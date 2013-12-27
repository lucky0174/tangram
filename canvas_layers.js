[
    {
        name: 'land_unlabeled',
        data: function (json) {
            // Only land features WITHOUT names
            return {
                type: 'FeatureCollection',
                features: json['land-usages'].features.filter(function (feature) {
                    return !(feature.properties.name != null && feature.properties.name != '');
                })
            };
        },
        selection: true
    },
    {
        name: 'land_labeled',
        data: function (json) {
            // Only land features WITH names
            return {
                type: 'FeatureCollection',
                features: json['land-usages'].features.filter(function (feature) {
                    return (feature.properties.name != null && feature.properties.name != '');
                })
            };
        },
        selection: true
    },
    {
        name: 'water',
        data: function (json) { return json['water-areas']; },
        selection: true
    },
    {
        name: 'roads',
        data: function (json) {
            // Order roads using provided 'sort_key'
            return {
                type: 'FeatureCollection',
                features: json['highroad'].features.sort(function(a, b) {
                    return (a.properties.sort_key > b.properties.sort_key);
                })
            };
        }
    },
    {
        name: 'road_labels',
        data: function (json) {
            // Order roads using provided 'sort_key'
            return {
                type: 'FeatureCollection',
                features: json['skeletron'].features.sort(function(a, b) {
                    return (a.properties.sort_key > b.properties.sort_key);
                })
            };
        },
        visible: false,
        selection: true
    },
    {
        name: 'buildings_unlabeled',
        data: function (json) {
            return {
                type: 'FeatureCollection',
                features: json['buildings'].features.filter(function (feature) {
                    return !(feature.properties.name != null && feature.properties.name != '');
                })
            };
        },
        selection: true
    },
    {
        name: 'buildings_labeled',
        data: function (json) {
            return {
                type: 'FeatureCollection',
                features: json['buildings'].features.filter(function (feature) {
                    return (feature.properties.name != null && feature.properties.name != '');
                })
            };
        },
        selection: true
    },
    {
        name: 'pois',
        data: function (json) {
            // Only features WITH names
            return {
                type: 'FeatureCollection',
                features: json['pois'].features.filter(function (feature) {
                    return (feature.properties.name != null && feature.properties.name != '');
                })
            };
        },
        selection: true
    }
]
