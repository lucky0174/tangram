uniform float u_num_layers;

const float z_layer_scale;

float calculateZ (float z, float layer) {
    // Reverse and scale to 0-1 for GL depth buffer
    // Layers are force-ordered (higher layers guaranteed to render on top of lower), then by height/depth
    float z_layer_range = (u_num_layers + 1.) * z_layer_scale;
    float z_layer = (layer + 1.) * z_layer_scale;

    z = z_layer + clamp(z, 0., z_layer_scale);
    z = (z_layer_range - z) / z_layer_range;

    return z;
}

#pragma glslify: export(calculateZ)
