uniform vec2 u_resolution;
uniform float u_meters_per_pixel;
uniform float u_device_pixel_ratio;
uniform float u_time;
uniform vec3 u_map_position;
uniform vec3 u_tile_origin;

uniform sampler2D u_texture;

varying vec4 v_color;
varying vec2 v_texcoord;

// Alpha discard threshold (substitute for alpha blending)
#ifndef TANGRAM_ALPHA_DISCARD
#define TANGRAM_ALPHA_DISCARD 0.5
#endif

// Alpha fade range for edges of points
#ifndef FADE_RANGE
#define FADE_RANGE .15
#endif
#define FADE_START (1. - FADE_RANGE)

#pragma tangram: globals

void main (void) {
    vec4 color = v_color;

    // Apply a texture
    #ifdef TANGRAM_SPRITE_TEXTURE
        color *= texture2D(u_texture, v_texcoord);
    // Draw a point
    #else
        // Fade alpha near circle edge
        vec2 uv = v_texcoord * 2. - 1.;
        float dist = length(uv);
        color.a = clamp(1. - (smoothstep(0., FADE_RANGE, (dist - FADE_START)) / FADE_RANGE), 0., 1.);
    #endif

    // If blending is off, use alpha discard as a lower-quality substitute
    #ifndef TANGRAM_BLEND_OVERLAY
        if (color.a < TANGRAM_ALPHA_DISCARD) {
            discard;
        }
    #endif

    #pragma tangram: color
    #pragma tangram: filter

    gl_FragColor = color;
}
