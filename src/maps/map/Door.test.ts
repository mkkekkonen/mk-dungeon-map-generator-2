import { Door } from './Door';
import { Room } from './Room';
import { Side } from './Side';

describe('coords', () => {
  const room = new Room({
    topLeft: {
      x: 2,
      y: 1,
    },
    width: 5,
    height: 4,
  });

  test('north', () => {
    const door = new Door(room, Side.North, 2);
    expect(door.coords)
      .toEqual({ x: 4, y: 1 });
  });

  test('east', () => {
    const door = new Door(room, Side.East, 1);
    expect(door.coords)
      .toEqual({ x: 6, y: 2 });
  });

  test('south', () => {
    const door = new Door(room, Side.South, 1);
    expect(door.coords)
      .toEqual({ x: 3, y: 4 });
  });

  test('west', () => {
    const door = new Door(room, Side.West, 2);
    expect(door.coords)
      .toEqual({ x: 2, y: 3 });
  });
});
