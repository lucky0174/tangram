VectorRenderer.GLRenderer = GLRenderer;
GLRenderer.prototype = Object.create(VectorRenderer.prototype);
GLRenderer.debug = false;

function GLRenderer (tile_source, layers, styles, options)
{
    VectorRenderer.call(this, 'GLRenderer', tile_source, layers, styles, options);

    // if (GLBuilders !== undefined) {
       GLBuilders.setTileScale(VectorRenderer.tile_scale);
    // }

    var options = options || {};

    this.container = options.container;
    this.continuous_animation = false; // request redraw every frame
}

GLRenderer.prototype._init = function GLRendererInit ()
{
    this.container = this.container || document.body;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.zIndex = -1;
    this.container.appendChild(this.canvas);

    this.gl = GL.getContext(this.canvas);

    this.gl_programs = {};
    this.gl_programs['polygons'] = new GL.Program(this.gl, GLRenderer.vertex_shader_source, GLRenderer.fragment_shader_source);
    this.gl_programs['points'] = new GL.Program.createProgramFromURLs(this.gl, 'shaders/point_vertex.glsl', 'shaders/point_fragment.glsl');

    this.resizeMap(this.container.clientWidth, this.container.clientHeight);

    // this.zoom_step = 0.02; // for fractional zoom user adjustment
    this.start_time = +new Date();
    this.last_render_count = null;
    this.initInputHandlers();
};

// Determine a Z value that will stack features in a "painter's algorithm" style, first by layer, then by draw order within layer
// Features are assumed to be already sorted in desired draw order by the layer pre-processor
GLRenderer.calculateZ = function (layer, tile, layer_offset, feature_offset)
{
    // var layer_offset = layer_offset || 0;
    // var feature_offset = feature_offset || 0;
    var z = 0; // TODO: made this a no-op until revisiting where it should live - one-time calc here, in vertex layout/shader, etc.
    return z;
};

// Process geometry for tile - called by web worker
GLRenderer.addTile = function (tile, layers, styles)
{
    // var layers = VectorWorker.getLayers();
    // var styles = VectorWorker.getStyles();

    var layer, style, feature, z;
    var vertex_triangles = [];
    var vertex_points = [];
    var vertex_lines = [];

    // Join line test pattern
    // if (GLRenderer.debug) {
    //     tile.layers['roads'].features.push(GLRenderer.buildZigzagLineTestPattern());
    // }

    // Build raw geometry arrays
    tile.feature_count = 0;
    for (var ln=0; ln < layers.length; ln++) {
        layer = layers[ln];

        if (tile.layers[layer.name] != null) {
            var num_features = tile.layers[layer.name].features.length;

            // Rendering reverse order aka top to bottom
            for (var f = num_features-1; f >= 0; f--) {
                feature = tile.layers[layer.name].features[f];
                style = VectorRenderer.parseStyleForFeature(feature, styles[layer.name], tile);
                z = GLRenderer.calculateZ(layer, tile);

                var vertex_constants = [
                    style.color[0], style.color[1], style.color[2],
                    ln
                    // TODO: add material info, etc.
                ];

                if (style.outline.color) {
                    var outline_vertex_constants = [
                        style.outline.color[0], style.outline.color[1], style.outline.color[2],
                        ln - 0.5 // outlines sit between layers, underneath current layer but above the one below
                    ];
                }

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

                if (polygons != null) {
                    // Extruded polygons (e.g. 3D buildings)
                    if (style.extrude && style.height) {
                        GLBuilders.buildExtrudedPolygons(polygons, z, style.height, style.min_height, vertex_triangles, { vertex_constants: vertex_constants });
                    }
                    // Regular polygons
                    else {
                        GLBuilders.buildPolygons(polygons, z, vertex_triangles, { vertex_constants: vertex_constants });
                    }

                    // Polygon outlines
                    if (style.outline.color && style.outline.width) {
                        for (var mpc=0; mpc < polygons.length; mpc++) {
                            GLBuilders.buildPolylines(polygons[mpc], GLRenderer.calculateZ(layer, tile, -0.5), style.outline.width, vertex_triangles, { closed_polygon: true, remove_tile_edges: true, vertex_constants: outline_vertex_constants, vertex_lines: vertex_lines });
                        }
                    }
                }

                if (lines != null) {
                    // GLBuilders.buildLines(lines, feature, layer, style, tile, z, vertex_lines);
                    GLBuilders.buildPolylines(lines, z, style.width, vertex_triangles, { vertex_constants: vertex_constants, vertex_lines: vertex_lines });

                    // Line outlines
                    if (style.outline.color && style.outline.width) {
                        GLBuilders.buildPolylines(lines, GLRenderer.calculateZ(layer, tile, -0.5), style.width + 2 * style.outline.width, vertex_triangles, { vertex_constants: outline_vertex_constants, vertex_lines: vertex_lines });
                    }
                }

                if (points != null) {
                    // NOTE: adding to z to experiment with "floating" POIs
                    GLBuilders.buildPolyPoints(points, z + 25, style.size, vertex_points, { vertex_constants: vertex_constants });
                }

                tile.feature_count++;
            }
        }
    }

    tile.debug.features = tile.feature_count;
    vertex_triangles = new Float32Array(vertex_triangles);
    vertex_points = new Float32Array(vertex_points);
    vertex_lines = new Float32Array(vertex_lines);

    // NOTE: moved to generic event post from VectorRenderer (loses transferable objects for typed arrays, but gains flexibility)
    // VectorWorker.worker.postMessage(
    //     {
    //         key: tile.key,
    //         debug: tile.debug,
    //         vertex_triangles: vertex_triangles,
    //         vertex_lines: vertex_lines
    //     },
    //     [
    //         vertex_triangles.buffer,
    //         vertex_lines.buffer
    //     ]
    // );

    tile.vertex_data = {
        vertex_triangles: vertex_triangles,
        vertex_points: vertex_points,
        vertex_lines: vertex_lines
    };

    return tile;
};

