// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Texture from '@haski/core/texture';
import Factory from '@haski/extension/dragonBones/factory';
import Ticker from '@core/ticker';
import Stage from '@haski/core/stage';
import rendererFactory from '@haski/renderer/rendererFactory';
import RendererType from '@haski/renderer/rendererType';

window.onload = async function() {

    let texture = await Texture.get('dragonBones/dragon_boy/Dragon_tex.png');
    let dataDB = await fetch('dragonBones/dragon_boy/Dragon_ske.json').then(r => r.json());
    let atlasData = await fetch('dragonBones/dragon_boy/Dragon_tex.json').then(r => r.json());

    const factory = Factory.factory;
    factory.parseDragonBonesData(dataDB);
    factory.parseTextureAtlasData(atlasData, texture);

    let stage = new Stage();
    let rendererResult = rendererFactory({ type: RendererType.WEBGL, size: { width: 1920, height: 1080 }});
    if (!rendererResult) return;
    let renderer = rendererResult;
    document.body.appendChild(renderer.rawData);

    const armatureDisplay = factory.buildArmatureDisplay('Dragon');
    if (armatureDisplay) {
        armatureDisplay.animation.play('walk');
        armatureDisplay.tx = 400;
        armatureDisplay.ty = 400;
        stage.addChild(armatureDisplay);
    }
    let ticker = new Ticker();
    ticker.cb = () => {
        renderer.needRefresh = true;
        renderer.renderStageToTarget(stage);
        if (armatureDisplay)factory.dragonBones.advanceTime(ticker.dt * 0.001);
    };

    ticker.run();
};