// Geometry building functions

import Vector from '../vector';
import Geo from '../geo';

import earcut from 'earcut';

var Builders;
export default Builders = {};

Builders.debug = false;

Builders.tile_bounds = [
    { x: 0, y: 0},
    { x: Geo.tile_scale, y: -Geo.tile_scale } // TODO: correct for flipped y-axis?
];

const default_uvs = [0, 0, 1, 1];
const zero_vec2 = [0, 0];
const up_vec3 = [0, 0, 1];

// Re-scale UVs from [0, 1] range to a smaller area within the image
Builders.getTexcoordsForSprite = function (area_origin, area_size, tex_size) {
    var area_origin_y = tex_size[1] - area_origin[1] - area_size[1];

    return [
        area_origin[0] / tex_size[0],
        area_origin_y / tex_size[1],
        (area_size[0] + area_origin[0]) / tex_size[0],
        (area_size[1] + area_origin_y) / tex_size[1]
    ];
};

// Tesselate a flat 2D polygon
// x & y coordinates will be set as first two elements of provided vertex_template
Builders.buildPolygons = function (
    polygons,
    vertex_data, vertex_template,
    { texcoord_index, texcoord_scale, texcoord_normalize }) {

    if (texcoord_index) {
        texcoord_normalize = texcoord_normalize || 1;
        var [min_u, min_v, max_u, max_v] = texcoord_scale || default_uvs;
    }

    var num_polygons = polygons.length;
    for (var p=0; p < num_polygons; p++) {
        var polygon = polygons[p];

        // Find polygon extents to calculate UVs, fit them to the axis-aligned bounding box
        if (texcoord_index) {
            var [min_x, min_y, max_x, max_y] = Geo.findBoundingBox(polygon);
            var span_x = max_x - min_x;
            var span_y = max_y - min_y;
            var scale_u = (max_u - min_u) / span_x;
            var scale_v = (max_v - min_v) / span_y;
        }

        // Tessellate
        var vertices = Builders.triangulatePolygon(polygon);

        // Add vertex data
        var num_vertices = vertices.length;
        for (var v=0; v < num_vertices; v++) {
            var vertex = vertices[v];
            vertex_template[0] = vertex[0];
            vertex_template[1] = vertex[1];

            // Add UVs
            if (texcoord_index) {
                vertex_template[texcoord_index + 0] = ((vertex[0] - min_x) * scale_u + min_u) * texcoord_normalize;
                vertex_template[texcoord_index + 1] = ((vertex[1] - min_y) * scale_v + min_v) * texcoord_normalize;
            }

            vertex_data.addVertex(vertex_template);
        }
    }
};

