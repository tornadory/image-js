import { Image } from 'test/common';
import 'should';

describe('calculate the array of points', function () {
    it('check the array', function () {

        let img = new Image(8, 2, [255, 0], {
            kind: 'BINARY'
        });

        img.getPoints().should.eql([[0, 0],  [1, 0],  [2, 0],  [3, 0],  [4, 0],  [5, 0],  [6, 0],  [7, 0]]);
        img.points.should.eql([[0, 0],  [1, 0],  [2, 0],  [3, 0],  [4, 0],  [5, 0],  [6, 0],  [7, 0]]);

    });
});

