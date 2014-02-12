{
    water_ocean: {
        color: {
            default: [0.5, 0.5, 0.875]
        }
    },
    land_areas: {
        color: {
            default: [0.175, 0.175, 0.175]
        }
    },
    land_usages: {
        color: {
            default: [0.5, 0.875, 0.5],
            'pitch': [0.3, 0.675, 0.3]
        }
    },
    water_areas: {
        color: {
            default: [0.5, 0.5, 0.875]
        }
    },
    roads: {
        color: {
            // default: Style.color.randomColor
            default: [0.4, 0.4, 0.4],
            'highway': [1.0, 1.0, 1.0],
            'major_road': [0.5, 0.5, 0.5],
            'minor_road': [0.65, 0.65, 0.65],
            'path': [0.8, 0.8, 0.8],
            'rail': [0.5, 0.0, 0.0],
            'debug': [1, 0, 0]
        },
        width: {
            // default: function (f, t) { return Style.width.pixels(5, t); }
            default: function (f, t) { return 2 * Math.log(t.coords.z) * VectorRenderer.units_per_meter[t.coords.z]; },
            'highway': function (f, t) { return 3 * Math.log(t.coords.z) * VectorRenderer.units_per_meter[t.coords.z]; },
            'major_road': function (f, t) { return 2.5 * Math.log(t.coords.z) * VectorRenderer.units_per_meter[t.coords.z]; },
            'minor_road': function (f, t) { return 2 * Math.log(t.coords.z) * VectorRenderer.units_per_meter[t.coords.z]; },
            'path': function (f, t) { return 1 * Math.log(t.coords.z) * VectorRenderer.units_per_meter[t.coords.z]; },
            'debug': function (f, t) { return 5 * VectorRenderer.units_per_meter[t.coords.z]; }
        }
    },
    buildings: {
        color: {
            // default: function(f) { var h = f.properties.height || 20; h = Math.min((h + 50) / 250, 1.0); return [h, h, h]; } //Style.color.pseudoRandomColor
            // default: Style.color.pseudoRandomColor
            default: function (f) { return (f.properties.name || f.properties.kind) ? [(f.properties.name && 0.6) || 0.2, 0.2, (f.properties.kind && 0.6) || 0.2] : [0.6, 0.6, 0.6]; }
        },
        extrude: {
            default: function (f, t) { return ((t.coords.z >= 15 && f.properties.height > 20) || t.coords.z >= 16) }
        }
    }
}
