// Sprite rendering style

import {Style} from '../style';
import {StyleParser} from '../style_parser';
import gl from '../../gl/constants'; // web workers don't have access to GL context, so import all GL constants
import VertexLayout from '../../gl/vertex_layout';
import Builders from '../builders';
import Utils from '../../utils/utils';
import Label from '../text/label';


export var Sprites = Object.create(Style);

Object.assign(Sprites, {
    name: 'sprites',
    built_in: true,

    init() {
        Style.init.apply(this);

        // Base shaders
        this.vertex_shader_key = 'styles/sprites/sprites_vertex';
        this.fragment_shader_key = 'styles/sprites/sprites_fragment';

        this.selection = true;
        this.bboxes = {};

        var attribs = [
            { name: 'a_position', size: 3, type: gl.FLOAT, normalized: false },
            { name: 'a_shape', size: 4, type: gl.SHORT, normalized: true },
            { name: 'a_selection_color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
            { name: 'a_texcoord', size: 2, type: gl.FLOAT, normalized: false }, // TODO: pack into shorts
            { name: 'a_layer', size: 1, type: gl.FLOAT, normalized: false }
        ];
        this.vertex_layout = new VertexLayout(attribs);
    },

    _parseFeature (feature, rule_style, context) {
        var style = this.feature_style;

        let tile = context.tile.key;

        style.z = (rule_style.z && StyleParser.parseDistance(rule_style.z || 0, context)) || StyleParser.defaults.z;
        style.texture = rule_style.texture;
        style.sprite = rule_style.sprite;

        // sprite style only supports sizes in pixel units, so unit conversion flag is off
        style.size = rule_style.size && StyleParser.parseDistance(rule_style.size, context, false);

        // scale size to 16-bit signed int, with a max allowed width + height of 128 pixels
        style.size = [
            Math.min((style.size[0] || style.size), 256),
            Math.min((style.size[1] || style.size), 256)
        ];

        style.angle = rule_style.angle || 0;
        if (typeof style.angle === 'function') {
            style.angle = style.angle(context);
        }

        // factor by which sprites scales from current zoom level to next zoom level
        style.scale = rule_style.scale || 1;

        // to store bbox by tiles
        style.tile = tile;

        style.keep_in_tile = true;
        style.move_in_tile = false;

        this.setTexcoordScale(style); // Sets texcoord scale if needed (e.g. for sprite sub-area)

        return style;
    },

    /**
     * A "template" that sets constant attibutes for each vertex, which is then modified per vertex or per feature.
     * A plain JS array matching the order of the vertex layout.
     */
    makeVertexTemplate(style) {
        // Basic attributes, others can be added (see texture UVs below)
        var template = [
            // position - (x, y) coords will be filled in per-vertex below
            0, 0, style.z || 0,
            // scaling vector - (x, y) components per pixel, z = angle, w = scaling factor
            0, 0, 0, 0,
            // selection color
            style.selection_color[0] * 255, style.selection_color[1] * 255, style.selection_color[2] * 255, style.selection_color[3] * 255,
            // texture coords
            0, 0,
            // draw order
            style.order
        ];

        return template;
    },

    keepLabel (style, label) {
        if (this.bboxes[style.tile] === undefined) {
            this.bboxes[style.tile] = [];
        }

        if (style.keep_in_tile) {
            if (style.move_in_tile) {
                label.moveInTile();
            } else {
                return !label.inTileBounds();
            }
        } 

        if (label.occluded(this.bboxes[style.tile])) {
            return false;
        }

        return true;
    },

    buildPoints (points, style, vertex_data) {
        if (!style.size) {
            return;
        }

        var vertex_template = this.makeVertexTemplate(style);
        
        let label = new Label(style.text, points[0], style.size);

        if (!this.keepLabel(style, label)) {
            return;
        }

        Builders.buildSpriteQuadsForPoints(
            points,
            Utils.scaleInt16(style.size[0], 128), Utils.scaleInt16(style.size[1], 128),
            Utils.scaleInt16(style.angle, 360),
            Utils.scaleInt16(style.scale, 256),
            vertex_data,
            vertex_template,
            this.vertex_layout.index.a_shape,
            { texcoord_index: this.vertex_layout.index.a_texcoord, texcoord_scale: this.texcoord_scale }
        );
    }

});
