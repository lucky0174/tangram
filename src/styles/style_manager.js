// Manage rendering styles

import Utils from '../utils/utils';
import ShaderProgram from '../gl/shader_program';
import shaderSources from '../gl/shader_sources'; // built-in shaders

import {Style} from './style';
import {Polygons} from './polygons/polygons';
import {Points} from './points/points';
import {Sprites} from './sprites/sprites';
import {TextStyle} from './text/text';

import log from 'loglevel';

export var StyleManager = {};
export var Styles = {};

// Set the base object used to instantiate styles
StyleManager.baseStyle = Style;

// Global configuration for all styles
StyleManager.init = function () {
    if (StyleManager.initialized) {
        return;
    }

    ShaderProgram.removeBlock('globals');

    // Layer re-ordering function
    ShaderProgram.addBlock('globals', shaderSources['gl/shaders/layer_order']);

    // Feature selection globals
    ShaderProgram.addBlock('globals', shaderSources['gl/shaders/selection_globals']);

    // Feature selection vertex shader support
    ShaderProgram.replaceBlock('feature-selection-vertex', shaderSources['gl/shaders/selection_vertex']);

    // assume min 16-bit depth buffer, in practice uses 14-bits, 1 extra bit to handle virtual half-layers
    // for outlines (inserted in between layers), another extra bit to prevent precision loss
    ShaderProgram.defines.TANGRAM_LAYER_DELTA = 1 / (1 << 14);

    StyleManager.initialized = true;
};

// Destroy all styles for a given GL context
StyleManager.destroy = function (gl) {
    Object.keys(Styles).forEach((_name) => {
        var style = Styles[_name];
        if (style.gl === gl) {
            log.trace(`StyleManager.destroy: destroying render style ${style.name}`);

            if (!style.isBuiltIn()) {
                StyleManager.remove(style.name);
            }
            style.destroy();
        }
    });
};

// Register a style
StyleManager.register = function (style) {
    Styles[style.name] = style;
};

// Remove a style
StyleManager.remove = function (name) {
    delete Styles[name];
};

// Preloads network resources in the stylesheet (shaders, textures, etc.)
StyleManager.preload = function (styles) {
    // First load remote styles, then load shader blocks from remote URLs
    return StyleManager.loadRemoteStyles(styles).then(StyleManager.loadShaderBlocks);
};

// Load style definitions from external URLs
StyleManager.loadRemoteStyles = function (styles) {
    // Collect URLs and modes to import from them
    // This is done as a separate step becuase it is possible to import multiple modes from a single
    // URL, and we want to avoid duplicate calls for the same file.
    var urls = {};
    for (var name in styles) {
        var style = styles[name];
        if (style.url) {
            if (!urls[style.url]) {
                urls[style.url] = [];
            }

            // Make a list of the styles to import for this URL
            urls[style.url].push({
                target_name: name,
                source_name: style.name || name
            });
        }
    }

    // As each URL finishes loading, replace the target style(s)
    return Promise.all(Object.keys(urls).map(url => {
        return new Promise((resolve, reject) => {
            Utils.loadResource(url).then((data) => {
                for (var target of urls[url]) {
                    if (data && data[target.source_name]) {
                        styles[target.target_name] = data[target.source_name];
                    }
                    else {
                        delete styles[target.target_name];
                        return reject(new Error(`StyleManager.preload: error importing style ${target.target_name}, could not find source style ${target.source_name} in ${url}`));
                    }
                }
                resolve();

                this.selection = false;
            }).catch((error) => {
                log.error(`StyleManager.preload: error importing style(s) ${JSON.stringify(urls[url])} from ${url}`, error);
            });
        });
    })).then(() => Promise.resolve(styles));
};

// Preload shader blocks from external URLs
StyleManager.loadShaderBlocks = function (styles) {
    var queue = [];
    for (var style of Utils.values(styles)) {
        if (style.shaders && style.shaders.blocks) {
            let _blocks = style.shaders.blocks;

            for (let [key, block] of Utils.entries(style.shaders.blocks)) {
                let _key = key;

                // Array of blocks
                if (Array.isArray(block)) {
                    for (let b=0; b < block.length; b++) {
                        if (typeof block[b] === 'object' && block[b].url) {
                            let _index = b;
                            queue.push(Utils.io(Utils.cacheBusterForUrl(block[b].url)).then((data) => {
                                _blocks[_key][_index] = data;
                            }).catch((error) => {
                                log.error(`StyleManager.loadShaderBlocks: error loading shader block`, _blocks, _key, _index, error);
                            }));
                        }
                    }
                }
                // Single block
                else if (typeof block === 'object' && block.url) {
                    queue.push(Utils.io(Utils.cacheBusterForUrl(block.url)).then((data) => {
                        _blocks[_key] = data;
                    }).catch((error) => {
                        log.error(`StyleManager.loadShaderBlocks: error loading shader block`, _blocks, _key, error);
                    }));
                }
            }
        }
    }
    return Promise.all(queue).then(() => Promise.resolve(styles)); // TODO: add error
};

