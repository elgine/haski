/* eslint-disable no-undef */
import Transform2d from '@maths/transform2d';
import assert from 'assert';

describe('Transform2d', () => {
    describe('#translation', () => {
        it('Should equals', () => {
            let t = new Transform2d();
            t.tx = 5;
            assert.equal(t.matrix.toString(), [1, 0, 5, 0, 1, 0, 0, 0, 1].toString());
        });
    });
});