// Called on main thread when a web worker completes processing for a single tile
GLRenderer.prototype._tileWorkerCompleted = function (tile)
{
    var vertex_triangles = tile.vertex_data.vertex_triangles;
    var vertex_points = tile.vertex_data.vertex_points;
    var vertex_lines = tile.vertex_data.vertex_lines;

    // Create GL geometry objects
    tile.gl_geometry = {};

    if (vertex_triangles.length > 0) {
        tile.gl_geometry.polygons = new GLTriangles(this.gl, this.gl_programs.polygons.program, vertex_triangles);
    }

    if (vertex_points.length > 0) {
        tile.gl_geometry.points = new GLPolyPoints(this.gl, this.gl_programs.points.program, vertex_points);
    }

    // Disabling lines for now, till we have better handling for mulitple programs
    // if (vertex_lines.length > 0) {
    //     tile.gl_geometry.push(new GLLines(this.gl, this.gl_programs.polygons.program, vertex_lines, { line_width: 1 /*5 / Geo.meters_per_pixel[Math.floor(this.zoom)]*/ }));
    // }

    tile.debug.geometries = 0;
    tile.debug.buffer_size = 0;
    for (var p in tile.gl_geometry) {
        tile.debug.geometries += tile.gl_geometry[p].geometry_count;
        tile.debug.buffer_size += tile.gl_geometry[p].vertex_data.byteLength;
    }

    tile.debug.geom_ratio = (tile.debug.geometries / tile.debug.features).toFixed(1);

    // Selection - experimental/future
    // var gl_renderer = this;
    // var pixel = new Uint8Array(4);
    // tileDiv.onmousemove = function (event) {
    //     // console.log(event.offsetX + ', ' + event.offsetY + ' | ' + parseInt(tileDiv.style.left) + ', ' + parseInt
    //     var p = Point(
    //         event.offsetX + parseInt(tileDiv.style.left),
    //         event.offsetY + parseInt(tileDiv.style.top)
    //     );
    //     gl_renderer.gl.readPixels(p.x, p.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    //     console.log(p.x + ', ' + p.y + ': (' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', ' + pixel[3] + ')')
    // };

    delete tile.vertex_data; // TODO: might want to preserve this for rebuilding geometries when styles/etc. change?
};

GLRenderer.prototype.removeTile = function GLRendererRemoveTile (key)
{
    if (this.map_zooming == true) {
        return; // short circuit tile removal, GL renderer will sweep out tiles by zoom level when zoom ends
    }

    var tile = this.tiles[key];

    if (tile != null && tile.gl_geometry != null) {
        for (var p in tile.gl_geometry) {
            tile.gl_geometry[p].destroy();
        }
        tile.gl_geometry = null;
    }
    VectorRenderer.prototype.removeTile.apply(this, arguments);
};

GLRenderer.prototype.preserve_tiles_within_zoom = 2;
GLRenderer.prototype.setZoom = function (zoom)
{
    // Schedule GL tiles for removal on zoom
    console.log("renderer.map_last_zoom: " + this.map_last_zoom);

    this.map_zooming = false;
    this.zoom = zoom;
    var below = this.zoom;
    var above = this.zoom;
    if (Math.abs(this.zoom - this.map_last_zoom) <= this.preserve_tiles_within_zoom) {
        if (this.zoom > this.map_last_zoom) {
            below = this.zoom - this.preserve_tiles_within_zoom;
        }
        else {
            above = this.zoom + this.preserve_tiles_within_zoom;
        }
    }
    this.removeTilesOutsideZoomRange(below, above);
    this.map_last_zoom = this.zoom;
    this.dirty = true; // calling because this is a full override of the parent class
};

