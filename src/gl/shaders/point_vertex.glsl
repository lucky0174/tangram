uniform mat4 u_tile_view;
uniform float u_num_layers;

attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_color;
attribute float a_layer;

varying vec3 v_color;
varying vec2 v_texcoord;

#if defined(FEATURE_SELECTION)
    attribute vec4 a_selection_color;
    varying vec4 v_selection_color;
#endif

// Imported functions
#pragma glslify: calculateZ = require(./modules/depth_scale)

#pragma tangram: globals
#pragma tangram: camera

void main() {
    #if defined(FEATURE_SELECTION)
        if (a_selection_color.xyz == vec3(0.)) {
            // Discard by forcing invalid triangle if we're in the feature
            // selection pass but have no selection info
            // TODO: in some cases we may actually want non-selectable features to occlude selectable ones?
            gl_Position = vec4(0., 0., 0., 1.);
            return;
        }
        v_selection_color = a_selection_color;
    #endif

    // vec4 position = u_perspective * u_tile_view * vec4(a_position, 1.);
    vec4 position = u_tile_view * vec4(a_position, 1.);

    #pragma tangram: vertex

    v_color = a_color;
    v_texcoord = a_texcoord;

    cameraProjection(position);

    // position.z = calculateZ(position.z, a_layer, u_num_layers, 256.);

    // Offset each layer to avoid z-fighting or occlusion of otherwise "equal" layers
    // For cases where z=0, higher levels should be drawn on top of lower ones
    position.z -= (a_layer + 1.) * .001;

    gl_Position = position;
}
