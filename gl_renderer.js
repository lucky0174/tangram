GLRenderer.prototype = Object.create(VectorRenderer.prototype);

function GLRenderer (leaflet, layers)
{
    VectorRenderer.apply(this, arguments);

    // Defines the vertex buffer layout for the program
    // this.program_layout = {
    //     attribs: [
    //         {
    //             name: 'position',
    //             components: 3,
    //             type: WebGLRenderingContext.FLOAT,
    //             normalized: false
    //         },
    //         {
    //             name: 'normal',
    //             components: 3,
    //             type: WebGLRenderingContext.FLOAT,
    //             normalized: false
    //         },
    //         {
    //             name: 'color',
    //             components: 3,
    //             type: WebGLRenderingContext.FLOAT,
    //             normalized: false
    //         }
    //     ]
    // };
}

GLRenderer.prototype.init = function GLRendererInit ()
{
    this.gl = GL.getContext();
    // this.background = new GLBackground(this.gl, this.program); // TODO: passthrough vertex shader needed for background (no map translation)
    this.last_render_count = null;

    this.program = GL.createProgramFromURLs(this.gl, 'vertex.glsl', 'fragment.glsl');
    // this.program_layout = GL.makeProgramLayout(this.gl, this.program, this.program_layout);

    this.zoom = this.leaflet.map.getZoom();
    this.zoom_step = 0.02; // for fractional zoom user adjustment
    this.map_last_zoom = this.leaflet.map.getZoom();
    this.map_zooming = false;

    this.initMapHandlers();
    this.initInputHandlers();
};

// Leaflet map/layer handlers
GLRenderer.prototype.initMapHandlers = function GLRendererInitMapHandlers ()
{
    var renderer = this;

    this.leaflet.map.on('zoomstart', function () {
        console.log("map.zoomstart " + renderer.leaflet.map.getZoom());
        renderer.map_last_zoom = renderer.leaflet.map.getZoom();
        renderer.map_zooming = true;
    });

    this.leaflet.map.on('zoomend', function () {
        console.log("map.zoomend " + renderer.leaflet.map.getZoom());
        renderer.map_zooming = false;

        // Schedule GL tiles for removal on zoom
        // console.log("renderer.map_last_zoom: " + renderer.map_last_zoom);
        var map_zoom = renderer.leaflet.map.getZoom();
        var below = map_zoom;
        var above = map_zoom;
        if (Math.abs(map_zoom - renderer.map_last_zoom) == 1) {
            if (map_zoom > renderer.map_last_zoom) {
                below = map_zoom - 1;
            }
            else {
                above = map_zoom + 1;
            }
        }
        renderer.removeTilesOutsideZoomRange(below, above);
        renderer.map_last_zoom = renderer.leaflet.map.getZoom();
    });

    this.leaflet.layer.on('tileunload', function (event) {
        var tile = event.tile;
        var key = tile.getAttribute('data-tile-key');
        if (key && renderer.tiles[key]) {
            if (renderer.map_zooming == false) {
                console.log("unload " + key);
                renderer.removeTile(key);
            }
        }
    });
};

// User input
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
    });

    document.addEventListener('keyup', function (event) {
        gl_renderer.key = null;
    });
};

GLRenderer.aboutEqual = function (a, b, tolerance)
{
    tolerance = tolerance || 1;
    return (Math.abs(a - b) < tolerance);
};

