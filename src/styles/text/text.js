// Polygon rendering style

import Builders from '../builders';
import Texture from '../../gl/texture';
import WorkerBroker from '../../utils/worker_broker';
import Utils from '../../utils/utils';
import {Sprites} from '../sprites/sprites';
import Label from './label';
import {StyleParser} from '../style_parser';

export var Text = Object.create(Sprites);

Object.assign(Text, {
    name: 'text',
    super: Sprites,
    built_in: true,

    init() {

        this.super.init.apply(this);

        // Provide a hook for this object to be called from worker threads
        if (Utils.isMainThread) {
            WorkerBroker.addTarget('Text', this);
        }

        this.texts = {}; // unique texts, keyed by tile
        this.texture = {};
        this.canvas = {};
        this.bboxes = {};
        this.geometries = {};

        this.font_style = {
            typeface: 'Helvetica',
            size: '12px',
            fill: 'white',
            stroke: 'black'
        }
    },

    // Set font style params for canvas drawing
    setFont (tile, { size, typeface, fill, stroke }) {
        this.size = parseInt(size);
        this.buffer = 6; // pixel padding around text
        let ctx = this.getContext(tile);

        ctx.font = size + ' ' + typeface;
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        ctx.lineWidth = 4;
        ctx.miterLimit = 2;
    },

    getContext (tile) {
        return this.canvas[tile].getContext('2d');
    },

    // Width and height of text based on current font style
    textSize (text, tile) {
        return [
            Math.ceil(this.getContext(tile).measureText(text).width) + this.buffer * 2,
            this.size + this.buffer * 2
        ];
    },

    // Draw text at specified location, adjusting for buffer and baseline
    drawText (text, [x, y], tile) {
        // TODO: optional stroke
        this.getContext(tile).strokeText(text, x + this.buffer, y + this.buffer + this.size);
        this.getContext(tile).fillText(text, x + this.buffer, y + this.buffer + this.size);
    },

    setTextureTextPositions (tile, texts) {
        // Find widest label and sum of all label heights
        let widest = 0, height = 0;

        for (let key in texts) {
            let size = texts[key].size;

            texts[key].position = [0, height];

            if (size[0] > widest) {
                widest = size[0];
            }

            height += size[1];
        }

        return [ widest, height ];
    },

    getTextSizes (tile, texts) {
        // create a canvas
        var canvas = document.createElement('canvas');
        this.canvas[tile] = canvas;

        // update text sizes
        for (let key in texts) {
            let text = key.split('/')[0];
            this.setFont(tile, texts[key].text_style);
            texts[key].size = this.textSize(text, tile);
        }

        return Promise.resolve(texts);
    },

    rasterize (tile, texts, texture_size) {
        for (let key in texts) {
            let info = texts[key];
            let text = key.split('/')[0];

            this.setFont(tile, info.text_style);
            this.drawText(text, info.position, tile);

            info.texcoords = Builders.getTexcoordsForSprite(
                info.position,
                info.size,
                texture_size
            );
        }
    },

    // Called on main thread from worker, to create atlas of labels for a tile
    addTexts (tile, texts) {
        this.texts[tile] = texts;

        let texture_size = this.setTextureTextPositions(tile, texts);
        let context = this.getContext(tile);

        console.log(`text summary for tile ${tile}: fits in ${texture_size[0]}x${texture_size[1]}px`);

        // update the canvas "context"
        this.canvas[tile].width = texture_size[0];
        this.canvas[tile].height = texture_size[1];
        context.clearRect(0, 0, texture_size[0], texture_size[1]);

        // create a texture
        this.texture[tile] = new Texture(this.gl, 'labels-' + tile, { filtering: 'linear' });
        this.texture[tile].setCanvas(this.canvas[tile]);

        // ask for rasterization for the text set
        this.rasterize(tile, texts, texture_size);

        this.texture[tile].update();

        return Promise.resolve(this.texts[tile]);
    },

    // Override
    startData () {
        let tile_data = this.super.startData.apply(this);
        tile_data.queue = [];
        return tile_data;
    },

    // Override
    endData (tile_data) {
        // Count collected text
        let tile, count;
        if (tile_data.queue.length > 0) {
            tile = tile_data.queue[0][2].tile.key;
            count = Object.keys(this.texts[tile]||{}).length;
            console.log(`# texts for tile ${tile}: ${count}`);
        }
        if (!count) {
            return Promise.resolve();
        }

        // Attach tile-specific label atlas to mesh as a texture uniform
        tile_data.uniforms = { u_textures: ['labels-'+tile] };

        return WorkerBroker.postMessage('Text', 'getTextSizes', tile, this.texts[tile]).then(texts => {
            if (this.bboxes[tile] === undefined) {
                this.bboxes[tile] = [];
            }

            for (let key in texts) {
                let text_info = texts[key];
                let text = key.split('/')[0];
                let label;
                let keep_in_tile;
                let move_in_tile;
                let geometry = this.geometries[tile][key];

                if (geometry.type === "LineString") {
                    let lines = geometry.coordinates;
                    let line = [lines[0]];

                    keep_in_tile = true;
                    move_in_tile = true;

                    label = new Label(text, line[0], text_info.size, lines);
                } else if (geometry.type === "Point") {
                    let points = [geometry.coordinates];

                    keep_in_tile = true;
                    move_in_tile = false;

                    label = new Label(text, points[0], text_info.size);
                }

                if (label.discard(move_in_tile, keep_in_tile, this.bboxes[tile])) {
                    // remove the text from the map
                    delete texts[key];
                }

                // TODO : add labels to the worker
            }

            if (Object.keys(texts).length == 0) {
                // early exit
                return;
            }

            return WorkerBroker.postMessage('Text', 'addTexts', tile, texts).then(texts => {
                this.texts[tile] = texts;

                // Build queued features
                tile_data.queue.forEach(q => this.super.addFeature.apply(this, q));
                tile_data.queue = [];

                return this.super.endData.call(this, tile_data);
            });
        });
    },

    // Override to queue features instead of processing immediately
    addFeature (feature, rule, context, tile_data) {
        // Collect text
        let text = feature.properties.name;

        if (text) {
            let tile = context.tile.key;
            if (!this.texts[tile]) {
                this.texts[tile] = {};
            }

            if (!this.geometries[tile]) {
                this.geometries[tile] = {};
            }

            let style = this.font_style;

            if (rule.font) {
                style = {
                    typeface: rule.font.typeface || this.font_style.typeface,
                    size: rule.font.size || this.font_size.font_size,
                    fill: rule.font.fill === undefined ? this.font_style.fill : Utils.toCanvasColor(rule.font.fill),
                    stroke: rule.font.stroke === undefined ? this.font_style.stroke : Utils.toCanvasColor(rule.font.stroke)
                };

                let style_key = `${style.typeface}/${style.size}/${style.fill}/${style.stroke}`;
            }

            let key = `${text}/${style_key}`;

            this.texts[tile][key] = {
                text_style: style
            };

            this.geometries[tile][key] = feature.geometry;
        }

        tile_data.queue.push([feature, rule, context, tile_data]);
    },

    buildLines (lines, style, vertex_data) {
        var vertex_template = this.makeVertexTemplate(style);
        let line = lines[0];

        // TODO : get labels
        // let label = new Label(style.text, line[0], style.size, lines);
        return;

        Builders.buildSpriteQuadsForPoints(
            [ label.position ],
            Utils.scaleInt16(label.size[0], 128), Utils.scaleInt16(label.size[1], 128),
            Utils.scaleInt16(Utils.radToDeg(label.angle), 360),
            Utils.scaleInt16(style.scale, 256),
            vertex_data,
            vertex_template,
            this.vertex_layout.index.a_shape,
            { texcoord_index: this.vertex_layout.index.a_texcoord, texcoord_scale: this.texcoord_scale }
        );
    },

    buildPoints (points, style, vertex_data) {
        var vertex_template = this.makeVertexTemplate(style);

        // TODO : get labels
        //let label = new Label(style.text, points[0], style.size);

        // size = label.size;
        // position = label.position;
        return;

        Builders.buildSpriteQuadsForPoints(
            [ position ],
            Utils.scaleInt16(size[0], 128), Utils.scaleInt16(size[1], 128),
            Utils.scaleInt16(Utils.radToDeg(angle), 360),
            Utils.scaleInt16(style.scale, 256),
            vertex_data,
            vertex_template,
            this.vertex_layout.index.a_shape,
            { texcoord_index: this.vertex_layout.index.a_texcoord, texcoord_scale: this.texcoord_scale }
        );
    },

    _parseFeature (feature, rule_style, context) {
        let style = this.feature_style;
        let tile = context.tile.key;

        style.text = feature.properties.name;

        style.angle = rule_style.angle || 0;
        if (typeof style.angle === 'function') {
            style.angle = style.angle(context);
        }

        // factor by which sprites scales from current zoom level to next zoom level
        style.scale = rule_style.scale || 1;

        // to store bbox by tiles
        style.tile = tile;

        // Set UVs
        // TODO : fix uvs
        // this.texcoord_scale = this.texts[tile][style.text].texcoords;

        return style;
    }

});
