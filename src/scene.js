var Point = require('./point.js');
var Geo = require('./geo.js');
var Style = require('./style.js');
var ModeManager = require('./gl/gl_modes').ModeManager;
var Utils = require('./utils.js');

var GL = require('./gl/gl.js');
var GLProgram = require('./gl/gl_program.js');
var GLBuilders = require('./gl/gl_builders.js');
var GLTexture = require('./gl/gl_texture.js');

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

// Setup that happens on main thread only (skip in web worker)
var yaml;
Utils.runIfInMainThread(function() {
    try {
        yaml = require('js-yaml');
    }
    catch (e) {
        console.log("no YAML support, js-yaml module not found");
    }

    findBaseLibraryURL();
});

// Global setup
Scene.tile_scale = 4096; // coordinates are locally scaled to the range [0, tile_scale]
Geo.setTileScale(Scene.tile_scale);
GLBuilders.setTileScale(Scene.tile_scale);
GLProgram.defines.TILE_SCALE = Scene.tile_scale;
Scene.debug = false;

// Layers & styles: pass an object directly, or a URL as string to load remotely
function Scene (tile_source, layers, styles, options)
{
    var options = options || {};
    this.tile_source = tile_source;
    this.tiles = {};
    this.num_workers = options.num_workers || 1;
    this.allow_cross_domain_workers = (options.allow_cross_domain_workers === false ? false : true);

    if (typeof layers === 'string') {
        this.layer_source = Utils.urlForPath(layers);
        this.layers = Scene.loadLayers(this.layer_source);
    }
    else {
        this.layers = layers;
    }
    this.layers_serialized = Utils.serializeWithFunctions(this.layers);

    if (typeof styles === 'string') {
        this.style_source = Utils.urlForPath(styles);
        this.styles = Scene.loadStyles(this.style_source);
    }
    else {
        this.styles = Scene.postProcessStyles(styles);
    }
    this.styles_serialized = Utils.serializeWithFunctions(this.styles);

    this.dirty = true; // request a redraw
    this.animated = false; // request redraw every frame
    this.initialized = false;

    this.modes = Scene.createModes({}, this.styles);
    this.updateActiveModes();

    this.createWorkers();
    this.selection_map_worker_size = {};

    this.frame = 0;
    this.zoom = null;
    this.center = null;
    this.device_pixel_ratio = window.devicePixelRatio || 1;

    this.zooming = false;
    this.panning = false;

    this.container = options.container;

    this.resetTime();
}

Scene.prototype.init = function ()
{
    this.container = this.container || document.body;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.zIndex = -1;
    this.container.appendChild(this.canvas);

    this.gl = GL.getContext(this.canvas);
    this.resizeMap(this.container.clientWidth, this.container.clientHeight);

    this.initModes();
    this.initSelectionBuffer();

    // this.zoom_step = 0.02; // for fractional zoom user adjustment
    this.last_render_count = null;
    this.initInputHandlers();

    // Init workers
    this.workers.forEach(function(worker) {
        worker.addEventListener('message', scene.workerBuildTileCompleted.bind(this));
        worker.addEventListener('message', scene.workerGetFeatureSelection.bind(this));
        worker.addEventListener('message', scene.workerLogMessage.bind(this));
    }.bind(this));

    this.initialized = true;
};

Scene.prototype.initModes = function ()
{
    // Init GL context for modes (compiles programs, etc.)
    for (var m in this.modes) {
        this.modes[m].init(this.gl);
    }
};

Scene.prototype.initSelectionBuffer = function ()
{
    // Selection state tracking
    this.pixel = new Uint8Array(4);
    this.pixel32 = new Float32Array(this.pixel.buffer);
    this.selection_point = Point(0, 0);
    this.selected_feature = null;
    this.selection_callback = null;
    this.selection_callback_timer = null;
    this.selection_frame_delay = 5; // delay from selection render to framebuffer sample, to avoid CPU/GPU sync lock
    this.update_selection = false;

    // Frame buffer for selection
    // TODO: initiate lazily in case we don't need to do any selection
    this.fbo = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
    this.fbo_size = { width: 256, height: 256 }; // TODO: make configurable / adaptive based on canvas size
    this.gl.viewport(0, 0, this.fbo_size.width, this.fbo_size.height);

    // Texture for the FBO color attachment
    this.fbo_texture = new GLTexture(this.gl, 'selection_fbo');
    this.fbo_texture.setData(this.fbo_size.width, this.fbo_size.height, null, { filtering: 'nearest' });
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.fbo_texture.texture, 0);

    // Renderbuffer for the FBO depth attachment
    this.fbo_depth_rb = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.fbo_depth_rb);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.fbo_size.width, this.fbo_size.height);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.fbo_depth_rb);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};

