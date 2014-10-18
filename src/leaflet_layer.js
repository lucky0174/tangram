import Scene from './scene';

export var LeafletLayer = L.GridLayer.extend({

    initialize: function (options) {
        L.setOptions(this, options);
        this.scene = new Scene(
            this.options.vectorTileSource,
            this.options.vectorLayers,
            this.options.vectorStyles,
            { num_workers: this.options.numWorkers }
        );

        this.scene.debug = this.options.debug;
        this.scene.continuous_animation = false; // set to true for animatinos, etc. (eventually will be automated)
        this.hooks = {};
    },

    // Finish initializing scene and setup events when layer is added to map
    onAdd: function (map) {

        this.hooks.tileunload = (event) => {
            var tile = event.tile;
            var key = tile.getAttribute('data-tile-key');
            this.scene.removeTile(key);
        };
        this.on('tileunload', this.hooks.tileunload);

        this.hooks.resize = () => {
            var size = this._map.getSize();
            this.scene.resizeMap(size.x, size.y);
            this.updateBounds();
        };
        this._map.on('resize', this.hooks.resize);

        this.hooks.move = () => {
            var center = this._map.getCenter();
            this.scene.setCenter(center.lng, center.lat);
            this.updateBounds();
        };
        this._map.on('move', this.hooks.move);

        this.hooks.zoomstart = () => {
            console.log("map.zoomstart " + this._map.getZoom());
            this.scene.startZoom();
        };
        this._map.on('zoomstart', this.hooks.zoomstart);

        this.hooks.zoomend = () => {
            console.log("map.zoomend " + this._map.getZoom());
            this.scene.setZoom(this._map.getZoom());
            this.updateBounds();
        };
        this._map.on('zoomend', this.hooks.zoomend);

        this.hooks.dragstart = () => {
            this.scene.panning = true;
        };
        this._map.on('dragstart', this.hooks.dragstart);

        this.hooks.dragend = () => {
            this.scene.panning = false;
        };
        this._map.on('dragend', this.hooks.dragend);

        // Canvas element will be inserted after map container (leaflet transforms shouldn't be applied to the GL canvas)
        // TODO: find a better way to deal with this? right now GL map only renders correctly as the bottom layer
        this.scene.container = this._map.getContainer();

        var center = this._map.getCenter();
        this.scene.setCenter(center.lng, center.lat);
        console.log("zoom: " + this._map.getZoom());
        this.scene.setZoom(this._map.getZoom());
        this.updateBounds();

        L.GridLayer.prototype.onAdd.apply(this, arguments);

        // Use leaflet's existing event system as the callback mechanism
        this.scene.init(() => {
            this.fire('init');
        });
    },

    onRemove: function (map) {
        L.GridLayer.prototype.onRemove.apply(this, arguments);

        this.off('tileunload', this.hooks.tileunload);
        this._map.off('resize', this.hooks.resize);
        this._map.off('move', this.hooks.move);
        this._map.off('zoomstart', this.hooks.zoomstart);
        this._map.off('zoomend', this.hooks.zoomend);
        this._map.off('dragstart', this.hooks.dragstart);
        this._map.off('dragend', this.hooks.dragend);
        this.hooks = {};

        this.scene.destroy();
        this.scene = null;
        // TODO: allow layer to be re-added later, requiring scene re-initialization?
    },

    createTile: function (coords, done) {
        var div = document.createElement('div');
        this.scene.loadTile(coords, div, done);
        return div;
    },

    updateBounds: function () {
        var bounds = this._map.getBounds();
        this.scene.setBounds(bounds.getSouthWest(), bounds.getNorthEast());
    },

    render: function () {
        if (!this.scene) {
            return;
        }
        this.scene.render();
    }

});

export function leafletLayer(options) {
    return new LeafletLayer(options);
}
