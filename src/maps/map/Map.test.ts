import { Map } from './Map';
import { Room } from './Room';
import { constants } from '../../util';

const { WALL, FLOOR } = constants.MAP_ELEMENTS;

describe('getRoomWallHashMap', () => {
  it('creates hash map correctly', () => {
    const rooms = [
      new Room({
        topLeft: { x: 2, y: 1 },
        width: 5,
        height: 4,
      }),
      new Room({
        topLeft: { x: 8, y: 3 },
        width: 4,
        height: 4,
      }),
    ];

    const map = new Map({
      rooms,
      width: 14,
      height: 9,
    });

    const hashMap = {
      '2:1': WALL,
      '2:2': WALL,
      '2:3': WALL,
      '2:4': WALL,
      '3:1': WALL,
      '3:4': WALL,
      '4:1': WALL,
      '4:4': WALL,
      '5:1': WALL,
      '5:4': WALL,
      '6:1': WALL,
      '6:2': WALL,
      '6:3': WALL,
      '6:4': WALL,
      '8:3': WALL,
      '8:4': WALL,
      '8:5': WALL,
      '8:6': WALL,
      '9:3': WALL,
      '9:6': WALL,
      '10:3': WALL,
      '10:6': WALL,
      '11:3': WALL,
      '11:4': WALL,
      '11:5': WALL,
      '11:6': WALL,
    };

    expect(map.getRoomWallHashMap())
      .toEqual(hashMap);
  });
});

describe('get2DArray', () => {
  it('works', () => {
    const W = WALL;
    const F = FLOOR;

    const rooms = [
      new Room({
        topLeft: { x: 2, y: 1 },
        width: 5,
        height: 4,
      }),
      new Room({
        topLeft: { x: 8, y: 3 },
        width: 4,
        height: 4,
      }),
    ];

    const map = new Map({
      rooms,
      width: 14,
      height: 9,
    });

    const expectedArray = [
      [F, F, F, F, F, F, F, F, F, F, F, F, F, F],
      [F, F, W, W, W, W, W, F, F, F, F, F, F, F],
      [F, F, W, F, F, F, W, F, F, F, F, F, F, F],
      [F, F, W, F, F, F, W, F, W, W, W, W, F, F],
      [F, F, W, W, W, W, W, F, W, F, F, W, F, F],
      [F, F, F, F, F, F, F, F, W, F, F, W, F, F],
      [F, F, F, F, F, F, F, F, W, W, W, W, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, F, F, F],
      [F, F, F, F, F, F, F, F, F, F, F, F, F, F],
    ];

    expect(map.get2DArray())
      .toEqual(expectedArray);
  });
});