// Tesselate and extrude a flat 2D polygon into a simple 3D model with fixed height and add to GL vertex buffer
Builders.buildExtrudedPolygons = function (
    polygons,
    z, height, min_height,
    vertex_data, vertex_template,
    normal_index,
    normal_normalize,
    {
        remove_tile_edges,
        tile_edge_tolerance,
        texcoord_index,
        texcoord_scale,
        texcoord_normalize,
        winding
    }) {

    // Top
    var min_z = z + (min_height || 0);
    var max_z = z + height;
    vertex_template[2] = max_z;
    Builders.buildPolygons(polygons, vertex_data, vertex_template, { texcoord_index, texcoord_scale, texcoord_normalize });

    // Walls
    // Fit UVs to wall quad
    if (texcoord_index) {
        texcoord_normalize = texcoord_normalize || 1;
        var [min_u, min_v, max_u, max_v] = texcoord_scale || default_uvs;
        var texcoords = [
            [min_u, max_v],
            [min_u, min_v],
            [max_u, min_v],

            [max_u, min_v],
            [max_u, max_v],
            [min_u, max_v]
        ];
    }

    var num_polygons = polygons.length;
    for (var p=0; p < num_polygons; p++) {
        var polygon = polygons[p];

        for (var q=0; q < polygon.length; q++) {
            var contour = polygon[q];

            for (var w=0; w < contour.length - 1; w++) {
                if (remove_tile_edges && Builders.outsideTile(contour[w], contour[w+1], tile_edge_tolerance)) {
                    continue; // don't extrude tile edges
                }

                // Wall order is dependent on winding order, so that normals face outward
                let w0, w1;
                if (winding === 'CCW') {
                    w0 = w;
                    w1 = w+1;
                }
                else {
                    w0 = w+1;
                    w1 = w;
                }

                // Two triangles for the quad formed by each vertex pair, going from bottom to top height
                var wall_vertices = [
                    // Triangle
                    [contour[w1][0], contour[w1][1], max_z],
                    [contour[w1][0], contour[w1][1], min_z],
                    [contour[w0][0], contour[w0][1], min_z],
                    // Triangle
                    [contour[w0][0], contour[w0][1], min_z],
                    [contour[w0][0], contour[w0][1], max_z],
                    [contour[w1][0], contour[w1][1], max_z]
                ];

                // Calc the normal of the wall from up vector and one segment of the wall triangles
                let wall_vec = Vector.normalize([contour[w1][0] - contour[w0][0], contour[w1][1] - contour[w0][1], 0]);
                let normal = Vector.cross(up_vec3, wall_vec);

                // Update vertex template with current surface normal
                vertex_template[normal_index + 0] = normal[0] * normal_normalize;
                vertex_template[normal_index + 1] = normal[1] * normal_normalize;
                vertex_template[normal_index + 2] = normal[2] * normal_normalize;

                for (var wv=0; wv < wall_vertices.length; wv++) {
                    vertex_template[0] = wall_vertices[wv][0];
                    vertex_template[1] = wall_vertices[wv][1];
                    vertex_template[2] = wall_vertices[wv][2];

                    if (texcoord_index) {
                        vertex_template[texcoord_index + 0] = texcoords[wv][0] * texcoord_normalize;
                        vertex_template[texcoord_index + 1] = texcoords[wv][1] * texcoord_normalize;
                    }

                    vertex_data.addVertex(vertex_template);
                }
            }
        }
    }
};

// Build tessellated triangles for a polyline
var cornersForCap = {
    butt: 0,
    square: 2,
    round: 3
};

var trianglesForJoin = {
    miter: 0,
    bevel: 1,
    round: 3
};

