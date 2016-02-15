import Tile from './tile';
import Geo from './geo';
import Utils from './utils/utils';

import log from 'loglevel';

var TileManager;

export default TileManager = {

    init(scene) {
        this.scene = scene;
        this.tiles = {};
        this.coord_tiles = {};
        this.visible_coords = {};
        this.queued_coords = [];
        this.building_tiles = null;
        this.reset_visible_tiles = true;
        this.max_proxy_descendant_depth = 3; // # of levels deep to search for descendant proxy tiles
    },

    destroy() {
        this.forEachTile(tile => tile.destroy());
        this.tiles = {};
        this.coord_tiles = {};
        this.visible_coords = {};
        this.queued_coords = [];
        this.scene = null;
    },

    keepTile(tile) {
        this.tiles[tile.key] = tile;
        this.addTileCoord(tile);

        // Increment reference count up the tile pyramid
        for (let z = tile.coords.z - 1; z >= 0; z--) {
            let up = Tile.coordinateAtZoom(tile.coords, z);
            this.incTileCount(up);
        }
    },

    addTileCoord(tile) {
        if (!this.coord_tiles[tile.coords.key]) {
            this.coord_tiles[tile.coords.key] = { tiles: new Set(), descendants: 0 };
        }
        else if (!this.coord_tiles[tile.coords.key].tiles) {
            this.coord_tiles[tile.coords.key].tiles = new Set();
        }
        this.coord_tiles[tile.coords.key].tiles.add(tile);
    },

    incTileCount(coord) {
        if (!this.coord_tiles[coord.key]) {
            this.coord_tiles[coord.key] = { descendants: 0 };
        }
        this.coord_tiles[coord.key].descendants++;
    },

    decTileCount(coord) {
        if (!this.coord_tiles[coord.key]) {
            this.coord_tiles[coord.key] = { descendants: 0 };
        }
        else {
            this.coord_tiles[coord.key].descendants--;
            if (this.coord_tiles[coord.key].descendants === 0 && !this.coord_tiles[coord.key].tiles) {
                delete this.coord_tiles[coord.key];
            }
        }
    },

    hasTile(key) {
        return this.tiles[key] !== undefined;
    },

    forgetTile(key) {
        if (this.hasTile(key)) {
            let tile = this.tiles[key];
            if (this.coord_tiles[tile.coords.key]) {
                this.coord_tiles[tile.coords.key].tiles.delete(tile);
                if (this.coord_tiles[tile.coords.key].tiles.size === 0) {
                    if (this.coord_tiles[tile.coords.key].tiles.descendants === 0) {
                        // remove whole coord
                        delete this.coord_tiles[tile.coords.key];
                    }
                    else {
                        // or at least tiles
                        delete this.coord_tiles[tile.coords.key].tiles;
                    }
                }
            }

            // Decrement reference count up the tile pyramid
            for (let z = tile.coords.z - 1; z >= 0; z--) {
                let up = Tile.coordinateAtZoom(tile.coords, z);
                this.decTileCount(up);
            }
        }

        delete this.tiles[key];
        this.tileBuildStop(key);
    },

    // Remove a single tile
    removeTile(key) {
        log.trace(`tile unload for ${key}`);

        var tile = this.tiles[key];

        if (tile != null) {
            tile.destroy();
        }

        this.forgetTile(tile.key);
        this.scene.requestRedraw();
    },

    // Run a function on each tile
    forEachTile(func) {
        for (let t in this.tiles) {
            func(this.tiles[t]);
        }
    },

    // Remove tiles that pass a filter condition
    removeTiles(filter) {
        let remove_tiles = [];
        for (let t in this.tiles) {
            let tile = this.tiles[t];
            if (filter(tile)) {
                remove_tiles.push(t);
            }
        }
        for (let r=0; r < remove_tiles.length; r++) {
            let key = remove_tiles[r];
            this.removeTile(key);
        }
    },

    updateTilesForView({ tile_update = false } = {}) {
        // Find visible tiles and load new ones
        let prev_coords = Object.keys(this.visible_coords);
        this.visible_coords = {};
        let tile_coords = this.scene.findVisibleTileCoordinates();
        for (let coords of tile_coords) {
            this.queueCoordinate(coords);
            this.visible_coords[coords.key] = coords;
        }

        // Check if visible coords changed
        // TODO: move to a new view manager object
        let new_coords = Object.keys(this.visible_coords);
        let coords_changed = false;
        if (prev_coords.length !== new_coords.length) {
            coords_changed = true;
        }
        else {
            prev_coords.sort();
            new_coords.sort();
            if (!prev_coords.every((c, i) => new_coords[i] === c)) {
                coords_changed = true;
            }
        }

        // Only update when states have changed:
        //   - visible coordinates changed
        //   - individual tile build finished (or aborted)
        //   - hard reset of visible tiles (e.g. when reloading scene)
        if (coords_changed || tile_update || this.reset_visible_tiles) {
            this.reset_visible_tiles = false;

            this.forEachTile(tile => {
                this.updateVisibility(tile);
                tile.update(this.scene);
            });

            this.loadQueuedCoordinates();
            this.updateProxyTiles();
            this.scene.pruneTileCoordinatesForView(); // remove tiles too far outside of view
        }
    },

    getAncestorTile (coord, source, style_zoom) {
        // First check overzoomed tiles at same coordinate zoom
        if (style_zoom > source.max_zoom) {
            if (this.coord_tiles[coord.key] && this.coord_tiles[coord.key].tiles) {
                for (let z = style_zoom - 1; z >= source.max_zoom; z--) {
                    for (let ancestor of this.coord_tiles[coord.key].tiles) {
                        if (ancestor.style_zoom === z && ancestor.source.name === source.name) {
                            return ancestor;
                        }
                    }
                }
            }
        }

        // Check tiles at next zoom up
        let parent = Tile.coordinateAtZoom(coord, coord.z - 1);
        if (this.coord_tiles[parent.key] && this.coord_tiles[parent.key].tiles) {
            for (let ancestor of this.coord_tiles[parent.key].tiles) {
                if (ancestor.source.name === source.name) {
                    return ancestor; // found ancestor
                }
            }
        }
        // didn't find ancestor, try next level
        // TODO: max depth levels to check
        if (coord.z > 1) {
            return this.getAncestorTile(Tile.coordinateAtZoom(coord, coord.z - 1), source, style_zoom - 1);
        }
    },

    getDescendantTiles (coord, source, style_zoom, level = 1) {
        let descendants = [];

        // First check overzoomed tiles at same coordinate zoom
        if (style_zoom >= source.max_zoom) {
            if (this.coord_tiles[coord.key] && this.coord_tiles[coord.key].tiles) {
                let search_max_zoom = Math.max(Geo.default_view_max_zoom, style_zoom + this.max_proxy_descendant_depth);
                for (let z = style_zoom + 1; z <= search_max_zoom; z++) {
                    for (let descendant of this.coord_tiles[coord.key].tiles) {
                        if (descendant.style_zoom === z && descendant.source.name === source.name) {
                            descendants.push(descendant);
                            return descendants;
                        }
                    }
                }
            }
            return descendants;
        }

        // Check tiles at next zoom down
        if (this.coord_tiles[coord.key] && this.coord_tiles[coord.key].descendants > 0) {
            for (let child of Tile.childrenForCoordinate(coord)) {
                let found = false;
                if (this.coord_tiles[child.key] && this.coord_tiles[child.key].tiles) {
                    for (let descendant of this.coord_tiles[child.key].tiles) {
                        if (descendant.source.name === source.name) {
                            descendants.push(descendant);
                            found = true;
                            break; // found descendant, look for next
                        }
                    }
                }

                // didn't find child, try next level
                if (!found && level <= this.max_proxy_descendant_depth && child.z <= source.max_zoom) {
                    descendants.push(...this.getDescendantTiles(child, source, style_zoom + 1, level + 1));
                }
            }
        }

        return descendants;
    },

    updateProxyTiles () {
        if (this.scene.zoom_direction === 0) {
            return;
        }

        // Clear previous proxies
        this.forEachTile(tile => tile.proxy = false);

        let proxy = false;
        this.forEachTile(tile => {
            if (this.scene.zoom_direction === 1) {
                if (tile.visible && tile.loading && tile.coords.z > 0) {
                    let p = this.getAncestorTile(tile.coords, tile.source, tile.style_zoom);
                    if (p) {
                        proxy = true;
                        p.proxy = true;
                        p.visible = true;
                        p.update(this.scene);
                    }
                }
            }
            else if (this.scene.zoom_direction === -1) {
                if (tile.visible && tile.loading) {
                    let d = this.getDescendantTiles(tile.coords, tile.source, tile.style_zoom);
                    for (let t of d) {
                        proxy = true;
                        t.proxy = true;
                        t.visible = true;
                        t.update(this.scene);
                    }
                }
            }
        });

        if (!proxy) {
            this.scene.zoom_direction = 0;
        }
    },

    updateVisibility(tile) {
        if (tile.style_zoom !== this.scene.tile_zoom) {
            tile.visible = false;
            return;
        }

        if (this.visible_coords[tile.coords.key]) {
            tile.visible = true;
        }
        else {
            // brute force
            for (let key in this.visible_coords) {
                if (Tile.isChild(tile.coords, this.visible_coords[key])) {
                    tile.visible = true;
                    return;
                }
            }

            tile.visible = false;
        }
    },

    // Remove tiles that aren't visible, and flag remaining visible ones to be updated
    // (for loading, proxy, etc.)
    resetVisibleTiles () {
        this.removeTiles(tile => !tile.visible);
        this.reset_visible_tiles = true;
    },

    getRenderableTiles() {
        let tiles = [];
        for (let t in this.tiles) {
            let tile = this.tiles[t];
            if (tile.visible && tile.loaded) {
                tiles.push(tile);
            }
        }
        return tiles;
    },

    isLoadingVisibleTiles() {
        return Object.keys(this.tiles).some(k => this.tiles[k].visible && this.tiles[k].loading);
    },

    // Queue a tile for load
    queueCoordinate(coords) {
        this.queued_coords[this.queued_coords.length] = coords;
    },

    // Load all queued tiles
    loadQueuedCoordinates() {
        if (this.queued_coords.length === 0) {
            return;
        }

        // Sort queued tiles from center tile
        this.queued_coords.sort((a, b) => {
            let ad = Math.abs(this.scene.center_tile.x - a.x) + Math.abs(this.scene.center_tile.y - a.y);
            let bd = Math.abs(this.scene.center_tile.x - b.x) + Math.abs(this.scene.center_tile.y - b.y);
            return (bd > ad ? -1 : (bd === ad ? 0 : 1));
        });
        this.queued_coords.forEach(coords => this.loadCoordinate(coords));
        this.queued_coords = [];
    },

    // Load all tiles to cover a given logical tile coordinate
    loadCoordinate(coords) {
        // Skip if not at current scene zoom
        if (coords.z !== this.scene.center_tile.z) {
            return;
        }

        // Determine necessary tiles for each source
        for (let source of Utils.values(this.scene.sources)) {
            if (!source.tiled) {
                continue;
            }

            let key = Tile.key(coords, source, this.scene.tile_zoom);
            if (key && !this.hasTile(key)) {
                let tile = Tile.create({
                    source,
                    coords,
                    worker: this.scene.nextWorker(),
                    style_zoom: this.scene.styleZoom(coords.z) // TODO: replace?
                });

                this.keepTile(tile);
                this.buildTile(tile);
            }
        }
    },

    // Sort and build a list of tiles
    buildTiles(tiles) {
        Tile.sort(tiles).forEach(tile => this.buildTile(tile));
        this.checkBuildQueue();
    },

    buildTile(tile) {
        this.tileBuildStart(tile.key);
        this.updateVisibility(tile);
        tile.update(this.scene);
        tile.build(this.scene.generation)
            .then(message => this.buildTileCompleted(message))
            .catch(() => {
                this.forgetTile(tile.key);
                Tile.abortBuild(tile);
            });
    },

    // Called on main thread when a web worker completes processing for a single tile (initial load, or rebuild)
    buildTileCompleted({ tile }) {
        // Removed this tile during load?
        if (this.tiles[tile.key] == null) {
            log.trace(`discarded tile ${tile.key} in TileManager.buildTileCompleted because previously removed`);
            Tile.abortBuild(tile);
            this.updateTilesForView({ tile_update: true });
        }
        // Built with an outdated scene configuration?
        else if (tile.generation !== this.scene.generation) {
            log.debug(`discarded tile ${tile.key} in TileManager.buildTileCompleted because built with ` +
                `scene config gen ${tile.generation}, current ${this.scene.generation}`);
            this.forgetTile(tile.key);
            Tile.abortBuild(tile);
            this.updateTilesForView({ tile_update: true });
        }
        else {
            // Update tile with properties from worker
            if (this.tiles[tile.key]) {
                tile = this.tiles[tile.key].merge(tile);
            }

            this.updateTilesForView({ tile_update: true });
            tile.buildMeshes(this.scene.styles);
            this.scene.requestRedraw();
        }

        this.tileBuildStop(tile.key);
    },

    // Track tile build state
    tileBuildStart(key) {
        this.building_tiles = this.building_tiles || {};
        this.building_tiles[key] = true;
        log.trace(`tileBuildStart for ${key}: ${Object.keys(this.building_tiles).length}`);
    },

    tileBuildStop(key) {
        // Done building?
        if (this.building_tiles) {
            log.trace(`tileBuildStop for ${key}: ${Object.keys(this.building_tiles).length}`);
            delete this.building_tiles[key];
            this.checkBuildQueue();
        }
    },

    // Check status of tile building queue and notify scene when we're done
    checkBuildQueue() {
        if (!this.building_tiles || Object.keys(this.building_tiles).length === 0) {
            this.building_tiles = null;
            this.scene.tileManagerBuildDone();
        }
    },

    // Sum of a debug property across tiles
    getDebugSum(prop, filter) {
        var sum = 0;
        for (var t in this.tiles) {
            if (this.tiles[t].debug[prop] != null && (typeof filter !== 'function' || filter(this.tiles[t]) === true)) {
                sum += this.tiles[t].debug[prop];
            }
        }
        return sum;
    },

    // Average of a debug property across tiles
    getDebugAverage(prop, filter) {
        return this.getDebugSum(prop, filter) / Object.keys(this.tiles).length;
    }

};