// Web workers handle heavy duty geometry processing
Scene.prototype.createWorkers = function ()
{
    var worker_url = Scene.library_base_url + 'tangram-worker.min.js' + '?' + (+new Date());

    // Instantiate workers from URL
    var makeWorkers = function (url) {
        this.workers = [];
        for (var w=0; w < this.num_workers; w++) {
            this.workers.push(new Worker(url));
            this.workers[w].postMessage({
                type: 'init',
                worker_id: w,
                num_workers: this.num_workers
            })
        }
    }.bind(this);

    // Local object URLs supported?
    var createObjectURL = (window.URL && window.URL.createObjectURL) || (window.webkitURL && window.webkitURL.createObjectURL);
    if (createObjectURL && this.allow_cross_domain_workers) {
        // To allow workers to be loaded cross-domain, first load worker source via XHR, then create a local URL via a blob
        var req = new XMLHttpRequest();
        req.onload = function () {
            var worker_local_url = createObjectURL(new Blob([req.response], { type: 'application/javascript' }));
            makeWorkers(worker_local_url);
        }.bind(this);
        req.open('GET', worker_url, false /* async flag */);
        req.send();
    }
    // Traditional load from remote URL
    else {
        makeWorkers(worker_url);
    }

    this.next_worker = 0;
};

// Post a message about a tile to the next worker (round robbin)
Scene.prototype.workerPostMessageForTile = function (tile, message)
{
    if (tile.worker == null) {
        tile.worker = this.next_worker;
        this.next_worker = (tile.worker + 1) % this.workers.length;
    }
    this.workers[tile.worker].postMessage(message);
};

Scene.prototype.setCenter = function (lng, lat)
{
    this.center = { lng: lng, lat: lat };
    this.dirty = true;
};

Scene.prototype.startZoom = function ()
{
    this.last_zoom = this.zoom;
    this.zooming = true;
};

Scene.prototype.preserve_tiles_within_zoom = 2;
Scene.prototype.setZoom = function (zoom)
{
    // Schedule GL tiles for removal on zoom
    var below = zoom;
    var above = zoom;
    if (this.last_zoom != null) {
        console.log("scene.last_zoom: " + this.last_zoom);
        if (Math.abs(zoom - this.last_zoom) <= this.preserve_tiles_within_zoom) {
            if (zoom > this.last_zoom) {
                below = zoom - this.preserve_tiles_within_zoom;
            }
            else {
                above = zoom + this.preserve_tiles_within_zoom;
            }
        }
    }

    this.last_zoom = this.zoom;
    this.zoom = zoom;
    this.capped_zoom = Math.min(~~this.zoom, this.tile_source.max_zoom || ~~this.zoom);
    this.zooming = false;

    this.removeTilesOutsideZoomRange(below, above);
    this.dirty = true;
};

Scene.prototype.removeTilesOutsideZoomRange = function (below, above)
{
    below = Math.min(below, this.tile_source.max_zoom || below);
    above = Math.min(above, this.tile_source.max_zoom || above);

    console.log("removeTilesOutsideZoomRange [" + below + ", " + above + "])");
    var remove_tiles = [];
    for (var t in this.tiles) {
        var tile = this.tiles[t];
        if (tile.coords.z < below || tile.coords.z > above) {
            remove_tiles.push(t);
        }
    }
    for (var r=0; r < remove_tiles.length; r++) {
        var key = remove_tiles[r];
        console.log("removed " + key + " (outside range [" + below + ", " + above + "])");
        this.removeTile(key);
    }
};

Scene.prototype.setBounds = function (sw, ne)
{
    this.bounds = {
        sw: { lng: sw.lng, lat: sw.lat },
        ne: { lng: ne.lng, lat: ne.lat }
    };

    var buffer = 200 * Geo.meters_per_pixel[~~this.zoom]; // pixels -> meters
    this.buffered_meter_bounds = {
        sw: Geo.latLngToMeters(Point(this.bounds.sw.lng, this.bounds.sw.lat)),
        ne: Geo.latLngToMeters(Point(this.bounds.ne.lng, this.bounds.ne.lat))
    };
    this.buffered_meter_bounds.sw.x -= buffer;
    this.buffered_meter_bounds.sw.y -= buffer;
    this.buffered_meter_bounds.ne.x += buffer;
    this.buffered_meter_bounds.ne.y += buffer;

    this.center_meters = Point(
        (this.buffered_meter_bounds.sw.x + this.buffered_meter_bounds.ne.x) / 2,
        (this.buffered_meter_bounds.sw.y + this.buffered_meter_bounds.ne.y) / 2
    );

    // console.log("set scene bounds to " + JSON.stringify(this.bounds));

    // Mark tiles as visible/invisible
    for (var t in this.tiles) {
        this.updateVisibilityForTile(this.tiles[t]);
    }

    this.dirty = true;
};

Scene.prototype.isTileInZoom = function (tile)
{
    return (Math.min(tile.coords.z, this.tile_source.max_zoom || tile.coords.z) == this.capped_zoom);
};

// Update visibility and return true if changed
Scene.prototype.updateVisibilityForTile = function (tile)
{
    var visible = tile.visible;
    tile.visible = this.isTileInZoom(tile) && Geo.boxIntersect(tile.bounds, this.buffered_meter_bounds);
    tile.center_dist = Math.abs(this.center_meters.x - tile.min.x) + Math.abs(this.center_meters.y - tile.min.y);
    return (visible != tile.visible);
};

Scene.prototype.resizeMap = function (width, height)
{
    this.dirty = true;

    this.css_size = { width: width, height: height };
    this.device_size = { width: Math.round(this.css_size.width * this.device_pixel_ratio), height: Math.round(this.css_size.height * this.device_pixel_ratio) };

    this.canvas.style.width = this.css_size.width + 'px';
    this.canvas.style.height = this.css_size.height + 'px';
    this.canvas.width = this.device_size.width;
    this.canvas.height = this.device_size.height;

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};

Scene.prototype.requestRedraw = function ()
{
    this.dirty = true;
};