Builders.buildPolylines = function (
    lines,
    width,
    vertex_data, vertex_template,
    {
        closed_polygon,
        remove_tile_edges,
        tile_edge_tolerance,
        texcoord_index,
        texcoord_scale,
        texcoord_normalize,
        texcoord_ratio,
        scaling_index,
        scaling_normalize,
        join, cap,
        miter_limit
    }) {

    var cornersOnCap = cornersForCap[cap] || 0;         // default 'butt'
    var trianglesOnJoin = trianglesForJoin[join] || 0;  // default 'miter'

    // Configure miter limit
    if (trianglesOnJoin === 0) {
        miter_limit = miter_limit || 3; // default miter limit
        var miter_len_sq = miter_limit * miter_limit;
    }

    // Build variables
    if (texcoord_index) {
        texcoord_normalize = texcoord_normalize || 1;
        texcoord_ratio = texcoord_ratio || 1;
        var [min_u, min_v, max_u, max_v] = texcoord_scale || default_uvs;
    }

    // Values that are constant for each line and are passed to helper functions
    var constants = {
        vertex_data,
        vertex_template,
        halfWidth: width/2,
        vertices: [],
        scaling_index,
        scaling_normalize,
        scalingVecs: scaling_index && [],
        texcoord_index,
        texcoords: texcoord_index && [],
        texcoord_normalize,
        min_u, min_v, max_u, max_v,
        nPairs: 0,
        uvScale: 1/((width*texcoord_ratio)*4096),//1/(4096*10),
        totalDist: 0
    };

    for (var ln = 0; ln < lines.length; ln++) {
        // Remove dupe points from lines
        var line = dedupeLine(lines[ln], closed_polygon);
        if (!line) {
            continue; // skip if no valid line remaining
        }

        var lineSize = line.length;

        // Ignore non-lines
        if (lineSize < 2) {
            continue;
        }

        //  Initialize variables
        var coordPrev = [0, 0], // Previous point coordinates
            coordCurr = [0, 0], // Current point coordinates
            coordNext = [0, 0]; // Next point coordinates

        var normPrev = [0, 0],  // Right normal to segment between previous and current m_points
            normCurr = [0, 0],  // Right normal at current point, scaled for miter joint
            normNext = [0, 0];  // Right normal to segment between current and next m_points

        var isPrev = false,
            isNext = true;

        // Add vertices to buffer according to their index
        indexPairs(constants);

        // Do this with the rest (except the last one)
        for (let i = 0; i < lineSize ; i++) {

            // There is a next one?
            isNext = i+1 < lineSize;

            if (isPrev) {
                // If there is a previous one, copy the current (previous) values on *Prev
                coordPrev = coordCurr;
                normPrev = Vector.normalize(Vector.perp(coordPrev, line[i]));
            } else if (i === 0 && closed_polygon === true) {
                // If it's the first point and is a closed polygon

                var needToClose = true;
                if (remove_tile_edges) {
                    if(Builders.outsideTile(line[i], line[lineSize-2], tile_edge_tolerance)) {
                        needToClose = false;
                    }
                }

                if (needToClose) {
                    coordPrev = line[lineSize-2];
                    normPrev = Vector.normalize(Vector.perp(coordPrev, line[i]));
                    isPrev = true;
                }
            }

            // Assign current coordinate
            coordCurr = line[i];

            if (isNext) {
                coordNext = line[i+1];
            } else if (closed_polygon === true) {
                // If it's the last point in a closed polygon
                coordNext = line[1];
                isNext = true;
            }

            if (isNext) {
                // If it's not the last one get next coordinates and calculate the right normal

                normNext = Vector.normalize(Vector.perp(coordCurr, coordNext));
                if (remove_tile_edges) {
                    if (Builders.outsideTile(coordCurr, coordNext, tile_edge_tolerance)) {
                        normCurr = Vector.normalize(Vector.perp(coordPrev, coordCurr));
                        if (isPrev) {
                            addVertexPair(coordCurr, normCurr, Vector.length(Vector.sub(coordCurr, coordPrev)), constants);
                            constants.nPairs++;

                            // Add vertices to buffer acording their index
                            indexPairs(constants);
                        }
                        isPrev = false;
                        continue;
                    }
                }
            }

            //  Compute current normal
            if (isPrev) {
                //  If there is a PREVIOUS ...
                if (isNext) {
                    // ... and a NEXT ONE, compute previous and next normals (scaled by the angle with the last prev)
                    normCurr = Vector.normalize(Vector.add(normPrev, normNext));
                    var scale = 2 / (1 + Math.abs(Vector.dot(normPrev, normCurr)));
                    normCurr = Vector.mult(normCurr,scale*scale);
                } else {
                    // ... and there is NOT a NEXT ONE, copy the previous next one (which is the current one)
                    normCurr = Vector.normalize(Vector.perp(coordPrev, coordCurr));
                }
            } else {
                // If there is NO PREVIOUS ...
                if (isNext) {
                    // ... and a NEXT ONE,
                    normNext = Vector.normalize(Vector.perp(coordCurr, coordNext));
                    normCurr = normNext;
                } else {
                    // ... and NO NEXT ONE, nothing to do (without prev or next one this is just a point)
                    continue;
                }
            }

            if (isPrev || isNext) {
                // If it's the BEGINNING of a LINE
                if (i === 0 && !isPrev && !closed_polygon) {
                    addCap(coordCurr, normCurr, cornersOnCap, true, constants);
                }

                //  Miter limit: if miter join is too sharp, convert to bevel instead
                if (trianglesOnJoin === 0 && Vector.lengthSq(normCurr) > miter_len_sq) {
                    trianglesOnJoin = trianglesForJoin['bevel']; // switch to bevel
                }

                // If it's a JOIN
                if (trianglesOnJoin !== 0 && isPrev && isNext) {
                    addJoin([coordPrev, coordCurr, coordNext],
                            [normPrev,normCurr, normNext],
                            trianglesOnJoin,
                            constants);
                } else {
                    addVertexPair(coordCurr, normCurr, Vector.length(Vector.sub(coordCurr, coordPrev)), constants);
                }

                if (isNext) {
                   constants.nPairs++;
                }

                isPrev = true;
            }
        }

        // Add vertices to buffer according to their index
        indexPairs(constants);

         // If it's the END of a LINE
        if(!closed_polygon) {
            addCap(coordCurr, normCurr, cornersOnCap , false, constants);
        }
    }
};

