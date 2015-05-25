import chai from 'chai';
let assert = chai.assert;
import Tile from '../src/tile';
import TileManager from '../src/tile_manager';

let nycLatLng = { lng: -73.97229909896852, lat: 40.76456761707639, zoom: 17 };

describe('Tile', function() {

    let subject,
        scene,
        coords = { x: 38603, y: 49255, z: 17 };

    beforeEach(() => {
        scene = makeScene({});
        sinon.stub(scene, 'findVisibleTiles').returns([]);
        scene.setView(nycLatLng);
        return scene.init().then(() => {
            subject = Tile.create({coords, worker: scene.nextWorker()});
        });
    });

    afterEach(() => {
        scene.destroy();
        scene   = null;
        subject = null;
    });

    describe('.constructor(spec)', () => {

        it('returns a new instance', () => {
            assert.instanceOf(subject, Tile);
        });

        it('overzooms a coordinate above the tile source max zoom', () => {
            let unzoomed_coords = { x: Math.floor(coords.x*2), y: Math.floor(coords.y*2), z: 18 };
            let overzoomed_coords = { x: Math.floor(coords.x/4), y: Math.floor(coords.y/4), z: 15 };

            let overzoom_tile = new Tile({
                max_zoom: 15,
                coords: unzoomed_coords
            });

            assert.deepEqual(overzoom_tile.coords, overzoomed_coords);
        });

    });

    describe('.create(spec)', () => {
        it('returns a new instance', () => {
            assert.instanceOf(Tile.create({tile_source: scene.tile_source, coords: { x: 10, y: 10, z: 10 }}), Tile);
        });
    });

    describe('.build(generation)', () => {
        beforeEach(() => {
            sinon.spy(subject, 'workerMessage');
        });

        afterEach(() => {
            subject.workerMessage.restore();
        });

        it('calls .workerMessage()', () => {
            subject.build();
            sinon.assert.called(subject.workerMessage);
        });
    });

    describe('sets visibility', () => {

        beforeEach(() => {
            scene.findVisibleTiles.restore();
            scene.tile_manager.visible_tiles = scene.findVisibleTiles();
        });

        describe('without a max_zoom', () => {

            it('is visible when scene is at same zoom as tile zoom', () => {
                TileManager.updateVisibility(subject);
                assert.isTrue(subject.visible);
            });

            it('is NOT visible when scene is lower than tile zoom', () => {
                scene.setZoom(16);
                TileManager.updateVisibility(subject);
                assert.isFalse(subject.visible);
            });

            it('is NOT visible when scene is higher than tile zoom', () => {
                scene.setZoom(18);
                TileManager.updateVisibility(subject);
                assert.isFalse(subject.visible);
            });

        });

        describe('with a max_zoom', () => {

            beforeEach(() => {
                subject.max_zoom = 17;
                scene.max_zoom = 17;
            });

            afterEach(() => {
                delete subject.max_zoom;
                delete scene.max_zoom;
            });

            it('is visible when scene is higher than tile zoom and tile is at its max zoom', () => {
                scene.setZoom(18);
                TileManager.updateVisibility(subject);
                assert.isTrue(subject.visible);
            });

            it('is NOT visible when scene is higher than tile zoom and tile is NOT at its max zoom', () => {
                subject.max_zoom = 16;
                scene.max_zoom = 16;
                scene.setZoom(18);
                TileManager.updateVisibility(subject);
                assert.isFalse(subject.visible);
            });

        });

    });
});