GLRenderer.prototype.buildPolygons = function (polygons, feature, layer, style, tile)
{
    // To ensure layers draw in order, offset z coordinate by one centimeter per layer
    // TODO: use glPolygonOffset instead of modifying z coord in geom? or store as separate field that doesn't affect y coord in vertex shader
    var z = (feature.properties && feature.properties.sort_key) || layer.number;
    z /= 100;

    var color = (style.color && (style.color[feature.properties.kind] || style.color.default)) || [1.0, 0, 0];
    if (typeof color == 'function') { // dynamic/function-based color
        color = color(feature);
    }

    var triangles = [];
    var height, wall_vertices;
    var t, p, w;

    polygons.forEach(function (polygon) {

        // Polygon outlines & edge detection - experimental
        // for (t=0; t < polygon.length; t++) {
        //     for (p=0; p < polygon[t].length - 1; p++) {
        //         // Point A to B
        //         var pa = polygon[t][p];
        //         var pb = polygon[t][p+1];

        //         // Edge detection
        //         var edge = null;
        //         var pointTest = GLRenderer.aboutEqual;
        //         var tol = 2;

        //         if (pointTest(pa[0], tile.min.x, tol) && pointTest(pb[0], tile.min.x, tol)) {
        //             edge = 'left';
        //         }
        //         else if (pointTest(pa[0], tile.max.x, tol) && pointTest(pb[0], tile.max.x, tol)) {
        //             edge = 'right';
        //         }
        //         else if (pointTest(pa[1], tile.min.y, tol) && pointTest(pb[1], tile.min.y, tol)) {
        //             edge = 'top';
        //         }
        //         else if (pointTest(pa[1], tile.max.y, tol) && pointTest(pb[1], tile.max.y, tol)) {
        //             edge = 'bottom';
        //         }

        //         if (edge != null) {
        //             console.log("tile " + tile.key + " edge detected: " + edge);
        //             continue;
        //         }

        //         lines.push(
        //             // Point A
        //             pa[0],
        //             pa[1],
        //             z + 0,
        //             0, 0, 1, // flat surfaces point straight up
        //             1, 1, 1, // white
        //             // Point B
        //             pb[0],
        //             pb[1],
        //             z + 0,
        //             0, 0, 1, // flat surfaces point straight up
        //             1, 1, 1 // white
        //         );
        //     }
        // }

        // Use libtess.js port of gluTesselator for complex OSM polygons
        var vertices = GL.triangulate(polygon);

        // 3D buildings
        // TODO: try moving this into a style-specific post-processing/filter function?
        if (layer.name == 'buildings' && tile.coords.z >= 16) {
            height = 20; // TODO: add this to vector tiles

            for (t=0; t < vertices.length; t++) {
                triangles.push(
                    vertices[t][0],
                    vertices[t][1],
                    z + height,
                    0, 0, 1, // flat surfaces point straight up
                    color[0], color[1], color[2]
                );
            }
            // count += vertices.length;

            for (p=0; p < polygon.length; p++) {
                for (w=0; w < polygon[p].length - 1; w++) {
                    wall_vertices = [];

                    // Two triangles for the quad formed by each vertex pair, going from ground to building height
                    wall_vertices.push(
                        // Triangle
                        [polygon[p][w+1][0], polygon[p][w+1][1], z + height],
                        [polygon[p][w+1][0], polygon[p][w+1][1], z],
                        [polygon[p][w][0], polygon[p][w][1], z],
                        // Triangle
                        [polygon[p][w][0], polygon[p][w][1], z],
                        [polygon[p][w][0], polygon[p][w][1], z + height],
                        [polygon[p][w+1][0], polygon[p][w+1][1], z + height]
                    );

                    // Calc the normal of the wall from up vector and one segment of the wall triangles
                    var normal = Vector.cross(
                        [0, 0, 1],
                        Vector.normalize([polygon[p][w+1][0] - polygon[p][w][0], polygon[p][w+1][1] - polygon[p][w][1], 0])
                    );

                    for (t=0; t < wall_vertices.length; t++) {
                        triangles.push(
                            wall_vertices[t][0],
                            wall_vertices[t][1],
                            wall_vertices[t][2],
                            normal[0], normal[1], normal[2],
                            color[0], color[1], color[2]
                        );
                    }
                    // count += wall_vertices.length;
                }
            }
        }
        // Regular polygon
        else {
            for (t=0; t < vertices.length; t++) {
                triangles.push(
                    vertices[t][0],
                    vertices[t][1],
                    z,
                    0, 0, 1, // flat surfaces point straight up
                    color[0], color[1], color[2]
                );
            }
            // count += vertices.length;
        }
    });

    return triangles;
};

GLRenderer.prototype.buildLines = function (lines, feature, layer, style, tile)
{
    // To ensure layers draw in order, offset z coordinate by one centimeter per layer
    // TODO: use glPolygonOffset instead of modifying z coord in geom? or store as separate field that doesn't affect y coord in vertex shader
    var z = (feature.properties && feature.properties.sort_key) || layer.number;
    z /= 100;

    var color = (style.color && (style.color[feature.properties.kind] || style.color.default)) || [1.0, 0, 0];
    if (typeof color == 'function') { // dynamic/function-based color
        color = color(feature);
    }

    var segments = [];

    lines.forEach(function (line) {
        for (var p=0; p < line.length - 1; p++) {
            // Point A to B
            var pa = line[p];
            var pb = line[p+1];

            segments.push(
                // Point A
                pa[0],
                pa[1],
                z + 0,
                0, 0, 1, // flat surfaces point straight up
                color[0], color[1], color[2],
                // Point B
                pb[0],
                pb[1],
                z + 0,
                0, 0, 1, // flat surfaces point straight up
                color[0], color[1], color[2]
            );
        }
    });

    return segments;
}

