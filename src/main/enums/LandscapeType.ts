import { TerrainType } from './TerrainType';

// landscape characteristics of basic terrain types
export enum LandscapeType {
  NONE = 0, // nothing special
  ICE = TerrainType.MOUNTAIN + 1, // water specific arctic
  REEF, // water specific tropical
  OASIS, // desert specific
  SWAMP, // plain / grass specific
  FOREST, // plain / grass / tundra specific
  JUNGLE, // plain / grass specific tropical
  VOLCANO, // mountain specific universal
}
