// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Matrix2d from '@maths/matrix2d';
import Color from '@maths/color';
import ObjectRenderer from '../../objectRenderer';
import Graphics from '../../../graphics/graphics';
import CanvasRenderer from '../canvasRenderer';
import { PathDataType } from '../../../graphics/pathData';
import { isPattern, isGradient } from '../../../graphics/fillStyle';
import Pattern from '../../../graphics/pattern';
import { Gradient, isLinearGradient, LinearGradient, RadialGradient } from '../../../graphics/gradient';

export default class ShapeRenderer implements ObjectRenderer<Graphics> {

    public readonly name: string = 'shape';

    render(renderer: CanvasRenderer, graphics: Graphics) {
        const ctx = renderer.curCtx;
        graphics.pathDatas.forEach((path) => {
            let { fillStyle, type, subPaths } = path;
            ctx.beginPath();
            subPaths.forEach((path) => {
                path.vertices.forEach((v, i) => {
                    if (i === 0) {
                        ctx.moveTo(v[0], v[1]);
                    } else { ctx.lineTo(v[0], v[1]) }
                });
            });
            let canvasFillStyle: string | CanvasGradient | CanvasPattern = 'rgba(0, 0, 0, 0)';
            if (isPattern(fillStyle)) {
                fillStyle = fillStyle as Pattern;
                let canvasPattern = ctx.createPattern(fillStyle.texture.rawData, fillStyle.repeat || 'no-repeat');
                if (canvasPattern) {
                    if (fillStyle.matrix) { canvasPattern.setTransform(Matrix2d.toSVGMatrix(fillStyle.matrix, {})) }
                    canvasFillStyle = canvasPattern;
                }
            } else if (isGradient(fillStyle)) {
                let g = fillStyle as Gradient;
                let canvasGradient: CanvasGradient;
                let isLinear = isLinearGradient(g);
                if (isLinear) {
                    let lg = g as LinearGradient;
                    canvasGradient = ctx.createLinearGradient(lg.s[0], lg.s[1], lg.e[0], lg.e[1]);
                } else {
                    let rg = g as RadialGradient;
                    canvasGradient = ctx.createRadialGradient(
                        rg.sc[0], rg.sc[1], rg.sr,
                        rg.ec[0], rg.ec[1], rg.er
                    );
                }
                g.colors.forEach((c, i) => canvasGradient.addColorStop(g.stops[i], c));
                canvasFillStyle = canvasGradient;
            } else {
                canvasFillStyle = Color.toString(fillStyle as any);
            }
            if (type === PathDataType.FILL) {
                ctx.fillStyle = canvasFillStyle;
                ctx.fill();
            } else {
                let { lineWidth, lineCap, miterLimit, lineJoin } = path.drawingStyle;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = lineCap;
                ctx.lineJoin = lineJoin;
                ctx.miterLimit = miterLimit || 10;
                ctx.strokeStyle = canvasFillStyle;
                ctx.stroke();
            }
        });
    }
}