import { parse } from 'mathjs';
import { parseStringPromise } from 'xml2js';

import { initialize2DArray, gunzip } from '../../util';

type TiledOrientation = 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
type TiledRenderOrder = 'right-down' | 'right-up' | 'left-down' | 'left-up';
type TiledObjDrawOrder = 'index' | 'topdown';

interface ITilesetMeta {
  source: string
  firstGid: number
}

interface ITiledObject {
  id: number

  name: string
  type: string

  x: number
  y: number
  width: number
  height: number
}

interface ITiledObjectGroup {
  id: number
  drawOrder: TiledObjDrawOrder
  objects: ITiledObject[]
}

interface ITiledLayer {
  id: number
  name: string
  width: number
  height: number

  tiles?: number[][]
}

export interface ITiledMap {
  version: string
  tiledVersion: string

  orientation: TiledOrientation
  renderOrder: TiledRenderOrder

  width: number
  height: number

  tileWidthPx: number
  tileHeightPx: number

  infinite: boolean

  nextLayerId: number
  nextObjectId: number

  tilesets?: any[]
  tileLayers: ITiledLayer[]
  tilesetMeta: ITilesetMeta[]
}

interface ITiledImage {
  source: string

  width: number
  height: number
}

interface ITiledTile {
  id: number
  collision: ITiledObjectGroup
}

export interface ITiledTileset {
  firstGid: number
  sourceFilename: string

  version: string
  tiledVersion: string

  name: string

  tileWidth: number
  tileHeight: number
  tileCount: number

  columns: number

  images: ITiledImage[]
  tiles: ITiledTile[]
}

const loadTilesetTiles = (data: any): ITiledTile[] => {
  return data.map((tileData: any) => {
    const collisionObjectGroup = tileData.objectgroup[0];
    const collisionObject = collisionObjectGroup.object[0];

    return {
      id: +tileData.$.id,
      collision: {
        drawOrder: collisionObjectGroup.$.draworder,
        id: +collisionObjectGroup.$.id,
        objects: [
          {
            id: +collisionObject.$.id,
            name: collisionObject.$.name,
            type: collisionObject.$.type,
            x: +collisionObject.$.x,
            y: +collisionObject.$.y,
            width: +collisionObject.$.width,
            height: +collisionObject.$.height,
          },
        ],
      },
    };
  });
};

const loadTilesetImages = (data: any): ITiledImage[] => {
  return data.map((imageData: any) => {
    return {
      source: imageData.$.source,
      width: +imageData.$.width,
      height: +imageData.$.height,
    };
  });
};

const loadTileData = (data: any, mapWidth: number, mapHeight: number) => {
  const tileData = initialize2DArray(mapWidth, mapHeight);

  const mapStartXOffset = +data.chunk[0].$.x * (-1);
  const mapStartYOffset = +data.chunk[0].$.y * (-1);

  const encoding = data.$.encoding;
  const compression = data.$.compression;

  if (encoding === 'base64' && compression === 'zlib' && data.chunk) {
    data.chunk.forEach((chunk: any) => {
      const startX = +chunk.$.x;
      const startY = +chunk.$.y;
      const width = +chunk.$.width;
      const height = +chunk.$.height;

      const endX = startX + width;
      const endY = startY + height;

      const intArr = gunzip(chunk._);

      let index = 0;

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const _x = x + mapStartXOffset;
          const _y = y + mapStartYOffset;

          tileData[_y][_x] = intArr[index];
          index++;
        }
      }
    });
  }

  return tileData;
};

const loadTileLayers = (layerData: any, mapWidth: number, mapHeight: number, infinite = false) => {
  return layerData.map((data: any) => {
    const tiles = loadTileData(data.data[0], mapWidth, mapHeight);

    return {
      id: +data.$.id,
      name: data.$.name,
      width: +data.$.width,
      height: +data.$.height,
      tiles,
    };
  });
};

export const loadTiledTileset = async (xml: string, sourceFilename: string, firstGid: number): Promise<ITiledTileset | undefined> => {
  const { tileset: data } = await parseStringPromise(xml);

  try {
    return {
      firstGid,
      sourceFilename,
      version: data.$.version,
      tiledVersion: data.$.tiledversion,
      name: data.$.name,
      tileWidth: +data.$.tilewidth,
      tileHeight: +data.$.tileheight,
      tileCount: +data.$.tilecount,
      columns: +data.$.columns,
      images: loadTilesetImages(data.image),
      tiles: loadTilesetTiles(data.tile),
    };
  } catch (e) {
    console.log(`Invalid tileset data: ${e.message}`);
  }
};

const getTilesetMeta = (tilesetData: any): ITilesetMeta[] => {
  return tilesetData.map((data: any) => ({
    source: data.$.source,
    firstGid: +data.$.firstgid,
  }));
};

export const loadTiledMap = async (xml: string): Promise<ITiledMap | undefined> => {
  const { map: mapData } = await parseStringPromise(xml);
  
  try {
    const tileLayerData: any = mapData.layer;

    const width = +mapData.$.width;
    const height = +mapData.$.height;

    const infinite = mapData.$.infinite === '1';

    const map: ITiledMap = {
      version: mapData.$.version,
      tiledVersion: mapData.$.tiledversion,
      orientation: mapData.$.orientation,
      renderOrder: mapData.$.renderorder,
      width,
      height,
      tileWidthPx: +mapData.$.tilewidth,
      tileHeightPx: +mapData.$.tileheight,
      infinite,
      nextLayerId: +mapData.$.nextlayerid,
      nextObjectId: +mapData.$.nextobjectid,
      tileLayers: loadTileLayers(tileLayerData, width, height, infinite),
      tilesetMeta: getTilesetMeta(mapData.tileset),
    };

    return map;
  } catch(e) {
    console.log(`Invalid map data: ${e.message}`);
  }
};
