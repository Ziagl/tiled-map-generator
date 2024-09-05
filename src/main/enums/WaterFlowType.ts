import { LandscapeType } from './LandscapeType';

export enum WaterFlowType {
  NONE = 0,
  RIVERBANK = 1, // other side of river
  RIVERAREA = 2, // distance around riverbed not other river can be added
  RIVER = LandscapeType.VOLCANO + 1,
}
