import { parseStringPromise } from 'xml2js';

import { initialize2DArray, gunzip } from '../../util';

type TiledOrientation = 'orthogonal' | 'isometric' | 'staggered' | 'hexagonal';
type TiledRenderOrder = 'right-down' | 'right-up' | 'left-down' | 'left-up';

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

  tileset: any
  tileLayers: ITiledLayer[]
}

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

const loadTiledTileset = async (xml: string) => {
  const tileset = await parseStringPromise(xml);
};

export const loadTiledMap = async (xml: string): Promise<ITiledMap | undefined> => {
  const { map: mapData } = await parseStringPromise(xml);
  
  try {
    const tilesetSource: string = mapData.tileset.source;
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
      tileset: {},
      tileLayers: loadTileLayers(tileLayerData, width, height, infinite),
    };

    return map;
  } catch(e) {
    console.log(`Invalid map data: ${e.message}`);
  }
};
