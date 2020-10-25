import { Random } from 'random-js';

import { Door, Map, Room, Side } from '../map';
import { shuffle } from '../../util';
import { MIN_ROOM_DIM, MAX_ROOM_DIM } from '../../util/constants';

interface IGeneratorOptions {
  nRooms?: number

  mapWidth: number
  mapHeight: number

  minRooms?: number
  maxRooms?: number
}

export const getMaxDistanceNW = (room: Room, side: Side): number => {
  if ([Side.North, Side.South].includes(side)) {
    return room.width - 2;
  }

  if ([Side.East, Side.West].includes(side)) {
    return room.height - 2;
  }

  return 0;
};

const generateRoomDoors = (random: Random, room: Room) => {
  const nDoors = random.integer(1, 4);

  const sides = shuffle([Side.North, Side.East, Side.South, Side.West])
    .slice(0, nDoors) as Side[];

  sides.forEach(side => {
    const maxDistanceNW = getMaxDistanceNW(room, side);
    const distanceNW = random.integer(1, maxDistanceNW);
    const door = new Door(room, side, distanceNW);
    room.doors.push(door);
  });
};

const getRandomRooms = ({
  nRooms,
  mapWidth,
  mapHeight,
  minRooms,
  maxRooms,
}: IGeneratorOptions) => {
  const rooms: Room[] = [];
  const random = new Random();

  const _nRooms = nRooms || (minRooms && maxRooms && random.integer(minRooms, maxRooms));

  if (!_nRooms) {
    throw new Error('Invalid number of rooms');
  }

  for (let i = 0; i < _nRooms; i++) {
    let room: Room | null = null;

    while (!room
      || room.bottomRight.x >= mapWidth
      || room.bottomRight.y >= mapHeight
      || rooms.some(listRoom => room!.overlapsWith(listRoom))
    ) {
      const topLeftX = random.integer(0, mapWidth - 1);
      const topLeftY = random.integer(0, mapHeight - 1);
      const topLeft = {
        x: topLeftX,
        y: topLeftY,
      };

      const roomWidth = random.integer(MIN_ROOM_DIM, MAX_ROOM_DIM);
      const roomHeight = random.integer(MIN_ROOM_DIM, MAX_ROOM_DIM);

      room = new Room({
        topLeft,
        width: roomWidth,
        height: roomHeight,
      });
    }

    rooms.push(room);
    generateRoomDoors(random, room);
  }

  return rooms;
};

export const generateRandomMap = ({
  nRooms,
  mapWidth = 100,
  mapHeight = 100,
  minRooms = 1,
  maxRooms = 5,
}: IGeneratorOptions): Map => {
  const rooms = getRandomRooms({
    mapWidth,
    mapHeight,
    minRooms,
    maxRooms,
    nRooms,
  });

  return new Map({
    rooms,
    width: mapWidth,
    height: mapHeight,
  });
};
