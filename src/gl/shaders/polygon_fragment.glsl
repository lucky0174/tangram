uniform vec2 u_resolution;
uniform vec2 u_aspect;
uniform mat4 u_meter_view;
uniform float u_meters_per_pixel;
uniform float u_time;

varying vec3 v_color;

#if !defined(LIGHTING_VERTEX)
    varying vec4 v_position;
    varying vec3 v_normal;
#endif

#if defined(EFFECT_NOISE_TEXTURE)
    varying vec4 v_position_world;
    #pragma glslify: cnoise = require(glsl-noise/classic/3d)
#endif

const float light_ambient = 0.5;

// Imported functions
#pragma glslify: lighting = require(./modules/lighting)

void main (void) {
    vec3 color;

    #if !defined(LIGHTING_VERTEX) // default to per-pixel lighting
        color = lighting(
            v_position, v_normal, v_color,
            // vec4(0., 0., 150. * u_meters_per_pixel, 1.), // location of point light (in pixels above ground)
            // distortion away from screen origin
            vec4(400. * u_meters_per_pixel, -200. * u_meters_per_pixel, 150. * u_meters_per_pixel, 1.), // location of point light (in pixels above ground)
            vec4(0., 0., 50. * u_meters_per_pixel, 1.), // location of point light for 'night' mode (in pixels above ground)
            vec3(0.2, 0.7, -0.5), // direction of light for flat shading
            light_ambient);
    #else
        color = v_color;
    #endif

    // Spotlight effect
    #if defined(EFFECT_SPOTLIGHT)
        vec2 position = gl_FragCoord.xy / u_resolution.xy;  // scale coords to [0.0, 1.0]
        position = position * 2.0 - 1.0;                    // scale coords to [-1.0, 1.0]
        position *= u_aspect;                               // correct aspect ratio

        color *= max(1.0 - distance(position, vec2(0.0, 0.0)), 0.2);
    #endif

    // Mutate colors by screen position or time
    #if defined(EFFECT_COLOR_BLEED)
        color += vec3(gl_FragCoord.x / u_resolution.x, 0.0, gl_FragCoord.y / u_resolution.y);
        color.r += sin(u_time / 3.0);
    #endif

    // Mutate color by 3d noise
    #if defined (EFFECT_NOISE_TEXTURE)
        #if defined(EFFECT_NOISE_ANIMATABLE) && defined(EFFECT_NOISE_ANIMATED)
            color *= (abs(cnoise((v_position_world.xyz + vec3(u_time * 5., u_time * 7.5, u_time * 10.)) / 10.0)) / 4.0) + 0.75;
        #endif
        #ifndef EFFECT_NOISE_ANIMATABLE
            color *= (abs(cnoise(v_position_world.xyz / 10.0)) / 4.0) + 0.75;
        #endif
    #endif

        // color = vec3(v_position);
        // color = vec3(v_normal);
        // color = vec3(v_color);
        // color = vec3(u_meters_per_pixel);

    gl_FragColor = vec4(color, 1.0);
}
