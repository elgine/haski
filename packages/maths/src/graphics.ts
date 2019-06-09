// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector2d from './vector2d';

export default class Graphics {

    private static _temp: Vec2d = [0, 0];
    private static _temp1: Vec2d = [0, 0];
    private static _temp2: Vec2d = [0, 0];
    private static _temp3: Vec2d = [0, 0];
    private static _temp4: Vec2d = [0, 0];
    private static _temp5: Vec2d = [0, 0];
    private static _centre: Vec2d = [0, 0];

    static quadraticCurveTo(lx: number, ly: number, cx: number, cy: number, x: number, y: number, curveSampleRate: number, out: Vec2d[], last?: Vec2d) {
        let samples = (Math.sqrt(Math.pow(cx - lx, 2) + Math.pow(cy - ly, 2)) +
            Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))) / curveSampleRate;
        samples = ~~samples;
        let step = 1 / samples;
        let oneMinusT: number;
        for (let i = step; i <= 1; i += step) {
            let vertice = [0, 0];
            oneMinusT = 1 - i;
            vertice[0] = oneMinusT * oneMinusT * lx + 2 * i * oneMinusT * cx + i * i * x;
            vertice[1] = oneMinusT * oneMinusT * ly + 2 * i * oneMinusT * cy + i * i * y;
            out.push(vertice);
        }
        if (last) {
            last[0] = x;
            last[1] = y;
        }
    }

    static bezierCurveTo(lx: number, ly: number, cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number, curveSampleRate: number, out: Vec2d[], last?: Vec2d) {
        let samples = (Math.sqrt(Math.pow(cx1 - lx, 2) + Math.pow(cy1 - ly, 2)) +
            Math.sqrt(Math.pow(cx2 - cx1, 2) + Math.pow(cy2 - cy1, 2)) +
            Math.sqrt(Math.pow(x - cx2, 2) + Math.pow(y - cy2, 2))) / curveSampleRate;
        samples = ~~samples;
        let step = 1 / samples;
        let oneMinusT: number;
        for (let i = 0; i <= 1; i += step) {
            oneMinusT = 1 - i;
            let vertice = [0, 0];
            vertice[0] = oneMinusT * oneMinusT * oneMinusT * lx + 3 * cx1 * i * oneMinusT * oneMinusT +
                3 * cx2 * i * i * oneMinusT + x * i * i * i;
            vertice[1] = oneMinusT * oneMinusT * oneMinusT * ly + 3 * cy1 * i * oneMinusT * oneMinusT +
                3 * cy2 * i * i * oneMinusT + y * i * i * i;
            out.push(vertice);
        }
        if (last) {
            last[0] = x;
            last[1] = y;
        }
    }

    static ellipsePerimeter(rx: number, ry: number) {
        return 2 * Math.PI * ry + 4 * (rx - ry);
    }

    static arcTo(lx: number, ly: number, x1: number, y1: number, x2: number, y2: number, radius: number, curveSampleRate: number, out: Vec2d[], last?: Vec2d) {
        Vector2d.set(lx - x1, ly - y1, this._temp4);
        Vector2d.set(x2 - x1, y2 - y1, this._temp5);
        let rad = Vector2d.rad1(this._temp4, this._temp5);
        let half = rad / 2;
        let d = Math.abs(radius / Math.sin(half));
        Vector2d.set(x1, y1, this._temp);
        Vector2d.add(Vector2d.mul(Vector2d.clone(this._temp4, this._temp1), Math.abs(radius / Math.tan(half)) / Vector2d.len(this._temp4)), this._temp);
        Vector2d.add(Vector2d.mul(Vector2d.clone(this._temp5, this._temp2), Math.abs(radius / Math.tan(half)) / Vector2d.len(this._temp5)), this._temp);
        Vector2d.add(Vector2d.mul(Vector2d.fromRadian(Vector2d.rad(this._temp4) + half, this._centre), d), this._temp);
        Vector2d.sub(Vector2d.clone(this._temp1, this._temp3), this._centre);
        let p1Rad = Vector2d.rad(this._temp3);
        let p2Rad = Vector2d.rad(Vector2d.sub(Vector2d.clone(this._temp2, this._temp3), this._centre));
        let samples = ~~((p2Rad - p1Rad) * radius / curveSampleRate) + 4;
        let perRad: number = (p2Rad - p1Rad) / (samples - 4);
        rad = p1Rad;
        for (let i = 1; i < samples; i++) {
            let vertice = [0, 0];
            out.push(vertice);
            if (i === 1) {
                vertice[0] = this._temp1[0];
                vertice[1] = this._temp1[1];
            } else if (i === samples - 2) {
                Vector2d.clone(this._temp2, vertice);
            } else if (i === samples - 1) {
                vertice[0] = x2;
                vertice[1] = y2;
            } else {
                vertice[0] = Math.cos(rad) + this._centre[0];
                vertice[1] = Math.sin(rad) + this._centre[1];
                rad += perRad;
            }
        }
        if (last) {
            last[0] = x2;
            last[1] = y2;
        }
    }

    static rect(x: number, y: number, width: number, height: number, out: Vec2d[], close?: boolean, last?: Vec2d) {
        out.push(
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height]
        );
        if (close) {
            out.push([x, y]);
        }
        if (last) {
            last[0] = x;
            last[1] = y + height;
        }
    }

    static roundRect(
        x: number, y: number,
        width: number, height: number,
        radius: number[], curveSampleRate: number, out: Vec2d[], close?: boolean, last?: Vec2d
    ) {
        const radiusLen = radius.length;
        if (radiusLen === 0) {
            this.rect(x, y, width, height, out);
            return;
        }
        let topLeftH = 0; let topLeftV = 0;
        let topRightH = 0; let topRightV = 0;
        let bottomLeftH = 0; let bottomLeftV = 0;
        let bottomRightH = 0; let
            bottomRightV = 0;
        if (radiusLen === 1) {
            topLeftH = topLeftV = topRightH = topRightV =
            bottomLeftH = bottomLeftV = bottomRightH = bottomRightV = radius[0];
        } else if (radiusLen === 2) {
            topLeftH = topLeftV = topRightH = topRightV = radius[0];
            bottomLeftH = bottomLeftV = bottomRightH = bottomRightV = radius[1];
        } else if (radiusLen === 4) {
            topLeftH = topLeftV = radius[0];
            topRightH = topRightV = radius[1];
            bottomLeftH = bottomLeftV = radius[2];
            bottomRightH = bottomRightV = radius[3];
        } else if (radiusLen === 5) {
            topLeftH = radius[0];
            topRightH = radius[1];
            bottomLeftH = radius[2];
            bottomRightH = radius[3];
            topLeftV = topRightV = bottomLeftV = bottomRightV = radius[4];
        } else if (radiusLen === 6) {
            topLeftH = radius[0];
            topRightH = radius[1];
            bottomLeftH = radius[2];
            bottomRightH = radius[3];
            topLeftV = topRightV = radius[4];
            bottomLeftV = bottomRightV = radius[5];
        } else if (radiusLen === 8) {
            topLeftH = radius[0];
            topRightH = radius[1];
            bottomLeftH = radius[2];
            bottomRightH = radius[3];
            topLeftV = radius[4];
            topRightV = radius[5];
            bottomLeftV = radius[6];
            bottomRightV = radius[7];
        }
        // top-left-radius
        let cx = x + topLeftH;
        let cy = y + topLeftV;
        let len = this.ellipsePerimeter(topLeftH, topLeftV) / 4;
        let samples = Math.max(1, len / curveSampleRate);
        if (len > 1) {
            this.ellipse(cx, cy, topLeftH, topLeftV, 0, Math.PI, Math.PI * 1.5, samples, out);
        } else {
            out.push([x, y]);
        }
        // top-right-radius
        cx = x + width - topRightH;
        cy = y + topRightV;
        len = this.ellipsePerimeter(topRightH, topRightV) / 4;
        samples = Math.max(1, len / curveSampleRate);
        if (len > 1) { this.ellipse(cx, cy, topRightH, topRightV, 0, Math.PI * 1.5, Math.PI * 2, samples, out) }
        else { out.push([x + width, y]) }
        // bottom-right-radius
        cx = x + width - bottomRightH;
        cy = y + height - bottomRightV;
        len = this.ellipsePerimeter(bottomRightH, bottomRightV) / 4;
        samples = Math.max(1, len / curveSampleRate);
        if (len > 1) { this.ellipse(cx, cy, bottomRightH, bottomRightV, 0, 0, Math.PI * 0.5, samples, out) }
        else { out.push([x + width, y + height]) }
        // bottom-left-radius
        cx = x + bottomLeftH;
        cy = y + height - bottomLeftV;
        len = this.ellipsePerimeter(bottomLeftH, bottomLeftV) / 4;
        samples = Math.max(1, len / curveSampleRate);
        if (len > 1) { this.ellipse(cx, cy, bottomLeftH, bottomLeftV, 0, Math.PI * 0.5, Math.PI, samples, out, last) }
        else {
            out.push([x, y + height]);
            if (last) {
                last[0] = x;
                last[1] = y + height;
            }
        }
        if (close) {
            out.push([out[0][0], out[0][1]]);
        }
    }

    static arc(cx: number, cy: number, radius: number, sr: number, er: number, curveSampleRate: number, out: Vec2d[], last?: Vec2d) {
        this.ellipse(cx, cy, radius, radius, 0, sr, er, curveSampleRate, out, last);
    }

    static ellipse(
        cx: number, cy: number,
        rx: number, ry: number, rotation: number,
        sr: number, er: number, curveSampleRate: number, out: Vec2d[], last?: Vec2d
    ) {
        curveSampleRate = curveSampleRate || 10;
        let samples = Math.floor(Math.max(rx, ry) * Math.abs((er - sr)) / curveSampleRate);
        let dr = (er - sr) / samples; let rx2 = rx * rx; let ry2 = ry * ry; let rx2ry2 = rx2 * ry2; let x = 0; let
            y = 0;
        for (let i = 1; i <= samples; i++) {
            let rad = sr + i * dr + rotation;
            if ((i === samples && rad !== er)) { rad = er }
            if (rad === 0 || rad === Math.PI * 2) {
                x = rx;
                y = 0;
            } else if (rad === Math.PI) {
                x = -rx;
                y = 0;
            } else if (rad === Math.PI * 0.5) {
                y = ry;
                x = 0;
            } else if (rad === Math.PI * 1.5) {
                y = -ry;
                x = 0;
            } else {
                let k = Math.tan(rad);
                x = Math.sqrt(rx2ry2 / (rx2 * k * k + ry2));
                y = Math.sqrt((rx2ry2 - ry2 * x * x) / rx2);
                // Region2
                if (rad > Math.PI * 0.5 && rad < Math.PI) {
                    x = -x;
                }
                // Region3
                else if (rad > Math.PI && rad < Math.PI * 1.5) {
                    x = -x;
                    y = -y;
                }
                // Region4
                else if (rad > Math.PI * 1.5 && rad < Math.PI * 2) {
                    y = -y;
                }
            }
            out.push([x + cx, y + cy]);
            if (i === samples && last) {
                last[0] = x + cx;
                last[1] = y + cy;
            }
        }
    }
}