import Ticker from '@core/ticker';
import Stage from '@haski/core/stage';
import Sprite from '@haski/sprite/sprite';
import Renderer from '@haski/renderer/renderer';
import rendererFactory from '@haski/renderer/rendererFactory';

let ticker = new Ticker();
let stage = new Stage();
let renderer: Renderer;

window.onload = async function() {
    let rendererDetected = rendererFactory();
    if (!rendererDetected) {
        return;
    }
    renderer = rendererDetected;
};