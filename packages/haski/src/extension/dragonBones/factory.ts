// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import dragonBones from 'dragonBones';
import ArmatureDisplay from './armatureDisplay';
import Slot from './slot';
import TextureAtlasData, { TextureData } from './textureAtlasData';
import Texture from '../../core/texture';
import Sprite from '../../sprite/sprite';

export default class Factory extends dragonBones.BaseFactory {

    private static _dragonBonesInstance: dragonBones.DragonBones = null as any;
    private static _factory: Factory = null as any;

    private static _createDragonBones(): dragonBones.DragonBones {
        const eventManager = new ArmatureDisplay();
        const dragonBonesInstance = new dragonBones.DragonBones(eventManager);
        (dragonBonesInstance as any).tick = (passedTime: number) => {
            Factory._dragonBonesInstance.advanceTime(passedTime * 0.001);
        };

        return dragonBonesInstance;
    }

    public static get factory(): Factory {
        if (Factory._factory === null) {
            Factory._factory = new Factory();
        }
        return Factory._factory;
    }

    constructor(dataParser: dragonBones.DataParser | null = null) {
        super(dataParser);
        if (Factory._dragonBonesInstance === null) {
            Factory._dragonBonesInstance = Factory._createDragonBones();
        }
        this._dragonBones = Factory._dragonBonesInstance;
    }

    public buildArmatureDisplay(armatureName: string, dragonBonesName: string = '', skinName: string = '', textureAtlasName: string = ''): ArmatureDisplay | null {
        const armature = this.buildArmature(armatureName, dragonBonesName || '', skinName || '', textureAtlasName || '');
        if (armature !== null) {
            this._dragonBones.clock.add(armature);
            return armature.display as ArmatureDisplay;
        }
        return null;
    }

    public getTextureDisplay(textureName: string, textureAtlasName: string | null = null): Sprite | null {
        const textureData = this._getTextureData(textureAtlasName !== null ? textureAtlasName : '', textureName) as TextureData;
        if (textureData !== null) {
            const texture = (textureData.parent as TextureAtlasData).renderTexture;
            if (texture) {
                const bitmap = new Sprite(texture);
                bitmap.textureRegion.clone(textureData.region);
                return bitmap;
            }
        }

        return null;
    }

    public get soundEventManager(): ArmatureDisplay {
        return this._dragonBones.eventManager as ArmatureDisplay;
    }

    protected _isSupportMesh(): boolean {
        console.warn('Elgame can not support mesh.');
        return false;
    }

    protected _buildTextureAtlasData(textureAtlasData: TextureAtlasData | null, textureAtlas: Texture | null): TextureAtlasData {
        let t: TextureAtlasData;
        if (textureAtlasData) {
            t = textureAtlasData;
            t.renderTexture = textureAtlas;
        }
        else {
            t = dragonBones.BaseObject.borrowObject(TextureAtlasData);
        }
        return t;
    }

    protected _buildArmature(dataPackage: dragonBones.BuildArmaturePackage): dragonBones.Armature {
        const armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
        const armatureDisplay = new ArmatureDisplay();
        armature.init(
            dataPackage.armature,
            armatureDisplay, armatureDisplay, this._dragonBones
        );
        return armature;
    }

    protected _buildSlot(dataPackage: dragonBones.BuildArmaturePackage, slotData: dragonBones.SlotData, armature: dragonBones.Armature): Slot {
        // eslint-disable-next-line no-unused-expressions
        dataPackage;
        // eslint-disable-next-line no-unused-expressions
        armature;
        const slot = dragonBones.BaseObject.borrowObject(Slot);
        const rawDisplay = new Sprite();
        slot.init(
            slotData, armature,
            rawDisplay, rawDisplay
        );
        return slot;
    }
}