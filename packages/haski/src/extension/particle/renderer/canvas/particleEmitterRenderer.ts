// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ObjectRenderer from '../../../../renderer/objectRenderer';
import ParticleEmitter from '../../particleEmitter';
import CanvasRenderer from '../../../../renderer/canvas/canvasRenderer';
import Color from '@maths/color';

export default class ParticleEmitterRenderer implements ObjectRenderer<ParticleEmitter> {

    public readonly name: string = 'particleEmitter';

    render(renderer: CanvasRenderer, emitter: ParticleEmitter) {
        const ctx: CanvasRenderingContext2D = renderer.curCtx;
        if (emitter.params.additive) { ctx.globalCompositeOperation = 'lighter' }
        emitter.particles.forEach((particle) => {
            const vm = particle.matrix;
            ctx.save();
            ctx.beginPath();
            ctx.transform(vm[0], vm[1], vm[3], vm[4], vm[2], vm[5]);
            ctx.rect(0, 0, particle.width, particle.height);
            ctx.closePath();
            if (emitter.params.texture) {
                const rawData = emitter.params.texture.rawData;
                const texRegion = emitter.params.texBounds || {
                    x: 0, y: 0, width: rawData.width, height: rawData.height
                };
                ctx.drawImage(rawData, 0, 0, texRegion.width, texRegion.height, texRegion.x, texRegion.y, texRegion.width, texRegion.height);
            }
            ctx.fillStyle = Color.toString(particle.color);
            ctx.fill();
            ctx.restore();
        });
    }
}