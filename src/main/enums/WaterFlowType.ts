import { LandscapeType } from './LandscapeType';

export enum WaterFlowType {
  NONE = 0,
  RIVERBED = 1, // distance around river not other river can be added
  RIVER = LandscapeType.VOLCANO + 1,
}
