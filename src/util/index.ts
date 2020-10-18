import { Random } from 'random-js';

import * as constants from './constants';

// Fisher-Yates shuffle
export const shuffle = (arr: any[]): any[] => {
  const random = new Random();

  const arrToReturn = [...arr];

  let currentIndex = arr.length;

  while (currentIndex !== 0) {
    const randomIndex = random.integer(0, currentIndex - 1);
    currentIndex--;

    const temp = arrToReturn[currentIndex];
    arrToReturn[currentIndex] = arrToReturn[randomIndex];
    arrToReturn[randomIndex] = temp;
  }

  return arrToReturn;
};

export { ICoords } from './Coords';
export { constants };
