// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import dragonBones from 'dragonBones';
import Texture from '../../core/texture';

export class TextureData extends dragonBones.TextureData {
    public static toString(): string {
        return '[class dragonBones.ElgameTextureData]';
    }
}

export default class TextureAtlasData extends dragonBones.TextureAtlasData {

    public static toString(): string {
        return '[class dragonBones.ElgameTextureAtlasData]';
    }

    private _renderTexture: Texture|null = null;

    createTexture() {
        return dragonBones.BaseObject.borrowObject(TextureData);
    }

    protected _onClear() {
        super._onClear();
        this._renderTexture = null;
    }

    get renderTexture() {
        return this._renderTexture;
    }

    set renderTexture(v: Texture|null) {
        if (this._renderTexture === v) return;
        this._renderTexture = v;
    }
}