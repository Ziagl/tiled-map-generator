import { LandscapeType } from './LandscapeType';

export enum WaterFlowType {
  NONE = 0,
  WATER = 1,
  MOUNTAIN = 2,
  RIVER = LandscapeType.VOLCANO + 1,
}
