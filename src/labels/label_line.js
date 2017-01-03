import Label from './label';
import Vector from '../vector';
import OBB from '../utils/obb';

const PLACEMENT = {
    MID_POINT: 0,
    CORNER: 1
};

const MAX_ANGLE = Math.PI / 2;      // maximum angle for articulated labels
const LINE_EXCEED_STRAIGHT = .1;   // minimal ratio for straight labels (label length) / (line length)
const LINE_EXCEED_KINKED = 0.6;     // minimal ratio for kinked labels

export default class LabelLine {

    constructor (size, lines, layout) {
        this.size = size;
        this.layout = layout;
        this.lines = lines;
        this.space_width = layout.space_width; // width of space for the font used
        this.space_indices = layout.space_indices;
        this.num_segments = size.length; // number of label segments
        this.total_length = size.reduce(function(prev, next){ return prev + next[0]; }, 0) + this.space_indices.length * this.space_width;
        this.total_height = size[0][1];
        this.placement = (layout.placement === undefined) ? PLACEMENT.MID_POINT : layout.placement;

        this.kink_index = 0; // index at which an articulated label will kink (e.g., 1 means a kink _after_ the first segment)
        this.spread_factor = 1; // spaces out adjacent words to prevent overlap
        this.fitness = 0; // measure of quality of fit

        this.line_lengths = getLineLengths(lines);
        this.line_angles = getLineAngles(lines);
        this.line_angles_segments = getLineAnglesForSegments(lines);
        this.pre_angles = [];
        this.positions = [];

        // Arrays for Label properties. TODO: create array of Label types, where LabelLine acts as a "grouped label"
        this.position = [];
        this.angle = [];
        this.offsets = [];
        this.obbs = [];
        this.aabbs = [];

        // optionally limit the line segments that the label may be placed in, by specifying a segment index range
        // used as a coarse subdivide for placing multiple labels per line geometry
        this.segment_index = layout.segment_index || layout.segment_start || 0;
        this.segment_max = layout.segment_end || this.lines.length;

        let spacing = 100;
        let {label_positions, label_indices} = getStartingPositions(lines, spacing + this.total_length, layout.units_per_pixel);

        if (label_positions.length === 0 || size.length === 0 || size.length < 4){
            this.throw_away = true;
            return;
        }

        let upp = layout.units_per_pixel;

        let total_line_length = this.line_lengths.reduce(function(prev, next){ return prev + next; });
        let total_label_length = upp * size.reduce(function(prev, next){ return prev + next[0]; }, 0);

        if (total_label_length > total_line_length){
            this.throw_away = true;
            return;
        }

        let label_lengths = size.map(function(size){
            return size[0] * upp;
        });

        let widths = size.map(function(size){
            return size[0];
        });

        // starting position
        let anchor_offset = 0;
        let anchor_index = curvaturePlacement(this.lines, total_line_length, this.line_lengths, total_label_length);
        // let anchor_index = 0;

        let anchor = Vector.add(
            lines[anchor_index],
            Vector.rot([anchor_offset, 0], this.line_angles_segments[anchor_index])
        );

        let height = size[0][1];

        let {positions, offsets, angles, pre_angles, indices} = placeAtPosition.call(this, anchor, anchor_index, anchor_offset, lines, this.line_lengths, this.line_angles_segments, label_lengths, upp);

        this.position = anchor;
        this.positions = positions.slice();
        this.offsets = offsets.slice();
        this.angle = angles.slice();
        this.pre_angles = pre_angles.slice();

        let {obbs, aabbs} = createBoundingBoxes(positions, pre_angles, widths, height);

        let label_stops = getAngleRanges(this.line_lengths, label_lengths);

        let angle_info = [];
        for (var i = 0; i < label_stops.length; i++){
            angle_info[i] = {
                offsets : [],
                angle_array : [],
                pre_angles : [],
                stop_array : []
            };

            let stops = label_stops[i].slice();
            stops.unshift(0);
            if (stops.length == 3 && stops[2] < .9) stops[2] = .9;
            else stops.push(.9);

            stops = [0, .3, .6, .9];

            for (var j = 0; j < stops.length; j++){
                let line_lengths = (function(stop){
                    return this.line_lengths.map(function(length){
                        return (1 + stop) * length;
                    });
                }.bind(this))(stops[j]);

                let new_lines = (function(stop){
                    var prev = anchor;
                    var new_line = [anchor];
                    lines.forEach(function(pt, i){
                        if (i == lines.length - 1) return;
                        var v = Vector.sub(lines[i+1], lines[i]);
                        var delta = Vector.mult(v, 1 + stop);
                        new_line.push(Vector.add(new_line[i], delta));
                    });
                    return new_line;
                }.bind(this))(stops[j]);

                anchor = Vector.add(
                    new_lines[anchor_index],
                    Vector.rot([anchor_offset, 0], this.line_angles_segments[anchor_index])
                );

                let {positions, offsets, angles, pre_angles, indices} = placeAtPosition.call(this, anchor, anchor_index, anchor_offset, new_lines, line_lengths, this.line_angles_segments, label_lengths, upp);

                angle_info[i].offsets.push(offsets[i][0]);
                angle_info[i].angle_array.push(angles[i]);
                angle_info[i].pre_angles.push(pre_angles[i]);
            }

            stops.shift();

            angle_info[i].stop_array = stops;
        }

        // smooth(angle_info);

        this.angle = angles;
        this.pre_angles = pre_angles;
        this.obbs = obbs;
        this.aabbs = aabbs;
        this.angle_info = angle_info;

        // First fitting segment
        // let segment = this.getNextFittingSegment(this.getCurrentSegment());
        // this.throw_away = (!segment);
    }

