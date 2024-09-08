import { MapTemperature } from '../enums/MapTemperature';
import { MapHumidity } from '../enums/MapHumidity';
import { Direction } from 'honeycomb-grid';

// basic interface for all landscape shaper classes
export interface IMapLandscapeShaper {
  readonly temperature: MapTemperature;
  readonly humidity: MapHumidity;
  readonly rows: number;
  readonly columns: number;

  generate(
    map: number[][],
    factorRiver: number,
    riverbed: number,
  ): {
    terrain: number[][];
    landscape: number[][];
    riverTileDirections: Map<string, Direction[]>;
  };
}
