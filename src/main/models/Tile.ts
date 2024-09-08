import { CubeCoordinates, Orientation, defineHex } from 'honeycomb-grid';
import { TerrainType } from '../enums/TerrainType';
import { LandscapeType } from '../enums/LandscapeType';

export class Tile extends defineHex({
  dimensions: 1,
  orientation: Orientation.POINTY,
  origin: 'topLeft',
  offset: -1,
}) {
  coordinates: CubeCoordinates = { q: 0, r: 0, s: 0 };
  terrain: TerrainType = TerrainType.SHALLOW_WATER;
  landscape: LandscapeType = LandscapeType.NONE;
}
