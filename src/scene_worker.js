/*jshint worker: true*/
import Utils from './utils';
import WorkerBroker from './worker_broker'; // jshint ignore:line
import {StyleParser} from './styles/style_parser';
import {StyleManager} from './styles/style_manager';
import Scene  from './scene';
import Tile from './tile';
import TileSource from './tile_source.js';
import {parseRules} from './rule';
import {GLBuilders} from './gl/gl_builders';
import GLTexture from './gl/gl_texture';

export var SceneWorker = {};

// Worker functionality will only be defined in worker thread
Utils.inWorkerThread(() => {

    SceneWorker.worker = self;
    SceneWorker.tiles = {}; // tiles processed by this worker

    // TODO: sync render style state between main thread and worker
    GLBuilders.setTileScale(Scene.tile_scale);

    // Initialize worker
    SceneWorker.worker.init = function (worker_id) {
        SceneWorker.worker_id = worker_id;
        StyleParser.selection_map_prefix = SceneWorker.worker_id;
        return worker_id;
    };

    // A proimse that will be resolved when config is done
    SceneWorker.resetConfigPromise = function () {
        var p = {};
        SceneWorker.configuring = {};
        SceneWorker.configuring.promise = new Promise((resolve, reject) => p = { resolve, reject });
        SceneWorker.configuring.resolve = p.resolve;
        SceneWorker.configuring.reject = p.reject;
    };
    SceneWorker.resetConfigPromise();

    SceneWorker.worker.updateConfig = function ({ tile_source, config }) {
        SceneWorker.resetConfigPromise();

        SceneWorker.config = null;
        SceneWorker.styles = null;
        StyleParser.resetSelectionMap();

        SceneWorker.tile_source = TileSource.create(tile_source);

        var layer;
        config = JSON.parse(config);

        // Geometry block functions are not macro'ed and wrapped like the rest of the style functions are
        // TODO: probably want a cleaner way to exclude these
        for (layer in config.layers) {
            config.layers[layer].geometry = Utils.stringsToFunctions(config.layers[layer].geometry);
        }

        // Expand styles
        SceneWorker.config = Utils.stringsToFunctions(StyleParser.expandMacros(config), StyleParser.wrapFunction);
        SceneWorker.styles = StyleManager.build(SceneWorker.config.styles);

        // Parse each top-level layer as a separate rule tree
        // TODO: find a more graceful way to incorporate this
        SceneWorker.rules = {};
        for (layer in SceneWorker.config.layers) {
            SceneWorker.rules[layer] = parseRules({ [layer]: SceneWorker.config.layers[layer] });
        }

        // Sync tetxure info from main thread
        SceneWorker.syncing_textures = SceneWorker.syncTextures().then(() => {
            SceneWorker.configuring.resolve(SceneWorker.config);
            SceneWorker.log('debug', `updated config`);
        });
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
        return SceneWorker.configuring.promise.then(() => {
            // First time building the tile
            if (tile.loaded !== true) {
                return new Promise((resolve, reject) => {
                    SceneWorker.tile_source.loadTile(tile).then(() => {
                        var keys = Tile.buildGeometry(tile, SceneWorker.config.layers, SceneWorker.rules, SceneWorker.styles);

                        resolve({
                            tile: SceneWorker.sliceTile(tile, keys),
                            worker_id: SceneWorker.worker_id,
                            selection_map_size: StyleParser.selection_map_size
                        });
                    }).catch((error) => {
                        if (error) {
                            SceneWorker.log('error', `tile load error for ${tile.key}: ${error.stack}`);
                        }
                        else {
                            SceneWorker.log('debug', `skip building tile ${tile.key} because no longer loading`);
                        }

                        resolve({
                            tile: SceneWorker.sliceTile(tile),
                            worker_id: SceneWorker.worker_id,
                            selection_map_size: StyleParser.selection_map_size
                        });
                    });
                });
            }
            // Tile already loaded, just rebuild
            else {
                SceneWorker.log('debug', `used worker cache for tile ${tile.key}`);

                // Build geometry
                var keys = Tile.buildGeometry(tile, SceneWorker.config.layers, SceneWorker.rules, SceneWorker.styles);

                return {
                    tile: SceneWorker.sliceTile(tile, keys),
                    worker_id: SceneWorker.worker_id,
                    selection_map_size: StyleParser.selection_map_size
                };
            }
        });
    };

    // Remove tile
    SceneWorker.worker.removeTile = function (key) {
        var tile = SceneWorker.tiles[key];

        if (tile != null) {
            // Cancel if loading
            if (tile.loading === true) {
                SceneWorker.log('debug', `cancel tile load for ${key}`);
                tile.loading = false;
            }

            // Remove from cache
            delete SceneWorker.tiles[key];
            SceneWorker.log('debug', `remove tile from cache for ${key}`);
        }
    };

    // Get a feature from the selection map
    SceneWorker.worker.getFeatureSelection = function ({ id, key } = {}) {
        var selection = StyleParser.selection_map[key];

        return {
            id: id,
            feature: (selection && selection.feature)
        };
    };

    // Texture info needs to be synced from main thread
    SceneWorker.syncTextures = function () {
        // We're only syncing the textures that have sprites defined, since these are (currently) the only ones we
        // need info about for geometry construction (we need width/height, which we only know after the texture loads)
        // This is an async process, so it returns a promise
        var textures = [];
        for (var style of Utils.values(SceneWorker.styles)) {
            if (style.textures) {
                for (var t in style.textures) {
                    if (style.textures[t].sprites) {
                        textures.push(t);
                    }
                }
            }
        }

        SceneWorker.log('trace', 'sync textures to worker:', textures);
        if (textures.length > 0) {
            return GLTexture.syncTexturesToWorker(textures);
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

});
