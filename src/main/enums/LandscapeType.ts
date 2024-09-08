import { TerrainType } from './TerrainType';

// landscape characteristics of basic terrain types
export enum LandscapeType {
  NONE = 0, // nothing special
  RIVERBANK = 1, // other side of river
  RIVERAREA = 2, // distance around riverbed not other river can be added
  ICE = TerrainType.MOUNTAIN + 1, // water specific arctic
  REEF, // water specific tropical
  OASIS, // desert specific
  SWAMP, // plain / grass specific
  FOREST, // plain / grass / tundra specific
  JUNGLE, // plain / grass specific tropical
  VOLCANO, // mountain specific universal
  RIVER, // river
}
