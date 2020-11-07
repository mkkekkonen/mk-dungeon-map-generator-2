import { Map } from '../map';
import { constants } from '../../util';

const { FLOOR, WALL, DOOR, CORRIDOR } = constants.MAP_ELEMENTS;

export const renderToConsole = (map: Map): void => {
  const array = map.get2DArray();

  for (let y = 0; y < map.height; y++) {
    const arrayToPrint: string[] = [];

    for (let x = 0; x < map.width; x++) {
      const mapElement = array[y][x];

      switch (mapElement) {
        case FLOOR:
          arrayToPrint.push('.');
          break;
        case WALL:
          arrayToPrint.push('#');
          break;
        case DOOR:
          arrayToPrint.push('+');
          break;
        case CORRIDOR:
          arrayToPrint.push('$');
          break;
        default:
          break;
      }
    }

    console.log(arrayToPrint.join(''));
  }
};
