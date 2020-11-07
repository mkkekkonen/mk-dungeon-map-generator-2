import { parseStringPromise } from 'xml2js';

import { Map, Room, Door, Side } from '../map';

const getRoomDoor = (room: Room, doorX: number, doorY: number) => {
  if (doorX === room.left) {
    const distanceNW = doorY - room.top;
    return new Door(room, Side.West, distanceNW);
  } else if (doorX === room.right) {
    const distanceNW = doorY - room.top;
    return new Door(room, Side.East, distanceNW);
  } else if (doorY === room.top) {
    const distanceNW = doorX - room.left;
    return new Door(room, Side.North, distanceNW);
  } else if (doorY === room.bottom) {
    const distanceNW = doorX - room.left;
    return new Door(room, Side.South, distanceNW);
  }
};

const loadRooms = (
  mapData: any,
  startXOffset: number,
  startYOffset: number,
  tileWidth: number,
  tileHeight: number,
) => {
  const roomObjectGroup = mapData.objectgroup
    .find((objectGroup: any) => objectGroup.$.name === 'Rooms');

  if (!roomObjectGroup) {
    return [];
  }

  return roomObjectGroup.object.map((object: any) => {
    const roomTopLeft = {
      x: (+object.$.x + startXOffset) / tileWidth,
      y: (+object.$.y + startYOffset) / tileHeight,
    };

    return new Room({
      topLeft: roomTopLeft,
      width: +object.$.width / tileWidth,
      height: +object.$.height / tileHeight,
    });
  });
};

const loadDoors = (
  mapData: any,
  rooms: Room[],
  startXOffset: number,
  startYOffset: number,
  tileWidth: number,
  tileHeight: number,
): void => {
  const doorObjectGroup = mapData.objectgroup
    .find((objectGroup: any) => objectGroup.$.name === 'Doors');

  if (!doorObjectGroup) {
    return;
  }

  doorObjectGroup.object.forEach((object: any) => {
    const doorX = (+object.$.x + startXOffset) / tileWidth;
    const doorY = (+object.$.y + startYOffset) / tileHeight;

    const room = rooms.find(room => room.contains({ x: doorX, y: doorY }));

    if (!room) {
      return;
    }

    const door = getRoomDoor(room, doorX, doorY);
    if (door) {
      room.doors.push(door);
    }
  });
};

export const loadMap = async (xml: string): Promise<Map | undefined> => {
  const { map: mapData } = await parseStringPromise(xml);

  const mapWidth = +mapData.$.width;
  const mapHeight = +mapData.$.height;

  const tileWidth = +mapData.$.tilewidth;
  const tileHeight = +mapData.$.tileheight;

  const startXOffset = +mapData.layer[0].data[0].chunk[0].$.x * tileWidth * (-1);
  const startYOffset = +mapData.layer[0].data[0].chunk[0].$.y * tileHeight * (-1);

  const rooms = loadRooms(mapData, startXOffset, startYOffset, tileWidth, tileHeight);

  loadDoors(mapData, rooms, startXOffset, startYOffset, tileWidth, tileHeight);

  return new Map({ width: mapWidth, height: mapHeight, rooms });
};