GLRenderer.prototype.addTile = function GLRendererAddTile (tile, tileDiv)
{
    var renderer = this;
    var layer, style;
    var triangles = [];
    var lines = [];

    // Build raw geometry arrays
    for (var ln=0; ln < this.layers.length; ln++) {
        layer = this.layers[ln];
        style = this.styles[layer.name] || {};

        if (tile.layers[layer.name] != null) {
            tile.layers[layer.name].features.forEach(function(feature) {
                if (feature.geometry.type == 'Polygon') {
                    triangles = triangles.concat(renderer.buildPolygons([feature.geometry.coordinates], feature, layer, style, tile));
                }
                else if (feature.geometry.type == 'MultiPolygon') {
                    triangles = triangles.concat(renderer.buildPolygons(feature.geometry.coordinates, feature, layer, style, tile));
                }
                else if (feature.geometry.type == 'LineString') {
                    lines = lines.concat(renderer.buildLines([feature.geometry.coordinates], feature, layer, style, tile));
                }
                else if (feature.geometry.type == 'MultiLineString') {
                    lines = lines.concat(renderer.buildLines(feature.geometry.coordinates, feature, layer, style, tile));
                }
            });
        }
    }

    // Create GL geometry objects
    this.tiles[tile.key].gl_geometry = [];
    this.tiles[tile.key].gl_geometry.push(new GLTriangles(this.gl, this.program, new Float32Array(triangles)));
    this.tiles[tile.key].gl_geometry.push(new GLLines(this.gl, this.program, new Float32Array(lines), { line_width: 5 / Geo.meters_per_pixel[Math.floor(this.zoom)] }));
    // console.log("created " + count/3 + " triangles for tile " + tile.key);

    // Selection - experimental/future
    // var gl_renderer = this;
    // var pixel = new Uint8Array(4);
    // tileDiv.onmousemove = function (event) {
    //     // console.log(event.offsetX + ', ' + event.offsetY + ' | ' + parseInt(tileDiv.style.left) + ', ' + parseInt(tileDiv.style.top));
    //     var p = Point(
    //         event.offsetX + parseInt(tileDiv.style.left),
    //         event.offsetY + parseInt(tileDiv.style.top)
    //     );
    //     gl_renderer.gl.readPixels(p.x, p.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    //     console.log(p.x + ', ' + p.y + ': (' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', ' + pixel[3] + ')');
    // };
};

GLRenderer.prototype.removeTile = function GLRendererRemoveTile (key)
{
    if (this.tiles[key] != null && this.tiles[key].gl_geometry != null) {
        this.tiles[key].gl_geometry.forEach(function (gl_geometry) { gl_geometry.destroy(); });
        this.tiles[key].gl_geometry = null;
    }
    VectorRenderer.prototype.removeTile.apply(this, arguments);
};

GLRenderer.prototype.removeTilesOutsideZoomRange = function (below, above)
{
    console.log("removeTilesOutsideZoomRange [" + below + ", " + above + "])");
    for (var t in this.tiles) {
        if (this.tiles[t].coords.z < below || this.tiles[t].coords.z > above) {
            console.log("removed " + this.tiles[t].key + " (outside range [" + below + ", " + above + "])");
            this.removeTile(t);
        }
    }
};

// Continuous zoom: maintains a floating point zoom and syncs with leaflet to set an integer zoom
GLRenderer.prototype.setZoom = function (z) {
    var base = Math.floor(z);
    var fraction = z % 1.0;
    var map = this.leaflet.map;
    if (base != map.getZoom()) {
        if (base > map.getMaxZoom()) {
            base = map.getMaxZoom();
            fraction = 0.99;
        }
        else if (base < map.getMinZoom()) {
            base = map.getMinZoom();
        }
        this.zoom = base + fraction;
        map.setZoom(base, { animate: false });
    }
    else {
        this.zoom = z;
    }
};

GLRenderer.prototype.input = function GLRendererInput ()
{
    // Fractional zoom scaling
    if (this.key == 'up') {
        this.setZoom(this.zoom + this.zoom_step);
    }
    else if (this.key == 'down') {
        this.setZoom(this.zoom - this.zoom_step);
    }
};

GLRenderer.prototype.render = function GLRendererRender ()
{
    var gl = this.gl;

    this.input();

    if (!this.program) {
        return;
    }
    gl.useProgram(this.program);

    // Sync zoom w/leaflet
    if (Math.floor(this.zoom) != this.leaflet.map.getZoom()) {
        this.zoom = this.leaflet.map.getZoom();
    }

    // Set values to this.program variables
    gl.uniform2f(gl.getUniformLocation(this.program, 'resolution'), gl.canvas.width, gl.canvas.height);

    var center = this.leaflet.map.getCenter(); // TODO: move map center tracking/projection to central class?
    center = Geo.latLngToMeters(Point(center.lng, center.lat));
    gl.uniform2f(gl.getUniformLocation(this.program, 'map_center'), center.x, center.y);
    gl.uniform1f(gl.getUniformLocation(this.program, 'map_zoom'), this.zoom);
    // gl.uniform1f(gl.getUniformLocation(this.program, 'map_zoom'), Math.floor(this.zoom) + (Math.log((this.zoom % 1) + 1) / Math.LN2)); // scale fractional zoom by log

    // gl.clearColor(200 / 255, 200 / 255, 200 / 255, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // this.background.render();

    // Render tile GL geometries
    var count = 0;
    for (var t in this.tiles) {
        if (this.tiles[t].coords.z == (this.zoom << 0)) {
            if (this.tiles[t].gl_geometry != null) {
                this.tiles[t].gl_geometry.forEach(function (gl_geometry) {
                    gl_geometry.render();
                    count += gl_geometry.geometry_count;
                });
            }
        }
        // else {
        //     console.log("didn't render " + this.tiles[t].key);
        // }
    }

    if (count != this.last_render_count) {
        console.log("rendered " + count + " primitives");
    }
    this.last_render_count = count;
};
