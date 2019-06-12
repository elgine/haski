import CanvasRenderer from '@haski/renderer/canvas/canvasRenderer';
import GLRenderer from '@haski/renderer/webgl/glRenderer';
import Stage from '@haski/core/stage';
import Graphics from '@haski/graphics/graphics';
import Ticker from '@core/ticker';

window.onload = function() {
    let stage = new Stage();
    let graphics = new Graphics();
    graphics.rect(0, 0, 200, 200);
    graphics.fill('#ff0');
    graphics.translate(300);
    graphics.rotate(0.1);
    stage.addChild(graphics);

    let canvasRenderer = new CanvasRenderer();
    let glRenderer = new GLRenderer();

    let ticker = new Ticker();
    ticker.cb = () => {
        canvasRenderer.needRefresh = true;
        glRenderer.needRefresh = true;
        canvasRenderer.renderStageToTarget(stage);
        glRenderer.renderStageToTarget(stage);
    };

    document.body.appendChild(canvasRenderer.rawData);
    document.body.appendChild(glRenderer.rawData);

    ticker.run();
};