GLRenderer.prototype.removeTilesOutsideZoomRange = function (below, above)
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

// Overrides base class method (a no op)
GLRenderer.prototype.resizeMap = function (width, height)
{
    VectorRenderer.prototype.resizeMap.apply(this, arguments);

    this.css_size = { width: width, height: height };
    this.device_size = { width: Math.round(this.css_size.width * this.device_pixel_ratio), height: Math.round(this.css_size.height * this.device_pixel_ratio) };

    this.canvas.style.width = this.css_size.width + 'px';
    this.canvas.style.height = this.css_size.height + 'px';
    this.canvas.width = this.device_size.width;
    this.canvas.height = this.device_size.height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};

GLRenderer.prototype._render = function GLRendererRender ()
{
    var gl = this.gl;

    this.input();

    // Reset frame state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Render tiles grouped by program
    var count = 0;
    for (var program_name in this.gl_programs) {
        var gl_program = this.gl_programs[program_name];

        gl.useProgram(gl_program.program);

        // TODO: set these once per program, don't set when they haven't changed
        gl_program.uniform('2f', 'resolution', this.css_size.width, this.css_size.height);
        gl_program.uniform('1f', 'time', ((+new Date()) - this.start_time) / 1000);

        var center = Geo.latLngToMeters(Point(this.center.lng, this.center.lat));
        gl_program.uniform('2f', 'map_center', center.x, center.y);
        gl_program.uniform('1f', 'map_zoom', this.zoom); // Math.floor(this.zoom) + (Math.log((this.zoom % 1) + 1) / Math.LN2 // scale fractional zoom by log
        gl_program.uniform('1f', 'num_layers', this.layers.length);

        var meters_per_pixel = Geo.min_zoom_meters_per_pixel / Math.pow(2, this.zoom);
        var meter_zoom = Point(this.css_size.width / 2 * meters_per_pixel, this.css_size.height / 2 * meters_per_pixel);
        gl_program.uniform('2f', 'meter_zoom', meter_zoom.x, meter_zoom.y);

        gl_program.uniform('1f', 'tile_scale', VectorRenderer.tile_scale); // TODO: move this to a constant or define

        // TODO: make a list of renderable tiles once per frame, outside this loop
        // Render tile GL geometries
        var capped_zoom = Math.min(~~this.zoom, this.tile_source.max_zoom || ~~this.zoom);
        for (var t in this.tiles) {
            var tile = this.tiles[t];
            if (tile.loaded == true &&
                tile.visible == true &&
                Math.min(tile.coords.z, this.tile_source.max_zoom || tile.coords.z) == capped_zoom) {

                if (tile.gl_geometry[program_name] != null) {
                    gl_program.uniform('2f', 'tile_min', tile.min.x, tile.min.y);
                    gl_program.uniform('2f', 'tile_max', tile.max.x, tile.max.y);

                    tile.gl_geometry[program_name].render();
                    count += tile.gl_geometry[program_name].geometry_count;
                }
            }
        }
    }

    if (count != this.last_render_count) {
        console.log("rendered " + count + " primitives");
    }
    this.last_render_count = count;

    if (this.continuous_animation == true) {
        this.dirty = true;
    }

    return true;
};

// Sum of a debug property across tiles
GLRenderer.prototype.getDebugSum = function (prop, filter)
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
GLRenderer.prototype.getDebugAverage = function (prop, filter)
{
    return this.getDebugSum(prop, filter) / Object.keys(this.tiles).length;
};

// User input
// TODO: restore fractional zoom support once leaflet animation refactor pull request is merged

GLRenderer.prototype.initInputHandlers = function GLRendererInitInputHandlers ()
{
    var gl_renderer = this;
    gl_renderer.key = null;

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) {
            gl_renderer.key = 'left';
        }
        else if (event.keyCode == 39) {
            gl_renderer.key = 'right';
        }
        else if (event.keyCode == 38) {
            gl_renderer.key = 'up';
        }
        else if (event.keyCode == 40) {
            gl_renderer.key = 'down';
        }
        else if (event.keyCode == 83) { // s
            console.log("reloading shaders");
            gl_renderer.gl_program.program = GL.updateProgramFromURLs(gl_renderer.gl, gl_renderer.gl_program.program, 'vertex.glsl', 'fragment.glsl');
            gl_renderer.gl.useProgram(gl_renderer.gl_program.program);
            gl_renderer.gl_program.refreshUniforms();
            gl_renderer.dirty = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        gl_renderer.key = null;
    });
};

GLRenderer.prototype.input = function GLRendererInput ()
{
    // // Fractional zoom scaling
    // if (this.key == 'up') {
    //     this.setZoom(this.zoom + this.zoom_step);
    // }
    // else if (this.key == 'down') {
    //     this.setZoom(this.zoom - this.zoom_step);
    // }
};
