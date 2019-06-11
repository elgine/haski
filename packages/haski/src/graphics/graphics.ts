import { AABB2d } from '@maths/bounds';
import RenderObject from '../core/renderObject';
import { FillStyle } from './fillStyle';
import PathData from './pathData';
import Path from './path';
import StrokePathData from './strokePathData';
import FillPathData from './fillPathData';
import PathDrawingStyle, { defaultDrawingStyle } from './pathDrawingStyle';

export default class Graphics extends RenderObject {
    type = 'graphics';
    curveSampleRate: number = 5;
    strokeStyle: FillStyle = '#000';
    fillStyle: FillStyle = '';
    pathDrawingStyle: PathDrawingStyle = defaultDrawingStyle();

    protected _paths: Path[] = [];
    protected _curPath?: Path;
    protected _pathDatas: PathData[] = [];

    private _maxLineWidth: number = 1;

    setWorldMatrixDirty(v = true) {
        super.setWorldMatrixDirty(v);
        v && this._notifyPathDatasWorldVerticesDirty();
    }

    stroke(fillStyle?: FillStyle, pathDrawingStyle?: PathDrawingStyle) {
        if (fillStyle) this.strokeStyle = fillStyle;
        if (pathDrawingStyle) {
            this.pathDrawingStyle = pathDrawingStyle;
            this._maxLineWidth = Math.max(this.pathDrawingStyle.lineWidth, this._maxLineWidth);
        }
        if (!this._curPath) return this;
        this._pathDatas.push(new StrokePathData(this.worldMatrix, this._curPath.subPaths, this.strokeStyle, this.pathDrawingStyle));
        this.setLocalBoundsDirty(true);
        this.setRenderDirty(true);
        return this;
    }

    fill(fillStyle?: FillStyle, path?: Path) {
        if (fillStyle) this.fillStyle = fillStyle;
        path = path || this._curPath;
        if (!path) return path;
        this._pathDatas.push(new FillPathData(this.worldMatrix, path.subPaths, this.fillStyle));
        this.setLocalBoundsDirty(true);
        this.setRenderDirty(true);
        return this;
    }

    beginPath() {
        this._newPath();
        return this;
    }

    closePath() {
        if (this._curPath) {
            this._curPath.closePath();
        }
        return this;
    }

    moveTo(x: number, y: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.moveTo(x, y);
        return this;
    }

    lineTo(x: number, y: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.lineTo(x, y);
        return this;
    }

    quadraticCurveTo(cx: number, cy: number, x: number, y: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.quadraticCurveTo(cx, cy, x, y, this.curveSampleRate);
        return this;
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.bezierCurveTo(cx1, cy1, cx2, cy2, x, y, this.curveSampleRate);
        return this;
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.arcTo(x1, y1, x2, y2, radius, this.curveSampleRate);
        return this;
    }

    rect(x: number, y: number, width: number, height: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.rect(x, y, width, height);
        return this;
    }

    ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, sr: number, er: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.ellipse(cx, cy, rx, ry, rotation, sr, er, this.curveSampleRate);
        return this;
    }

    roundRect(x: number, y: number, width: number, height: number, radius: number[]) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.roundRect(x, y, width, height, radius, this.curveSampleRate);
        return this;
    }

    arc(cx: number, cy: number, radius: number, sr: number, er: number) {
        this._makesurePathExists();
        if (!this._curPath) return this;
        this._curPath.arc(cx, cy, radius, sr, er, this.curveSampleRate);
        return this;
    }

    clear() {
        this._pathDatas.length = 0;
        this._paths.length = 0;
        this._curPath = undefined;
        this.pathDrawingStyle = defaultDrawingStyle();
        this.strokeStyle = '#000';
        this.fillStyle = '#000';
        this._maxLineWidth = 1;
        return this;
    }

    protected _doComputeLocalBounds(target: AABB2d) {
        target.compose(this._pathDatas.reduce((va, pathData) => {
            return pathData.subPaths.reduce((va, subPath) => {
                Array.prototype.push.apply(va, subPath.vertices);
                return va;
            }, va);
        }, [] as Vec2d[])).padding(this._maxLineWidth);
    }

    protected _doComputeWorldBounds(local: AABB2d, target: AABB2d) {
        target.clone(local).padding(-this._maxLineWidth).transform(this.worldMatrix).padding(this._maxLineWidth);
    }

    private _newPath() {
        this._curPath = new Path();
        this._paths.push(this._curPath);
    }

    private _makesurePathExists() {
        if (!this._curPath) this._newPath();
    }

    private _notifyPathDatasWorldVerticesDirty() {
        this._pathDatas.forEach(pathData => pathData.setWorldVerticesDirty(true));
    }

    get paths() {
        return this._paths;
    }

    get pathDatas() {
        return this._pathDatas;
    }
}