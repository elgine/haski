// import assert from 'assert';
// import { describe, it } from 'mocha';
// import Transform2d from '@maths/transform2d';

// describe('transform2d', () => {
//     describe('#components', () => {
//         it('translate x', () => {
//             let t = new Transform2d();
//             t.tx = 5;
//             assert.equal(t.matrix, [1, 0, 5, 0, 1, 0, 0, 0, 1]);
//         });
//     });
// });

import Transform2d from '@maths/transform2d';

let t = new Transform2d();

t.rotate(0.1);

console.log(t.matrix);