    // Iterate through the line geometry creating the next valid label.
    static nextLabel(label) {
        // increment segment
        let hasNext = label.getNextSegment();
        if (!hasNext) {
            return false;
        }

        // clone options
        let layout = Object.create(label.layout);
        layout.segment_index = label.segment_index;
        layout.placement = label.placement;

        // create new label
        let nextLabel = new LabelLine(label.size, label.lines, layout);

        return (nextLabel.throw_away) ? false : nextLabel;
    }

    fit (line){
        let length = getLineLength(line);
        let spacing = 50;

        for (let i = 0; i < line.length; i++){
            let segment = line[i];
        }
    }

    // Strategy for returning the next segment. Assumes an "ordering" of possible segments
    // taking into account both straight and articulated segments. Returns false if all possibilities
    // have been exhausted
    getNextSegment() {
        switch (this.placement) {
            case PLACEMENT.CORNER:
                this.placement = PLACEMENT.MID_POINT;
                break;
            case PLACEMENT.MID_POINT:
                if (this.segment_index >= this.lines.length - 2) {
                    return false;
                }
                else if (this.size.length > 1) {
                    this.placement = PLACEMENT.CORNER;
                }
                this.segment_index++;
                break;
        }

        return this.getCurrentSegment();
    }

    // Returns the line segments necessary for other calculations at the current line segment index.
    // This is the current and next segment for a straight line, and the previous, current and next
    // for an articulated segment.
    getCurrentSegment() {
        let p1, p2, segment;
        switch (this.placement) {
            case PLACEMENT.CORNER:
                p1 = this.lines[this.segment_index - 1];
                p2 = this.lines[this.segment_index];
                let p3 = this.lines[this.segment_index + 1];
                segment = [ p1, p2, p3 ];
                break;
            case PLACEMENT.MID_POINT:
                p1 = this.lines[this.segment_index];
                p2 = this.lines[this.segment_index + 1];
                segment = [ p1, p2 ];
                break;
        }

        return segment;
    }

    // Returns next segment that is valid (within tile, inside angle requirements and within line geometry).
    getNextFittingSegment(segment) {
        segment = segment || this.getNextSegment();
        if (!segment) {
            return false;
        }

        if (this.doesSegmentFit(segment)) {
            this.update();
            if (this.inTileBounds() && this.inAngleBounds()) {
                return segment;
            }
        }

        return this.getNextFittingSegment();
    }

    // Returns boolean indicating whether current segment is valid
    doesSegmentFit(segment) {
        switch (this.placement) {
            case PLACEMENT.CORNER:
                return this.fitKinkedSegment(segment);
            case PLACEMENT.MID_POINT:
                return this.fitStraightSegment(segment);
        }
    }

