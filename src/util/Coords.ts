export interface ICoords {
  x: number
  y: number
}

export class CoordOps {
  static add = (a: ICoords, b: ICoords): ICoords => ({
    x: a.x + b.x,
    y: a.y + b.y,
  });
}
