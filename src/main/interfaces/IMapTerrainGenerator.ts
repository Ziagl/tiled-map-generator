import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';

// basic interface for all terrain generator classes
export interface IMapTerrainGenerator {
  readonly type: MapType;
  readonly size: MapSize;
  readonly rows: number;
  readonly columns: number;

  generate(size: MapSize): number[][];
}