    // Returns boolean indicating whether kinked segment is valid
    // Cycles through various ways of kinking the labels around the segment's pivot,
    // finding the best fit, and determines the kink_index.
    fitKinkedSegment(segment) {
        let upp = this.layout.units_per_pixel;

        let p0p1 = Vector.sub(segment[0], segment[1]);
        let p1p2 = Vector.sub(segment[1], segment[2]);

        // Don't fit if segment doesn't pass the vertical line test, resulting in upside-down labels
        if (p0p1[0] * p1p2[0] < 0 && p0p1[1] * p1p2[1] > 0) {
            return false;
        }

        let line_length1 = Vector.length(p0p1) / upp;
        let line_length2 = Vector.length(p1p2) / upp;

        // break up multiple segments into two chunks (N-1 options)
        let label_length1 = this.total_length;
        let label_length2 = 0;
        let width, fitness = 0;
        let kink_index = this.num_segments - 1;
        let fitnesses = [];

        while (kink_index > 0) {
            width = this.size[kink_index][0];

            if (hasSpaceAtIndex(kink_index, this.space_indices)){
                width += this.space_width;
            }

            label_length1 -= width;
            label_length2 += width;

            fitness = Math.max(calcFitness(line_length1, label_length1), calcFitness(line_length2, label_length2));
            fitnesses.unshift(fitness);

            kink_index--;
        }

        let max_fitness = Math.max.apply(null, fitnesses);

        if (max_fitness < LINE_EXCEED_KINKED) {
            this.kink_index = fitnesses.indexOf(max_fitness) + 1;
            this.fitness = max_fitness;
            return true;
        }
        else {
            this.kink_index = 0;
            return false;
        }
    }

    // Returns boolean indicating whether straight segment is valid
    // A straight segment is placed at the midpoint and is valid if the label's length is greater than a
    // factor (LINE_EXCEED_STRAIGHT) of the line segment's length
    fitStraightSegment(segment) {
        let upp = this.layout.units_per_pixel;
        let line_length = Vector.length(Vector.sub(segment[0], segment[1])) / upp;
        let fitness = calcFitness(line_length, this.total_length);

        if (fitness < LINE_EXCEED_STRAIGHT){
            this.fitness = fitness;
            return true;
        }
        else {
            return false;
        }
    }

    // Once a fitting segment is found, determine its angles, positions and bounding boxes
    update() {
        this.angle = this.getCurrentAngle();
        this.position = this.getCurrentPosition();
        this.updateBBoxes();
    }

    getCurrentAngle() {
        let segment = this.getCurrentSegment();
        let angles = [];

        switch (this.placement) {
            case PLACEMENT.CORNER:
                let theta1 = getAngleFromSegment(segment[0], segment[1]);
                let theta2 = getAngleFromSegment(segment[1], segment[2]);

                let p0p1 = Vector.sub(segment[0], segment[1]);
                let p1p2 = Vector.sub(segment[1], segment[2]);

                let orientation = (p0p1[0] >= 0 && p1p2[0] >= 0) ? 1 : -1;
                let angle;

                for (let i = 0; i < this.num_segments; i++){
                    if (i < this.kink_index){
                        angle = (orientation > 0) ? theta2 : theta1;
                    }
                    else {
                        angle = (orientation > 0) ? theta1 : theta2;
                    }
                    angles.push(angle);
                }
                break;
            case PLACEMENT.MID_POINT:
                let theta = getAngleFromSegment(segment[0], segment[1]);
                for (let i = 0; i < this.num_segments; i++){
                    angles.push(theta);
                }
                break;
        }

        return angles;
    }

    // Return the position of the center of the label
    getCurrentPosition() {
        let segment = this.getCurrentSegment();
        let position;

        switch (this.placement) {
            case PLACEMENT.CORNER:
                position = segment[1].slice();
                break;
            case PLACEMENT.MID_POINT:
                position = [
                    0.5 * (segment[0][0] + segment[1][0]),
                    0.5 * (segment[0][1] + segment[1][1])
                ];
                break;
        }

        return position;
    }

