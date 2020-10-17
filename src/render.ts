import { Generator } from './maps/generator';
import { ConsoleRenderer } from './maps/renderers';

 const run = () => {
  const map = Generator.generateRandomMap({
    nRooms: 4,
    mapWidth: 50,
    mapHeight: 50,
  });

  ConsoleRenderer.renderToConsole(map);
};

run();
