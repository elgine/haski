// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import dragonBones from 'dragonBones';
import Sprite from '../../sprite/sprite';
import ArmatureDisplay from './armatureDisplay';
import TextureAtlasData, { TextureData } from './textureAtlasData';

export default class Slot extends dragonBones.Slot {

    public static toString(): string {
        return '[class dragonBones.ElgameSlot]';
    }

    private _textureScale: number = 1;
    private _renderDisplay!: Sprite;

    /**
     * @internal
     */
    public _updateVisible(): void {
        this._renderDisplay.visible = this._parent.visible && this._visible;
    }

    protected _onClear() {
        super._onClear();
        this._textureScale = 1;
        this._renderDisplay = null as any;
    }

    protected _initDisplay(value: any, isRetain: boolean): void {
        // eslint-disable-next-line no-unused-expressions
        value;
        // eslint-disable-next-line no-unused-expressions
        isRetain;
    }

    protected _disposeDisplay(value: any, isRelease: boolean): void {
        // eslint-disable-next-line no-unused-expressions
        value;
        // eslint-disable-next-line no-unused-expressions
        isRelease;
    }

    protected _onUpdateDisplay(): void {
        this._renderDisplay = (this._display ? this._display : this._rawDisplay) as Sprite;
    }

    protected _addDisplay(): void {
        const container = this._armature.display as ArmatureDisplay;
        this._renderDisplay.name = this.name;
        container.addChild(this._renderDisplay);
    }

    protected _replaceDisplay(value: any): void {
        const container = this._armature.display as ArmatureDisplay;
        const prevDisplay = value as Sprite;
        container.addChild(this._renderDisplay);
        container.swapChildren(this._renderDisplay, prevDisplay);
        container.removeChild(prevDisplay);
        this._textureScale = 1.0;
    }

    protected _removeDisplay(): void {
        if (this._renderDisplay.parent) { this._renderDisplay.parent.removeChild(this._renderDisplay) }
    }

    protected _updateZOrder(): void {
        const container = this._armature.display as ArmatureDisplay;
        const index = container.getChildIndex(this._renderDisplay);
        if (index === this._zOrder) {
            return;
        }
        container.addChildAt(this._renderDisplay, this._zOrder);
    }

    protected _updateBlendMode(): void {
        // TODO
    }

    protected _updateColor(): void {
        const opacity = this._colorTransform.alphaMultiplier * this._globalAlpha;
        this._renderDisplay.opacity = opacity;
        this._renderDisplay.setTint([this._colorTransform.redMultiplier * 255, this._colorTransform.greenMultiplier * 255, this._colorTransform.blueMultiplier * 255, 1]);
    }

    protected _updateFrame(): void {
        let currentTextureData = this._textureData as (TextureData | null);

        if (this._displayIndex >= 0 && this._display !== null && currentTextureData !== null) {
            let currentTextureAtlasData = currentTextureData.parent as TextureAtlasData;

            if (this._armature.replacedTexture !== null) { // Update replaced texture atlas.
                if (this._armature._replaceTextureAtlasData === null) {
                    currentTextureAtlasData = dragonBones.BaseObject.borrowObject(TextureAtlasData);
                    currentTextureAtlasData.copyFrom(currentTextureData.parent);
                    currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
                    this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                }
                else {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData as TextureAtlasData;
                }
                currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name) as TextureData;
            }

            const renderTexture = currentTextureAtlasData.renderTexture;
            if (renderTexture !== null) {
                if (this._geometryData !== null) { // Mesh.
                    // TODO
                }
                else { // Normal texture.
                    this._textureScale = currentTextureData.parent.scale * this._armature._armatureData.scale;
                    const normalDisplay = this._renderDisplay as Sprite;
                    normalDisplay.texture = renderTexture;
                    normalDisplay.textureRegion.clone(currentTextureData.region);
                }
                this._visibleDirty = true;
                return;
            }
        }

        if (this._geometryData !== null) {
            // TODO
        }
        else {
            const normalDisplay = this._renderDisplay as Sprite;
            normalDisplay.tx = 0.0;
            normalDisplay.ty = 0.0;
            normalDisplay.visible = false;
        }
    }

    protected _updateMesh(): void {
        // TODO
    }

    protected _updateTransform(): void {
        this.updateGlobalTransform(); // Update transform.
        const gm = this.globalTransformMatrix;
        this._renderDisplay.setMatrix([gm.a, gm.c, gm.tx, gm.b, gm.d, gm.ty, 0, 0, 1]);
        this._renderDisplay.tx = gm.tx - (gm.a * this._pivotX + gm.c * this._pivotY);
        this._renderDisplay.ty = gm.ty - (gm.b * this._pivotX + gm.d * this._pivotY);
    }

    protected _identityTransform(): void {
        this._renderDisplay.tx = 0.0;
        this._renderDisplay.ty = 0.0;
        this._renderDisplay.r = 0.0;
        this._renderDisplay.skx = this._renderDisplay.sky = 0;
        this._renderDisplay.sx = 1.0;
        this._renderDisplay.sy = 1.0;
    }
}