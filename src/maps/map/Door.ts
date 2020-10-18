import { Room } from './Room';
import { Side } from './Side';
import { ICoords } from '../../util';

export class Door {
  public room: Room;

  public distanceNW: number;
  public side: Side;

  constructor(parent: Room, side: Side, distanceNW: number) {
    this.room = parent;
    
    this.side = side;
    this.distanceNW = distanceNW;
  }

  get coords(): ICoords {
    switch(this.side) {
      case Side.North: {
        const x = this.room.topLeft.x + this.distanceNW;
        const y = this.room.topLeft.y;
        return { x, y };
      }
      case Side.East: {
        const x = this.room.bottomRight.x;
        const y = this.room.topLeft.y + this.distanceNW;
        return { x, y };
      }
      case Side.South: {
        const x = this.room.topLeft.x + this.distanceNW;
        const y = this.room.bottomRight.y;
        return { x, y };
      }
      case Side.West: {
        const x = this.room.topLeft.x;
        const y = this.room.topLeft.y + this.distanceNW;
        return { x, y };
      }
      case Side.None:
      default:
        return { x: 0, y: 0 };
    }
  }
}
