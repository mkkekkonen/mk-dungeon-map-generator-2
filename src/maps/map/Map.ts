import { Room } from './Room';
import { MapMatrix } from './MapMatrix';
import { constants } from '../../util';
import { Door } from './Door';

interface IMapOptions {
  width: number
  height: number
  rooms: Room[]
}

type RoomWallCoords = { [key: string]: number };

const { FLOOR, WALL } = constants.MAP_ELEMENTS;

const getWallCoordsKey = (x: number, y: number) => `${x}:${y}`;

export class Map {
  width: number;
  height: number;

  rooms: Room[];

  constructor({
    width,
    height,
    rooms = [],
  }: IMapOptions) {
    this.width = width;
    this.height = height;

    this.rooms = rooms;
  }

  getRoomWallHashMap = (): RoomWallCoords => {
    const roomWallCoords: RoomWallCoords = {};

    this.rooms.forEach(room => {
      // N wall
      for (let x = room.topLeft.x; x <= room.bottomRight.x; x++) {
        const key = getWallCoordsKey(x, room.topLeft.y);
        roomWallCoords[key] = WALL;
      }

      // E wall
      for (let y = room.topLeft.y + 1; y <= room.bottomRight.y - 1; y++) {
        const key = getWallCoordsKey(room.bottomRight.x, y);
        roomWallCoords[key] = WALL;
      }

      // S wall
      for (let x = room.topLeft.x; x <= room.bottomRight.x; x++) {
        const key = getWallCoordsKey(x, room.bottomRight.y);
        roomWallCoords[key] = WALL;
      }

      // W wall
      for (let y = room.topLeft.y + 1; y <= room.bottomRight.y - 1; y++) {
        const key = getWallCoordsKey(room.topLeft.x, y);
        roomWallCoords[key] = WALL;
      }
    });

    return roomWallCoords;
  };

  get2DArray = (): number[][] => {
    const array2D: number[][] = [];

    const roomWallHashMap = this.getRoomWallHashMap();

    for (let y = 0; y < this.height; y++) {
      array2D.push([]);

      for (let x = 0; x < this.width; x++) {
        const isWall = roomWallHashMap[getWallCoordsKey(x, y)];
        if (isWall) {
          array2D[y].push(WALL);
        } else {
          array2D[y].push(FLOOR);
        }
      }
    }

    return array2D;
  }

  // writeIntoMatrix = (): MapMatrix => {
    
  // }
}
