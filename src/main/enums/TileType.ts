// different tile types that are currently known
export enum TileType {
  DEEP_WATER = 1, // deep water is surrounded by water tiles
  SHALLOW_WATER = 2, // basic water type next to land
  DESERT = 3, // lots of sand
  PLAIN = 4, // basic land type - green grass
  FOREST = 5, // grass with moderate climate vegetation
  SWAMP = 6, // wet grass land
  JUNGLE = 7, // grass with tropical climate vegetation
  HILLS = 8, // passable mountainous terrain
  MOUNTAIN = 9, // impassable mountains
  SNOW_PLAIN = 10, // plain, but in arctic zone
  SNOW_HILLS = 11, // hiils, but in arctic zone
  SNOW_MOUNTAIN = 12, // mountain, but in arctic zone
  SNOW_WATER = 13, // water, but in arctic zone
}