// Remove duplicate points from a line, creating a new line only when points must be removed
function dedupeLine (line, closed) {
    let i, dupes;

    // Collect dupe points
    for (i=0; i < line.length - 1; i++) {
        if (line[i][0] === line[i+1][0] && line[i][1] === line[i+1][1]) {
            dupes = dupes || [];
            dupes.push(i);
        }
    }

    // Remove dupe points
    if (dupes) {
        line = line.slice(0);
        dupes.forEach(d => line.splice(d, 1));
    }

    // Line needs at least 2 points, polygon needs at least 3 (+1 to close)
    if (!closed && line.length < 2 || closed && line.length < 4) {
        return;
    }
    return line;
}

// Add to equidistant pairs of vertices (internal method for polyline builder)
function addVertex(coord, normal, uv, { halfWidth, vertices, scalingVecs, texcoords }) {
    if (scalingVecs) {
        //  a. If scaling is on add the vertex (the currCoord) and the scaling Vecs (normals pointing where to extrude the vertices)
        vertices.push(coord);
        scalingVecs.push(normal);
    } else {
        //  b. Add the extruded vertices
        vertices.push([coord[0] + normal[0] * halfWidth,
                       coord[1] + normal[1] * halfWidth]);
    }

    // c) Add UVs if they are enabled
    if (texcoords) {
        texcoords.push(uv);
    }
}

//  Add to equidistant pairs of vertices (internal method for polyline builder)
function addVertexPair (coord, normal, dist, constants) {
    if (constants.texcoords) {
        constants.totalDist += dist*constants.uvScale;
        // console.log(dist, constants.totalDist);
        addVertex(coord, normal, [constants.max_u, constants.totalDist], constants);
        addVertex(coord, Vector.neg(normal), [constants.min_u, constants.totalDist], constants);
    }
    else {
        addVertex(coord, normal, null, constants);
        addVertex(coord, Vector.neg(normal), null, constants);
    }
}

//  Tessalate a FAN geometry between points A       B
//  using their normals from a center        \ . . /
//  and interpolating their UVs               \ p /
//                                             \./
//                                              C
function addFan (coord, nA, nC, nB, uA, uC, uB, signed, numTriangles, constants) {

    if (numTriangles < 1) {
        return;
    }

    // Add previous vertices to buffer and clear the buffers and index pairs
    // because we are going to add more triangles.
    indexPairs(constants);

    // Initial parameters
    var normCurr = Vector.set(nA);
    var normPrev = [0,0];

    // Calculate the angle between A and B
    var angle_delta = Vector.angleBetween(nA, nB);

    // Calculate the angle for each triangle
    var angle_step = angle_delta/numTriangles;

    // Joins that turn left or right behave diferently...
    // triangles need to be rotated in diferent directions
    if (!signed) {
        angle_step *= -1;
    }

    if (constants.texcoords) {
        var uvCurr = Vector.set(uA);
        var uv_delta = Vector.div(Vector.sub(uB,uA), numTriangles);
    }

    //  Add the FIRST and CENTER vertex
    //  The triangles will be composed in a FAN style around it
    addVertex(coord, nC, uC, constants);

    //  Add first corner
    addVertex(coord, normCurr, uA, constants);

    // Iterate through the rest of the corners
    for (var t = 0; t < numTriangles; t++) {
        normPrev = Vector.normalize(normCurr);
        normCurr = Vector.rot(Vector.normalize(normCurr), angle_step);     //  Rotate the extrusion normal
        if (constants.texcoords) {
            uvCurr = Vector.add(uvCurr,uv_delta);
        }
        addVertex(coord, normCurr, uvCurr, constants);      //  Add computed corner
    }

    // Index the vertices
    for (var i = 0; i < numTriangles; i++) {
        if (signed) {
            addIndex(i+2, constants);
            addIndex(0, constants);
            addIndex(i+1, constants);
        } else {
            addIndex(i+1, constants);
            addIndex(0, constants);
            addIndex(i+2, constants);
        }
    }

    // Clear the buffer
    constants.vertices = [];
    if (constants.scalingVecs) {
        constants.scalingVecs = [];
    }
    if (constants.texcoords) {
        constants.texcoords = [];
    }
}

