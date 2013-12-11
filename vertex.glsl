uniform vec2 resolution;
uniform vec2 map_center;
uniform float map_zoom;
// uniform float time;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

varying vec3 fcolor;

// const vec3 light = vec3(0.2, 0.7, -0.5); // vec3(0.1, 0.2, -0.4)
vec3 light = normalize(vec3(0.2, 0.7, -0.5)); // vec3(0.1, 0.2, -0.4)
const float ambient = 0.45;

// Project lat-lng to mercator
// vec2 latLngToMeters (vec2 coordinate) {
//     const float pi = 3.1415926;
//     const float half_circumference_meters = 20037508.342789244;
//     vec2 projected;

//     // Latitude
//     projected.y = log(tan((coordinate.y + 90.0) * pi / 360.0)) / (pi / 180.0);
//     projected.y = projected.y * half_circumference_meters / 180.0;

//     // Longitude
//     projected.x = coordinate.x * half_circumference_meters / 180.0;

//     return projected;
// }

void main() {
    vec3 vposition = position;
    vec3 vnormal = normal;

    // Scale mercator meters to viewport
    const float min_zoom_meters_per_pixel = 20037508.342789244 * 2.0 / 256.0;
    float meters_per_pixel = min_zoom_meters_per_pixel / pow(2.0, map_zoom);
    vec2 meter_zoom = vec2(resolution.x / 2.0 * meters_per_pixel, resolution.y / 2.0 * meters_per_pixel);

    vposition.xy -= map_center;

    // Isometric-style projections
    // vposition.y += vposition.z; // z coordinate is a simple translation up along y axis, ala isometric
    // vposition.y += vposition.z * 0.5; // closer to Ultima 7-style axonometric
    // vposition.x -= vposition.z * 0.5;

    vposition.xy /= meter_zoom;

    // Flat shading between surface normal and light
    fcolor = color;
    light = vec3(-0.25, -0.25, 0.35); // vec3(0.1, 0.1, 0.35); // point light location
    light = normalize(vec3(vposition.x, vposition.y, -vposition.z) - light); // light angle from light point to vertex
    fcolor *= dot(vnormal, light * -1.0) + ambient + clamp(vposition.z / meter_zoom.x, 0.0, 0.25);
    fcolor = min(fcolor, 1.0);

    // Perspective-style projections
    vec2 perspective_offset = vec2(-0.25, -0.25);
    vec2 perspective_factor = vec2(0.8, 0.8); // vec2(-0.25, 0.75);
    vposition.xy += vposition.z * perspective_factor * (vposition.xy - perspective_offset) / meter_zoom.xy; // perspective from offset center screen

    // Rotation test
    // float theta = 0;
    // const float pi = 3.1415926;
    // vec2 pr;
    // pr.x = vposition.x * cos(theta * pi / 180.0) + vposition.y * -sin(theta * pi / 180.0);
    // pr.y = vposition.x * sin(theta * pi / 180.0) + vposition.y * cos(theta * pi / 180.0);
    // vposition.xy = pr;

    // vposition.y *= abs(sin(vposition.x)); // hourglass effect

    vposition.z = (-vposition.z + 32768.0) / 65536.0; // reverse and scale to 0-1 for GL depth buffer

    gl_Position = vec4(vposition, 1.0);
}
