uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_map_position;
uniform vec4 u_tile_origin;
uniform float u_meters_per_pixel;
uniform float u_device_pixel_ratio;

uniform mat3 u_normalMatrix;
uniform mat3 u_inverseNormalMatrix;

#ifdef TANGRAM_RASTER_TEXTURE
    uniform sampler2D u_raster_texture;         // raster texture sampler
    uniform vec2 u_raster_texture_size;         // width/height pixel dimensions of raster texture
    uniform vec2 u_raster_texture_pixel_size;   // UV size of a single pixel in raster texture
#endif

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_world_position;

#define TANGRAM_NORMAL v_normal

#ifdef TANGRAM_TEXTURE_COORDS
    varying vec2 v_texcoord;
#endif

#ifdef TANGRAM_MODEL_POSITION_VARYING
    varying vec4 v_model_position;
#endif

#if defined(TANGRAM_LIGHTING_VERTEX)
    varying vec4 v_lighting;
#endif

#pragma tangram: camera
#pragma tangram: material
#pragma tangram: lighting
#pragma tangram: global

void main (void) {
    // Initialize globals
    #pragma tangram: setup

    vec4 color = v_color;
    vec3 normal = TANGRAM_NORMAL;

    // Get value from raster tile texture
    #ifdef TANGRAM_RASTER_TEXTURE
        vec4 raster = texture2D(u_raster_texture, v_model_position.xy);

        #ifdef TANGRAM_RASTER_TEXTURE_COLOR
            // note: vertex color is multiplied to tint texture color
            color *= raster;
        #endif
        #ifdef TANGRAM_RASTER_TEXTURE_NORMAL
            normal = normalize(raster.rgb * 2. - 1.);
        #endif
    #endif

    // Apply normal from material
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