//  addBevel    A ----- B
//             / \ , . / \
//           /   /\   /\  \
//              /  \ /   \ \
//                / C \
function addBevel (coord, nA, nC, nB, uA, uC, uB, signed, constants) {
    // Add previous vertices to buffer and clear the buffers and index pairs
    // because we are going to add more triangles.
    indexPairs(constants);

    //  Add the FIRST and CENTER vertex
    addVertex(coord, nC, uC, constants);
    addVertex(coord, nA, uA, constants);
    addVertex(coord, nB, uB, constants);

    if (signed) {
        addIndex(2, constants);
        addIndex(0, constants);
        addIndex(1, constants);
    } else {
        addIndex(1, constants);
        addIndex(0, constants);
        addIndex(2, constants);
    }

    // Clear the buffer
    constants.vertices = [];
    if (constants.scalingVecs) {
        constants.scalingVecs = [];
    }
    if (constants.texcoords) {
        constants.texcoords = [];
    }
}


//  Tessalate a SQUARE geometry between A and B     + ........+
//  and interpolating their UVs                     : \  2  / :
//                                                  : 1\   /3 :
//                                                  A -- C -- B
function addSquare (coord, nA, nB, uA, uC, uB, signed, constants) {

    // Add previous vertices to buffer and clear the buffers and index pairs
    // because we are going to add more triangles.
    indexPairs(constants);

    // Initial parameters
    var normCurr = Vector.set(nA);
    var normPrev = [0,0];
    if (constants.texcoords) {
        var uvCurr = Vector.set(uA);
        var uv_delta = Vector.div(Vector.sub(uB,uA), 4);
    }

    // First and last cap have different directions
    var angle_step = 0.78539816339; // PI/4 = 45 degrees
    if (!signed) {
        angle_step *= -1;
    }

    //  Add the FIRST and CENTER vertex
    //  The triangles will be add in a FAN style around it
    //
    //                       A -- C
    addVertex(coord, zero_vec2, uC, constants);

    //  Add first corner     +
    //                       :
    //                       A -- C
    addVertex(coord, normCurr, uA, constants);

    // Iterate through the rest of the coorners completing the triangles
    // (except the corner 1 to save one triangle to be draw )
    for (var t = 0; t < 4; t++) {

        // 0     1     2
        //  + ........+
        //  : \     / :
        //  :  \   /  :
        //  A -- C -- B  3

        normPrev = Vector.normalize(normCurr);
        normCurr = Vector.rot( Vector.normalize(normCurr), angle_step);     //  Rotate the extrusion normal

        if (t === 0 || t === 2) {
            // In order to make this "fan" look like a square the mitters need to be streach
            var scale = 2 / (1 + Math.abs(Vector.dot(normPrev, normCurr)));
            normCurr = Vector.mult(normCurr, scale*scale);
        }

        if (constants.texcoords) {
            uvCurr = Vector.add(uvCurr,uv_delta);
        }

        if (t !== 1) {
            //  Add computed corner (except the corner 1)
            addVertex(coord, normCurr, uvCurr, constants);
        }
    }

    for (var i = 0; i < 3; i++) {
        if (signed) {
            addIndex(i+2, constants);
            addIndex(0, constants);
            addIndex(i+1, constants);
        } else {
            addIndex(i+1, constants);
            addIndex(0, constants);
            addIndex(i+2, constants);
        }
    }

    // Clear the buffer
    constants.vertices = [];
    if (constants.scalingVecs) {
        constants.scalingVecs = [];
    }
    if (constants.texcoords) {
        constants.texcoords = [];
    }
}

