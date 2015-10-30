import Utils from '../../utils/utils';
import Builders from '../builders';

export default class CanvasText {

    constructor () {
        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = 'transparent'; // render text on transparent background
        this.context = this.canvas.getContext('2d');
    }

    resize (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context.clearRect(0, 0, width, height);
    }

    // Set font style params for canvas drawing
    setFont (tile, { font_css, fill, stroke, stroke_width, px_size }) {
        this.px_size = px_size;
        this.text_buffer = 8; // pixel padding around text
        let ctx = this.context;

        ctx.font = font_css;
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = stroke_width;
        }
        else {
            ctx.strokeStyle = null;
            ctx.lineWidth = 0;
        }
        ctx.fillStyle = fill;
        ctx.miterLimit = 2;
    }

    textSizes (tile, texts) {
        for (let style in texts) {
            let text_infos = texts[style];

            for (let text in text_infos) {
                let text_style = text_infos[text].text_style;
                // update text sizes
                this.setFont(tile, text_style); // TODO: only set once above
                Object.assign(
                    text_infos[text],
                    this.textSize(text, tile, {
                        transform: text_style.transform,
                        text_wrap: text_style.text_wrap
                    })
                );
            }
        }

        return texts;
    }

    // Computes width and height of text based on current font style
    // Includes word wrapping, returns size info for whole text block and individual lines
    textSize (text, tile, { transform, text_wrap }) {
        let str = this.applyTextTransform(text, transform);
        let ctx = this.context;
        let buffer = this.text_buffer * Utils.device_pixel_ratio;
        let px_size = this.px_size;

        // vertical padding, TODO: use Canvas TextMetrics when/if they become available and/or make configurable
        px_size += 2;

        // Word wrapping
        // Line breaks can be caused by:
        //  - implicit line break when a maximum character threshold is exceeded per line (text_wrap)
        //  - explicit line break in the label text (\n)
        let words;
        if (typeof text_wrap === 'number') {
            words = str.split(' '); // split words on spaces
        }
        else {
            words = [str]; // no max line word wrapping (but new lines will still be in effect)
        }
        let new_line_template = { width: 0, chars: 0, text: '' };
        let line = Object.assign({}, new_line_template); // current line
        let lines = []; // completed lines
        let max_width = 0; // max width to fit all lines

        // add current line buffer to completed lines, optionally start new line
        function addLine (new_line) {
            line.text = line.text.trim();
            if (line.text.length > 0) {
                line.width = ctx.measureText(line.text).width;
                max_width = Math.max(max_width, Math.ceil(line.width));
                lines.push(line);
            }
            if (new_line) {
                line = Object.assign({}, new_line_template);
            }
        }

        // First iterate on space-break groups (will be one if max line length off), then iterate on line-break groups
        for (let w=0; w < words.length; w++) {
            let breaks = words[w].split('\n'); // split on line breaks

            for (let n=0; n < breaks.length; n++) {
                let word = breaks[n];

                // if adding current word would overflow, add a new line instead
                if (line.chars + word.length > text_wrap && line.chars > 0) {
                    addLine(true);
                }

                // add current word (plus space)
                line.chars += word.length + 1;
                line.text += word + ' ';

                // if line breaks present, add new line (unless on last line)
                if (breaks.length > 1 && n < breaks.length - 1) {
                    addLine(true);
                }
            }
        }
        addLine(false);

        // Final dimensions of text
        let height = lines.length * px_size;

        let text_size = [
            max_width / Utils.device_pixel_ratio,
            height / Utils.device_pixel_ratio
        ];

        let texture_text_size = [
            max_width + buffer * 2,
            height + buffer * 2
        ];

        // Returns lines (w/per-line info for drawing) and text's overall bounding box + canvas size
        return {
            lines,
            size: { text_size, texture_text_size, px_size }
        };
    }

    // Draw one or more lines of text at specified location, adjusting for buffer and baseline
    drawText (lines, [x, y], size, tile, { stroke, transform, align }) {
        align = align || 'center';

        for (let line_num=0; line_num < lines.length; line_num++) {
            let line = lines[line_num];
            let str = this.applyTextTransform(line.text, transform);
            let buffer = this.text_buffer * Utils.device_pixel_ratio;
            let texture_size = size.texture_text_size;
            let px_size = size.px_size;

            // Text alignment
            let tx;
            if (align === 'left') {
                tx = x + buffer;
            }
            else if (align === 'center') {
                tx = x + texture_size[0]/2 - line.width/2;
            }
            else if (align === 'right') {
                tx = x + texture_size[0] - line.width - buffer;
            }

            // In the absence of better Canvas TextMetrics (not supported by browsers yet),
            // 0.75 buffer produces a better approximate vertical centering of text
            let ty = y + buffer * 0.75 + (line_num + 1) * px_size;

            if (stroke) {
                this.context.strokeText(str, tx, ty);
            }
            this.context.fillText(str, tx, ty);
        }
    }

    rasterize (tile, texts, texture_size) {
        for (let style in texts) {
            let text_infos = texts[style];

            for (let text in text_infos) {
                let info = text_infos[text];

                this.setFont(tile, info.text_style); // TODO: only set once above
                this.drawText(info.lines, info.position, info.size, tile, {
                    stroke: info.text_style.stroke,
                    transform: info.text_style.transform,
                    align: info.text_style.align
                });

                info.texcoords = Builders.getTexcoordsForSprite(
                    info.position,
                    info.size.texture_text_size,
                    texture_size
                );
            }
        }
    }

    setTextureTextPositions (texts) {
        // Find widest label and sum of all label heights
        let widest = 0, height = 0;

        for (let style in texts) {
            let text_infos = texts[style];

            for (let text in text_infos) {
                let text_info = text_infos[text];
                let size = text_info.size.texture_text_size;

                text_info.position = [0, height];

                if (size[0] > widest) {
                    widest = size[0];
                }

                height += size[1];
            }
        }

        return [ widest, height ];
    }

    // Called before rasterization
    applyTextTransform (text, transform) {
        if (transform === 'capitalize') {
            return text.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
        else if (transform === 'uppercase') {
            return text.toUpperCase();
        }
        else if (transform === 'lowercase') {
            return text.toLowerCase();
        }
        return text;
    }

};
