import { loadMap } from './loadTiledRoomsDoors';

import mapXml from '../../assets/map1.tmx';

describe('loadMap', () => {
  it('works', async () => {
    const map = await loadMap(mapXml);

    console.log(map);
  });
});
