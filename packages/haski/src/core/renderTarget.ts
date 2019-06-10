// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createCanvas, getCanvasRenderingContext } from '@utils/canvas';
import Texture from './texture';
import uuid from 'uuid/v4';

export interface RenderTargetParams{
    el?: HTMLCanvasElement;
    size?: {width: number; height: number};
}

export default class RenderTarget extends Texture<HTMLCanvasElement> {

    public static readonly DEFAULT_WIDTH: number = 400;
    public static readonly DEFAULT_HEIGHT: number = 300;

    constructor(params: RenderTargetParams = {}) {
        super(uuid(), params.el || createCanvas());
        this.rawData.width = params.size ? params.size.width : RenderTarget.DEFAULT_WIDTH;
        this.rawData.height = params.size ? params.size.height : RenderTarget.DEFAULT_HEIGHT;
    }
}

const generateWhiteTexture = () => {
    let renderTarget = new RenderTarget();
    const ctx = getCanvasRenderingContext(renderTarget.rawData);
    let width = 256; let
        height = 256;
    renderTarget.rawData.width = width;
    renderTarget.rawData.height = height;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    return renderTarget;
};

export const WHITE = generateWhiteTexture();