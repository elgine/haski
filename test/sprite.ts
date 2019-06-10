import Stage from '@haski/base/stage';
import Sprite from '@haski/renderObject/sprite';
import Renderer from '@haski/render/renderer/canvas/canvasRenderer';
import Texture from '@haski/base/texture';

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};

window.onload = async function() {
    let image = await loadImage('textures/player/head.png');
    let stage = new Stage();
    let sprite = new Sprite();
    let renderer = new Renderer();
    sprite.texture = new Texture('head', image);
    stage.addChild(sprite);
    document.body.append(renderer.rawData);
    renderer.renderStageToTarget(stage);
};