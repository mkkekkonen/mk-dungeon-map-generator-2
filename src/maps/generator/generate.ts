import { Random } from 'random-js';
import PF from 'pathfinding';
import { flatten } from 'lodash';

import { Door, Map, Room, Side } from '../map';
import { shuffle, CoordOps, ICoords } from '../../util';
import { MIN_ROOM_DIM, MAX_ROOM_DIM, MAP_ELEMENTS } from '../../util/constants';

const cardinalCoords: { [key: string]: ICoords } = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

interface IGeneratorOptions {
  nRooms?: number

  mapWidth: number
  mapHeight: number

  minRooms?: number
  maxRooms?: number
}

const getAddCoords = (side: Side): ICoords => {
  switch (side) {
    case Side.North:
      return cardinalCoords.north;
    case Side.East:
      return cardinalCoords.east;
    case Side.South:
      return cardinalCoords.south;
    case Side.West:
      return cardinalCoords.west;
    default:
      return { x: 0, y: 0 };
  }
};

const generateCorridors = (map: Map) => {
  const random = new Random();
  const pathfinder = new PF.AStarFinder();

  const corridors: ICoords[][] = [];

  const array = map.get2DArray();
  const pfArray = array.map(row => row.map(value => {
    switch (value) {
      case MAP_ELEMENTS.FLOOR:
        return 0;
      default:
        return 1;
    }
  }));
  const pfGrid = new PF.Grid(pfArray);

  map.rooms.forEach((room, index) => {
    const otherRooms = [...map.rooms];
    otherRooms.splice(index, 1);
    const otherDoors = flatten(otherRooms.map(otherRoom => otherRoom.doors));

    room.doors.forEach(startDoor => {
      const endDoor = otherDoors[random.integer(0, otherDoors.length)];

      if (!startDoor || !endDoor) {
        return;
      }

      const startCoordinates = CoordOps.add(startDoor.coords, getAddCoords(startDoor.side));
      const endCoordinates = CoordOps.add(endDoor.coords, getAddCoords(endDoor.side));

      if (startCoordinates.x < 0 || startCoordinates.x >= map.width
          || startCoordinates.y < 0 || startCoordinates.y >= map.height
          || endCoordinates.x < 0 || endCoordinates.x >= map.width
          || endCoordinates.y < 0 || endCoordinates.y >= map.height) {
        return;  
      }

      const startNode = pfGrid.getNodeAt(startCoordinates.x, startCoordinates.y);
      const endNode = pfGrid.getNodeAt(endCoordinates.x, endCoordinates.y);

      if (!startNode || !endNode || !startNode.walkable || !endNode.walkable) {
        return;
      }

      const clonedGrid = pfGrid.clone();

      const path = pathfinder.findPath(
        startCoordinates.x,
        startCoordinates.y,
        endCoordinates.x,
        endCoordinates.y,
        clonedGrid,
      );

      const corridor: ICoords[] = [];

      for (let i = 0; i < path.length; i++) {
        const [x, y] = path[i];
        const elementCoords = { x, y };
        const coordsToCheck = [
          CoordOps.add(elementCoords, cardinalCoords.north),
          CoordOps.add(elementCoords, cardinalCoords.east),
          CoordOps.add(elementCoords, cardinalCoords.south),
          CoordOps.add(elementCoords, cardinalCoords.west),
        ];
        
        let breakCheck = false;

        coordsToCheck.forEach(coordToCheck => {
          if (corridors.find(corridor => corridor.find(corridorElement =>
            corridorElement.x === coordToCheck.x && corridorElement.y === coordToCheck.y
          ))) {
            breakCheck = true;
          }
        });

        corridor.push(elementCoords);

        if (breakCheck) {
          break;
        }
      }

      corridors.push(corridor);
    });
  });

  return corridors;
};

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

  const map = new Map({
    rooms,
    width: mapWidth,
    height: mapHeight,
  });

  const corridors = generateCorridors(map);

  map.corridors = corridors;

  return map;
};
