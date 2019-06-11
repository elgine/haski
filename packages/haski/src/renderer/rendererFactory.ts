import RendererType from './rendererType';
import detectRenderer from './detectRenderer';
import { supportCanvas, supportWebGL } from '@utils/canvas';
import GLRenderer from './webgl/glRenderer';
import CanvasRenderer from './canvas/canvasRenderer';
import { RendererParams } from './renderer';

// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default (params?: RendererParams) => {
    let type: RendererType = (params && params.type !== undefined) ? params.type : RendererType.WEBGL;
    if (params === undefined || params.type === undefined)type = detectRenderer();
    if (supportWebGL() && type === RendererType.WEBGL) return new GLRenderer(params);
    else if (supportCanvas() && type === RendererType.CANVAS) return new CanvasRenderer(params);
    return null;
};