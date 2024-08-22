import { Orientation, defineHex } from 'honeycomb-grid';
import { TerrainType } from '../enums/TerrainType';
import { LandscapeType } from '../enums/LandscapeType';
import { WaterFlowType } from '../enums/WaterFlowType';

export class Tile extends defineHex({
  dimensions: 1,
  orientation: Orientation.POINTY,
  origin: 'topLeft',
  offset: -1,
}) {
  terrain: TerrainType = TerrainType.SHALLOW_WATER;
  landscape: LandscapeType = LandscapeType.NONE;
  river: WaterFlowType = WaterFlowType.NONE;
}