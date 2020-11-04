import {
  loadTiledMap,
  loadTiledTileset,
  ITiledMap,
  ITiledTileset,
} from './loadTiled';

import mapXml from '../../assets/map1.tmx';
import tilesetXml from '../../assets/maptiles.xml';

describe('loadTiledMap', () => {
  it('works', async () => {
    const map = await loadTiledMap(mapXml);
    
    const expectedResult: ITiledMap = {
      version: '1.4',
      tiledVersion: '1.4.2',
      orientation: 'orthogonal',
      renderOrder: 'right-down',
      width: 50,
      height: 50,
      tileWidthPx: 32,
      tileHeightPx: 32,
      infinite: true,
      nextLayerId: 4,
      nextObjectId: 40,
      tileLayers: [
        {
          id: 1,
          name: 'Tiles',
          width: 50,
          height: 50,
        },
      ],
      tilesetMeta: [
        {
          firstGid: 1,
          source: 'maptiles.tsx',
        },
      ],
    };

    expect(map).toMatchObject(expectedResult);
  });
});

describe('loadTileset', () => {
  it('works', async () => {
    const tileset = await loadTiledTileset(tilesetXml, 'maptiles.xml', 1);

    const expectedResult: ITiledTileset = {
      firstGid: 1,
      sourceFilename: 'maptiles.xml',
      version: '1.4',
      tiledVersion: '1.4.2',
      name: 'maptiles',
      tileWidth: 32,
      tileHeight: 32,
      tileCount: 64,
      columns: 8,
      images: [
        {
          source: 'maptiles.png',
          width: 256,
          height: 256,
        },
      ],
      tiles: [
        {
          id: 0,
          collision: {
            drawOrder: 'index',
            id: 2,
            objects: [
              {
                id: 2,
                name: 'collision',
                type: 'collision',
                x: 0,
                y: 0,
                width: 32,
                height: 32,
              },
            ],
          },
        },
      ],
    };

    expect(tileset).toEqual(expectedResult);
  });
});