StyleManager.mix = function (...sources) {
    let dest = {};

    // Flags - OR'd, true if any style has it set
    dest.animated = sources.some(x => x && x.animated);
    dest.texcoords = sources.some(x => x && x.texcoords);

    // Overwrites - last definition wins
    dest.base = sources.map(x => x.base).filter(x => x).pop();
    dest.texture = sources.map(x => x.texture).filter(x => x).pop();

    // Merges - property-specific rules for merging values
    dest.defines = Object.assign({}, ...sources.map(x => x.defines).filter(x => x));
    dest.material = Object.assign({}, ...sources.map(x => x.material).filter(x => x));

    let merge = sources.map(x => x.shaders).filter(x => x);
    let shaders = {};
    shaders.defines = Object.assign({}, ...merge.map(x => x.defines).filter(x => x));
    shaders.uniforms = Object.assign({}, ...merge.map(x => x.uniforms).filter(x => x));

    merge.map(x => x.blocks).filter(x => x).forEach(blocks => {
        shaders.blocks = shaders.blocks || {};

        for (let [t, block] of Utils.entries(blocks)) {
            shaders.blocks[t] = shaders.blocks[t] || [];

            if (Array.isArray(block)) {
                shaders.blocks[t].push(...block);
            }
            else {
                shaders.blocks[t].push(block);
            }
        }
    });

    dest.shaders = shaders;

    return dest;
};

// Create a new style
// name: name of new style
// config: properties of new style
// styles: working set of styles being built (used for mixing in existing styles)
StyleManager.create = function (name, config, styles) {
    let style = Object.assign({}, config); // shallow copy

    // Style mixins
    let mixes = [];
    if (style.mix) {
        if (Array.isArray(style.mix)) {
            mixes.push(...style.mix);
        }
        else {
            mixes.push(style.mix);
        }
        mixes = mixes.map(x => styles[x]).filter(x => x);
    }

    // Always call mix(), even if there are no other mixins, so that style properties are copied
    // (mix() does a deep copy, otherwise we get undesired shared references between styles)
    mixes.push(style);
    style = StyleManager.mix(...mixes);

    // Has base style? Instantiate
    if (style.base &&
        Styles[style.base] &&
        typeof Styles[style.base].isBuiltIn === 'function' &&
        Styles[style.base].isBuiltIn()) {
        style = Object.assign(Object.create(Styles[style.base]), style);
    }

    return style;
};

// Called to create and initialize styles
StyleManager.build = function (styles, scene = {}) {
    // Sort styles by dependency, then build them
    let style_deps = Object.keys(styles).sort(
        (a, b) => StyleManager.inheritanceDepth(a, styles) - StyleManager.inheritanceDepth(b, styles)
    );

    // Working set of styles being built, renderable styles will be saved below
    let ws = Object.assign({}, Styles);

    for (let sname of style_deps) {
        ws[sname] = StyleManager.create(sname, styles[sname], ws);

        // Only renderable (instantiated) styles should be included for run-time use
        // Others are intermediary/abstract, used during style composition but not execution
        if (typeof ws[sname].init === 'function') {
            Styles[sname] = ws[sname];
        }
    }

    StyleManager.initStyles(scene);
    return Styles;
};

// Initialize all styles
StyleManager.initStyles = function (scene) {
    // Initialize all
    for (let sname in Styles) {
        Styles[sname].init({ device_pixel_ratio: scene.device_pixel_ratio });
    }
};

// Given a style key in a set of styles to add, count the length of the inheritance chain
// TODO: remove current (Styles) and future (styles) duplication, confusing
StyleManager.inheritanceDepth = function (key, styles) {
    let parents = 0;

    while(true) {
        let style = styles[key];
        if (!style) {
            // this is a scene def error, trying to extend a style that doesn't exist
            // TODO: warn/throw?
            break;
        }

        // The end of the inheritance chain:
        // a built-in style that doesn't extend another built-in style
        if (!style.base && typeof style.isBuiltIn === 'function' && style.isBuiltIn()) {
            break;
        }

        // Traverse next parent style
        parents++;

        if (Array.isArray(style.mix)) {
            // If multiple parents (base + mixins), find the deepest parent
            parents += Math.max(...style.mix.map(s => StyleManager.inheritanceDepth(s, styles)));
            break;
        }
        // If single base parent, continue loop up the parent tree
        key = style.base;
    }
    return parents;
};

// Compile all styles
StyleManager.compile = function (keys) {
    keys = keys || Object.keys(Styles);
    for (let key of keys) {
        try {
            Styles[key].compile();
            log.trace(`StyleManager.compile(): compiled style ${key}`);
        }
        catch(error) {
            log.error(`StyleManager.compile(): error compiling style ${key}:`, error);
        }
    }

    log.debug(`StyleManager.compile(): compiled all styles`);
};

// Add built-in rendering styles
StyleManager.register(Polygons);
StyleManager.register(Points);
StyleManager.register(Sprites);
StyleManager.register(TextStyle);
