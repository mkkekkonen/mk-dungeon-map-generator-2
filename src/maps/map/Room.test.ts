import { Room } from './Room';

describe('overlapsWith', () => {
  it('does not overlap - R1 left of R2', () => {
    const R1 = new Room({
      topLeft: { x: 1, y: 1 },
      width: 4,
      height: 3,
    });

    const R2 = new Room({
      topLeft: { x: 6, y: 2 },
      width: 4,
      height: 3,
    });

    expect(R1.overlapsWith(R2)).toBe(false);
    expect(R2.overlapsWith(R1)).toBe(false);
  });

  it('does not overlap - R1 above R2', () => {
    const R1 = new Room({
      topLeft: { x: 1, y: 1 },
      width: 4,
      height: 3,
    });

    const R2 = new Room({
      topLeft: { x: 4, y: 5 },
      width: 3,
      height: 4,
    });

    expect(R1.overlapsWith(R2)).toBe(false);
    expect(R2.overlapsWith(R1)).toBe(false);
  });

  it('overlaps', () => {
    const R1 = new Room({
      topLeft: { x: 1, y: 1 },
      width: 3,
      height: 4,
    });

    const R2 = new Room({
      topLeft: { x: 3, y: 2 },
      width: 4,
      height: 3,
    });

    expect(R1.overlapsWith(R2)).toBe(true);
    expect(R2.overlapsWith(R1)).toBe(true);
  });
});
