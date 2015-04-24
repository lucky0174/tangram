uniform vec2 u_resolution;
uniform float u_meters_per_pixel;
uniform float u_device_pixel_ratio;
uniform float u_time;
uniform vec3 u_map_position;
uniform vec3 u_tile_origin;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_world_position;

#if defined(TEXTURE_COORDS)
    varying vec2 v_texcoord;
#endif

// Define a wrap value for world coordinates (allows more precision at higher zooms)
// e.g. at wrap 1000, the world space will wrap every 1000 meters
#if defined(WORLD_POSITION_WRAP)
    vec2 world_position_anchor = vec2(floor(u_tile_origin / WORLD_POSITION_WRAP) * WORLD_POSITION_WRAP);

    // Convert back to absolute world position if needed
    vec4 absoluteWorldPosition () {
        return vec4(v_world_position.xy + world_position_anchor, v_world_position.z, v_world_position.w);
    }
#else
    vec4 absoluteWorldPosition () {
        return v_world_position;
    }
#endif

#if defined(TANGRAM_LIGHTING_VERTEX)
    varying vec4 v_lighting;
#endif

#pragma tangram: camera
#pragma tangram: material
#pragma tangram: lighting
#pragma tangram: global

void main (void) {
    vec4 color = v_color;
    vec3 normal = v_normal;

    #ifdef TANGRAM_MATERIAL_NORMAL_TEXTURE
        calculateNormal(normal);
    #endif

    // Modify normal before lighting
    #pragma tangram: normal

    // Modify color and material properties before lighting
    #if !defined(TANGRAM_LIGHTING_VERTEX)
    #pragma tangram: color
    #endif

    #if defined(TANGRAM_LIGHTING_FRAGMENT)
        color = calculateLighting(v_position.xyz - u_eye, normal, color);
    #elif defined(TANGRAM_LIGHTING_VERTEX)
        color = v_lighting;
    #endif

    // Modify color after lighting (filter-like effects that don't require a additional render passes)
    #pragma tangram: filter

    gl_FragColor = color;
}
