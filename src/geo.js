// Miscellaneous geo functions

var Geo;
export default Geo = {};

// Projection constants
Geo.tile_size = 256;
Geo.half_circumference_meters = 20037508.342789244;
Geo.circumference_meters = Geo.half_circumference_meters * 2;
Geo.min_zoom_meters_per_pixel = Geo.circumference_meters / Geo.tile_size; // min zoom draws world as 2 tiles wide
Geo.meters_per_pixel = [];
Geo.meters_per_tile = [];
Geo.max_zoom = 20;
for (var z=0; z <= Geo.max_zoom; z++) {
    Geo.meters_per_pixel[z] = Geo.min_zoom_meters_per_pixel / Math.pow(2, z);
    Geo.meters_per_tile[z] = Geo.circumference_meters / Math.pow(2, z);
}

Geo.metersPerPixel = function (zoom) {
    return Geo.min_zoom_meters_per_pixel / Math.pow(2, zoom);
};

// Conversion functions based on an defined tile scale
Geo.units_per_meter = [];
Geo.tile_scale = 4096; // coordinates are locally scaled to the range [0, tile_scale]
Geo.units_per_pixel = Geo.tile_scale / Geo.tile_size;

for (let z=0; z <= Geo.max_zoom; z++) {
    Geo.units_per_meter[z] = Geo.tile_scale / (Geo.tile_size * Geo.meters_per_pixel[z]);
}

// Convert tile location to mercator meters - multiply by pixels per tile, then by meters per pixel, adjust for map origin
Geo.metersForTile = function (tile) {
    return {
        x: tile.x * Geo.circumference_meters / Math.pow(2, tile.z) - Geo.half_circumference_meters,
        y: -(tile.y * Geo.circumference_meters / Math.pow(2, tile.z) - Geo.half_circumference_meters)
    };
};

/**
   Given a point in mercator meters and a zoom level, return the tile X/Y/Z that the point lies in
*/
Geo.tileForMeters = function ([x, y], zoom) {
    return {
        x: Math.floor((x + Geo.half_circumference_meters) / (Geo.circumference_meters / Math.pow(2, zoom))),
        y: Math.floor((-y + Geo.half_circumference_meters) / (Geo.circumference_meters / Math.pow(2, zoom))),
        z: zoom
    };
};

// Wrap a tile to positive #s for zoom
// Optionally specify the axes to wrap
Geo.wrapTile = function({ x, y, z }, mask = { x: true, y: false }) {
    var m = (1 << z) - 1;
    if (mask.x) {
        x = x & m;
    }
    if (mask.y) {
        y = y & m;
    }
    return { x, y, z };
};

/**
   Convert mercator meters to lat-lng
*/
Geo.metersToLatLng = function ([x, y]) {

    x /= Geo.half_circumference_meters;
    y /= Geo.half_circumference_meters;

    y = (2 * Math.atan(Math.exp(y * Math.PI)) - (Math.PI / 2)) / Math.PI;

    x *= 180;
    y *= 180;

    return [x, y];
};

/**
  Convert lat-lng to mercator meters
*/
Geo.latLngToMeters = function([x, y]) {

    // Latitude
    y = Math.log(Math.tan(y*Math.PI/360 + Math.PI/4)) / Math.PI;
    y *= Geo.half_circumference_meters;

    // Longitude
    x *= Geo.half_circumference_meters / 180;

    return [x, y];
};

Geo.wrapLng = function(x) {
    if (x > 180 || x < -180) {
        x = ((x + 180) % 360 + 360) % 360 - 180;
    }
    return x;
};

// Run an in-place transform function on each cooordinate in a GeoJSON geometry
Geo.transformGeometry = function (geometry, transform) {
    if (geometry.type === 'Point') {
        transform(geometry.coordinates);
    }
    else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
        geometry.coordinates.forEach(transform);
    }
    else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
        geometry.coordinates.forEach(coordinates => coordinates.forEach(transform));
    }
    else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
            polygon.forEach(coordinates => coordinates.forEach(transform));
        });
    }
    // TODO: support GeometryCollection
};

Geo.boxIntersect = function (b1, b2) {
    return !(
        b2.sw.x > b1.ne.x ||
        b2.ne.x < b1.sw.x ||
        b2.sw.y > b1.ne.y ||
        b2.ne.y < b1.sw.y
    );
};

// Finds the axis-aligned bounding box for a polygon
Geo.findBoundingBox = function (polygon) {
    var min_x = Infinity,
        max_x = -Infinity,
        min_y = Infinity,
        max_y = -Infinity;

    // Only need to examine outer ring (polygon[0])
    var num_coords = polygon[0].length;
    for (var c=0; c < num_coords; c++) {
        var coord = polygon[0][c];

        if (coord[0] < min_x) {
            min_x = coord[0];
        }
        if (coord[1] < min_y) {
            min_y = coord[1];
        }
        if (coord[0] > max_x) {
            max_x = coord[0];
        }
        if (coord[1] > max_y) {
            max_y = coord[1];
        }
    }

    return [min_x, min_y, max_x, max_y];
};

// Convert geometry type to one of: 'point', 'line', 'polygon'
Geo.geometryType = function(type) {
    if (type === 'Polygon' || type === 'MultiPolygon') {
        return 'polygon';
    }
    else if (type === 'LineString' || type === 'MultiLineString') {
        return 'line';
    }
    if (type === 'Point' || type === 'MultiPoint') {
        return 'point';
    }
};
