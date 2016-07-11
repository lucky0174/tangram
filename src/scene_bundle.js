import Utils from './utils/utils';
import JSZip from 'jszip';

export class SceneBundle {

    constructor(url, path) {
        this.url = url;
        this.path = path || Utils.pathForURL(this.url);
    }

    load() {
        return Utils.loadResource(this.url);
    }

    urlFor(url) {
        return Utils.addBaseURL(url, this.path);
    }

}

export class ZipSceneBundle extends SceneBundle {

    constructor(url, path) {
        super(url, path);
        this.zip = null;
        this.files = {};
        this.urls = {};
        this.root = null;
    }

    load() {
        this.zip = new JSZip();

        if (typeof this.url === 'string') {
            return Utils.io(this.url, 60000, 'arraybuffer')
                .then(body => this.zip.loadAsync(body))
                .then(() => this.parseZipFiles())
                .then(() => this.loadRoot())
                .catch(e => Promise.reject(e));
        } else {
            return Promise.resolve(this);
        }
    }

    urlFor(url) {
        if (Utils.isRelativeURL(url)) {
            return this.urlForZipFile(url);
        }
        return Utils.addBaseURL(url, this.path);
    }

    loadRoot() {
        return this.findRoot()
            .then(() => Utils.loadResource(this.urlForZipFile(this.root)));
    }

    findRoot() {
        // Must be a single YAML at top level of zip
        let bundle_yaml = this.url.split('/').pop().split('.zip').shift() + '.yaml';
        let root = Object.keys(this.files)
            .filter(path => this.files[path].depth === 0)
            .filter(path => Utils.extensionForURL(path) === 'yaml');

        if (root.length === 1) {
            this.root = root[0];
        }
        else if (root.length > 1) {
            // check for name of bundle w/YAML extension
            let index = root.indexOf(bundle_yaml);
            if (index > -1) {
                this.root = root[index];
            }
        }

        if (!this.root) {
            let msg = `Could not find root scene for bundle '${this.url}': `;
            msg += `there must be either a single scene YAML file at the root level of the zip archive, `;
            msg += `or a scene YAML file with the same name as the archive file, e.g. '${bundle_yaml}'. `;
            if (root.length > 0) {
                msg += `Found these YAML files at the root level: ${root.map(r => '\'' + r + '\'' )}.`;
            }
            else {
                msg += `Found NO YAML files at the root level.`;
            }
            return Promise.reject(Error(msg));
        }
        return Promise.resolve();
    }

    parseZipFiles() {
        let paths = [];
        let queue = [];
        this.zip.forEach((path, file) => {
            if (!file.dir) {
                paths.push(path);
                queue.push(file.async('arraybuffer'));
            }
        });

        return Promise.all(queue).then(data => {
            for (let i=0; i < data.length; i++) {
                let path = paths[i];
                let depth = path.split('/').length - 1;
                this.files[path] = { data: data[i], depth };
            }
        });
    }

    urlForZipFile(file) {
        if (this.files[file]) {
            if (!this.files[file].url) {
                this.files[file].url = Utils.createObjectURL(new Blob([this.files[file].data]));
            }

            return this.files[file].url;
        }
    }

}

export function createSceneBundle(url, path) {
    if (typeof url === 'string' && Utils.extensionForURL(url) === 'zip') {
        return new ZipSceneBundle(url, path);
    }
    return new SceneBundle(url, path);
}
