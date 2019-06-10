// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector2d from '@maths/vector2d';
import Graphics from '@maths/graphics';

export default class SubPath {

    public area: number = 0;
    private _vertices: Vec2d[] = [];
    private _last: Vec2d = [0, 0];

    closePath() {
        if (Vector2d.equals(this._last, this._vertices[0])) return;
        this._vertices.push([this._vertices[0][0], this._vertices[0][1]]);
    }

    moveTo(x: number, y: number) {
        this._vertices = [[x, y]];
        this._last[0] = x;
        this._last[1] = y;
    }

    lineTo(x: number, y: number) {
        this._vertices.push([x, y]);
        this._last[0] = x;
        this._last[1] = y;
    }

    quadraticCurveTo(cx: number, cy: number, x: number, y: number, curveSampleRate: number) {
        Graphics.quadraticCurveTo(this._last[0], this._last[1], cx, cy, x, y, curveSampleRate, this._vertices, this._last);
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number, curveSampleRate: number) {
        Graphics.bezierCurveTo(this._last[0], this._last[1], cx1, cy1, cx2, cy2, x, y, curveSampleRate, this._vertices, this._last);
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number, curveSampleRate: number) {
        Graphics.arcTo(this._last[0], this._last[1], x1, y1, x2, y2, radius, curveSampleRate, this._vertices, this._last);
    }

    ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, sr: number, er: number, curveSampleRate: number) {
        Graphics.ellipse(cx, cy, rx, ry, rotation, sr, er, curveSampleRate, this._vertices, this._last);
    }

    arc(cx: number, cy: number, radius: number, sr: number, er: number, curveSampleRate: number) {
        this.ellipse(cx, cy, radius, radius, 0, sr, er, curveSampleRate);
    }

    fromRect(x: number, y: number, width: number, height: number) {
        this._vertices.length = 0;
        Graphics.rect(x, y, width, height, this._vertices, true);
        this._last[0] = 0;
        this._last[1] = 0;
    }

    fromRoundRect(x: number, y: number, width: number, height: number, radius: number[], curveSampleRate: number) {
        this._vertices.length = 0;
        Graphics.roundRect(x, y, width, height, radius, curveSampleRate, this._vertices, true);
        this._last[0] = 0;
        this._last[1] = 0;
    }

    get vertices() {
        return this._vertices;
    }
}