    // Check for articulated labels to be within an angle range [-MAX_ANGLE, +MAX_ANGLE]
    inAngleBounds() {
        switch (this.placement) {
            case PLACEMENT.CORNER:
                let angle0 = this.angle[0];
                if (angle0 < 0) {
                    angle0 += 2 * Math.PI;
                }

                let angle1 = this.angle[1];
                if (angle1 < 0) {
                    angle1 += 2 * Math.PI;
                }

                let theta = Math.abs(angle1 - angle0);
                theta = Math.min(2 * Math.PI - theta, theta);

                return theta <= MAX_ANGLE;
            case PLACEMENT.MID_POINT:
                return true;
        }
    }

    // Calculate bounding boxes
    updateBBoxes() {
        let upp = this.layout.units_per_pixel;
        let height = (this.total_height + this.layout.buffer[1] * 2) * upp * Label.epsilon;

        // reset bounding boxes
        this.obbs = [];
        this.aabbs = [];

        // fudge width value as text may overflow bounding box if it has italic, bold, etc style
        let italics_buffer = (this.layout.italic) ? 5 * upp : 0;

        switch (this.placement) {
            case PLACEMENT.CORNER:
                let angle0 = this.angle[this.kink_index - 1]; // angle before kink
                let angle1 = this.angle[this.kink_index]; // angle after kink
                let theta = Math.abs(angle1 - angle0); // angle delta

                // A spread factor of 0 pivots the boxes on their horizontal center, looking like: "X"
                // a spread factor of 1 offsets the boxes so that their corners touch, looking like: "\/" or "/\"
                let dx = this.spread_factor * Math.abs(this.total_height * Math.tan(0.5 * theta));
                let nudge = -0.5 * dx;

                if (hasSpaceAtIndex(this.kink_index, this.space_indices)){
                    nudge -= 0.5 * this.space_width;
                }

                // Place labels backwards from kink index
                for (let i = this.kink_index - 1; i >= 0; i--) {
                    let width_px = this.size[i][0];
                    let angle = this.angle[i];

                    let width = (width_px + 2 * this.layout.buffer[0]) * upp * Label.epsilon;

                    nudge -= 0.5 * width_px;

                    let offset = Vector.rot([nudge * upp, 0], -angle);
                    let position = Vector.add(this.position, offset);

                    let obb = getOBB(position, width + italics_buffer, height, angle, this.offset, upp);
                    let aabb = obb.getExtent();

                    this.obbs.push(obb);
                    this.aabbs.push(aabb);

                    this.offsets[i] = [
                        this.layout.offset[0] + nudge,
                        this.layout.offset[1]
                    ];

                    nudge -= 0.5 * width_px;

                    if (hasSpaceAtIndex(this.kink_index, this.space_indices)){
                       nudge -= 0.5 * this.space_width;
                    }
                }

                // Place labels forwards from kink index
                nudge = 0.5 * dx;

                if (hasSpaceAtIndex(this.kink_index, this.space_indices)){
                    nudge += 0.5 * this.space_width;
                }

                for (let i = this.kink_index; i < this.num_segments; i++){
                    let width_px = this.size[i][0];
                    let angle = this.angle[i];

                    let width = (width_px + 2 * this.layout.buffer[0]) * upp * Label.epsilon;

                    nudge += 0.5 * width_px;

                    let offset = Vector.rot([nudge * upp, 0], -angle);
                    let position = Vector.add(this.position, offset);

<<<<<<< 86b491e65e95f36e4c9345dd5468352dde65aa00
                    let obb = getOBB(position, width + italics_buffer, height, angle, this.offset, upp);
=======
                    this.positions[i] = position;

                    let obb = getOBB(position, width, height, angle, this.offset, upp);
>>>>>>> WIP new line walking algorithm
                    let aabb = obb.getExtent();

                    this.obbs.push(obb);
                    this.aabbs.push(aabb);

                    this.offsets[i] = [
                        this.layout.offset[0] + nudge,
                        this.layout.offset[1]
                    ];

                    nudge += 0.5 * width_px;

                    if (hasSpaceAtIndex(this.kink_index, this.space_indices)){
                        nudge += 0.5 * this.space_width;
                    }
                }
                break;
            case PLACEMENT.MID_POINT:
                let shift = -0.5 * this.total_length; // shift for centering the labels

                for (let i = 0; i < this.num_segments; i++){
                    if (hasSpaceAtIndex(i, this.space_indices)){
                        shift += 0.5 * this.space_width;
                    }

                    let width_px = this.size[i][0];
                    let width = (width_px + 2 * this.layout.buffer[0]) * upp * Label.epsilon;
                    let angle = this.angle[i];

                    shift += 0.5 * width_px;

                    let offset = Vector.rot([shift * upp, 0], -angle);
                    let position = Vector.add(this.position, offset);

<<<<<<< 86b491e65e95f36e4c9345dd5468352dde65aa00
                    let obb = getOBB(position, width + italics_buffer, height, angle, this.offset, upp);
=======
                    this.positions[i] = position;

                    let obb = getOBB(position, width, height, angle, this.offset, upp);
>>>>>>> WIP new line walking algorithm
                    let aabb = obb.getExtent();

                    this.obbs.push(obb);
                    this.aabbs.push(aabb);

                    this.offsets[i] = [
                        this.layout.offset[0] + shift,
                        this.layout.offset[1]
                    ];

                    shift += 0.5 * width_px;
                }

                break;
        }
    }

