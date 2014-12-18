// Polygon rendering style

import {Style} from './style';
import {StyleParser} from './style_parser';
import gl from '../gl/gl_constants'; // web workers don't have access to GL context, so import all GL constants
import GLVertexLayout from '../gl/gl_vertex_layout';
import {GLBuilders} from '../gl/gl_builders';
import GLTexture from '../gl/gl_texture';

export var Polygons = Object.create(Style);

Object.assign(Polygons, {
    built_in: true,

    init() {
        Style.init.apply(this);

        // Base shaders
        this.vertex_shader_key = 'polygon_vertex';
        this.fragment_shader_key = 'polygon_fragment';

        // Default world coords to wrap every 100,000 meters, can turn off by setting this to 'false'
        this.defines['WORLD_POSITION_WRAP'] = 100000;

        // Turn feature selection on
        this.selection = true;

        // Basic attributes, others can be added (see texture UVs below)
        var attribs = [
            { name: 'a_position', size: 3, type: gl.FLOAT, normalized: false },
            { name: 'a_normal', size: 3, type: gl.FLOAT, normalized: false },
            // { name: 'a_normal', size: 3, type: gl.BYTE, normalized: true }, // attrib isn't a multiple of 4!
            // { name: 'a_color', size: 3, type: gl.FLOAT, normalized: false },
            { name: 'a_color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
            // { name: 'a_selection_color', size: 4, type: gl.FLOAT, normalized: false },
            { name: 'a_selection_color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
            { name: 'a_layer', size: 1, type: gl.FLOAT, normalized: false }
        ];

        // Optional texture UVs
        if (this.texcoords) {
            this.defines['TEXTURE_COORDS'] = true;

            // Add vertex attribute for UVs only when needed
            attribs.push({ name: 'a_texcoord', size: 2, type: gl.FLOAT, normalized: false });
        }

        this.vertex_layout = new GLVertexLayout(attribs);
    },

    _parseFeature (feature, feature_style, context) {
        var style = this.feature_style;

        style.color = feature_style.color && StyleParser.parseColor(feature_style.color, context);
        style.width = feature_style.width && StyleParser.parseDistance(feature_style.width, context);
        style.size = feature_style.size && StyleParser.parseDistance(feature_style.size, context);
        style.z = (feature_style.z && StyleParser.parseDistance(feature_style.z || 0, context)) || StyleParser.defaults.z;

        style.texture = feature_style.texture;
        style.sprite = feature_style.sprite;

        // height defaults to feature height, but extrude style can dynamically adjust height by returning a number or array (instead of a boolean)
        style.height = feature.properties.height || StyleParser.defaults.height;
        style.min_height = feature.properties.min_height || StyleParser.defaults.min_height;
        style.extrude = feature_style.extrude;
        if (style.extrude) {
            if (typeof style.extrude === 'function') {
                style.extrude = style.extrude(context);
            }

            if (typeof style.extrude === 'number') {
                style.height = style.extrude;
            }
            else if (Array.isArray(style.extrude)) {
                style.min_height = style.extrude[0];
                style.height = style.extrude[1];
            }
        }

        style.outline = style.outline || {};
        if (feature_style.outline) {
            style.outline.color = StyleParser.parseColor(feature_style.outline.color, context);
            style.outline.width = StyleParser.parseDistance(feature_style.outline.width, context);
            style.outline.tile_edges = feature_style.outline.tile_edges;
        }
        else {
            style.outline.color = null;
            style.outline.width = null;
            style.outline.tile_edges = false;
        }

        return style;
    },

    /**
     * A "template" that sets constant attibutes for each vertex, which is then modified per vertex or per feature.
     * A plain JS array matching the order of the vertex layout.
     */
    makeVertexTemplate(style) {
        // Placeholder values
        var color = style.color || [0, 0, 0];

        // Basic attributes, others can be added (see texture UVs below)
        var template = [
            // position - x & y coords will be filled in per-vertex below
            0, 0, style.z || 0,
            // normal
            0, 0, 1,
            // color
            // TODO: automate multiplication for normalized attribs?
            color[0] * 255, color[1] * 255, color[2] * 255, 255,
            // selection color
            style.selection_color[0] * 255, style.selection_color[1] * 255, style.selection_color[2] * 255, style.selection_color[3] * 255,
            // layer number
            style.layer
        ];

        if (this.texcoords) {
            // debugger;
            // Add texture UVs to template only if needed
            template.push(0, 0);

            if (this.textures && this.textures[style.texture] && style.sprite) {
                // var texture = this.textures[style.texture] && GLTexture.textures[style.texture];
                var texture = this.textures[style.texture];
                var sprite = this.textures[style.texture].atlas && this.textures[style.texture].atlas[style.sprite];
                if (sprite) {
                    this.texcoord_scale = [];
                    this.texcoord_scale[0] = GLBuilders.scaleTexcoordsToSprite(
                        [0, 0], [sprite[0], sprite[1]], [sprite[2], sprite[3]], [texture.width, texture.height]);
                    this.texcoord_scale[1] = GLBuilders.scaleTexcoordsToSprite(
                        [1, 1], [sprite[0], sprite[1]], [sprite[2], sprite[3]], [texture.width, texture.height]);
                }
            }
        }

        return template;

    },

    buildPolygons(polygons, style, vertex_data) {
        var vertex_template = this.makeVertexTemplate(style);

        // Polygon fill
        if (style.color) {
            // Extruded polygons (e.g. 3D buildings)
            if (style.extrude && style.height) {
                GLBuilders.buildExtrudedPolygons(
                    polygons,
                    style.z, style.height, style.min_height,
                    vertex_data, vertex_template,
                    this.vertex_layout.index.a_normal,
                    { texcoord_index: this.vertex_layout.index.a_texcoord, texcoord_scale: this.texcoord_scale }
                );
            }
            // Regular polygons
            else {
                GLBuilders.buildPolygons(
                    polygons,
                    vertex_data, vertex_template,
                    { texcoord_index: this.vertex_layout.index.a_texcoord, texcoord_scale: this.texcoord_scale }
                );
            }
        }

        // Polygon outlines
        if (style.outline && style.outline.color && style.outline.width) {
            // Replace color in vertex template
            var color_index = this.vertex_layout.index.a_color;
            vertex_template[color_index + 0] = style.outline.color[0] * 255;
            vertex_template[color_index + 1] = style.outline.color[1] * 255;
            vertex_template[color_index + 2] = style.outline.color[2] * 255;

            // Polygon outlines sit over current layer but underneath the one above
            // TODO: address inconsistency with line outlines
            vertex_template[this.vertex_layout.index.a_layer] += 0.0001;

            for (var mpc=0; mpc < polygons.length; mpc++) {
                GLBuilders.buildPolylines(
                    polygons[mpc],
                    style.z,
                    style.outline.width,
                    vertex_data,
                    vertex_template,
                    {
                        texcoord_index: this.vertex_layout.index.a_texcoord,
                        texcoord_scale: this.texcoord_scale,
                        closed_polygon: true,
                        remove_tile_edges: !style.outline.tile_edges
                    }
                );
            }
        }
    },

    buildLines(lines, style, vertex_data) {
        var vertex_template = this.makeVertexTemplate(style);

        // Main line
        if (style.color && style.width) {
            GLBuilders.buildPolylines(
                lines,
                style.z,
                style.width,
                vertex_data,
                vertex_template,
                {
                    texcoord_index: this.vertex_layout.index.a_texcoord
                }
            );
        }

        // Outline
        if (style.outline && style.outline.color && style.outline.width) {
            // Replace color in vertex template
            var color_index = this.vertex_layout.index.a_color;
            vertex_template[color_index + 0] = style.outline.color[0] * 255;
            vertex_template[color_index + 1] = style.outline.color[1] * 255;
            vertex_template[color_index + 2] = style.outline.color[2] * 255;

            // Line outlines sit underneath current layer but above the one below
            // TODO: address inconsistency with polygon outlines
            // TODO: need more fine-grained styling controls for outlines
            // (see complex road interchanges where casing outlines should be interleaved by road type)
            vertex_template[this.vertex_layout.index.a_layer] -= 0.0001;

            GLBuilders.buildPolylines(
                lines,
                style.z,
                style.width + 2 * style.outline.width,
                vertex_data,
                vertex_template,
                {
                    texcoord_index: this.vertex_layout.index.a_texcoord
                }
            );
        }
    },

    buildPoints(points, style, vertex_data) {
        if (!style.color || !style.size) {
            return;
        }

        var vertex_template = this.makeVertexTemplate(style);

        GLBuilders.buildQuadsForPoints(
            points,
            style.size * 2,
            style.size * 2,
            vertex_data,
            vertex_template,
            { texcoord_index: this.vertex_layout.index.a_texcoord }
        );

    },
    name: 'polygons'
});
