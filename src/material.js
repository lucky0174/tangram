/*global Material */
import shaderSources from './gl/shader_sources'; // built-in shaders
import GLSL from './gl/glsl';
import {StyleParser} from './styles/style_parser';

export default class Material {
    constructor (config) {

        config = config || {};

        if (config.normal != null) {
            this.normalTexture = config.normal.texture;
            this.normalMapping = config.normal.mapping || 'triplanar';
            this.normalScale = GLSL.expandVec3(config.normal.scale != null ? config.normal.scale : 1);
            this.normalAmount = config.normal.amount != null ? config.normal.amount : 1;
        }

		if (config.emission != null) {
            if (config.emission.texture) {
    			this.emissionTexture = config.emission.texture;
    			this.emissionMapping = config.emission.mapping || 'spheremap';
    			this.emissionScale = GLSL.expandVec3(config.emission.scale != null ? config.emission.scale : 1);
    			this.emissionAmount = GLSL.expandVec4(config.emission.amount != null ? config.emission.amount : 1);
    		}
            else if (typeof config.emission === 'number') {
           		this.emission = GLSL.expandVec4(config.emission);
        	}
            else {
            	this.emission = StyleParser.parseColor(config.emission);
        	}
		}

        if (config.ambient != null) {
            if (config.ambient.texture) {
    			this.ambientTexture = config.ambient.texture;
    			this.ambientMapping = config.ambient.mapping || 'spheremap';
    			this.ambientScale = GLSL.expandVec3(config.ambient.scale != null ? config.ambient.scale : 1);
    			this.ambientAmount = GLSL.expandVec4(config.ambient.amount != null ? config.ambient.amount : 1);
            }
			else if (typeof config.ambient === 'number') {
            	this.ambient = GLSL.expandVec4(config.ambient);
        	}
            else {
            	this.ambient = StyleParser.parseColor(config.ambient);
        	}
		}

        if (config.diffuse != null) {
            if (config.diffuse.texture) {
    			this.diffuseTexture = config.diffuse.texture;
    			this.diffuseMapping = config.diffuse.mapping || 'spheremap';
    			this.diffuseScale = GLSL.expandVec3(config.diffuse.scale != null ? config.diffuse.scale : 1);
    			this.diffuseAmount = GLSL.expandVec4(config.diffuse.amount != null ? config.diffuse.amount : 1);
            }
            else if (typeof config.diffuse === 'number') {
            	this.diffuse = GLSL.expandVec4(config.diffuse);
        	}
            else {
            	this.diffuse = StyleParser.parseColor(config.diffuse);
        	}
		}

        if (config.specular != null) {
            if (config.specular.texture) {
    			this.specularTexture = config.specular.texture;
    			this.specularMapping = config.specular.mapping || 'spheremap';
    			this.specularScale = GLSL.expandVec3(config.specular.scale != null ? config.specular.scale : 1);
    			this.specularAmount = GLSL.expandVec4(config.specular.amount != null ? config.specular.amount : 1);
            }
            else if (typeof config.specular === 'number') {
            	this.specular = GLSL.expandVec4(config.specular);
        	}
            else {
            	this.specular = StyleParser.parseColor(config.specular);
        	}

            this.shininess = config.shininess ? parseFloat(config.shininess) : 0.2;
		}
    }

    // Determine if a material config block has sufficient properties to create a material
    static isValid (config) {
        if (config == null) {
            return false;
        }

        if (config.emission == null &&
            config.ambient == null &&
            config.diffuse == null &&
            config.specular == null) {
            return false;
        }

        return true;
    }

