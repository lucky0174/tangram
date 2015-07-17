import DataSource from './data_source';
import {GeoJSONSource, GeoJSONTileSource} from './geojson';

import topojson from 'topojson';


/**
 Mapzen/OSM.US-style TopoJSON vector tiles
 @class TopoJSONTileSource
*/
export class TopoJSONTileSource extends GeoJSONTileSource {

    constructor(source) {
        let _this = super(source);

        // Replace with non-tiled source if tiled source failed to instantiate
        if (_this !== this) {
            return new TopoJSONSource(source);
        }
    }

    parseSourceData (tile, source, response) {
        let data = JSON.parse(response);
        data = TopoJSONSource.prototype.toGeoJSON(data);
        this.prepareGeoJSON(data, tile, source);
    }

}


/**
 TopoJSON standalone (non-tiled) source
 Uses geojson-vt split into tiles client-side
*/

export class TopoJSONSource extends GeoJSONSource {

    parseSourceData (tile, source, response) {
        let data = JSON.parse(response);
        data = this.toGeoJSON(data);
        source.layers = this.getLayers(data);
    }

    toGeoJSON (data) {
        // Single layer
        if (data.objects &&
            Object.keys(data.objects).length === 1 &&
            data.objects.vectile != null) {
            data = topojson.feature(data, data.objects.vectile);
        }
        // Multiple layers
        else {
            let layers = {};
            for (let key in data.objects) {
                layers[key] = topojson.feature(data, data.objects[key]);
            }
            data = layers;
        }
        return data;
    }

}

DataSource.register(TopoJSONTileSource, 'TopoJSON');        // prefered shorter name
DataSource.register(TopoJSONTileSource, 'TopoJSONTiles');   // for backwards-compatibility

