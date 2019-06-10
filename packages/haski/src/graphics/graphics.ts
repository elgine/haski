// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Path from './path';
import { FillStyle } from '../core/fillStyle';
import GraphicsData from './graphicsData';

export default class Graphics {

    public readonly graphicsData: GraphicsData;

    /**
     * Pixels sample-rate in curve
     */
    public curveSampleRate: number = 5;

    private _lineWidth: number = 1;

    private _miterLimit: number = 10;

    /**
     * Line cap style
     */
    private _lineCap: CanvasLineCap = 'butt';

    /**
     * line join style
     */
    private _lineJoin: CanvasLineJoin = 'miter';

    /**
     * Stroke style
     */
    private _strokeStyle: FillStyle = '#000';

    /**
     * Fill style
     */
    private _fillStyle: FillStyle = '#000';

    private _paths: Path[] = [];
    private _curPath?: Path;

    constructor(graphicsData: GraphicsData) {
        this.graphicsData = graphicsData;
    }

    beginPath() {
        this._newPath();
    }

    stroke(strokeStyle?: FillStyle, lineWidth?: number, lineCap?: CanvasLineCap, lineJoin?: CanvasLineJoin, miterLimit?: number, dash?: number[]) {
        this._strokeStyle = strokeStyle || this._strokeStyle;
        this._lineWidth = lineWidth || this._lineWidth;
        this._lineCap = lineCap || this._lineCap;
        this._lineJoin = lineJoin || this._lineJoin;
        this._miterLimit = miterLimit || this._miterLimit;
        if (!this._curPath) return;
        if (this._lineWidth > 0) { this.graphicsData.stroke(this._curPath, this._strokeStyle, {
            lineWidth: this._lineWidth,
            lineCap: this._lineCap,
            lineJoin: this._lineJoin,
            miterLimit: this._miterLimit
        }); }
    }

    fill(fillStyle?: FillStyle, path?: Path) {
        this._fillStyle = fillStyle || this._fillStyle;
        path = path || this._curPath;
        if (!path) return;
        this.graphicsData.fill(path, this._fillStyle);
    }

    closePath() {
        if (this._curPath) {
            this._curPath.closePath();
        }
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
        this.graphicsData.clear();
        this._paths.length = 0;
        this._curPath = undefined;
    }

    private _newPath() {
        this._curPath = new Path();
        this._paths.push(this._curPath);
    }

    private _makesurePathExists() {
        if (!this._curPath) this._newPath();
    }

    get paths() {
        return this._paths;
    }
}