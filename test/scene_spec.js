import chai from 'chai';
let assert = chai.assert;
import Scene from '../src/scene';
import Utils from '../src/utils/utils';
import sampleScene from './fixtures/sample-scene';

let nycLatLng = { lng: -73.97229, lat: 40.76456, zoom: 17 };

describe('Scene', function () {

    let subject;

    beforeEach(() => {
        subject = makeScene({});
        sinon.stub(subject, 'findVisibleTileCoordinates').returns([]);
        subject.setView(nycLatLng);
    });

    afterEach(() => {
        subject.destroy();
        subject = null;
    });

    describe('.constructor()', () => {

        it('returns a new instance', () => {
            assert.instanceOf(subject, Scene);
        });

        it('correctly sets the value of the layers object', () => {
            assert.equal(subject.layer_source, sampleScene.layers);
        });

        it('correctly sets the value of the config object', () => {
            assert.equal(subject.config_source, sampleScene.config);
        });


    });

    describe('.load()', () => {

        describe('when the scene is not loaded', () => {

            beforeEach(() => {
                return subject.load();
            });

            it('correctly sets the value of the data source', () => {
                let source = subject.sources['osm'];
                assert.propertyVal(source, 'max_zoom', 18);
                assert.propertyVal(source, 'url', 'http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json');
            });

            it('sets the initialized property', () => {
                assert.isTrue(subject.initialized);
            });

            it('sets the container property', () => {
                assert.instanceOf(subject.container, HTMLDivElement);
            });

            it('sets the canvas property', () => {
                assert.instanceOf(subject.canvas, HTMLCanvasElement);
            });

            it('sets the gl property', () => {
                assert.instanceOf(subject.gl, WebGLRenderingContext);
            });

            it('compiles render styles', () => {
                assert.isTrue(subject.styles.rainbow.compiled);
                assert.ok(subject.styles.rainbow.program);
            });
        });

        describe('when the scene is already initialized', () => {

            it('handles second load() call', () => {
                return subject.load().then(() => {
                    return subject.load();
                });
            });

        });
    });

    describe('.resizeMap()', () => {
        let height = 100;
        let width = 200;
        let devicePixelRatio = 2;
        let computedHeight = Math.round(height * devicePixelRatio);
        let computedWidth  = Math.round(width * devicePixelRatio);

        beforeEach(() => {
            subject.device_pixel_ratio = devicePixelRatio;
            return subject.load().then(() => {
                sinon.spy(subject.gl, 'bindFramebuffer');
                sinon.spy(subject.gl, 'viewport');
                Utils.device_pixel_ratio = devicePixelRatio;
                subject.resizeMap(width, height);
            });
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

    describe('.setView(lng, lat)', () => {
        let {lng, lat, zoom} = nycLatLng;

        beforeEach(() => {
            subject.setView(nycLatLng);
        });

        it('sets the scene center', () => {
            assert.deepEqual(subject.center, {lng, lat});
        });

        it('sets the scene zoom', () => {
            assert.equal(subject.zoom, zoom);
        });

        it('marks the scene as dirty', () => {
            assert.isTrue(subject.dirty);
        });
    });

    describe('.startZoom()', () => {

        beforeEach(() => {
            subject.startZoom();
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

        beforeEach(() => {
            subject.setZoom(10);
        });

        it('marks the scene as dirty', () => {
            assert.isTrue(subject.dirty);
        });

        it('updates the zoom level', () => {
            assert.equal(subject.zoom, 10);
        });

    });

    describe('.update()', () => {

        beforeEach(() => {
            sinon.spy(subject, 'render');

            subject.setView(nycLatLng);
            return subject.load();
        });

        describe('when the scene is not dirty', () => {
            it('returns false', () => {
                subject.dirty = false;
                assert.isFalse(subject.update());
            });
        });

        describe('when the scene is not initialized', () => {
            it('returns false', () => {
                subject.initialized = false;
                assert.isFalse(subject.update());
            });
        });

        describe('when the scene is dirty', () => {
            beforeEach(() => { subject.dirty = true; });
            it('calls the render method', () => {
                subject.update();
                assert.isTrue(subject.render.called);
            });
        });

        it('increments the frame property', () => {
            let old = subject.frame;
            subject.update();
            assert.operator(subject.frame, '>', old);
        });

        it('returns true', () => {
            assert.isTrue(subject.update());
        });

    });

    describe('.updateStyles()', () => {

        beforeEach(() => {
            return subject.load();
        });

        describe('when a new style is added', () => {

            beforeEach(() => {
                subject.config.styles.elevator = {
                    "base": "polygons",
                    "animated": true,
                    "shaders": {
                        "blocks": {
                            "vertex": "position.z *= (sin(position.z + u_time) + 1.0); // elevator buildings"
                        }
                    }
                };
            });

            it('doesn\'t compile if the style isn\'t referenced by a style rule', () => {
                subject.updateStyles();
                assert.isFalse(subject.styles.elevator.compiled);
            });

            it('does compile if the style is referenced by a style rule', () => {
                subject.config.layers.buildings.draw.polygons.style = 'elevator';
                subject.updateStyles();
                assert.isTrue(subject.styles.elevator.compiled);
                assert.ok(subject.styles.elevator.program);
            });

        });

        it('adds properties to an existing style', () => {
            subject.config.styles.rainbow.shaders.uniforms = { u_test: 10 };
            subject.config.styles.rainbow.defines = subject.config.styles.rainbow.defines || {};
            subject.config.styles.rainbow.defines.TEST = true;
            subject.updateStyles();

            assert.ok(subject.styles.rainbow);
            assert.isTrue(subject.styles.rainbow.compiled);
            assert.ok(subject.styles.rainbow.program);
            assert.deepPropertyVal(subject, 'styles.rainbow.shaders.uniforms.u_test', 10);
            assert.deepPropertyVal(subject, 'styles.rainbow.defines.TEST', true);
        });
    });

});