    // Checks each segment to see if it is within the tile. If any segment fails this test, they all fail.
    // TODO: label group
    inTileBounds() {
        for (let i = 0; i < this.aabbs.length; i++) {
            let aabb = this.aabbs[i];
            let obj = { aabb };
            let in_bounds = Label.prototype.inTileBounds.call(obj);
            if (!in_bounds) {
                return false;
            }
        }
        return true;
    }

    // Adds each segment to the collision pass as its own bounding box
    // TODO: label group
    add(bboxes) {
        this.placed = true;
        for (let i = 0; i < this.aabbs.length; i++) {
            let aabb = this.aabbs[i];
            let obb = this.obbs[i];
            let obj = { aabb, obb };
            Label.prototype.add.call(obj, bboxes);
        }
    }

    // Checks each segment to see if it should be discarded (via collision). If any segment fails this test, they all fail.
    // TODO: label group
    discard(bboxes, exclude = null) {
        if (this.throw_away) {
            return true;
        }

        for (let i = 0; i < this.obbs.length; i++){
            let aabb = this.aabbs[i];
            let obb = this.obbs[i];
            let obj = { aabb, obb };

            let shouldDiscard = Label.prototype.occluded.call(obj, bboxes, exclude);
            if (shouldDiscard) {
                return true;
            }
        }
        return false;
    }
}

// Private method to calculate oriented bounding box
function getOBB(position, width, height, angle, offset, upp) {
    let p0, p1;
    // apply offset, x positive, y pointing down
    if (offset && (offset[0] !== 0 || offset[1] !== 0)) {
        offset = Vector.rot(offset, angle);
        p0 = position[0] + (offset[0] * upp);
        p1 = position[1] - (offset[1] * upp);
    }
    else {
        p0 = position[0];
        p1 = position[1];
    }

    // the angle of the obb is negative since it's the tile system y axis is pointing down
    return new OBB(p0, p1, -angle, width, height);
}

function calcFitness(line_length, label_length) {
    return 1 - line_length / label_length;
}

function hasSpaceAtIndex(index, space_indices) {
    return (space_indices.indexOf(index) !== -1);
}

function getLineLength(line){
    let distance = 0;
    for (let i = 0; i < line.length - 1; i++){
        distance += norm(line[i], line[i+1]);
    }
    return distance;
}

function norm(p, q){
    return Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2));
}

function smooth(angle_info){
    for (let i = 0; i < angle_info.length; i++){
        let info = angle_info[i];
        let angles = info.angle_array;
        let pre_angles = info.pre_angles;

        let smooth_angles = [];
        let smooth_pre_angles = [];

        for (let j = 0; j < angles.length; j++){
            if (j === 0){
                // smooth_angles[j] = angles[0];
                // smooth_pre_angles[j] = pre_angles[0];
                smooth_angles[j] = 1/3 * (2 * angles[0] + angles[1]);
                smooth_pre_angles[j] = 1/3 * (2 * pre_angles[0] + pre_angles[1]);
            }
            else if (j === angles.length - 1){
                // smooth_angles[j] = angles[j];
                // smooth_pre_angles[j] = pre_angles[j];
                smooth_angles[j] = 1/3 * (2 * angles[j] + angles[j - 1]);
                smooth_pre_angles[j] = 1/3 * (2 * pre_angles[j] + pre_angles[j - 1]);
            }
            else {
                smooth_angles[j] = 1/4 * (2 * angles[j] + angles[j - 1] + angles[j + 1]);
                smooth_pre_angles[j] = 1/4 * (2 * pre_angles[j] + pre_angles[j - 1] + pre_angles[j + 1]);
            }
        }
        info.angle_array = smooth_angles;
        info.pre_angles = smooth_pre_angles;
    }
}

