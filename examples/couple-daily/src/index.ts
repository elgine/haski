import Stage from '@haski/core/stage';
import Sprite from '@haski/sprite/sprite';
import Renderer from '@haski/renderer/renderer';
import rendererFactory from '@haski/renderer/rendererFactory';

let stage = new Stage();
let renderer: Renderer;

window.onload = async function() {
    let rendererDetected = rendererFactory();
    if (!rendererDetected) {
        return;
    }
    renderer = rendererDetected;


};