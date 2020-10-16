import { MapMatrix } from './MapMatrix';

describe('getAt', () => {
  it('returns correct number', () => {
    const matrix = new MapMatrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);

    expect(matrix.getAt(1, 2))
      .toEqual(8);
  });
});

describe('resetMatrix', () => {
  it('resets matrix', () => {
    const matrix = new MapMatrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);

    matrix.resetMatrix([
      [10, 11, 12],
      [13, 14, 15],
      [16, 17, 18],
    ]);

    expect(matrix.getAt(2, 1))
      .toEqual(15);
  });
});
