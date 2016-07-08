import Label from './label';
import Geo from '../geo';
import OBB from '../utils/obb';
import PointAnchor from '../styles/points/point_anchor';
import {StyleParser} from '../styles/style_parser';

export default class LabelPoint extends Label {

    constructor (position, size, options) {
        super(size, options);
        this.position = [position[0], position[1]];
        this.offset = [this.options.offset[0], this.options.offset[1]];
        this.anchor = this.options.anchor;
        this.parent = this.options.parent;
        this.update();
    }

    update() {
        this.computeOffset();
        this.updateBBoxes();
    }

    computeOffset () {
        // Additional anchor/offset for point:
        if (this.parent) {
            let parent = this.parent;
            // point's own anchor, text anchor applied to point, additional point offset
            this.offset = PointAnchor.computeOffset(this.offset, parent.size, parent.anchor);
            this.offset = PointAnchor.computeOffset(this.offset, parent.size, this.anchor);
            if (parent.offset !== StyleParser.zeroPair) {        // point has an offset
                if (this.offset === StyleParser.zeroPair) { // no text offset, use point's
                    this.offset = parent.offset;
                }
                else {                                          // text has offset, add point's
                    this.offset[0] += parent.offset[0];
                    this.offset[1] += parent.offset[1];
                }
            }
        }

        this.offset = PointAnchor.computeOffset(this.offset, this.size, this.anchor);
    }

    updateBBoxes () {
        let width = (this.size[0] + this.options.buffer[0] * 2) * this.options.units_per_pixel * Label.epsilon;
        let height = (this.size[1] + this.options.buffer[1] * 2) * this.options.units_per_pixel * Label.epsilon;

        let p = [
            this.position[0] + (this.offset[0] * this.options.units_per_pixel),
            this.position[1] - (this.offset[1] * this.options.units_per_pixel)
        ];

        this.obb = new OBB(p[0], p[1], 0, width, height);
        this.aabb = this.obb.getExtent();
    }

    // Try to move the label into the tile bounds
    // Returns true if label was moved into tile, false if it couldn't be moved
    moveIntoTile () {
        let updated = false;

        if (this.aabb[0] < 0) {
            this.position[0] += -this.aabb[0];
            updated = true;
        }

        if (this.aabb[2] >= Geo.tile_scale) {
            this.position[0] -= this.aabb[2] - Geo.tile_scale + 1;
            updated = true;
        }

        if (this.aabb[3] > 0) {
            this.position[1] -= this.aabb[3];
            updated = true;
        }

        if (this.aabb[1] <= -Geo.tile_scale) {
            this.position[1] -= this.aabb[1] + Geo.tile_scale - 1;
            updated = true;
        }

        if (updated) {
            this.updateBBoxes();
        }

        return this.inTileBounds();
    }

}
