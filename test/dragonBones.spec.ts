// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

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
let texUrl = 'dragonBones/demon/Demon_tex.png';
let dataUrl = 'dragonBones/demon/Demon_ske.json';
let atlasUrl = 'dragonBones/demon/Demon_tex.json';

let skeName = 'Demon';
let defaultAni = 'normalAttack';

let attack = 'normalAttack';

window.onload = async function() {

    let texture = await Texture.get(texUrl);
    let dataDB = await fetch(dataUrl).then(r => r.json());
    let atlasData = await fetch(atlasUrl).then(r => r.json());

    const factory = Factory.factory;
    factory.parseDragonBonesData(dataDB);
    factory.parseTextureAtlasData(atlasData, texture);

    let stage = new Stage();
    let rendererResult = rendererFactory({ type: RendererType.CANVAS, size: { width: 1920, height: 1080 }});
    if (!rendererResult) return;
    let renderer = rendererResult;
    document.body.appendChild(renderer.rawData);

    const armatureDisplay = factory.buildArmatureDisplay(skeName);
    if (armatureDisplay) {
        armatureDisplay.animation.play(attack, 0);
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