// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import GLVertexAttrib from './glVertexAttrib';
import { MAT2, MAT3, MAT4 } from './glShaderDataType';

const getGLUnitTypeByteSize = (gl: WebGLRenderingContext, type: number) => {
    let byteSize = 4;
    switch (type) {
        case gl.BOOL:
        case gl.UNSIGNED_BYTE:
            byteSize = 1;
            break;
        case gl.UNSIGNED_SHORT:
        case gl.SHORT:
            byteSize = 2;
            break;
        case gl.FLOAT:
        case gl.INT:
        case gl.UNSIGNED_INT:
            byteSize = 4;
            break;
    }
    return byteSize;
};

const getGLLocationSize = (type: number) => {
    switch (type) {
        case MAT2: return 2;
        case MAT3: return 3;
        case MAT4: return 4;
        default: return 1;
    }
};

export default class GLVAO {

    public beforeDrawn?: Function;
    public onDrawn?: Function;
    public readonly maxUnit: number = 3000;
    public readonly gl: WebGLRenderingContext;
    private _attribs: GLVertexAttrib[] = [];
    private _vbo!: WebGLBuffer;
    private _ebo!: WebGLBuffer;
    private _vaoCtx?: OES_vertex_array_object;
    private _vao?: WebGLVertexArrayObjectOES;
    private _vertexBuffer!: Float32Array;
    private _indiceBuffer!: Uint16Array;
    private _useElement: boolean = false;

    private _unitSize: number = 0;
    private _stride: number = 0;

    private _vertexCount: number = 0;
    private _indiceCount: number = 0;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        let vaoCtx = gl.getExtension('OES_vertex_array_object');
        if (vaoCtx) {
            this._vaoCtx = vaoCtx;
        }
    }

    /**
     * Push unit data
     * @param vertexData
     * @param indices
     */
    push(vertexData: number[], indices?: number[], vertexDataCount?: number, indiceCount?: number) {
        vertexDataCount = vertexDataCount || vertexData.length;
        const vertexCount = vertexDataCount / this._unitSize;
        indiceCount = indices ? indices.length : 0;
        if (!(vertexCount > this.maxUnit || (this._useElement && indiceCount > this.maxUnit))) {
            if (vertexCount + this._vertexCount > this.maxUnit || (this._useElement && this._indiceCount + indiceCount > this.maxUnit)) {
                this.flush();
            }
            if (this._useElement) {
                if (indiceCount <= 0) return;
                if (indices) {
                    // for (let i = 0; i < indiceCount; i++) {
                    //     this._indiceBuffer[this._indiceCount + i] = indices[i] + this._vertexCount;
                    // }
                    this._indiceBuffer.set(indices.slice(0, indiceCount).map(v => v + this._vertexCount), this._indiceCount);
                    this._indiceCount += indiceCount;
                }
            }
            if (vertexCount <= 0) return;
            // for (let i = 0; i < vertexCount; i++) {
            //     for (let j = 0; j < this._unitSize; j++) {
            //         this._vertexBuffer[(this._vertexCount + i) * this._unitSize + j] = vertexData[i * this._unitSize + j];
            //     }
            // }
            this._vertexBuffer.set(vertexData.slice(0, vertexDataCount), this._vertexCount * this._unitSize);
            this._vertexCount += vertexCount;
        } else {
            if (indices) {
                for (let i = 0; i < indiceCount; i += 3) {
                    if (this._vertexCount + 3 > this.maxUnit || (this._useElement && this._indiceCount + 3 > this.maxUnit)) {
                        this.flush();
                    }
                    let is = indices.slice(i, i + 3);
                    is.forEach((id) => {
                        this._vertexBuffer.set(vertexData.slice(id * this._unitSize, this._unitSize * (id + 1)), this._vertexCount * this._unitSize);
                        this._vertexCount++;
                    });
                    this._indiceBuffer.set([this._indiceCount, this._indiceCount + 1, this._indiceCount + 2], this._indiceCount);
                    this._indiceCount += 3;
                }
            }
        }
    }

    initialize(attribs: GLVertexAttrib[], useElement?: boolean) {
        this._useElement = useElement || true;
        if (this._vaoCtx) {
            this._vao = this._vaoCtx.createVertexArrayOES() as WebGLVertexArrayObjectOES;
        }
        this._vbo = this.gl.createBuffer() as WebGLBuffer;
        if (this._useElement) {
            this._ebo = this.gl.createBuffer() as WebGLBuffer;
        }
        // Initialize vertex data layout
        this._attribs = attribs.slice();
        // Calculate stride, unitSize
        this._stride = 0;
        this._unitSize = 0;
        this._attribs.forEach((attrib) => {
            this._stride += attrib.size * getGLUnitTypeByteSize(this.gl, attrib.type);
            this._unitSize += attrib.size;
        });
        this._vertexBuffer = new Float32Array(this.maxUnit * this._unitSize);
        this._indiceBuffer = new Uint16Array(this.maxUnit);
    }

    commit(usage?: number) {
        this.bind();
        if (this._useElement) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ebo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this._indiceBuffer, usage || this.gl.STATIC_DRAW);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this._vertexBuffer, usage || this.gl.STATIC_DRAW);
        let offsetBytes = 0;
        this._attribs.forEach((attrib) => {
            let attribTypeByteSize = getGLUnitTypeByteSize(this.gl, attrib.unitType);
            let locationSize = getGLLocationSize(attrib.type);
            this.gl.vertexAttribPointer(attrib.location, attrib.size, attrib.unitType, false, this._stride, offsetBytes);
            this.gl.enableVertexAttribArray(attrib.location);
            offsetBytes += attrib.size * attribTypeByteSize * locationSize;
        });
    }

    draw(mode?: number, count?: number, offset?: number) {
        this.bind();
        this.beforeDrawn && this.beforeDrawn();
        if (this._useElement) {
            offset = offset || 0;
            count = count || (this._indiceCount - offset);
            this.gl.drawElements(mode || this.gl.TRIANGLES, count, this.gl.UNSIGNED_SHORT, offset);
        } else {
            offset = offset || 0;
            count = count || (this._vertexCount - offset);
            this.gl.drawArrays(mode || this.gl.TRIANGLES, offset, count);
        }
        this.onDrawn && this.onDrawn();
    }

    flush(usage?: number, mode?: number) {
        if ((this._vertexCount > 0 && !this._useElement) || (this._useElement && this._indiceCount > 0)) {
            this.commit(usage);
            this.draw(mode);
            this._vertexCount = 0;
            this._indiceCount = 0;
        }
    }

    bind() {
        if (this._vaoCtx && this._vao) {
            this._vaoCtx.bindVertexArrayOES(this._vao);
        } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ebo);
        }
    }

    unbind() {
        if (this._vaoCtx && this._vao) {
            this._vaoCtx.bindVertexArrayOES(null);
        } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    dispose() {
        if (this._vaoCtx && this._vao) {
            this._vaoCtx.deleteVertexArrayOES(this._vao);
        }
        this.gl.deleteBuffer(this._vbo);
        this.gl.deleteBuffer(this._ebo);
    }

    get verticeCount() {
        return this._vertexCount;
    }

    get indiceCount() {
        return this._indiceCount;
    }
}