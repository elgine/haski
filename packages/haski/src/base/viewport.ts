import RenderObject from './renderObject';
import Matrix2d from '@maths/matrix2d';

export default class Viewport extends RenderObject {

    protected _doComputeWorldMatrix(innerMat: Mat2d, innerInvMat: Mat2d) {
        Matrix2d.reset(innerMat);
        if (this._parent) {
            Matrix2d.mul(innerMat, this._parent.worldMatrix);
        }
        Matrix2d.mul(innerMat, this.invMatrix);
        Matrix2d.invert(innerMat, innerInvMat);
    }
}