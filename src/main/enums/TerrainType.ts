// all possible basic terrain types of earth like planets
export enum TerrainType {
  DEEP_WATER = 1, // deep water is surrounded by water tiles
  SHALLOW_WATER = 2, // basic water type next to land
  DESERT = 3, // lots of sand
  DESERT_HILLS = 4, // desert with hills
  PLAIN = 5, // plain land
  PLAIN_HILLS = 6, // plain land with hills
  GRASS = 7, // grass land
  GRASS_HILLS = 8, // grass land with hills
  TUNDRA = 9, // grass with cold climate vegetation
  TUNDRA_HILLS = 10, // grass with cold climate vegetation and hills
  SNOW = 11, // plain, but in arctic zone
  SNOW_HILLS = 12, // hills, but in arctic zone
  MOUNTAIN = 13, // impassable mountains
}
