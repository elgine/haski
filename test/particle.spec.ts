import Stage from '@haski/core/stage';
import Ticker from '@core/ticker';
import CanvasRenderer from '@haski/renderer/canvas/canvasRenderer';
import GLRenderer from '@haski/renderer/webgl/glRenderer';
import ParticleEmitter from '@haski/extension/particle/particleEmitter';
import ParticleCanvasRenderer from '@haski/extension/particle/renderer/canvas/particleEmitterRenderer';
import ParticleWebGLRenderer from '@haski/extension/particle/renderer/webgl/particleEmitterRenderer';

window.onload = function() {
    let stage = new Stage();
    let canvasRenderer = new CanvasRenderer();
    let glRenderer = new GLRenderer();
    canvasRenderer.addObjRenderer(new ParticleCanvasRenderer());
    glRenderer.addObjRenderer(new ParticleWebGLRenderer());

    let spark = new ParticleEmitter();
    stage.addChild(spark);
    spark.set({
        position: [20, 20],
        rotation: [
            { time: 0, value: -Math.PI * 0.5, delta: Math.PI * 0.01 }
        ],
        speed: { value: 0.5, delta: 0.5 },

        tangentialAccel: [
            { time: 0, value: 0.01, delta: 0.01 }
        ],
        duration: -1
    });
    spark.tx = 200;
    spark.ty = 200;
    spark.run();

    let negative1 = new ParticleEmitter();
    negative1.compositionOperation = 'lighter';
    negative1.set({

    });
    stage.addChild(negative1);

    let negative2 = new ParticleEmitter();
    negative2.set({

    });
    stage.addChild(negative2);

    let yellow = new ParticleEmitter();
    stage.addChild(yellow);

    let orange = new ParticleEmitter();
    stage.addChild(orange);

    let red = new ParticleEmitter();
    stage.addChild(red);

    let white = new ParticleEmitter();
    stage.addChild(white);

    let ticker = new Ticker();
    ticker.cb = function() {
        spark.tick(ticker.dt);
        canvasRenderer.renderStageToTarget(stage);
        glRenderer.renderStageToTarget(stage);
    };
};