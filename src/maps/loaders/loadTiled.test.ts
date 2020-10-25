import { loadTiledMap, ITiledMap } from './loadTiled';

import xml from '../../assets/map1.tmx';

describe('loadTiledMap', () => {
  it('works', async () => {
    const map = await loadTiledMap(xml);
    
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
      tileset: {},
      tileLayers: [
        {
          id: 1,
          name: 'Tiles',
          width: 50,
          height: 50,
        },
      ],
    };

    expect(map).toMatchObject(expectedResult);
  });
});
