// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createCanvas } from './canvas';
import uuid from 'uuid/v4';
import nextPow2 from '@maths/nextPow2';

export interface TextureNode extends IAABB2d{
    path: string;
    right?: TextureNode;
    bottom?: TextureNode;
}

const split = (node: TextureNode, width: number, height: number) => {
    node.bottom = { path: 'undefined', x: node.x, y: node.y + height, width: node.width, height: node.height - height };
    node.right = { path: 'undefined', x: node.x + width, y: node.y, width: node.width - width, height: height };
    return node;
};

export default (textures: BaseTexture[]) => {
    let canvas = createCanvas();
    let subTextures: {[path: string]: TextureNode} = {};
    textures.sort((t1, t2) => Math.max(t2.rawData.width, t2.rawData.height) - Math.max(t1.rawData.width, t1.rawData.height)).map((texture) => {
        return packTexture(texture);
    });
    let root: TextureNode = {
        path: 'undefined',
        x: 0,
        y: 0,
        width: textures[0].rawData.width,
        height: textures[0].rawData.height
    };
    function packTexture(texture: BaseTexture) {
        if (subTextures[texture.path]) return subTextures[texture.path];
        if (!root) {
            root = {
                path: 'undefined',
                x: 0,
                y: 0,
                width: texture.rawData.width,
                height: texture.rawData.height
            };
        }
        let node = findNode(root, texture.rawData.width, texture.rawData.height);
        if (node) {
            split(node, texture.rawData.width, texture.rawData.height);
        } else {
            node = grow(texture.rawData.width, texture.rawData.height);
        }
        if (node) {
            node.path = texture.path;
            subTextures[texture.path] = node;
        }
        return node;
    }

    function findNodeByName(tid: string) {
        return subTextures[tid];
    }

    function findNode(node: TextureNode|undefined, w: number, h: number): TextureNode|undefined {
        if (!node) return undefined;
        if (node.path !== 'undefined') {
            return findNode(node.right, w, h) || findNode(node.bottom, w, h);
        } else if (w <= node.width && h <= node.height) {
            return node;
        }
        return undefined;
    }

    function renderTexture(texture: BaseTexture) {
        const node = findNodeByName(texture.path) || packTexture(texture);
        const drawingCtx = canvas.getContext('2d');
        if (!drawingCtx) {
            console.warn("Current browser doesn't support canvas 2d");
            return;
        }
        drawingCtx.save();
        drawingCtx.beginPath();
        drawingCtx.rect(node.x, node.y, node.width, node.height);
        drawingCtx.closePath();
        drawingCtx.clip();
        drawingCtx.drawImage(texture.rawData, node.x, node.y);
        drawingCtx.restore();
        return node;
    }

    function grow(w: number, h: number) {
        let canGrowDown = w <= root.width;
        let canGrowRight = h <= root.height;
        let shouldGrowRight = canGrowRight && (root.height >= (root.width + w));
        let shouldGrowDown = canGrowDown && (root.width >= (root.height + h));
        if (shouldGrowRight) {
            return growRight(w, h);
        } else if (shouldGrowDown) {
            return growDown(w, h);
        } else if (canGrowRight) {
            return growRight(w, h);
        } else if (canGrowDown) {
            return growDown(w, h);
        }
        return undefined;
    }

    function growDown(w: number, h: number) {
        root = {
            path: uuid(),
            x: 0,
            y: 0,
            width: root.width,
            height: root.height + h,
            bottom: { path: 'undefined', x: 0, y: root.height, width: root.width, height: h },
            right: root
        };
        let node = findNode(root, w, h);
        if (node)split(node, w, h);
        return node;
    }

    function growRight(w: number, h: number) {
        root = {
            path: uuid(),
            x: 0,
            y: 0,
            width: root.width + w,
            height: root.height + h,
            bottom: root,
            right: { path: 'undefined', x: root.width, y: 0, width: w, height: root.height }
        };
        let node = findNode(root, w, h);
        if (node)split(node, w, h);
        return node;
    }

    // Render textures

    const size = textures.reduce((info, texture) => {
        const node = findNodeByName(texture.path);
        info.width = Math.max(info.width, node.width + node.x);
        info.height = Math.max(info.height, node.height + node.y);
        return info;
    }, { width: 0, height: 0 });
    console.log(size);
    canvas.width = nextPow2(size.width);
    canvas.height = nextPow2(size.height);
    textures.forEach((texture) => renderTexture(texture));

    // Generate regions
    const regions: Dictionary<IAABB2d> = {};
    textures.forEach((t) => {
        const r = subTextures[t.path];
        regions[t.path] = {
            x: r.x,
            y: r.y,
            width: t.rawData.width,
            height: t.rawData.height
        };
    });
    return {
        regions,
        canvas
    };
};