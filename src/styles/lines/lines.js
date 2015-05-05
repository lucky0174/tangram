// Line rendering style

import {Style} from '../style';
import {StyleParser} from '../style_parser';
import gl from '../../gl/constants'; // web workers don't have access to GL context, so import all GL constants
import VertexLayout from '../../gl/vertex_layout';
import Builders from '../builders';
import Utils from '../../utils/utils';

export var Lines = Object.create(Style);

Object.assign(Lines, {
    name: 'lines',
    built_in: true,
    vertex_shader_key: 'styles/polygons/polygons_vertex', // re-use polygon shaders
    fragment_shader_key: 'styles/polygons/polygons_fragment',
    selection: true,

    init() {
        Style.init.apply(this, arguments);

        // Default world coords to wrap every 100,000 meters, can turn off by setting this to 'false'
        this.defines.TANGRAM_WORLD_POSITION_WRAP = 100000;

        // Basic attributes, others can be added (see texture UVs below)
        var attribs = [
            { name: 'a_position', size: 3, type: gl.FLOAT, normalized: false },
            { name: 'a_extrude', size: 3, type: gl.FLOAT, normalized: false },
            { name: 'a_scale', size: 2, type: gl.SHORT, normalized: true },
            { name: 'a_color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
            { name: 'a_selection_color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
            { name: 'a_layer', size: 1, type: gl.FLOAT, normalized: false }
        ];

        // Tell the shader we want an order attribute, and to extrude lines
        this.defines.TANGRAM_ORDER_ATTRIBUTE = true;
        this.defines.TANGRAM_EXTRUDE_LINES = true;

        // Optional texture UVs
        if (this.texcoords) {
            this.defines.TANGRAM_TEXTURE_COORDS = true;

            // Add vertex attribute for UVs only when needed
            attribs.push({ name: 'a_texcoord', size: 2, type: gl.FLOAT, normalized: false });
        }

        this.vertex_layout = new VertexLayout(attribs);
    },

    _parseFeature (feature, rule_style, context) {
        var style = this.feature_style;

        style.width = rule_style.width && StyleParser.cacheDistance(rule_style.width, context);
        if (!style.width) {
            return;
        }

        style.color = rule_style.color && StyleParser.cacheColor(rule_style.color, context);

        // Smoothly interpolate line width between zooms: get scale factors to previous and next zooms
        // Adjust by factor of 2 because tile units are zoom-dependent (a given value is twice as
        // big in world space at the next zoom than at the previous)
        context.zoom--;
        context.units_per_meter /= 2;
        style.prev_width = StyleParser.cacheDistance(rule_style.width, context);
        style.prev_width = Utils.scaleInt16(style.prev_width / style.width, 256);
        context.zoom += 2;
        context.units_per_meter *= 4; // undo previous divide by 2, then multiply by 2
        style.next_width = StyleParser.cacheDistance(rule_style.width, context);
        style.next_width = Utils.scaleInt16(style.next_width / style.width, 256);
        context.zoom--;
        context.units_per_meter /= 2;

        // height defaults to feature height, but extrude style can dynamically adjust height by returning a number or array (instead of a boolean)
        style.z = (rule_style.z && StyleParser.cacheDistance(rule_style.z || 0, context)) || StyleParser.defaults.z;
        style.height = feature.properties.height || StyleParser.defaults.height;
        style.extrude = rule_style.extrude;
        if (style.extrude) {
            if (typeof style.extrude === 'function') {
                style.extrude = style.extrude(context);
            }

            if (typeof style.extrude === 'number') {
                style.height = style.extrude;
            }
            else if (Array.isArray(style.extrude)) {
                style.height = style.extrude[1];
            }
        }

        // Raise line height if extruded
        if (style.extrude && style.height) {
            style.z += style.height;
        }

        style.cap = rule_style.cap;
        style.join = rule_style.join;
        style.tile_edges = rule_style.tile_edges;

        // style.outline = style.outline || {};
        // if (rule_style.outline) {
        //     style.outline.color = rule_style.outline.color && StyleParser.cacheColor(rule_style.outline.color, context);
        //     style.outline.width = rule_style.outline.width && StyleParser.parseDistance(rule_style.outline.width, context);
        //     style.outline.cap = rule_style.outline.cap || rule_style.cap;
        //     style.outline.join = rule_style.outline.join || rule_style.join;
        // }
        // else {
        //     style.outline.color = null;
        //     style.outline.width = null;
        // }

        return style;
    },

    preprocess (draw) {
        draw.color = draw.color && { value: draw.color };
        draw.width = draw.width && { value: draw.width };
        draw.z = draw.z && { value: draw.z };

        // if (draw.outline) {
        //     draw.outline.color = draw.outline.color && { value: draw.outline.color };
        // }
    },

    /**
     * A "template" that sets constant attibutes for each vertex, which is then modified per vertex or per feature.
     * A plain JS array matching the order of the vertex layout.
     */
    makeVertexTemplate(style) {
       var color = style.color || [0, 0, 0, 1];

        // position - x & y coords will be filled in per-vertex below
        this.vertex_template[0] = 0;
        this.vertex_template[1] = 0;
        this.vertex_template[2] = style.z || 0;

        // extrusion vector
        this.vertex_template[3] = 0;
        this.vertex_template[4] = 0;
        this.vertex_template[5] = 1;

        // scaling to previous and next zoom
        this.vertex_template[6] = style.prev_width;
        this.vertex_template[7] = style.next_width;

        // color
        this.vertex_template[8] = color[0] * 255;
        this.vertex_template[9] = color[1] * 255;
        this.vertex_template[10] = color[2] * 255;
        this.vertex_template[11] = color[3] * 255;

        // selection color
        this.vertex_template[12] = style.selection_color[0] * 255;
        this.vertex_template[13] = style.selection_color[1] * 255;
        this.vertex_template[14] = style.selection_color[2] * 255;
        this.vertex_template[15] = style.selection_color[3] * 255;

        // layer order
        this.vertex_template[16] = style.order;

        // Add texture UVs to template only if needed
        if (this.texcoords) {
            this.vertex_template[17] = 0;
            this.vertex_template[18] = 0;
        }

        return this.vertex_template;
    },

    buildLines(lines, style, vertex_data, options = {}) {
        var vertex_template = this.makeVertexTemplate(style);

        // Main line
        if (style.color && style.width) {
            Builders.buildPolylines(
                lines,
                style.width,
                vertex_data,
                vertex_template,
                {
                    cap: style.cap,
                    join: style.join,
                    scaling_index: this.vertex_layout.index.a_extrude,
                    texcoord_index: this.vertex_layout.index.a_texcoord,
                    texcoord_scale: this.texcoord_scale,
                    closed_polygon: options.closed_polygon,
                    remove_tile_edges: !style.tile_edges && options.remove_tile_edges
                }
            );
        }

        // Outline
        // TODO: for now, outlines can be drawn with multiple draw groups, but can consider restoring
        // some outline capabilities in the future
        // if (style.outline && style.outline.color && style.outline.width) {
        //     // Replace color in vertex template
        //     var color_index = this.vertex_layout.index.a_color;
        //     vertex_template[color_index + 0] = style.outline.color[0] * 255;
        //     vertex_template[color_index + 1] = style.outline.color[1] * 255;
        //     vertex_template[color_index + 2] = style.outline.color[2] * 255;

        //     // Line outlines sit underneath current layer but above the one below
        //     vertex_template[this.vertex_layout.index.a_layer] -= 0.5;

        //     Builders.buildPolylines(
        //         lines,
        //         style.width + 2 * style.outline.width,
        //         vertex_data,
        //         vertex_template,
        //         {
        //             cap: style.outline.cap,
        //             join: style.outline.join,
        //             scaling_index: this.vertex_layout.index.a_extrude,
        //             texcoord_index: this.vertex_layout.index.a_texcoord,
        //             texcoord_scale: this.texcoord_scale,
        //             closed_polygon: options.closed_polygon,
        //             remove_tile_edges: !style.tile_edges && options.remove_tile_edges
        //         }
        //     );
        // }
    },

    buildPolygons(polygons, style, vertex_data) {
        // Render polygons as individual lines
        for (let p=0; p < polygons.length; p++) {
            this.buildLines(polygons[p], style, vertex_data, { closed_polygon: true, remove_tile_edges: true });
        }
    }

});