// Determine a Z value that will stack features in a "painter's algorithm" style, first by layer, then by draw order within layer
// Features are assumed to be already sorted in desired draw order by the layer pre-processor
Scene.calculateZ = function (layer, tile, layer_offset, feature_offset)
{
    // var layer_offset = layer_offset || 0;
    // var feature_offset = feature_offset || 0;
    var z = 0; // TODO: made this a no-op until revisiting where it should live - one-time calc here, in vertex layout/shader, etc.
    return z;
};

Scene.prototype.render = function ()
{
    // Render on demand
    if (this.dirty == false || this.initialized == false) {
        return false;
    }
    this.dirty = false; // subclasses can set this back to true when animation is needed

    this.renderGL();

    // Redraw every frame if animating
    if (this.animated == true) {
        this.dirty = true;
    }

    this.frame++;

    // console.log("render map");
    return true;
};

Scene.prototype.resetFrame = function ()
{
    // Reset frame state
    var gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // TODO: unnecessary repeat?
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

Scene.prototype.renderGL = function ()
{
    var gl = this.gl;

    this.input();
    this.resetFrame();

    // Map transforms
    var center = Geo.latLngToMeters(Point(this.center.lng, this.center.lat));
    var meters_per_pixel = Geo.min_zoom_meters_per_pixel / Math.pow(2, this.zoom);
    var meter_zoom = Point(this.css_size.width / 2 * meters_per_pixel, this.css_size.height / 2 * meters_per_pixel);

    // Matrices
    var tile_view_mat = mat4.create();
    var tile_world_mat = mat4.create();
    var meter_view_mat = mat4.create();

    // Convert mercator meters to screen space
    mat4.scale(meter_view_mat, meter_view_mat, vec3.fromValues(1 / meter_zoom.x, 1 / meter_zoom.y, 1 / meter_zoom.y));

    // Renderable tile list
    var renderable_tiles = [];
    for (var t in this.tiles) {
        var tile = this.tiles[t];
        if (tile.loaded == true && tile.visible == true) {
            renderable_tiles.push(tile);
        }
    }
    this.renderable_tiles_count = renderable_tiles.length;

    // Render main pass - tiles grouped by rendering mode (GL program)
    var render_count = 0;
    for (var mode in this.active_modes) {
        // Per-frame mode updates/animations
        // Called even if the mode isn't rendered by any current tiles, so time-based animations, etc. continue
        this.modes[mode].update();

        var gl_program = this.modes[mode].gl_program;
        var first_for_mode = true;

        // Render tile GL geometries
        for (var t in renderable_tiles) {
            var tile = renderable_tiles[t];

            if (tile.gl_geometry[mode] != null) {
                // Setup mode if encountering for first time this frame
                // (lazy init, not all modes will be used in all screen views; some modes might be defined but never used)
                if (first_for_mode == true) {
                    first_for_mode = false;

                    gl_program.use();
                    this.modes[mode].setUniforms();

                    // TODO: don't set uniforms when they haven't changed
                    gl_program.uniform('2f', 'u_resolution', this.device_size.width, this.device_size.height);
                    gl_program.uniform('2f', 'u_aspect', this.device_size.width / this.device_size.height, 1.0);
                    gl_program.uniform('1f', 'u_time', ((+new Date()) - this.start_time) / 1000);
                    gl_program.uniform('1f', 'u_map_zoom', this.zoom); // Math.floor(this.zoom) + (Math.log((this.zoom % 1) + 1) / Math.LN2 // scale fractional zoom by log
                    gl_program.uniform('2f', 'u_map_center', center.x, center.y);
                    gl_program.uniform('1f', 'u_num_layers', this.layers.length);
                    gl_program.uniform('1f', 'u_meters_per_pixel', meters_per_pixel);
                    gl_program.uniform('Matrix4fv', 'u_meter_view', false, meter_view_mat);
                }

                // TODO: calc these once per tile (currently being needlessly re-calculated per-tile-per-mode)

                // Tile origin
                gl_program.uniform('2f', 'u_tile_origin', tile.min.x, tile.min.y);

                // Tile view matrix - transform tile space into view space (meters, relative to camera)
                mat4.identity(tile_view_mat);
                mat4.translate(tile_view_mat, tile_view_mat, vec3.fromValues(tile.min.x - center.x, tile.min.y - center.y, 0)); // adjust for tile origin & map center
                mat4.scale(tile_view_mat, tile_view_mat, vec3.fromValues(tile.span.x / Scene.tile_scale, -1 * tile.span.y / Scene.tile_scale, 1)); // scale tile local coords to meters
                gl_program.uniform('Matrix4fv', 'u_tile_view', false, tile_view_mat);

                // Tile world matrix - transform tile space into world space (meters, absolute mercator position)
                mat4.identity(tile_world_mat);
                mat4.translate(tile_world_mat, tile_world_mat, vec3.fromValues(tile.min.x, tile.min.y, 0));
                mat4.scale(tile_world_mat, tile_world_mat, vec3.fromValues(tile.span.x / Scene.tile_scale, -1 * tile.span.y / Scene.tile_scale, 1)); // scale tile local coords to meters
                gl_program.uniform('Matrix4fv', 'u_tile_world', false, tile_world_mat);

                // Render tile
                tile.gl_geometry[mode].render();
                render_count += tile.gl_geometry[mode].geometry_count;
            }
        }
    }

    // Render selection pass (if needed)
    // Slight variations on render pass code above - mostly because we're reusing uniforms from the main
    // mode program, for the selection program
    // TODO: reduce duplicated code w/main render pass above
    if (this.update_selection) {
        this.update_selection = false; // reset selection check

        // TODO: queue callback till panning is over? coords where selection was requested are out of date
        if (this.panning) {
            return;
        }

        // Switch to FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.viewport(0, 0, this.fbo_size.width, this.fbo_size.height);
        this.resetFrame();

        for (mode in this.modes) {
            gl_program = this.modes[mode].selection_gl_program;
            if (gl_program == null) {
                continue;
            }
            first_for_mode = true;

            // Render tile GL geometries
            for (t in renderable_tiles) {
                tile = renderable_tiles[t];

                if (tile.gl_geometry[mode] != null) {
                    // Setup mode if encountering for first time this frame
                    if (first_for_mode == true) {
                        first_for_mode = false;

                        gl_program.use();
                        this.modes[mode].setUniforms();

                        gl_program.uniform('2f', 'u_resolution', this.fbo_size.width, this.fbo_size.height);
                        gl_program.uniform('2f', 'u_aspect', this.fbo_size.width / this.fbo_size.height, 1.0);
                        gl_program.uniform('1f', 'u_time', ((+new Date()) - this.start_time) / 1000);
                        gl_program.uniform('1f', 'u_map_zoom', this.zoom);
                        gl_program.uniform('2f', 'u_map_center', center.x, center.y);
                        gl_program.uniform('1f', 'u_num_layers', this.layers.length);
                        gl_program.uniform('1f', 'u_meters_per_pixel', meters_per_pixel);
                        gl_program.uniform('Matrix4fv', 'u_meter_view', false, meter_view_mat);
                    }

                    // Tile origin
                    gl_program.uniform('2f', 'u_tile_origin', tile.min.x, tile.min.y);

                    // Tile view matrix - transform tile space into view space (meters, relative to camera)
                    mat4.identity(tile_view_mat);
                    mat4.translate(tile_view_mat, tile_view_mat, vec3.fromValues(tile.min.x - center.x, tile.min.y - center.y, 0)); // adjust for tile origin & map center
                    mat4.scale(tile_view_mat, tile_view_mat, vec3.fromValues(tile.span.x / Scene.tile_scale, -1 * tile.span.y / Scene.tile_scale, 1)); // scale tile local coords to meters
                    gl_program.uniform('Matrix4fv', 'u_tile_view', false, tile_view_mat);

                    // Tile world matrix - transform tile space into world space (meters, absolute mercator position)
                    mat4.identity(tile_world_mat);
                    mat4.translate(tile_world_mat, tile_world_mat, vec3.fromValues(tile.min.x, tile.min.y, 0));
                    mat4.scale(tile_world_mat, tile_world_mat, vec3.fromValues(tile.span.x / Scene.tile_scale, -1 * tile.span.y / Scene.tile_scale, 1)); // scale tile local coords to meters
                    gl_program.uniform('Matrix4fv', 'u_tile_world', false, tile_world_mat);

                    // Render tile
                    tile.gl_geometry[mode].render();
                }
            }
        }

        // Delay reading the pixel result from the selection buffer to avoid CPU/GPU sync lock.
        // Calling readPixels synchronously caused a massive performance hit, presumably since it
        // forced this function to wait for the GPU to finish rendering and retrieve the texture contents.
        if (this.selection_callback_timer != null) {
            clearTimeout(this.selection_callback_timer);
        }
        this.selection_callback_timer = setTimeout(
            function() {
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

                // Check selection map against FBO
                gl.readPixels(
                    Math.floor(this.selection_point.x * this.fbo_size.width / this.device_size.width),
                    Math.floor(this.selection_point.y * this.fbo_size.height / this.device_size.height),
                    1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.pixel);
                var feature_key = (this.pixel[0] + (this.pixel[1] << 8) + (this.pixel[2] << 16) + (this.pixel[3] << 24)) >>> 0;

                // console.log(
                //     Math.floor(this.selection_point.x * this.fbo_size.width / this.device_size.width) + ", " +
                //     Math.floor(this.selection_point.y * this.fbo_size.height / this.device_size.height) + ": (" +
                //     this.pixel[0] + ", " + this.pixel[1] + ", " + this.pixel[2] + ", " + this.pixel[3] + ")");

                // If feature found, ask appropriate web worker to lookup feature
                var worker_id = this.pixel[3];
                if (worker_id != 255) { // 255 indicates an empty selection buffer pixel
                    // console.log("worker_id: " + worker_id);
                    if (this.workers[worker_id] != null) {
                        // console.log("post message");
                        this.workers[worker_id].postMessage({
                            type: 'getFeatureSelection',
                            key: feature_key
                        });
                    }
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }.bind(this),
            this.selection_frame_delay
        );

        // Reset to screen buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    if (render_count != this.last_render_count) {
        console.log("rendered " + render_count + " primitives");
    }
    this.last_render_count = render_count;

    return true;
};

// Request feature selection
// Runs asynchronously, schedules selection buffer to be updated
Scene.prototype.getFeatureAt = function (pixel, callback)
{
    // TODO: queue callbacks while still performing only one selection render pass within X time interval?
    if (this.update_selection == true) {
        return;
    }

    this.selection_point = Point(
        pixel.x * this.device_pixel_ratio,
        this.device_size.height - (pixel.y * this.device_pixel_ratio)
    );
    this.selection_callback = callback;
    this.update_selection = true;
    this.dirty = true;
};

// Load a single tile
Scene.prototype.loadTile = function (coords, div, callback)
{
    // Overzoom?
    if (coords.z > this.tile_source.max_zoom) {
        var zgap = coords.z - this.tile_source.max_zoom;
        // var original_tile = [coords.x, coords.y, coords.z].join('/');
        coords.x = ~~(coords.x / Math.pow(2, zgap));
        coords.y = ~~(coords.y / Math.pow(2, zgap));
        coords.display_z = coords.z; // z without overzoom
        coords.z -= zgap;
        // console.log("adjusted for overzoom, tile " + original_tile + " -> " + [coords.x, coords.y, coords.z].join('/'));
    }

    this.trackTileSetLoadStart();

    var key = [coords.x, coords.y, coords.z].join('/');

    // Already loading/loaded?
    if (this.tiles[key]) {
        // if (this.tiles[key].loaded == true) {
        //     console.log("use loaded tile " + key + " from cache");
        // }
        // if (this.tiles[key].loading == true) {
        //     console.log("already loading tile " + key + ", skip");
        // }

        if (callback) {
            callback(null, div);
        }
        return;
    }

    var tile = this.tiles[key] = {};
    tile.key = key;
    tile.coords = coords;
    tile.min = Geo.metersForTile(tile.coords);
    tile.max = Geo.metersForTile({ x: tile.coords.x + 1, y: tile.coords.y + 1, z: tile.coords.z });
    tile.span = { x: (tile.max.x - tile.min.x), y: (tile.max.y - tile.min.y) };
    tile.bounds = { sw: { x: tile.min.x, y: tile.max.y }, ne: { x: tile.max.x, y: tile.min.y } };
    tile.debug = {};
    tile.loading = true;
    tile.loaded = false;

    this.buildTile(tile.key);
    this.updateTileElement(tile, div);
    this.updateVisibilityForTile(tile);

    if (callback) {
        callback(null, div);
    }
};

// Rebuild all tiles
// TODO: also rebuild modes? (detect if changed)
Scene.prototype.rebuildTiles = function ()
{
    // Update layers & styles
    this.layers_serialized = Utils.serializeWithFunctions(this.layers);
    this.styles_serialized = Utils.serializeWithFunctions(this.styles);
    this.selection_map = {};

    // Tell workers we're about to rebuild (so they can refresh styles, etc.)
    this.workers.forEach(function(worker) {
        worker.postMessage({
            type: 'prepareForRebuild',
            layers: this.layers_serialized,
            styles: this.styles_serialized
        });
    }.bind(this));

    // Rebuild visible tiles first, from center out
    // console.log("find visible");
    var visible = [], invisible = [];
    for (var t in this.tiles) {
        if (this.tiles[t].visible == true) {
            visible.push(t);
        }
        else {
            invisible.push(t);
        }
    }

    // console.log("sort visible distance");
    visible.sort(function(a, b) {
        // var ad = Math.abs(this.center_meters.x - this.tiles[b].min.x) + Math.abs(this.center_meters.y - this.tiles[b].min.y);
        // var bd = Math.abs(this.center_meters.x - this.tiles[a].min.x) + Math.abs(this.center_meters.y - this.tiles[a].min.y);
        var ad = this.tiles[a].center_dist;
        var bd = this.tiles[b].center_dist;
        return (bd > ad ? -1 : (bd == ad ? 0 : 1));
    }.bind(this));

    // console.log("build visible");
    for (var t in visible) {
        this.buildTile(visible[t]);
    }

    // console.log("build invisible");
    for (var t in invisible) {
        // Keep tiles in current zoom but out of visible range, but rebuild as lower priority
        if (this.isTileInZoom(this.tiles[invisible[t]]) == true) {
            this.buildTile(invisible[t]);
        }
        // Drop tiles outside current zoom
        else {
            this.removeTile(invisible[t]);
        }
    }

    this.updateActiveModes();
    this.resetTime();
};

Scene.prototype.buildTile = function(key)
{
    var tile = this.tiles[key];

    this.workerPostMessageForTile(tile, {
        type: 'buildTile',
        tile: {
            key: tile.key,
            coords: tile.coords, // used by style helpers
            min: tile.min, // used by TileSource to scale tile to local extents
            max: tile.max, // used by TileSource to scale tile to local extents
            debug: tile.debug
        },
        tile_source: this.tile_source,
        layers: this.layers_serialized,
        styles: this.styles_serialized
    });
};

// Process geometry for tile - called by web worker
// Returns a set of tile keys that should be sent to the main thread (so that we can minimize data exchange between worker and main thread)
Scene.addTile = function (tile, layers, styles, modes)
{
    var layer, style, feature, z, mode;
    var vertex_data = {};

    // Join line test pattern
    // if (Scene.debug) {
    //     tile.layers['roads'].features.push(Scene.buildZigzagLineTestPattern());
    // }

    // Build raw geometry arrays
    tile.debug.features = 0;
    for (var layer_num=0; layer_num < layers.length; layer_num++) {
        layer = layers[layer_num];

        // Skip layers with no styles defined, or layers set to not be visible
        if (styles.layers[layer.name] == null || styles.layers[layer.name].visible == false) {
            continue;
        }

        if (tile.layers[layer.name] != null) {
            var num_features = tile.layers[layer.name].features.length;

            // Rendering reverse order aka top to bottom
            for (var f = num_features-1; f >= 0; f--) {
                feature = tile.layers[layer.name].features[f];
                style = Style.parseStyleForFeature(feature, layer.name, styles.layers[layer.name], tile);

                // Skip feature?
                if (style == null) {
                    continue;
                }

                style.layer_num = layer_num;
                style.z = Scene.calculateZ(layer, tile) + style.z;

                var points = null,
                    lines = null,
                    polygons = null;

                if (feature.geometry.type == 'Polygon') {
                    polygons = [feature.geometry.coordinates];
                }
                else if (feature.geometry.type == 'MultiPolygon') {
                    polygons = feature.geometry.coordinates;
                }
                else if (feature.geometry.type == 'LineString') {
                    lines = [feature.geometry.coordinates];
                }
                else if (feature.geometry.type == 'MultiLineString') {
                    lines = feature.geometry.coordinates;
                }
                else if (feature.geometry.type == 'Point') {
                    points = [feature.geometry.coordinates];
                }
                else if (feature.geometry.type == 'MultiPoint') {
                    points = feature.geometry.coordinates;
                }

                // First feature in this render mode?
                mode = style.mode.name;
                if (vertex_data[mode] == null) {
                    vertex_data[mode] = [];
                }

                if (polygons != null) {
                    modes[mode].buildPolygons(polygons, style, vertex_data[mode]);
                }

                if (lines != null) {
                    modes[mode].buildLines(lines, style, vertex_data[mode]);
                }

                if (points != null) {
                    modes[mode].buildPoints(points, style, vertex_data[mode]);
                }

                tile.debug.features++;
            }
        }
    }

    tile.vertex_data = {};
    for (var s in vertex_data) {
        tile.vertex_data[s] = new Float32Array(vertex_data[s]);
    }

    return {
        vertex_data: true
    };
};

// Called on main thread when a web worker completes processing for a single tile (initial load, or rebuild)
Scene.prototype.workerBuildTileCompleted = function (event)
{
    if (event.data.type != 'buildTileCompleted') {
        return;
    }

    // Track selection map size (for stats/debug) - update per worker and sum across workers
    this.selection_map_worker_size[event.data.worker_id] = event.data.selection_map_size;
    this.selection_map_size = 0;
    Object.keys(this.selection_map_worker_size).forEach(function(w) { this.selection_map_size += this.selection_map_worker_size[w]; }.bind(this));
    console.log("selection map: " + this.selection_map_size + " features");

    var tile = event.data.tile;

    // Removed this tile during load?
    if (this.tiles[tile.key] == null) {
        console.log("discarded tile " + tile.key + " in Scene.tileWorkerCompleted because previously removed");
        return;
    }

    // Update tile with properties from worker
    tile = this.mergeTile(tile.key, tile);

    this.buildGLGeometry(tile);

    this.dirty = true;
    this.trackTileSetLoadEnd();
    this.printDebugForTile(tile);
};

// Called on main thread when a web worker completes processing for a single tile
Scene.prototype.buildGLGeometry = function (tile)
{
    var vertex_data = tile.vertex_data;

    // Cleanup existing GL geometry objects
    this.freeTileResources(tile);
    tile.gl_geometry = {};

    // Create GL geometry objects
    for (var s in vertex_data) {
        tile.gl_geometry[s] = this.modes[s].makeGLGeometry(vertex_data[s]);
    }

    tile.debug.geometries = 0;
    tile.debug.buffer_size = 0;
    for (var p in tile.gl_geometry) {
        tile.debug.geometries += tile.gl_geometry[p].geometry_count;
        tile.debug.buffer_size += tile.gl_geometry[p].vertex_data.byteLength;
    }
    tile.debug.geom_ratio = (tile.debug.geometries / tile.debug.features).toFixed(1);

    delete tile.vertex_data; // TODO: might want to preserve this for rebuilding geometries when styles/etc. change?
};

Scene.prototype.removeTile = function (key)
{
    console.log("tile unload for " + key);

    if (this.zooming == true) {
        return; // short circuit tile removal, will sweep out tiles by zoom level when zoom ends
    }

    var tile = this.tiles[key];

    if (tile != null) {
        this.freeTileResources(tile);

        // Web worker will cancel XHR requests
        this.workerPostMessageForTile(tile, {
            type: 'removeTile',
            key: tile.key
        });
    }

    delete this.tiles[key];
    this.dirty = true;
};

// Free any GL / owned resources
Scene.prototype.freeTileResources = function (tile)
{
    if (tile != null && tile.gl_geometry != null) {
        for (var p in tile.gl_geometry) {
            tile.gl_geometry[p].destroy();
        }
        tile.gl_geometry = null;
    }
};

// Attaches tracking and debug into to the provided tile DOM element
Scene.prototype.updateTileElement = function (tile, div)
{
    // Debug info
    div.setAttribute('data-tile-key', tile.key);
    div.style.width = '256px';
    div.style.height = '256px';

    if (this.debug) {
        var debug_overlay = document.createElement('div');
        debug_overlay.textContent = tile.key;
        debug_overlay.style.position = 'absolute';
        debug_overlay.style.left = 0;
        debug_overlay.style.top = 0;
        debug_overlay.style.color = 'white';
        debug_overlay.style.fontSize = '16px';
        // debug_overlay.style.textOutline = '1px #000000';
        div.appendChild(debug_overlay);

        div.style.borderStyle = 'solid';
        div.style.borderColor = 'white';
        div.style.borderWidth = '1px';
    }
};

// Merge properties from a provided tile object into the main tile store. Shallow merge (just copies top-level properties)!
// Used for selectively updating properties of tiles passed between main thread and worker
// (so we don't have to pass the whole tile, including some properties which cannot be cloned for a worker).
Scene.prototype.mergeTile = function (key, source_tile)
{
    var tile = this.tiles[key];

    if (tile == null) {
        this.tiles[key] = source_tile;
        return this.tiles[key];
    }

    for (var p in source_tile) {
        // console.log("merging " + p + ": " + source_tile[p]);
        tile[p] = source_tile[p];
    }

    return tile;
};

// Called on main thread when a web worker finds a feature in the selection buffer
Scene.prototype.workerGetFeatureSelection = function (event)
{
    if (event.data.type != 'getFeatureSelection') {
        return;
    }

    var feature = event.data.feature;
    var changed = false;
    if ((feature != null && this.selected_feature == null) ||
        (feature == null && this.selected_feature != null) ||
        (feature != null && this.selected_feature != null && feature.id != this.selected_feature.id)) {
        changed = true;
    }

    this.selected_feature = feature;

    if (typeof this.selection_callback == 'function') {
        this.selection_callback({ feature: this.selected_feature, changed: changed });
    }
};

// Reload layers and styles (only if they were originally loaded by URL). Mostly useful for testing.
Scene.prototype.reloadConfig = function ()
{
    if (this.layer_source != null) {
        this.layers = Scene.loadLayers(this.layer_source);
        this.layers_serialized = Utils.serializeWithFunctions(this.layers);
    }

    if (this.style_source != null) {
        this.styles = Scene.loadStyles(this.style_source);
        this.styles_serialized = Utils.serializeWithFunctions(this.styles);
    }

    if (this.layer_source != null || this.style_source != null) {
        this.rebuildTiles();
    }
};

// Called (currently manually) after modes are updated in stylesheet
Scene.prototype.refreshModes = function ()
{
    this.modes = Scene.refreshModes(this.modes, this.styles);
};

Scene.prototype.updateActiveModes = function ()
{
    // Make a set of currently active modes (used in a layer)
    this.active_modes = {};
    var animated = false; // is any active mode animated?
    for (var l in this.styles.layers) {
        var mode = this.styles.layers[l].mode.name;
        if (this.styles.layers[l].visible !== false) {
            this.active_modes[mode] = true;

            // Check if this mode is animated
            if (animated == false && this.modes[mode].animated == true) {
                animated = true;
            }
        }
    }
    this.animated = animated;
};

// Reset internal clock, mostly useful for consistent experience when changing modes/debugging
Scene.prototype.resetTime = function ()
{
    this.start_time = +new Date();
};

// User input
// TODO: restore fractional zoom support once leaflet animation refactor pull request is merged

Scene.prototype.initInputHandlers = function ()
{
    // this.key = null;

    // document.addEventListener('keydown', function (event) {
    //     if (event.keyCode == 37) {
    //         this.key = 'left';
    //     }
    //     else if (event.keyCode == 39) {
    //         this.key = 'right';
    //     }
    //     else if (event.keyCode == 38) {
    //         this.key = 'up';
    //     }
    //     else if (event.keyCode == 40) {
    //         this.key = 'down';
    //     }
    //     else if (event.keyCode == 83) { // s
    //         console.log("reloading shaders");
    //         for (var mode in this.modes) {
    //             this.modes[mode].gl_program.compile();
    //         }
    //         this.dirty = true;
    //     }
    // }.bind(this));

    // document.addEventListener('keyup', function (event) {
    //     this.key = null;
    // }.bind(this));
};

Scene.prototype.input = function ()
{
    // // Fractional zoom scaling
    // if (this.key == 'up') {
    //     this.setZoom(this.zoom + this.zoom_step);
    // }
    // else if (this.key == 'down') {
    //     this.setZoom(this.zoom - this.zoom_step);
    // }
};


// Stats/debug/profiling methods

// Profiling methods used to track when sets of tiles start/stop loading together
// e.g. initial page load is one set of tiles, new sets of tile loads are then initiated by a map pan or zoom
Scene.prototype.trackTileSetLoadStart = function ()
{
    // Start tracking new tile set if no other tiles already loading
    if (this.tile_set_loading == null) {
        this.tile_set_loading = +new Date();
        console.log("tile set load START");
    }
};

Scene.prototype.trackTileSetLoadEnd = function ()
{
    // No more tiles actively loading?
    if (this.tile_set_loading != null) {
        var end_tile_set = true;
        for (var t in this.tiles) {
            if (this.tiles[t].loading == true) {
                end_tile_set = false;
                break;
            }
        }

        if (end_tile_set == true) {
            this.last_tile_set_load = (+new Date()) - this.tile_set_loading;
            this.tile_set_loading = null;
            console.log("tile set load FINISHED in: " + this.last_tile_set_load);
        }
    }
};

Scene.prototype.printDebugForTile = function (tile)
{
    console.log(
        "debug for " + tile.key + ': [ ' +
        Object.keys(tile.debug).map(function (t) { return t + ': ' + tile.debug[t]; }).join(', ') + ' ]'
    );
};

// Recompile all shaders
Scene.prototype.compileShaders = function ()
{
    for (var m in this.modes) {
        this.modes[m].gl_program.compile();
    }
};

// Sum of a debug property across tiles
Scene.prototype.getDebugSum = function (prop, filter)
{
    var sum = 0;
    for (var t in this.tiles) {
        if (this.tiles[t].debug[prop] != null && (typeof filter != 'function' || filter(this.tiles[t]) == true)) {
            sum += this.tiles[t].debug[prop];
        }
    }
    return sum;
};

// Average of a debug property across tiles
Scene.prototype.getDebugAverage = function (prop, filter)
{
    return this.getDebugSum(prop, filter) / Object.keys(this.tiles).length;
};

// Log messages pass through from web workers
Scene.prototype.workerLogMessage = function (event)
{
    if (event.data.type != 'log') {
        return;
    }

    console.log("worker " + event.data.worker_id + ": " + event.data.msg);
};


/*** Class methods (stateless) ***/

Scene.loadLayers = function (url)
{
    var layers;
    var req = new XMLHttpRequest();
    req.onload = function () { eval('layers = ' + req.response); }; // TODO: security!
    req.open('GET', url + '?' + (+new Date()), false /* async flag */);
    req.send();
    return layers;
};

Scene.loadStyles = function (url)
{
    var styles;
    var req = new XMLHttpRequest();
    req.onload = function () { styles = req.response; };
    req.open('GET', url + '?' + (+new Date()), false /* async flag */);
    req.send();

    // Try JSON first, then YAML (if available)
    try {
        eval('styles = ' + req.response);
    }
    catch (e) {
        try {
            styles = yaml.safeLoad(req.response);
        }
        catch (e) {
            console.log("failed to parse styles!");
            styles = null;
        }
    }

    // Find generic functions & style macros
    Utils.stringsToFunctions(styles);
    Style.expandMacros(styles);
    Scene.postProcessStyles(styles);

    return styles;
};

// Normalize some style settings that may not have been explicitly specified in the stylesheet
Scene.postProcessStyles = function (styles)
{
    // Post-process styles
    for (var m in styles.layers) {
        if (styles.layers[m].visible !== false) {
            styles.layers[m].visible = true;
        }

        if ((styles.layers[m].mode && styles.layers[m].mode.name) == null) {
            styles.layers[m].mode = {};
            for (var p in Style.defaults.mode) {
                styles.layers[m].mode[p] = Style.defaults.mode[p];
            }
        }
    }

    return styles;
};

// Processes the tile response to create layers as defined by the scene
// Can include post-processing to partially filter or re-arrange data, e.g. only including POIs that have names
Scene.processLayersForTile = function (layers, tile)
{
    var tile_layers = {};
    for (var t=0; t < layers.length; t++) {
        layers[t].number = t;

        if (layers[t] != null) {
            // Just pass through data untouched if no data transform function defined
            if (layers[t].data == null) {
                tile_layers[layers[t].name] = tile.layers[layers[t].name];
            }
            // Pass through data but with different layer name in tile source data
            else if (typeof layers[t].data == 'string') {
                tile_layers[layers[t].name] = tile.layers[layers[t].data];
            }
            // Apply the transform function for post-processing
            else if (typeof layers[t].data == 'function') {
                tile_layers[layers[t].name] = layers[t].data(tile.layers);
            }
        }

        // Handle cases where no data was found in tile or returned by post-processor
        tile_layers[layers[t].name] = tile_layers[layers[t].name] || { type: 'FeatureCollection', features: [] };
    }
    tile.layers = tile_layers;
    return tile_layers;
};

// Called once on instantiation
Scene.createModes = function (modes, styles)
{
    // Built-in modes
    var built_ins = require('./gl/gl_modes').Modes; // TODO: make this non-GL specific
    for (var m in built_ins) {
        modes[m] = built_ins[m];
    }

    // Stylesheet modes
    for (var m in styles.modes) {
        // if (m != 'all') {
            modes[m] = ModeManager.configureMode(m, styles.modes[m]);
        // }
    }

    return modes;
};

Scene.refreshModes = function (modes, styles)
{
    // Copy stylesheet modes
    // TODO: is this the best way to copy stylesheet changes to mode instances?
    for (var m in styles.modes) {
        // if (m != 'all') {
            ModeManager.configureMode(m, styles.modes[m]);
        // }
    }

    // Refresh all modes
    for (m in modes) {
        modes[m].refresh();
    }

    return modes;
};


// Private/internal

// Get base URL from which the library was loaded
// Used to load additional resources like shaders, textures, etc. in cases where library was loaded from a relative path
function findBaseLibraryURL ()
{
    Scene.library_base_url = '';
    var scripts = document.getElementsByTagName('script'); // document.querySelectorAll('script[src*=".js"]');
    for (var s=0; s < scripts.length; s++) {
        var match = scripts[s].src.indexOf('tangram.debug.js');
        if (match == -1) {
            match = scripts[s].src.indexOf('tangram.min.js');
        }
        if (match >= 0) {
            Scene.library_base_url = scripts[s].src.substr(0, match);
            break;
        }
    }
};

if (module !== undefined) {
    module.exports = Scene;
}
