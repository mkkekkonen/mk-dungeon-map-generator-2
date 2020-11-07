import { Door } from './Door';
import { ICoords } from '../../util';

export interface IRoomOptions {
  topLeft: ICoords
  width: number
  height: number
}

export class Room {
  topLeft: ICoords;
  width: number;
  height: number;

  doors: Door[] = [];

  constructor(options: IRoomOptions) {
    this.topLeft = options.topLeft;
    this.width = options.width;
    this.height = options.height;
  }

  get bottomRight(): ICoords {
    const x = this.topLeft.x + this.width - 1;
    const y = this.topLeft.y + this.height - 1;

    return { x, y };
  }

  get top(): number {
    return this.topLeft.y;
  }

  get bottom(): number {
    return this.bottomRight.y;
  }

  get left(): number {
    return this.topLeft.x;
  }

  get right(): number {
    return this.bottomRight.x;
  }

  overlapsWith = (otherRoom: Room): boolean => {
    if (this.topLeft.x > otherRoom.bottomRight.x
        || otherRoom.topLeft.x > this.bottomRight.x) {
      return false;
    }

    if (this.topLeft.y > otherRoom.bottomRight.y
        || otherRoom.topLeft.y > this.bottomRight.y) {
      return false;
    }

    return true;
  }

  contains = (coords: ICoords): boolean => (
    coords.x >= this.left && coords.x <= this.right
      && coords.y >= this.top && coords.y <= this.bottom
  )
}
