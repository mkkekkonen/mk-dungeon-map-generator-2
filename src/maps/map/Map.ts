import { Room } from './Room';
import { MapMatrix } from './MapMatrix';
import { constants } from '../../util';
import { Door } from './Door';

interface IMapOptions {
  width: number
  height: number
  rooms: Room[]
}

type RoomMapCoords = { [key: string]: number };

const {
  FLOOR,
  WALL,
  DOOR,
} = constants.MAP_ELEMENTS;

const getMapCoordsKey = (x: number, y: number) => `${x}:${y}`;

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

  getRoomHashMap = (): RoomMapCoords => {
    const roomMapCoords: RoomMapCoords = {};

    this.rooms.forEach(room => {
      // N wall
      for (let x = room.topLeft.x; x <= room.bottomRight.x; x++) {
        const key = getMapCoordsKey(x, room.topLeft.y);
        roomMapCoords[key] = WALL;
      }

      // E wall
      for (let y = room.topLeft.y + 1; y <= room.bottomRight.y - 1; y++) {
        const key = getMapCoordsKey(room.bottomRight.x, y);
        roomMapCoords[key] = WALL;
      }

      // S wall
      for (let x = room.topLeft.x; x <= room.bottomRight.x; x++) {
        const key = getMapCoordsKey(x, room.bottomRight.y);
        roomMapCoords[key] = WALL;
      }

      // W wall
      for (let y = room.topLeft.y + 1; y <= room.bottomRight.y - 1; y++) {
        const key = getMapCoordsKey(room.topLeft.x, y);
        roomMapCoords[key] = WALL;
      }

      room.doors.forEach(door => {
        const doorCoords = door.coords;
        const key = getMapCoordsKey(doorCoords.x, doorCoords.y);
        roomMapCoords[key] = DOOR;
      });
    });

    return roomMapCoords;
  };

  get2DArray = (): number[][] => {
    const array2D: number[][] = [];

    const roomHashMap = this.getRoomHashMap();

    for (let y = 0; y < this.height; y++) {
      array2D.push([]);

      for (let x = 0; x < this.width; x++) {
        const element = roomHashMap[getMapCoordsKey(x, y)];
        if (element) {
          array2D[y].push(element);
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
