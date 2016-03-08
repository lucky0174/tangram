uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_map_position;
uniform vec4 u_tile_origin;
uniform float u_meters_per_pixel;
uniform float u_device_pixel_ratio;

uniform mat3 u_normalMatrix;
uniform mat3 u_inverseNormalMatrix;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_world_position;

#define TANGRAM_NORMAL v_normal

#ifdef TANGRAM_TEXTURE_COORDS
    varying vec2 v_texcoord;
#endif

#pragma tangram: camera
#pragma tangram: material
#pragma tangram: lighting
#pragma tangram: global

void main (void) {
    // Initialize globals
    #pragma tangram: setup

    vec4 color = v_color;

    #if defined(TANGRAM_LIGHTING_FRAGMENT)
        // Fragment lighting

        vec3 normal = TANGRAM_NORMAL;

        #ifdef TANGRAM_MATERIAL_NORMAL_TEXTURE
            calculateNormal(normal);
        #endif

        // Modify normal before lighting
        #pragma tangram: normal

        // Modify color and material properties before lighting
        #pragma tangram: color

        color = calculateLighting(v_position.xyz - u_eye, normal, color);
    #endif

    // Modify color after lighting (filter-like effects that don't require a additional render passes)
    #pragma tangram: filter

    gl_FragColor = color;
}
