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

    // Get value from raster tile texture
    #ifdef TANGRAM_RASTER_TEXTURE
        vec4 raster = texture2D(u_rasters[0], v_model_position.xy);
    #endif

    #ifdef TANGRAM_RASTER_TEXTURE_COLOR
        // note: vertex color is multiplied to tint texture color
        color *= raster;
    #endif

    #if defined(TANGRAM_LIGHTING_FRAGMENT)
        // Fragment lighting
        vec3 normal = TANGRAM_NORMAL;

        // Apply normal from raster tile
        // TODO: precedence / disambiguation between raster tile and material normals?
        #ifdef TANGRAM_RASTER_TEXTURE_NORMAL
            normal = normalize(raster.rgb * 2. - 1.);
        #endif

        // Apply normal from material
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