//  Add special joins (not miter) types that require FAN tessellations
//  Using http://www.codeproject.com/Articles/226569/Drawing-polylines-by-tessellation as reference
// function addJoin (coords, normals, v_pct, nTriangles, constants) {
function addJoin (coords, normals, nTriangles, constants) {
    constants.totalDist += Vector.length(Vector.sub(coords[1], coords[0]))*constants.uvScale;

    var signed = Vector.signed_area(coords[0], coords[1], coords[2]) > 0;
    var nA = normals[0],              // normal to point A (aT)
        nC = Vector.neg(normals[1]),  // normal to center (-vP)
        nB = normals[2];              // normal to point B (bT)

    if (constants.texcoords) {
        var uA = [constants.max_u, constants.totalDist],
            uC = [constants.min_u, constants.totalDist],
            uB = [constants.max_u, constants.totalDist];
    }

    if (signed) {
        addVertex(coords[1], nA, uA, constants);
        addVertex(coords[1], nC, uC, constants);
    } else {
        nA = Vector.neg(normals[0]);
        nC = normals[1];
        nB = Vector.neg(normals[2]);

        if (constants.texcoords) {
            uA = [constants.min_u, constants.totalDist];
            uC = [constants.max_u, constants.totalDist];
            uB = [constants.min_u, constants.totalDist];
        }
        addVertex(coords[1], nC, uC, constants);
        addVertex(coords[1], nA, uA, constants);
    }

    if (nTriangles === 1) {
        addBevel(coords[1], nA, nC, nB, uA, uC, uB, signed, constants);
    } else if (nTriangles > 1){
        addFan(coords[1], nA, nC, nB, uA, uC, uB, signed, nTriangles, constants);
    }

    if (signed) {
        addVertex(coords[1], nB, uB, constants);
        addVertex(coords[1], nC, uC, constants);
    } else {
        addVertex(coords[1], nC, uC, constants);
        addVertex(coords[1], nB, uB, constants);
    }
}

//  Function to add the vertex need for line caps,
//  because re-use the buffers needs to be at the end
function addCap (coord, normal, numCorners, isBeginning, constants) {

    if (numCorners < 1) {
        return;
    }

    // UVs
    var uvA, uvB, uvC;
    if (constants.texcoords) {
        uvC = [constants.min_u+(constants.max_u-constants.min_u)/2, constants.totalDist];   // Center point UVs

        if (isBeginning) {
            uvA = [constants.min_u, constants.totalDist];                                        // Beginning angle UVs
            uvB = [constants.max_u, constants.totalDist];                                        // Ending angle UVs
        }
        else {
            uvA = [constants.min_u, constants.totalDist];                                        // Begining angle UVs
            uvB = [constants.max_u, constants.totalDist];                                        // Ending angle UVs
        }
    }

    if ( numCorners === 2 ){
        // If caps are set as squares
        addSquare( coord,
                   Vector.neg(normal), normal,
                   uvA, uvC, uvB,
                   isBeginning,
                   constants);
    } else {
        // If caps are set as round ( numCorners===3 )
        addFan( coord,
                Vector.neg(normal), zero_vec2, normal,
                uvA, uvC, uvB,
                isBeginning, numCorners*2, constants);
    }
}

// Add a vertex based on the index position into the VBO (internal method for polyline builder)
function addIndex (index, { vertex_data, vertex_template, halfWidth, vertices, scaling_index, scaling_normalize, scalingVecs, texcoord_index, texcoords, texcoord_normalize }) {
    // Prevent access to undefined vertices
    if (index >= vertices.length) {
        return;
    }

    // set vertex position
    vertex_template[0] = vertices[index][0];
    vertex_template[1] = vertices[index][1];

    // set UVs
    if (texcoord_index) {
        vertex_template[texcoord_index + 0] = texcoords[index][0] * texcoord_normalize;
        vertex_template[texcoord_index + 1] = texcoords[index][1] * texcoord_normalize;
    }

    // set Scaling vertex (X, Y normal direction + Z halfwidth as attribute)
    if (scaling_index) {
        vertex_template[scaling_index + 0] = scalingVecs[index][0] * scaling_normalize;
        vertex_template[scaling_index + 1] = scalingVecs[index][1] * scaling_normalize;
        vertex_template[scaling_index + 2] = halfWidth;
    }

    //  Add vertex to VBO
    vertex_data.addVertex(vertex_template);
}

