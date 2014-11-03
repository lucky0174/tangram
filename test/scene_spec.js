import chai from 'chai';
let assert = chai.assert;
import Utils from '../src/utils';
import Scene from '../src/scene';
import Tile from '../src/tile';
import TileSource from '../src/tile_source';

import {makeScene} from './utils';
import sampleScene from './fixtures/sample-scene';

import samples from './fixtures/samples';
let nyc_bounds = samples.nyc_bounds;
let nycLatLng = [-73.97229909896852, 40.76456761707639];

describe('Scene', () => {

    describe('.constructor()', () => {
        it('returns a new instance', () => {
            let scene = new Scene();
            assert.instanceOf(scene, Scene);
            scene.destroy();
        });

        describe('when given sensible defaults', () => {
            let scene = makeScene({});
            it('returns a instance', () => {
                assert.instanceOf(scene, Scene);
                scene.destroy();
            });
        });
    });

    describe('.loadQueuedTiles()', () => {
        let subject;

        beforeEach((done) => {
            let coords = {x: 10, y: 10, z: 1},
                div    = document.createElement('div');

            subject = makeScene({});

            sinon.spy(subject, '_loadTile');

            subject.init(() => {
                subject.setBounds(nyc_bounds.south_west, nyc_bounds.north_east);
                subject.loadTile(coords, div, () => {});
                subject.loadQueuedTiles();
                done();
            });
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        it('calls _loadTile with the queued tile', () => {
            sinon.assert.calledOnce(subject._loadTile);
        });
    });

    describe('._loadTile(coords, div, cb)', () => {
        let subject,
            coord = {x: 10, y: 10, z: 2},
            div = document.createElement('div');

        beforeEach(() => {
            subject = makeScene({});
            subject.setBounds(nyc_bounds.south_west, nyc_bounds.north_east);
            sinon.stub(subject, 'workerPostMessageForTile');
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        describe('when the scene has not loaded the tile', () => {

            it('loads the tile', (done) => {
                subject._loadTile(coord, div, (er, div, tile) => {
                    assert.instanceOf(tile, Tile);
                    done();
                });
            });

            it('caches the result in the scene object', (done) => {
                subject._loadTile(coord, div, (er, div, tile) => {
                    let tiles = subject.tiles;
                    assert.instanceOf(tiles[tile.key], Tile);
                    done();
                });
            });
        });

        describe('when the scene already have the tile', () => {
            let key = '2621440/2621440/20';

            beforeEach(() => {
                subject.tiles[key] = {};
                sinon.spy(subject, 'cacheTile');
            });

            afterEach(() => {
                subject.cacheTile.restore();
                subject.tiles[key] = undefined;
            });

            it('calls back with the div', (done) => {
                subject._loadTile(coord, div, (error, div) => {
                    assert.isNull(error);
                    assert.instanceOf(div, HTMLElement);
                    done();
                });
            });
        });


    });

    describe('.create(options)', () => {
        let subject;

        beforeEach(() => {
            subject = makeScene({});

        });

        afterEach( () => {
            subject.destroy();
            subject = null;
        });

        it('returns a new instance', () => {
            assert.instanceOf(subject, Scene);
        });

        it('correctly sets the value of the tile source', () => {
            assert.instanceOf(subject.tile_source, TileSource);

        });

        it('correctly sets the value of the layers object', () => {
            assert.equal(subject.layers, sampleScene.layers);
        });

        it('correctly sets the value of the styles object', () => {
            assert.equal(subject.styles, sampleScene.styles);
        });


    });

    describe('.init(callback)', () => {

        describe('when the scene is not initialized', () => {
            let subject;
            beforeEach((done) => {
                subject = makeScene({});
                subject.init(done);

            });

            afterEach(() => {
                subject.destroy();
                subject = null;
            });

            it('calls back', (done) => {
                subject.init(() => {
                    assert.ok(true);
                    done();
                });
            });

            it('calls back', () => {
                assert.ok(true);
            });

            it('correctly sets the value of the tile source', () => {
                assert.equal(subject.tile_source, sampleScene.tileSource);
            });

            it('correctly sets the value of the layers object', () => {
                assert.equal(subject.layers, sampleScene.layers);
            });

            it('correctly sets the value of the styles object', () => {
                assert.equal(subject.styles, sampleScene.styles);
            });

            it('sets the initialized property', () => {
                assert.isTrue(subject.initialized);
            });

            it('sets the container property', () => {
                assert.instanceOf(subject.container, HTMLBodyElement);
            });

            it('sets the canvas property', () => {
                assert.instanceOf(subject.canvas, HTMLCanvasElement);
            });

            it('sets the gl property', () => {
                assert.instanceOf(subject.gl, WebGLRenderingContext);
            });
        });

        describe('when the scene is already initialized', () => {
            let subject;
            beforeEach(() => {
                subject = makeScene({});
            });

            afterEach(() => {
                subject.destroy();
                subject = null;
            });

            it('returns false', (done) => {
                subject.init(() => {
                    assert.isFalse(subject.init());
                    done();
                });
            });

        });
    });

    describe('.resizeMap()', () => {
        let subject;
        let height = 100;
        let width = 200;
        let devicePixelRatio = 2;
        let computedHeight = Math.round(height * devicePixelRatio);
        let computedWidth  = Math.round(width * devicePixelRatio);

        beforeEach((done) => {
            subject = makeScene({});
            subject.device_pixel_ratio = devicePixelRatio;
            subject.init(() => {
                sinon.spy(subject.gl, 'bindFramebuffer');
                sinon.spy(subject.gl, 'viewport');
                subject.resizeMap(width, height);
                done();
            });
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        it('marks the scene as dirty', () => {
            assert.isTrue(subject.dirty);
        });

        it('sets the device size property', () => {
            assert.deepEqual(subject.device_size, {
                height: computedHeight,
                width: computedWidth
            });
        });

        it('calls the gl.bindFrameBuffer method', () => {
            assert.ok(subject.gl.bindFramebuffer.called);
        });

        it('calls the gl.viewport method', () => {
            assert.ok(subject.gl.viewport);
        });

        describe('-canvas.style', () => {
            it('sets the height', () => {
                assert.equal(subject.canvas.style.height, height + 'px');
            });

            it('sets the width', () => {
                assert.equal(subject.canvas.style.width, width + 'px');
            });
        });

        describe('-canvas', () => {
            it('sets the height property', () => {
                assert.equal(subject.canvas.height, computedHeight);
            });

            it('sets the width property', () => {
                assert.equal(subject.canvas.width, computedWidth);
            });
        });


    });

    describe('.setCenter(lng, lat)', () => {
        let subject;
        let [lng, lat] = nycLatLng;

        beforeEach(() => {
            subject = makeScene({});
            subject.setCenter(...nycLatLng);
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        it('sets the center scene?', () => {
            assert.deepEqual(subject.center, {lng, lat});
        });

        it('marks the scene as dirty', () => {
            assert.isTrue(subject.dirty);
        });
    });

    describe('.startZoom()', () => {
        let subject;

        beforeEach(() => {
            subject = makeScene({});
            subject.startZoom();
        });

        afterEach(() => {
            subject.destroy();
            subject = undefined;
        });

        it('sets the last zoom property with the value of the current zoom', () => {
            assert.equal(subject.last_zoom, subject.zoom);
        });

        it('marks the scene as zooming', () => {
            assert.isTrue(subject.zooming);
        });
    });

    // TODO this method does a lot of stuff
    describe('.setZoom(zoom)', () => {
        let subject;
        beforeEach(() => {
            subject = makeScene({});
            sinon.spy(subject, 'removeTilesOutsideZoomRange');
            subject.setZoom(10);
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });
        it('calls the removeTilesOutsideZoomRange method', () =>  {
            assert.isTrue(subject.removeTilesOutsideZoomRange.called);
        });

        it('marks the scene as dirty', () => {
            assert.isTrue(subject.dirty);
        });
    });

    describe('.loadTile(tile)', () => {
        let subject;
        let tile = { coords: null, div: null, callback: () => {}};

        beforeEach(() => {
            subject = makeScene({}); subject.loadTile(tile);
        });
        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        it('appends the queued_tiles array', () => {
            assert.include(subject.queued_tiles[0], tile);
        });

    });

    describe('.render()', () => {
        let subject;

        beforeEach((done) => {
            subject = makeScene({});
            sinon.spy(subject, 'loadQueuedTiles');
            sinon.spy(subject, 'renderGL');
            subject.init(() => {
                subject.setCenter(...nycLatLng);
                done();
            });
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        it('calls the loadQueuedTiles method', () => {
            subject.render();
            assert.isTrue(subject.loadQueuedTiles.called);
        });

        describe('when the scene is not dirty', () => {
            it('returns false', () => {
                subject.dirty = false;
                assert.isFalse(subject.render());
            });
        });

        describe('when the scene is not initialized', () => {
            it('returns false', () => {
                subject.initialized = false;
                assert.isFalse(subject.render());
            });
        });

        describe('when the scene is dirty', () => {
            beforeEach(() => { subject.dirty = true; });
            it('calls the renderGL method', () => {
                subject.render();
                assert.isTrue(subject.renderGL.called);
            });
        });

        it('increments the frame property', () => {
            let old = subject.frame;
            subject.render();
            assert.operator(subject.frame, '>', old);
        });

        it('returns true', () => {
            assert.isTrue(subject.render());
        });

    });

    describe('.updateModes(callback)', () => {
        let subject;
        beforeEach((done) => {
            subject = makeScene({});
            subject.init(done);
        });

        afterEach(() => {
            subject.destroy();
            subject = undefined;
        });

        it('calls back', (done) => {
            subject.updateModes((error) => {
                assert.isNull(error);
                done();
            });
        });
    });

    describe('.rebuildGeometry(callback)', () => {
        let subject;
        beforeEach((done) => {
            subject = makeScene({});
            subject.setCenter(...nycLatLng);
            subject.init(done);
        });

        afterEach(() => {
            subject.destroy();
            subject = undefined;
        });

        it('calls back', (done) => {
            subject.rebuildGeometry((error) => {
                assert.isNull(error);
                done();
            });
        });
    });

    describe('.createWorkers(cb)', () => {
        let subject;
        beforeEach(() => {
            sinon.stub(Utils, 'xhr').callsArgWith(1, null, {}, '(function () { return this; })');
            subject = makeScene({num_workers: 2});
            sinon.spy(subject, 'makeWorkers');
            sinon.spy(subject, 'createObjectURL');
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
            Utils.xhr.restore();
        });

        it('calls the makeWorkers method', (done) => {
            subject.createWorkers(() => {
                sinon.assert.called(subject.makeWorkers);
                done();
            });
        });

        it('calls the xhr method', (done) => {
            subject.createWorkers(() => {
                sinon.assert.called(Utils.xhr);
                done();
            });
        });

        it('calls the createObjectUrl', (done) => {
            subject.createWorkers(() => {
                sinon.assert.called(subject.createObjectURL);
                done();
            });
        });
    });

    describe.skip('.makeWorkers(url)', () => {
        let subject;
        let numWorkers = 2;
        let url = 'test.js';
        beforeEach(() => {
            subject = makeScene({options: {numWorkers}});
            subject.makeWorkers(url);
        });

        afterEach(() => {
            subject.destroy();
            subject = null;
        });

        describe('when given a url', () => {

            it('creates the correct number of workers', () => {
                assert.equal(subject.workers.length, 2);
            });

            it('creates the correct type of workers', () => {
                assert.instanceOf(subject.workers[0], Worker);
            });
        });

    });

});
