import Scene from '../src/scene';
import sampleScene from './fixtures/sample-scene';

/*
    Special web worker treatment:

    - Custom worker build to use the Babel runtime (since there seem to be issues w/multiple instances of the
      polyfill getting instantiated on each test run otherwise).
    - Stub the worker so that we only load it once, to avoid flooding connections (was causing disconnnect errors).
*/

let worker_url = '/tangram.test-worker.js';

function loadWorkerContent(url) {
    let xhr = new XMLHttpRequest(), response;

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            response = xhr.responseText;
        }
    };

    xhr.onerror = (error) => {
        throw error;
    };

    xhr.open('GET', url, false);
    xhr.send();
    return response;
}

let workerBody = loadWorkerContent(worker_url);

sinon.stub(Scene, 'loadWorkerUrl').returns(Promise.resolve(
    URL.createObjectURL(new Blob([workerBody], { type: 'application/javascript' }))
));

let container = document.createElement('div');
container.style.width = '250px';
container.style.height = '250px';
document.body.appendChild(container);

window.makeScene = function (options) {
    options = options || {};

    options.disableRenderLoop = options.disableRenderLoop || true;
    options.workerUrl = options.workerUrl || worker_url;
    options.container = options.container || container;

    return new Scene(
        sampleScene.config,
        options
    );

};