// Add the index vertex to the VBO and clean the buffers
function indexPairs (constants) {
    // Add vertices to buffer acording their index
    for (var i = 0; i < constants.nPairs; i++) {
        addIndex(2*i+2, constants);
        addIndex(2*i+1, constants);
        addIndex(2*i+0, constants);

        addIndex(2*i+2, constants);
        addIndex(2*i+3, constants);
        addIndex(2*i+1, constants);
    }

    constants.nPairs = 0;

    // Clean the buffer
    constants.vertices = [];
    if (constants.scalingVecs) {
        constants.scalingVecs = [];
    }
    if (constants.texcoords) {
        constants.texcoords = [];
    }
}

// Build a billboard sprite quad centered on a point. Sprites are intended to be drawn in screenspace, and have
// properties for width, height, angle, and a scale factor that can be used to interpolate the screenspace size
// of a sprite between two zoom levels.
Builders.buildQuadsForPoints = function (points, vertex_data, vertex_template,
    { texcoord_index, position_index, shape_index, offset_index },
    { quad, quad_scale, offset, angle, texcoord_scale, texcoord_normalize }) {
    let w2 = quad[0] / 2;
    let h2 = quad[1] / 2;
    let scaling = [
        [-w2, -h2],
        [w2, -h2],
        [w2, h2],

        [-w2, -h2],
        [w2, h2],
        [-w2, h2]
    ];

    let texcoords;
    if (texcoord_index) {
        texcoord_normalize = texcoord_normalize || 1;

        var [min_u, min_v, max_u, max_v] = texcoord_scale || default_uvs;
        texcoords = [
            [min_u, min_v],
            [max_u, min_v],
            [max_u, max_v],

            [min_u, min_v],
            [max_u, max_v],
            [min_u, max_v]
        ];
    }

    let num_points = points.length;
    for (let p=0; p < num_points; p++) {
        let point = points[p];

        for (let pos=0; pos < 6; pos++) {
            // Add texcoords
            if (texcoord_index) {
                vertex_template[texcoord_index + 0] = texcoords[pos][0] * texcoord_normalize;
                vertex_template[texcoord_index + 1] = texcoords[pos][1] * texcoord_normalize;
            }

            vertex_template[position_index + 0] = point[0];
            vertex_template[position_index + 1] = point[1];

            vertex_template[shape_index + 0] = scaling[pos][0];
            vertex_template[shape_index + 1] = scaling[pos][1];
            vertex_template[shape_index + 2] = angle;
            vertex_template[shape_index + 3] = quad_scale;

            vertex_template[offset_index + 0] = offset[0];
            vertex_template[offset_index + 1] = offset[1];

            vertex_data.addVertex(vertex_template);
        }
    }
};


/* Utility functions */

// Triangulation using earcut
// https://github.com/mapbox/earcut
Builders.triangulatePolygon = function (contours)
{
    return earcut(contours);
};

// Tests if a line segment (from point A to B) is outside the tile bounds
// (within a certain tolerance to account for geometry nearly on tile edges)
Builders.outsideTile = function (_a, _b, tolerance) {
    let tile_min = Builders.tile_bounds[0];
    let tile_max = Builders.tile_bounds[1];

    // TODO: fix flipped Y coords here, confusing with 'max' reference
    if ((_a[0] <= tile_min.x + tolerance && _b[0] <= tile_min.x + tolerance) ||
        (_a[0] >= tile_max.x - tolerance && _b[0] >= tile_max.x - tolerance) ||
        (_a[1] >= tile_min.y - tolerance && _b[1] >= tile_min.y - tolerance) ||
        (_a[1] <= tile_max.y + tolerance && _b[1] <= tile_max.y + tolerance)) {
        return true;
    }

    return false;
};
