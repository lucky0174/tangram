/*jshint worker: true*/
import Utils from './utils/utils';
import WorkerBroker from './utils/worker_broker'; // jshint ignore:line
import Scene  from './scene';
import Tile from './tile';
import DataSource from './data_source.js';
import FeatureSelection from './selection';
import {StyleParser} from './styles/style_parser';
import {StyleManager} from './styles/style_manager';
import {parseRules} from './styles/rule';
import Builders from './styles/builders';
import Texture from './gl/texture';

export var SceneWorker = {
    sources: {
        tiles: {},
        objects: {}
    },
    styles: {},
    rules: {},
    layers: {},
    tiles: {},
    objects: {},
    config: {}
};

// Worker functionality will only be defined in worker thread

if (Utils.isWorkerThread) {

    SceneWorker.worker = self;

    // TODO: sync render style state between main thread and worker
    Builders.setTileScale(Scene.tile_scale);

    // Initialize worker
    SceneWorker.worker.init = function (worker_id, num_workers, device_pixel_ratio) {
        SceneWorker.worker_id = worker_id;
        SceneWorker.num_workers = num_workers;
        SceneWorker.device_pixel_ratio = device_pixel_ratio;
        FeatureSelection.setPrefix(SceneWorker.worker_id);
        return worker_id;
    };

    // Starts a config refresh
    SceneWorker.worker.updateConfig = function ({ config }) {
        SceneWorker.config = null;
        SceneWorker.styles = null;
        config = JSON.parse(config);

        for (var name in config.sources) {
            let source = DataSource.create(Object.assign(config.sources[name], {name}));
            if (source.tiled) {
                SceneWorker.sources.tiles[name] = source;
            }
            else {
                // Distribute object sources across workers
                if (source.id % SceneWorker.num_workers === SceneWorker.worker_id) {
                    // Load source if not cached
                    SceneWorker.sources.objects[name] = source;
                    if (!SceneWorker.objects[source.name]) {
                        SceneWorker.objects[source.name] = {};
                        source.load(SceneWorker.objects[source.name]);
                    }
                }
            }
        }

        // Geometry block functions are not macro'ed and wrapped like the rest of the style functions are
        // TODO: probably want a cleaner way to exclude these
        for (var layer in config.layers) {
            config.layers[layer].geometry = Utils.stringsToFunctions(config.layers[layer].geometry);
        }

        // Expand styles
        SceneWorker.config = Utils.stringsToFunctions(StyleParser.expandMacros(config), StyleParser.wrapFunction);
        SceneWorker.styles = StyleManager.build(SceneWorker.config.styles, { device_pixel_ratio: SceneWorker.device_pixel_ratio });

        // Parse each top-level layer as a separate rule tree
        // TODO: find a more graceful way to incorporate this

        SceneWorker.rules =  parseRules(SceneWorker.config.layers);

        // Sync tetxure info from main thread
        SceneWorker.syncing_textures = SceneWorker.syncTextures();

        // Return promise for when config refresh finishes
        SceneWorker.configuring = SceneWorker.syncing_textures.then(() => {
            SceneWorker.log('debug', `updated config`);
        });
    };

    // Returns a promise that fulfills when config refresh is finished
    SceneWorker.awaitConfiguration = function () {
        return SceneWorker.configuring;
    };

    // Slice a subset of keys out of a tile
    // Includes a minimum set of pre-defined keys for load state, debug. etc.
    // We use this to send a subset of the tile back to the main thread, to minimize unnecessary data transfer
    // (e.g. very large items like feature geometry are not needed on the main thread)
    SceneWorker.sliceTile = function (tile, keys) {
        keys = keys || {};
        keys.key = true;
        keys.loading = true;
        keys.loaded = true;
        keys.order = true;
        keys.error = true;
        keys.debug = true;

        // Build the tile subset
        var tile_subset = {};
        for (var k in keys) {
            tile_subset[k] = tile[k];
        }

        return tile_subset;
    };

    // Build a tile: load from tile source if building for first time, otherwise rebuild with existing data
    SceneWorker.worker.buildTile = function ({ tile }) {
        // Tile cached?
        if (SceneWorker.tiles[tile.key] != null) {
            // Already loading?
            if (SceneWorker.tiles[tile.key].loading === true) {
                return;
            }
        }

        // Update tile cache
        tile = SceneWorker.tiles[tile.key] = Object.assign(SceneWorker.tiles[tile.key] || {}, tile);

        // Update config (styles, etc.), then build tile
        return SceneWorker.awaitConfiguration().then(() => {
            // First time building the tile
            if (tile.loaded !== true) {

                return new Promise((resolve, reject) => {

                    tile.loading = true;
                    tile.loaded = false;
                    tile.error = null;

                    Promise.all(Object.keys(SceneWorker.sources.tiles).map(x => SceneWorker.sources.tiles[x].load(tile))).then(() => {
                        tile.loading = false;
                        tile.loaded = true;
                        // var keys = Tile.buildGeometry(tile, SceneWorker.config.layers, SceneWorker.rules, SceneWorker.styles);
                        Tile.buildGeometry(tile, SceneWorker.config.layers, SceneWorker.rules, SceneWorker.styles).then(keys => {
                            resolve({
                                tile: SceneWorker.sliceTile(tile, keys),
                                worker_id: SceneWorker.worker_id,
                                selection_map_size: FeatureSelection.map_size
                            });
                        });
                    }).catch((error) => {
                        tile.loading = false;
                        tile.loaded = false;
                        tile.error = error.toString();
                        SceneWorker.log('error', `tile load error for ${tile.key}: ${error.stack}`);

                        resolve({
                            tile: SceneWorker.sliceTile(tile),
                            worker_id: SceneWorker.worker_id,
                            selection_map_size: FeatureSelection.map_size
                        });
                    });
                });
            }
            // Tile already loaded, just rebuild
            else {
                SceneWorker.log('trace', `used worker cache for tile ${tile.key}`);

                // Build geometry
                // var keys = Tile.buildGeometry(tile, SceneWorker.config.layers, SceneWorker.rules, SceneWorker.styles);
                return Tile.buildGeometry(tile, SceneWorker.config.layers, SceneWorker.rules, SceneWorker.styles).then(keys => {
                    return {
                        tile: SceneWorker.sliceTile(tile, keys),
                        worker_id: SceneWorker.worker_id,
                        selection_map_size: FeatureSelection.map_size
                    };
                });
            }
        });
    };

    // Remove tile
    SceneWorker.worker.removeTile = function (key) {
        var tile = SceneWorker.tiles[key];

        if (tile != null) {
            // Cancel if loading
            if (tile.loading === true) {
                SceneWorker.log('trace', `cancel tile load for ${key}`);
                tile.loading = false;
            }

            Tile.cancel(tile);

            // Remove from cache
            delete SceneWorker.tiles[key];
            SceneWorker.log('trace', `remove tile from cache for ${key}`);
        }
    };

    // Get a feature from the selection map
    SceneWorker.worker.getFeatureSelection = function ({ id, key } = {}) {
        var selection = FeatureSelection.map[key];

        return {
            id: id,
            feature: (selection && selection.feature)
        };
    };

    // Resets the feature selection state
    SceneWorker.worker.resetFeatureSelection = function () {
        FeatureSelection.reset();
    };

    // Texture info needs to be synced from main thread
    SceneWorker.syncTextures = function () {
        // We're only syncing the textures that have sprites defined, since these are (currently) the only ones we
        // need info about for geometry construction (e.g. width/height, which we only know after the texture loads)
        let textures = [];
        if (SceneWorker.config.textures) {
            for (let [texname, texture] of Utils.entries(SceneWorker.config.textures)) {
                if (texture.sprites) {
                    textures.push(texname);
                }
            }
        }

        SceneWorker.log('trace', 'sync textures to worker:', textures);
        if (textures.length > 0) {
            return Texture.syncTexturesToWorker(textures);
        }
        return Promise.resolve();
    };

    // Log wrapper, sends message to main thread for display, and includes worker id #
    SceneWorker.log = function (level, ...msg) {
        SceneWorker.worker.postMessage({
            type: 'log',
            level: level || 'info',
            worker_id: SceneWorker.worker_id,
            msg: msg
        });
    };

    // Profiling helpers
    SceneWorker.worker.profile = function (name) {
        console.profile(`worker ${SceneWorker.worker_id}: ${name}`);
    };

    SceneWorker.worker.profileEnd = function (name) {
        console.profileEnd(`worker ${SceneWorker.worker_id}: ${name}`);
    };

}