    inject (style) {

        if (this.normalTexture) {
            style.defines['TANGRAM_MATERIAL_NORMAL_TEXTURE'] = true;
            if (this.normalMapping === 'uv'){
                style.defines['TANGRAM_MATERIAL_NORMAL_TEXTURE_UV'] = true;
                style.texcoords = true;
            } else if (this.normalMapping === 'planar') {
                style.defines['TANGRAM_MATERIAL_NORMAL_TEXTURE_PLANAR'] = true;
            } else if (this.normalMapping === 'triplanar') {
                style.defines['TANGRAM_MATERIAL_NORMAL_TEXTURE_TRIPLANAR'] = true;
            }
        }

        style.defines['TANGRAM_MATERIAL_EMISSION'] = (this.emission != null) || (this.emissionTexture != null);
        if ( this.emissionTexture != null ) {
            style.defines['TANGRAM_MATERIAL_EMISSION_TEXTURE'] = true;
            if (this.emissionMapping === 'uv'){
                style.defines['TANGRAM_MATERIAL_EMISSION_TEXTURE_UV'] = true;
                style.texcoords = true;
            } else if (this.emissionMapping === 'planar') {
                style.defines['TANGRAM_MATERIAL_EMISSION_TEXTURE_PLANAR'] = true;
            } else if (this.emissionMapping === 'triplanar') {
                style.defines['TANGRAM_MATERIAL_EMISSION_TEXTURE_TRIPLANAR'] = true;
            } else if (this.emissionMapping === 'spheremap') {
                style.defines['TANGRAM_MATERIAL_EMISSION_TEXTURE_SPHEREMAP'] = true;
            }
        }

        style.defines['TANGRAM_MATERIAL_AMBIENT'] = (this.ambient != null) || (this.ambientTexture != null);
        if ( this.ambientTexture != null ) {
            style.defines['TANGRAM_MATERIAL_AMBIENT_TEXTURE'] = true;
            if (this.ambientMapping === 'uv'){
                style.defines['TANGRAM_MATERIAL_AMBIENT_TEXTURE_UV'] = true;
                style.texcoords = true;
            } else if (this.ambientMapping === 'planar') {
                style.defines['TANGRAM_MATERIAL_AMBIENT_TEXTURE_PLANAR'] = true;
            } else if (this.ambientMapping === 'triplanar') {
                style.defines['TANGRAM_MATERIAL_AMBIENT_TEXTURE_TRIPLANAR'] = true;
            } else if (this.ambientMapping === 'spheremap') {
                style.defines['TANGRAM_MATERIAL_AMBIENT_TEXTURE_SPHEREMAP'] = true;
            }
        }

        style.defines['TANGRAM_MATERIAL_DIFFUSE'] = (this.diffuse != null) || (this.diffuseTexture != null);
        if ( this.diffuseTexture != null ) {
            style.defines['TANGRAM_MATERIAL_DIFFUSE_TEXTURE'] = true;
            if (this.diffuseMapping === 'uv'){
                style.defines['TANGRAM_MATERIAL_DIFFUSE_TEXTURE_UV'] = true;
                style.texcoords = true;
            } else if (this.diffuseMapping === 'planar') {
                style.defines['TANGRAM_MATERIAL_DIFFUSE_TEXTURE_PLANAR'] = true;
            } else if (this.diffuseMapping === 'triplanar') {
                style.defines['TANGRAM_MATERIAL_DIFFUSE_TEXTURE_TRIPLANAR'] = true;
            } else if (this.diffuseMapping === 'spheremap') {
                style.defines['TANGRAM_MATERIAL_DIFFUSE_TEXTURE_SPHEREMAP'] = true;
            }
        }

        style.defines['TANGRAM_MATERIAL_SPECULAR'] = (this.specular != null) || (this.specularTexture != null);
        if ( this.specularTexture != null ) {
            style.defines['TANGRAM_MATERIAL_SPECULAR_TEXTURE'] = true;
            if (this.specularMapping === 'uv'){
                style.defines['TANGRAM_MATERIAL_SPECULAR_TEXTURE_UV'] = true;
                style.texcoords = true;
            } else if (this.specularMapping === 'planar') {
                style.defines['TANGRAM_MATERIAL_SPECULAR_TEXTURE_PLANAR'] = true;
            } else if (this.specularMapping === 'triplanar') {
                style.defines['TANGRAM_MATERIAL_SPECULAR_TEXTURE_TRIPLANAR'] = true;
            } else if (this.specularMapping === 'spheremap') {
                style.defines['TANGRAM_MATERIAL_SPECULAR_TEXTURE_SPHEREMAP'] = true;
            }
        }

        style.replaceShaderTransform(Material.transform, shaderSources['gl/shaders/material']);
    }

    setupProgram (_program) {

        if (this.normalTexture){
            _program.setTextureUniform('u_material_normal_texture', this.normalTexture);
            _program.uniform('3fv', 'u_material.normalScale', this.normalScale);
            _program.uniform('1f', 'u_material.normalAmount', this.normalAmount);
        }

        if (this.emissionTexture){
            _program.setTextureUniform('u_material_emission_texture', this.emissionTexture);
            _program.uniform('3fv', 'u_material.emissionScale', this.emissionScale);
            _program.uniform('4fv', 'u_material.emission', this.emissionAmount);
        } else if (this.emission) {
            _program.uniform('4fv', 'u_material.emission', this.emission);
        }

        if (this.ambientTexture){
            _program.setTextureUniform('u_material_ambient_texture', this.ambientTexture);
            _program.uniform('3fv', 'u_material.ambientScale', this.ambientScale);
            _program.uniform('4fv', 'u_material.ambient', this.ambientAmount);
        } else if (this.ambient) {
            _program.uniform('4fv', 'u_material.ambient', this.ambient);
        }

        if (this.diffuseTexture){
            _program.setTextureUniform('u_material_diffuse_texture', this.diffuseTexture);
            _program.uniform('3fv', 'u_material.diffuseScale', this.diffuseScale);
            _program.uniform('4fv', 'u_material.diffuse', this.diffuseAmount);
        } else if (this.diffuse) {
            _program.uniform('4fv', 'u_material.diffuse', this.diffuse);
        }

        if (this.specularTexture){
            _program.setTextureUniform('u_material_specular_texture', this.specularTexture);
            _program.uniform('3fv', 'u_material.specularScale', this.specularScale);
            _program.uniform('4fv', 'u_material.specular', this.specularAmount);
            _program.uniform('1f', 'u_material.shininess', this.shininess);
        } else if (this.specular) {
            _program.uniform('4fv', 'u_material.specular', this.specular);
            _program.uniform('1f', 'u_material.shininess', this.shininess);
        }
    }
}

Material.transform = 'material';