function curvaturePlacement(line, total_line_length, line_lengths, label_length){
    var curvatures = []; // array of curvature values per line vertex

    // calculate curvature values
    for (let i = 1; i < line.length - 1; i++){
        var prev = line[i - 1];
        var curr = line[i];
        var next = line[i + 1];

        var norm_1 = Vector.perp(curr, prev);
        var norm_2 = Vector.perp(next, curr);

        var curvature = Vector.angleBetween(norm_1, norm_2);
        curvatures.push(curvature);
    }

    curvatures.push(Infinity); // Infinite penalty for going off end of line

    // calculate curvature costs
    var costs = [];
    var line_index = 0;
    var position = 0;

    // move window along line, starting at first vertex
    while (position + label_length < total_line_length){
        // define window breadth
        var window_start = position;
        var window_end = window_start + label_length;

        var line_position = window_start;
        var ahead_index = line_index;
        var cost = 0;

        // iterate through points on line intersecting window
        while (ahead_index < line.length && line_position + line_lengths[ahead_index] < window_end){
            cost += curvatures[ahead_index];
            if (cost === Infinity) break; // no further progress can be made

            line_position += line_lengths[ahead_index];
            ahead_index++;
        }

        // if optimal cost, break out
        if (cost === 0) return line_index;

        costs.push(cost);

        position += line_lengths[line_index];
        line_index++;
    }

    // return index with best placement (least curvature)
    // TODO: double check off-by-one error
    return costs.indexOf(Math.min.apply(null, costs));
}

function getStartingPositions(line, spacing, upp){
    let length = getLineLength(line);
    let num_labels = Math.floor(length / spacing);
    let remainder = length - (num_labels - 1) * spacing;

    let label_positions = [];
    let label_indices = [];

    let distance = 0.5 * remainder;
    for (let i = 0; i < num_labels; i++){
        let {position, index} = interpolateLine(line, distance);

        label_positions.push(position);
        label_indices.push(index);
        distance += spacing;
    }

    return {label_positions, label_indices};
}

function interpolateLine(line, distance){
    let sum = 0;
    for (let i = 0; i < line.length - 1; i++){
        let prevSum = sum
        let p = line[i];
        let q = line[i+1];
        let segment_length = norm(p, q);

        sum += segment_length;

        if (sum > distance){
            let overflow = sum - distance;
            let position = interpolateSegment(p, q, overflow);
            let index = i; // super weird
            return {position, index};
        }
    }
}

function interpolateAngle(index, ratio){
    if (this.line_angles[index + 1]){
        let angle1 = this.line_angles[index];
        let angle2 = this.line_angles[index + 1];
        return interpolate1d(angle1, angle2, ratio);
    }
    else {
        return this.line_angles[index];
    }
}

function interpolateSegment(p, q, distance){
    let length = norm(p, q);
    let ratio = distance / length;
    return interpolate2d(p, q, ratio);
}

function interpolate1d(x, y, t){
     return t * x + (1 - t) * y
}

function interpolate2d(x, y, t){
     return [
         interpolate1d(x[0], y[0], t),
         interpolate1d(x[1], y[1], t)
     ];
}

function getPositionsFromIndicesAndOffsets(line, indices, offsets, line_lengths, label_lengths){
    let positions = [];
    for (let i = 0; i < indices.length; i++){
        let index = indices[i];
        let offset = offsets[i];
        let label_length = label_lengths[i];
        let line_length = line_lengths[index];

        let angle = getAngleForSegment(line[index], line[index + 1]);;

        let offset2d = Vector.rot([offset, 0], angle);
        let position = Vector.add(line[index], offset2d);

        positions.push(position);
    }

    return positions;
}

