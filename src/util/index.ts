import { Random } from 'random-js';
import pako from 'pako';

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

export const initialize2DArray = (width: number, height: number): number[][] =>
  Array(height).fill(null).map(() => Array(width).fill(0));

export const gunzip = (base64Str: string): Uint32Array => {
  const strData = atob(base64Str);
  const charData = strData.split('').map(chr => chr.charCodeAt(0));
  const binData = new Uint8Array(charData);
  const data = pako.inflate(binData);
  const intArr = new Uint32Array(data.buffer);

  return intArr;
};

export { ICoords, CoordOps } from './Coords';
export { constants };
