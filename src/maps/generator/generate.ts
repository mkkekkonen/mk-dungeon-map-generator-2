import { Random } from 'random-js';

import { Map, Room } from '../map';
import { ICoords } from '../../util';
import { MIN_ROOM_DIM, MAX_ROOM_DIM } from '../../util/constants';

interface IGeneratorOptions {
  nRooms?: number

  mapWidth: number
  mapHeight: number

  minRooms?: number
  maxRooms?: number
}

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
    const topLeftX = random.integer(0, mapWidth - 1);
    const topLeftY = random.integer(0, mapHeight - 1);
    const topLeft = {
      x: topLeftX,
      y: topLeftY,
    };

    const roomWidth = random.integer(MIN_ROOM_DIM, MAX_ROOM_DIM);
    const roomHeight = random.integer(MIN_ROOM_DIM, MAX_ROOM_DIM);

    const room = new Room({
      topLeft,
      width: roomWidth,
      height: roomHeight,
    });

    if (rooms.some(listRoom => room.overlapsWith(listRoom))) {
      continue;
    }

    rooms.push(room);
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

  return new Map(rooms);
};