function getAnglesFromIndicesAndOffsets(anchor, indices, line, positions, line_lengths, label_lengths, offsets){
    let angles = [];
    let pre_angles = [];
    let offsets2d = [];

    for (let i = 0; i < positions.length; i++){
        let position = positions[i];
        let index = indices[i];
        let label_length = label_lengths[i];
        let line_length = line_lengths[index];
        let offset = offsets[i];

        let offset2d = Vector.sub(position, anchor);
        let offset2d_angle = -Vector.angle(offset2d);

        let angle;

        // if (index + 2 < line.length && offset + 0.5 * label_length > line_length){
        //     let angle1 = getAngleFromSegment(line[index], line[index + 1]);
        //     let angle2 = getAngleFromSegment(line[index + 1], line[index + 2]);
        //     let weight = (line_length - (offset + 0.5 * label_length)) / label_length;
        //     angle = weight * angle1 + (1 - weight) * angle2;
        // }
        // else
            angle = getAngleFromSegment(line[index], line[index + 1]);

        let pre_angle = angle - offset2d_angle;

        if (i > 0){
            let prev_angle = angles[i - 1];
            let prev_pre_angle = pre_angles[i - 1];
            if (Math.abs(offset2d_angle - prev_angle) > Math.PI) {
                if (offset2d_angle > prev_angle) offset2d_angle -= 2 * Math.PI;
                else offset2d_angle += 2 * Math.PI;
            }
            if (Math.abs(prev_pre_angle - pre_angle) > Math.PI) {
                if (pre_angle > prev_pre_angle) pre_angle -= 2 * Math.PI;
                else pre_angle += 2 * Math.PI
            }
        }

        angles.push(offset2d_angle);
        pre_angles.push(pre_angle);
        offsets2d.push(offset2d);
    }

    return [offsets2d, angles, pre_angles];
}

function placeAtAnchor(line_index, line_offset, line_lengths, label_lengths){
    let num_labels = label_lengths.length;
    let num_segments = line_lengths.length;

    let indices = [];
    let offsets = [];

    let label_index = 0;
    let label_offset = 0;

    // iterate along line
    while (label_index < num_labels){
        let label_length = label_lengths[label_index];

        // iterate along labels within the line segment
        while (label_index < num_labels && label_offset + 0.5 * label_length <= line_offset + line_lengths[line_index]){
            let offset = label_offset - line_offset + 0.5 * label_length;
            offsets.push(offset);
            indices.push(line_index);

            label_offset += label_length;
            label_index++;
            label_length = label_lengths[label_index];
        }

        line_offset += line_lengths[line_index];
        line_index++;
    }

    return [indices, offsets];
}

function getAngleRanges(line_lengths, label_lengths){
    var angle_ranges = [[]];

    var cumulate_label_lengths = [];
    label_lengths.reduce(function(a,b,i) { return cumulate_label_lengths[i] = a+b; }, 0);

    var cumulate_line_lengths = [];
    line_lengths.reduce(function(a,b,i) { return cumulate_line_lengths[i] = a+b; }, 0);

    for (var label_index = 1; label_index < label_lengths.length; label_index++){
        let line_index = 0;
        let prev_cumulate_label_length = cumulate_label_lengths[label_index - 1];
        let cumulate_label_length = cumulate_label_lengths[label_index];
        let cumulate_line_length = cumulate_line_lengths[line_index];
        let stops = [];

        while (prev_cumulate_label_length > cumulate_line_length){
            let stop = prev_cumulate_label_length / cumulate_line_length - 1;
            if (stop <= 1) {
                stops.unshift(stop);
            }
            if (stops.length === 3) break;
            line_index++;
            cumulate_line_length = cumulate_line_lengths[line_index];
        }

        angle_ranges[label_index] = stops;
    }

    return angle_ranges;
}

// places label at length offset from index. Finds next index and length offset
function getNextPlacement(line_index, line_offset, label_length, line_lengths){
    let line_length = line_lengths[line_index];
    let distance = label_length;
    line_offset += distance;

    if (line_offset > line_length && line_index < line_lengths.length - 1){
        line_offset = line_offset - line_length;
        line_index = line_index + 1;
    }

    return [line_index, line_offset];
}

