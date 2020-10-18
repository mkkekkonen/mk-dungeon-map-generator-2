import { Room, Side } from '../map';

import { getMaxDistanceNW } from './generate';

describe('getMaxDistanceNW', () => {
  test('north', () => {
    const room = new Room({
      topLeft: {
        x: 1,
        y: 1,
      },
      width: 5,
      height: 3,
    });

    expect(getMaxDistanceNW(room, Side.North))
      .toEqual(3);
  });

  test('east', () => {
    const room = new Room({
      topLeft: {
        x: 1,
        y: 1,
      },
      width: 5,
      height: 3,
    });

    expect(getMaxDistanceNW(room, Side.East))
      .toEqual(1);
  });

  test('south', () => {
    const room = new Room({
      topLeft: {
        x: 1,
        y: 1,
      },
      width: 3,
      height: 4,
    });

    expect(getMaxDistanceNW(room, Side.South))
      .toEqual(1);
  });

  test('west', () => {
    const room = new Room({
      topLeft: {
        x: 1,
        y: 1,
      },
      width: 3,
      height: 4,
    });

    expect(getMaxDistanceNW(room, Side.West))
      .toEqual(2);
  });
});
