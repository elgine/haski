// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import GLShader from './glShader';

export default class GLShaderManager {

    public readonly gl: WebGLRenderingContext;
    private _shaderMap: Dictionary<GLShader> = {};
    private _curShader!: GLShader;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    createShader(name: string, vertexShaderSource: string, fragmentShaderSource: string) {
        let shader = new GLShader(this.gl, name);
        if (shader.initialize(vertexShaderSource, fragmentShaderSource)) {
            this.addShader(shader);
            return shader;
        }
        return null;
    }

    addShader(shader: GLShader) {
        this._shaderMap[shader.name] = shader;
    }

    switchShader(shader: string|GLShader) {
        if (typeof shader === 'string') { shader = this._shaderMap[shader] }
        if (!shader) return;
        if (this._curShader) {
            this._curShader.vao.flush();
        }
        this._curShader = shader;
        this._curShader.bind();
    }

    get curShader() {
        return this._curShader;
    }
}