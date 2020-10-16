import { Matrix, matrix } from 'mathjs';

export class MapMatrix {
  private matrix: Matrix;

  constructor(array2D: number[][]) {
    this.matrix = matrix(array2D);
  }

  resetMatrix = (array2D: number[][]): void => {
    this.matrix = matrix(array2D);
  }

  getAt = (x: number, y: number): number => {
    return this.matrix.get([y, x]);
  }
}