function placeAtPosition(anchor, anchor_index, anchor_offset, line, line_lengths, line_angles_segments, label_lengths, upp){
    // Use flat coordinates. Get nearest line vertex index, and offset from the vertex for all labels.
    let [indices, relative_offsets] = placeAtAnchor(anchor_index, anchor_offset, line_lengths, label_lengths);

    // get 2D positions based on "flat" indices and offsets
    let positions = getPositionsFromIndicesAndOffsets(line, indices, relative_offsets, line_lengths, label_lengths);

    // get 2d offsets, angles and pre_angles relative to anchor
    let [offsets2d, angles, pre_angles] = getAnglesFromIndicesAndOffsets(anchor, indices, line, positions, line_lengths, label_lengths, relative_offsets);

    let offsets = offsets2d.map(function(offset){
        return [Math.sqrt(offset[0] * offset[0] + offset[1] * offset[1]) / upp, 0];
    });

    return {positions, offsets, angles, pre_angles, indices};
}

function getAnglesAndStops(angles, angle_ranges){
    let unique_angles = [];
    let previous = undefined;
    angles.forEach(function(value){
        if (previous !== value){
            unique_angles.push(value);
            previous = value;
        }
    });

    let angle_info = [];
    // put angles and stops in fixed spaced Arrays
    let max_angles = 4;
    let ones = [1,1,1,1];
    let zeros = [0,0,0,0];


    for (let i = 0; i < angles.length; i++){
        let stop_array = angle_ranges[i].concat(ones).splice(0, max_angles - 1);
        let angle_array = unique_angles.slice(0, angle_ranges[i].length + 1).reverse();
        let last_angle = angle_array[angle_array.length - 1];
        for (let j = angle_array.length; j < 4; j++){
            angle_array.push(last_angle);
        }
        angle_info[i] = {stop_array, angle_array};
    }

    return angle_info;
}

function createBoundingBoxes(positions, angles, widths, height){
    let obbs = [];
    let aabbs = [];
    for (let i = 0; i < positions.length; i++){
        let obb = getOBB(positions[i], widths[i], height, angles[i]);
        let aabb = obb.getExtent();

        obbs.push(obb);
        aabbs.push(aabb);
    }
    return {obbs, aabbs};
}

function getLineAngles(line){
    let angles = [];
    for (let i = 0; i < line.length - 1; i++){
        let p = line[i];
        let q = line[i+1];
        let angle = getAngleFromSegment(p, q);
        angles.push(angle);
    }
    return angles;
}

function getLineAnglesForSegments(line){
    let angles = [];
    for (let i = 0; i < line.length - 1; i++){
        let p = line[i];
        let q = line[i+1];
        let angle = getAngleForSegment(p, q);
        angles.push(angle);
    }
    return angles;
}

function getAngleForSegment(p, q){
    let pq = Vector.sub(q,p);
    return Vector.angle(pq);
}

// Private method to calculate the angle of a segment.
// Transforms the angle to lie within the range [0, PI/2] and [3*PI/2, 2*PI] (1st or 4th quadrants)
// as other ranges produce "upside down" labels
function getAngleFromSegment(pt1, pt2) {
    let p1p2 = Vector.sub(pt1, pt2);
    let theta = Math.atan2(p1p2[0], p1p2[1]) + Math.PI/2;
    // let theta = Math.PI - Math.atan2(p1p2[1], p1p2[0]);
    // console.log(theta, Math.PI - Math.atan2(p1p2[1], p1p2[0]))

    // if (theta > Math.PI/2) {
    //     // If in 2nd quadrant, move to 4th quadrant
    //     theta += Math.PI;
    //     theta %= 2 * Math.PI;
    // }
    // else if (theta < 0) {
    //     // If in 4th quadrant, make a positive angle
    //     theta += 2 * Math.PI;
    // }

    return theta;
}

function getLineLengths(line){
    let lengths = [];
    for (let i = 0; i < line.length - 1; i++){
        let p = line[i];
        let q = line[i+1];
        let length = norm(p,q);
        lengths.push(length);
    }
    return lengths;
}