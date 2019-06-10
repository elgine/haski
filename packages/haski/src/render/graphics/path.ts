// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import SubPath from './subPath';

export default class Path {

    private _subPaths: SubPath[] = [];
    private _curSubPath!: SubPath;

    closePath() {
        if (this._curSubPath) this._curSubPath.closePath();
    }

    moveTo(x: number, y: number) {
        this._newSubPath();
        this._curSubPath.moveTo(x, y);
    }

    lineTo(x: number, y: number) {
        this._makesureSubPathExists();
        this._curSubPath.lineTo(x, y);
    }

    quadraticCurveTo(cx: number, cy: number, x: number, y: number, curveSampleRate: number) {
        this._makesureSubPathExists();
        this._curSubPath.quadraticCurveTo(cx, cy, x, y, curveSampleRate);
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number, curveSampleRate: number) {
        this._makesureSubPathExists();
        this._curSubPath.bezierCurveTo(cx1, cy1, cx2, cy2, x, y, curveSampleRate);
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number, curveSampleRate: number) {
        this._makesureSubPathExists();
        this._curSubPath.arcTo(x1, y1, x2, y2, radius, curveSampleRate);
    }

    rect(x: number, y: number, width: number, height: number) {
        this._newSubPath();
        this._curSubPath.fromRect(x, y, width, height);
        delete this._curSubPath;
    }

    roundRect(x: number, y: number, width: number, height: number, radius: number[], curveSampleRate: number) {
        this._newSubPath();
        this._curSubPath.fromRoundRect(x, y, width, height, radius, curveSampleRate);
        delete this._curSubPath;
    }

    ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, sr: number, er: number, curveSampleRate: number) {
        this._makesureSubPathExists();
        this._curSubPath.ellipse(cx, cy, rx, ry, rotation, sr, er, curveSampleRate);
    }

    arc(cx: number, cy: number, radius: number, sr: number, er: number, curveSampleRate: number) {
        this._makesureSubPathExists();
        this._curSubPath.arc(cx, cy, radius, sr, er, curveSampleRate);
    }

    private _newSubPath() {
        this._curSubPath = new SubPath();
        this._subPaths.push(this._curSubPath);
    }

    private _makesureSubPathExists() {
        if (!this._curSubPath) this._newSubPath();
    }

    get subPaths() {
        return this._subPaths;
    }
}