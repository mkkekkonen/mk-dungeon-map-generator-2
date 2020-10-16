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
}
