import Scene from '../src/scene';
import * as URLs from '../src/utils/urls';

/*
    Special web worker treatment:

    - Custom worker build to use the Babel runtime (since there seem to be issues w/multiple instances of the
      polyfill getting instantiated on each test run otherwise).
    - Stub the worker so that we only load it once, to avoid flooding connections (was causing disconnnect errors).
*/

let worker_url = '/tangram.debug.js';

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

sinon.stub(Scene.prototype, 'getWorkerUrl').returns(
    URL.createObjectURL(new Blob([workerBody], { type: 'application/javascript' }))
);

sinon.stub(URLs, 'revokeObjectURL').returns(null);

let container = document.createElement('div');
container.style.width = '250px';
container.style.height = '250px';
document.body.appendChild(container);

window.makeScene = function (options) {
    options = options || {};

    options.disableRenderLoop = options.disableRenderLoop || true;
    options.container = options.container || container;
    options.logLevel =  options.logLevel || 'info';

    return new Scene(
        options.config || 'http://localhost:9876/base/test/fixtures/sample-scene.yaml',
        options
    );

};
