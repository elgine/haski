// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import GLShaderDataType, {
    BOOL, UNSIGNED_BYTE, BYTE, UNSIGNED_SHORT, SHORT, UNSIGNED_INT, INT, FLOAT,
    INT_VEC2, INT_VEC3, INT_VEC4,
    FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, MAT2, MAT3, MAT4
} from './glShaderDataType';

export const setUniformValue = (gl: WebGLRenderingContext, location: WebGLUniformLocation, type: GLShaderDataType, value: any) => {
    if (type.unit === MAT2 || type.unit === MAT3 || type.unit === MAT4) {
        switch (type.unit) {
            case MAT2:
                gl.uniformMatrix2fv(location, false, value);
                break;
            case MAT3:
                gl.uniformMatrix3fv(location, false, value);
                break;
            case MAT4:
                gl.uniformMatrix4fv(location, false, value);
                break;
        }
    } else {
        switch (type.unit) {
            case FLOAT:
                type.array ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
                break;
            case BOOL:
            case UNSIGNED_BYTE:
            case BYTE:
            case UNSIGNED_SHORT:
            case SHORT:
            case UNSIGNED_INT:
            case INT:
                type.array ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
                break;
            case INT_VEC2:
                type.array ? gl.uniform2iv(location, value) : gl.uniform2i(location, value[0], value[1]);
                break;
            case INT_VEC3:
                type.array ? gl.uniform3iv(location, value) : gl.uniform3i(location, value[0], value[1], value[2]);
                break;
            case INT_VEC4:
                type.array ? gl.uniform4iv(location, value) : gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                break;
            case FLOAT_VEC2:
                type.array ? gl.uniform2fv(location, value) : gl.uniform2f(location, value[0], value[1]);
                break;
            case FLOAT_VEC3:
                type.array ? gl.uniform3fv(location, value) : gl.uniform3f(location, value[0], value[1], value[2]);
                break;
            case FLOAT_VEC4:
                type.array ? gl.uniform4fv(location, value) : gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;
        }
    }
};

export default class GLUniform {

    public readonly gl: WebGLRenderingContext;
    public readonly program: WebGLProgram;
    public readonly location: WebGLUniformLocation;
    public readonly name: string;
    public readonly type: GLShaderDataType;

    constructor(gl: WebGLRenderingContext, program: WebGLProgram, name: string, location: WebGLUniformLocation, type: GLShaderDataType, value?: any) {
        this.gl = gl;
        this.program = program;
        this.name = name;
        this.location = location;
        this.type = type;
    }

    set value(v: any) {
        setUniformValue(this.gl, this.location, this.type, v);
    }

    get value() {
        return this.gl.getUniform(this.program, this.location);
    }
}