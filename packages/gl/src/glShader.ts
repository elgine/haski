// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import GLUniform from './glUniform';
import GLVertexAttrib from './glVertexAttrib';
import GLVAO from './glVAO';
import { FLOAT, BOOL, UNSIGNED_SHORT, UNSIGNED_INT, BYTE, UNSIGNED_BYTE, SHORT, INT, INT_VEC2, INT_VEC3, INT_VEC4, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, MAT2, MAT3, MAT4 } from './glShaderDataType';

const shaderTypeToGLUnitType = (str: string) => {
    let type: number = FLOAT;
    switch (str) {
        case 'bool': type = BOOL; break;
        case 'char': type = BYTE; break;
        case 'uchar': type = UNSIGNED_BYTE; break;
        case 'float': type = FLOAT; break;
        case 'ushort':
        case 'sampler2D': type = UNSIGNED_SHORT; break;
        case 'short': type = SHORT; break;
        case 'uint': type = UNSIGNED_INT; break;
        case 'int': type = INT; break;
        case 'ivec2': type = INT_VEC2; break;
        case 'ivec3': type = INT_VEC3; break;
        case 'ivec4': type = INT_VEC4; break;
        case 'vec2': type = FLOAT_VEC2; break;
        case 'vec3': type = FLOAT_VEC3; break;
        case 'vec4': type = FLOAT_VEC4; break;
        case 'mat2': type = MAT2; break;
        case 'mat3': type = MAT3; break;
        case 'mat4': type = MAT4; break;
    }
    return type;
};

const getGLType = (gl: WebGLRenderingContext, type: number) => {
    type = gl.FLOAT;
    switch (type) {
        case FLOAT:
        case FLOAT_VEC2:
        case FLOAT_VEC3:
        case FLOAT_VEC4:
        case MAT2:
        case MAT3:
        case MAT4:
            type = gl.FLOAT;
            break;
        case UNSIGNED_INT:
            type = gl.UNSIGNED_INT;
            break;
        case UNSIGNED_BYTE:
            type = gl.UNSIGNED_BYTE;
            break;
        case BYTE:
            type = gl.BYTE;
            break;
        case SHORT:
            type = gl.SHORT;
            break;
        case UNSIGNED_SHORT:
            type = gl.UNSIGNED_SHORT;
            break;
        case BOOL:
            type = gl.BOOL;
            break;
        case INT:
        case INT_VEC2:
        case INT_VEC3:
        case INT_VEC4:
            type = gl.INT;
            break;
    }
    return type;
};

const getGLTypeSize = (type: number) => {
    let size = 1;
    switch (type) {
        case BOOL:
        case FLOAT:
        case UNSIGNED_INT:
        case UNSIGNED_SHORT:
            size = 1;
            break;
        case INT_VEC2:
        case FLOAT_VEC2:
        case MAT2:
            size = 2;
            break;
        case INT_VEC3:
        case FLOAT_VEC3:
        case MAT3:
            size = 3;
            break;
        case INT_VEC4:
        case FLOAT_VEC4:
        case MAT4:
            size = 4;
            break;
    }
    return size;
};

/**
 * Shader program wrapper
 */
export default class GLShader {

    public readonly name: string;
    public readonly gl: WebGLRenderingContext;
    private _vertexShaderSource!: string;
    private _fragmentShaderSource!: string;

    private _nativeProgram!: WebGLProgram;
    private _nativeVertexShader!: WebGLShader;
    private _nativeFragmentShader!: WebGLShader;

    private _uniformMap: Dictionary<GLUniform> = {};
    private _vao!: GLVAO;

    constructor(gl: WebGLRenderingContext, name: string) {
        this.gl = gl;
        this.name = name;
        this._vao = new GLVAO(this.gl);
    }

    bind() {
        this.gl.useProgram(this._nativeProgram);
    }

    initialize(vertexSource: string, fragmentSource: string) {
        this._vertexShaderSource = vertexSource;
        this._fragmentShaderSource = fragmentSource;
        let ret = this._initNativeShader();
        if (!ret) return ret;
        this._parseAttribAndUniformVariables();
        return true;
    }

    dispose() {
        this._vao.dispose();
        this.gl.deleteProgram(this._nativeProgram);
        this.gl.deleteShader(this._nativeVertexShader);
        this.gl.deleteShader(this._nativeFragmentShader);
        this._uniformMap = {};
    }

    private _initNativeShader() {
        const gl = this.gl;
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) throw new Error('Some error occurs when create shader');
        gl.shaderSource(vertexShader, this._vertexShaderSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            let message = gl.getShaderInfoLog(vertexShader);
            console.error(message);
            gl.deleteShader(vertexShader);
            return false;
        }
        gl.shaderSource(fragmentShader, this._fragmentShaderSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            let message = gl.getShaderInfoLog(fragmentShader);
            console.error(message);
            gl.deleteShader(fragmentShader);
            return false;
        }
        let program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            let message = gl.getProgramInfoLog(program);
            console.error(message);
            gl.deleteProgram(program);
            return false;
        }
        this._nativeProgram = program;
        this._nativeVertexShader = vertexShader;
        this._nativeFragmentShader = fragmentShader;
        return true;
    }

    private _parseAttribAndUniformVariables() {
        let attribs = this._vertexShaderSource.match(/(attribute\s+\w+\s+\w+(\[[0-9]+\])?)/g);
        let uniformVertex = this._vertexShaderSource.match(/(uniform\s+\w+\s+\w+(\[[0-9]+\])?)/g);
        let uniformFragment = this._fragmentShaderSource.match(/(uniform\s+\w+\s+\w+(\[[0-9]+\])?)/g);
        let uniforms: string[] = [];
        if (uniformVertex) {
            uniforms = uniforms.concat(uniformVertex);
        }
        if (uniformFragment) {
            uniforms = uniforms.concat(uniformFragment);
        }
        let attributes: GLVertexAttrib[] = [];
        let name: string; let typeStr: string; let type: number; let
            array = false;
        if (attribs) {
            attribs.forEach((attrib) => {
                name = attrib.replace(/(attribute\s+\w+\s+)|\\n|(\[[0-9]+\])/g, '');
                typeStr = attrib.replace(name, '').replace(/(attribute)|\s|(\[[0-9]+\])/g, '');
                type = shaderTypeToGLUnitType(typeStr);
                attributes.push({
                    location: this.gl.getAttribLocation(this._nativeProgram, name),
                    name,
                    unitType: getGLType(this.gl, type),
                    type,
                    size: getGLTypeSize(type)
                });
            });
        }
        // Initialize vao
        this._vao.initialize(attributes);
        uniforms.forEach((uniform) => {
            name = uniform.replace(/(uniform\s+\w+\s+)|\s|(\[[0-9]+\])/g, '');
            array = /(\[[0-9]+\])/g.test(uniform);
            typeStr = uniform.replace(name, '').replace(/(uniform)|\s|\[[0-9]*\]/g, '');
            let uniformLoc = this.gl.getUniformLocation(this._nativeProgram, name);
            if (uniformLoc) {
                this._uniformMap[name] = new GLUniform(this.gl, this._nativeProgram, name, uniformLoc, { unit: shaderTypeToGLUnitType(typeStr), array });
            }
        });
    }

    get vao() {
        return this._vao;
    }

    get uniforms() {
        return this._uniformMap;
    }
}