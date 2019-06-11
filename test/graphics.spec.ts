/* eslint-disable no-undef */
import assert from 'assert';
import Stage from '@haski/core/stage';
import Graphics from '@haski/graphics/graphics';
import CanvasRenderer from '@haski/renderer/canvas/canvasRenderer';
import GLRenderer from '@haski/renderer/webgl/glRenderer';

let stage = new Stage();

window.onload = function() {
    let canvasRenderer = new CanvasRenderer();
    let glRenderer = new GLRenderer();

    const isEquals = () => {
        const ctx = canvasRenderer.curCtx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const canvasImageData = ctx.getImageData(0, 0, width, height);
        // Draw to canvas surface
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(glRenderer.rawData, 0, 0);

        const glImageData = ctx.getImageData(0, 0, width, height);

        for (let i = 0, count = width * height * 4; i < count; i++) {
            if (canvasImageData.data[i] !== glImageData[i]) {
                return false;
            }
        }
        return true;
    };

    describe('graphics', () => {
        describe('#fill-rect', () => {
            it('Each pixels should be equal', () => {
                let g = new Graphics();
                g.rect(0, 0, 100, 100);
                g.fill();
                stage.addChild(g);
                canvasRenderer.renderStageToTarget(stage);
                glRenderer.renderStageToTarget(stage);
                assert.equal(isEquals(), true);
            });
        });
    });
};