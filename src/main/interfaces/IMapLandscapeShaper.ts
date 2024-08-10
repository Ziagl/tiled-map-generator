import { MapTemperature } from '../enums/MapTemperature';
import { MapHumidity } from '../enums/MapHumidity';

// basic interface for all terrain generator classes
export interface IMapLandscapeShaper {
  readonly temperature: MapTemperature;
  readonly humidity: MapHumidity;
  readonly rows: number;
  readonly columns: number;

  generate(map: number[][]): number[][][];
}
