import Stage from '@haski/core/stage';
import Ticker from '@core/ticker';
import CanvasRenderer from '@haski/renderer/canvas/canvasRenderer';
import GLRenderer from '@haski/renderer/webgl/glRenderer';
import ParticeleEmitter from '@haski/extension/particle/particleEmitter';
import ParticleCanvasRenderer from '@haski/extension/particle/renderer/canvas/particleEmitterRenderer';
import ParticleWebGLRenderer from '@haski/extension/particle/renderer/webgl/particleEmitterRenderer';

window.onload = function() {
    let stage = new Stage();
    let canvasRenderer = new CanvasRenderer();
    let glRenderer = new GLRenderer();
    canvasRenderer.addObjRenderer(new ParticleCanvasRenderer());
    glRenderer.addObjRenderer(new ParticleWebGLRenderer());

    let emitter = new ParticeleEmitter();
    emitter.set({
        duration: -1
    });
    emitter.tx = 200;
    emitter.ty = 200;
    emitter.run();
    stage.addChild(emitter);

    let ticker = new Ticker();
    ticker.cb = function() {
        emitter.tick(ticker.dt);
        canvasRenderer.renderStageToTarget(stage);
        glRenderer.renderStageToTarget(stage);
    };
};