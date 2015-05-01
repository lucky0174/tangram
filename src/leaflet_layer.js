import Utils from './utils/utils';
import Scene from './scene';

import log from 'loglevel';

// Exports must appear outside a function, but will only be defined in main thread (below)
export var LeafletLayer;
export function leafletLayer(options) {
    return new LeafletLayer(options);
}

// Leaflet layer functionality is only defined in main thread
if (Utils.isMainThread) {

    // Determine if we are extending the leaflet 0.7.x TileLayer class, or the newer
    // leaflet 1.x GridLayer class.
    let layerBaseClass = L.GridLayer ? L.GridLayer : L.TileLayer;
    let leafletVersion = layerBaseClass === L.GridLayer ? '1.x' : '0.7.x';
    let layerClassConfig = {};

    // If extending leaflet 0.7.x TileLayer, make add/remove tile no ops
    if (layerBaseClass === L.TileLayer) {
        layerClassConfig._addTile = function(){};
        layerClassConfig._removeTile = function(){};
    }

    // Define custom layer methods
    Object.assign(layerClassConfig, {

        initialize: function (options) {
            // Defaults
            options.showDebug = (!options.showDebug ? false : true);

            L.setOptions(this, options);
            this.createScene();
            this.hooks = {};
            this._updating_tangram = false;

            // Force leaflet zoom animations off
            this._zoomAnimated = false;
        },

        createScene: function () {
            this.scene = Scene.create(
                this.options.scene,
                {
                    numWorkers: this.options.numWorkers,
                    preUpdate: this.options.preUpdate,
                    postUpdate: this.options.postUpdate,
                    continuousZoom: (LeafletLayer.leafletVersion === '1.x'),
                    highDensityDisplay: this.options.highDensityDisplay,
                    logLevel: this.options.logLevel,
                    // advanced option, app will have to manually called scene.update() per frame
                    disableRenderLoop: this.options.disableRenderLoop,
                    // advanced option, will require library to be served as same host as page
                    allowCrossDomainWorkers: this.options.allowCrossDomainWorkers
                });
        },

        // Finish initializing scene and setup events when layer is added to map
        onAdd: function (map) {
            if (!this.scene) {
                this.createScene();
            }

            layerBaseClass.prototype.onAdd.apply(this, arguments);

            this.hooks.resize = () => {
                this._updating_tangram = true;
                var size = map.getSize();
                this.scene.resizeMap(size.x, size.y);
                this._updating_tangram = false;
            };
            map.on('resize', this.hooks.resize);

            this.hooks.move = () => {
                if (this._updating_tangram) {
                    return;
                }

                this._updating_tangram = true;
                var view = map.getCenter();
                view.zoom = map.getZoom();

                var changed = this.scene.setView(view);
                if (changed) {
                    this.scene.immediateRedraw();
                }
                this._updating_tangram = false;
            };
            map.on('move', this.hooks.move);

            this.hooks.zoomstart = () => {
                if (this._updating_tangram) {
                    return;
                }

                this._updating_tangram = true;
                this.scene.startZoom();
                this._updating_tangram = false;
            };
            map.on('zoomstart', this.hooks.zoomstart);

            this.hooks.dragstart = () => {
                this.scene.panning = true;
            };
            map.on('dragstart', this.hooks.dragstart);

            this.hooks.dragend = () => {
                this.scene.panning = false;
            };
            map.on('dragend', this.hooks.dragend);

            // Force leaflet zoom animations off
            map._zoomAnimated = false;

            // Canvas element will be inserted after map container (leaflet transforms shouldn't be applied to the GL canvas)
            // TODO: find a better way to deal with this? right now GL map only renders correctly as the bottom layer
            this.scene.container = map.getContainer();

            // Initial view
            var view = map.getCenter();
            view.zoom = map.getZoom();
            this.scene.setView(view);

            // Subscribe to tangram events
            this.scene.subscribe({
                move: this.onTangramViewUpdate.bind(this)
            });

            // Use leaflet's existing event system as the callback mechanism
            this.scene.init().then(() => {
                log.debug('Scene.init() succeeded');
                this.fire('init');
            }, (error) => {
                log.error('Scene.init() failed with error:', error);
                throw error;
            });
        },

        onRemove: function (map) {
            layerBaseClass.prototype.onRemove.apply(this, arguments);

            map.off('resize', this.hooks.resize);
            map.off('move', this.hooks.move);
            map.off('zoomstart', this.hooks.zoomstart);
            map.off('dragstart', this.hooks.dragstart);
            map.off('dragend', this.hooks.dragend);
            this.hooks = {};

            if (this.scene) {
                this.scene.destroy();
                this.scene = null;
            }
        },

        createTile: function (coords) {
            var key = coords.x + '/' + coords.y + '/' + coords.z;
            var div = document.createElement('div');
            div.setAttribute('data-tile-key', key);
            div.style.width = '256px';
            div.style.height = '256px';

            if (this.options.showDebug) {
                var debug_overlay = document.createElement('div');
                debug_overlay.textContent = key;
                debug_overlay.style.position = 'absolute';
                debug_overlay.style.left = 0;
                debug_overlay.style.top = 0;
                debug_overlay.style.color = 'white';
                debug_overlay.style.fontSize = '16px';
                debug_overlay.style.textOutline = '1px #000000';
                debug_overlay.style.padding = '8px';

                div.appendChild(debug_overlay);
                div.style.borderStyle = 'solid';
                div.style.borderColor = 'white';
                div.style.borderWidth = '1px';
            }

            return div;
        },

        onTangramViewUpdate: function () {
            if (!this._map || this._updating_tangram) {
                return;
            }
            this._updating_tangram = true;
            this._map.setView([this.scene.center.lat, this.scene.center.lng], this.scene.zoom, { animate: false });
            this._updating_tangram = false;
        },

        render: function () {
            if (!this.scene) {
                return;
            }
            this.scene.update();
        }

    });

    // Create the layer class
    LeafletLayer = layerBaseClass.extend(layerClassConfig);

    // Polyfill some 1.0 methods
    if (typeof LeafletLayer.remove !== 'function') {
        LeafletLayer.prototype.remove = function() {
            if (this._map) {
                this._map.removeLayer(this);
            }
            this.fire('remove');
        };
    }

    LeafletLayer.layerBaseClass = layerBaseClass;
    LeafletLayer.leafletVersion = leafletVersion;

}
