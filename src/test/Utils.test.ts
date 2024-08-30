import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../main/enums/MapSize';
import { Utils } from '../main/Utils';
import { TileDistribution } from '../main/models/TileDistribution';
import { Tile } from '../main/models/Tile';
import { TerrainType } from '../main';
import { Mountain } from '../main/models/Mountain';

const mapSize = 8;
// DEEP_WATER = 1
// SHALLOW_WATER = 2
// DESERT = 3
// MOUNTAIN = 13
const exampleMapEasy:number[] = [
  1, 1, 1, 1, 1, 1, 1, 1,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 13, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  1, 1, 1, 1, 1, 1, 1, 1,
];
const mountainCoordinateEasy = { col: 2, row: 2 };
const exampleMapMedium:number[] = [
  1, 1, 1, 1, 1, 1, 1, 1,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 3,
  2, 3, 3, 3, 13, 3, 3, 3,
  2, 3, 3, 3, 3, 3, 3, 3,
  2, 3, 3, 3, 3, 3, 3, 3,
  1, 1, 1, 3, 3, 3, 3, 3,
];
const mountainCoordinateMedium = { col: 4, row: 4 };
const exampleMapAdvanced:number[] = [
  1, 1, 1, 1, 1, 1, 1, 1,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 13, 13, 3, 13,
  2, 3, 3, 3, 3, 3, 3, 13,
  2, 3, 3, 3, 13, 3, 3, 13,
  1, 1, 1, 1, 3, 3, 3, 3,
];

test('tileDistributionClass', () => {
  let distribution = new TileDistribution(0.0, 0.1, 0.8, 0.1);
  expect(distribution.polar).toBe(0.0);
  expect(distribution.temperate).toBe(0.1);
  expect(distribution.dry).toBe(0.8);
  expect(distribution.tropical).toBe(0.1);
  distribution = new TileDistribution(0.9, 0.2, 1.5, 0.7);
  expect(distribution.polar).toBeCloseTo(0.27);
  expect(distribution.temperate).toBeCloseTo(0.06);
  expect(distribution.dry).toBeCloseTo(0.45);
  expect(distribution.tropical).toBeCloseTo(0.21);
  distribution = new TileDistribution(0.0, 0.0, 0.0, 0.0);
  expect(distribution.polar).toBe(0.25);
  expect(distribution.temperate).toBe(0.25);
  expect(distribution.dry).toBe(0.25);
  expect(distribution.tropical).toBe(0.25);
});
test('climateZonesSeparation', () => {
  let rows = Utils.climateZonesSeparation(100);
  expect(rows[0]?.length).toBe(18); // polar
  expect(rows[1]?.length).toBe(38); // temperate
  expect(rows[2]?.length).toBe(14); // dry
  expect(rows[3]?.length).toBe(30); // tropical
});
test('convertMapSize', () => {
  let data = Utils.convertMapSize(MapSize.MICRO);
  expect(data[0]).toBe(26);
  expect(data[1]).toBe(44);
  data = Utils.convertMapSize(MapSize.TINY);
  expect(data[0]).toBe(38);
  expect(data[1]).toBe(60);
  data = Utils.convertMapSize(MapSize.SMALL);
  expect(data[0]).toBe(46);
  expect(data[1]).toBe(74);
  data = Utils.convertMapSize(MapSize.MEDIUM);
  expect(data[0]).toBe(54);
  expect(data[1]).toBe(84);
  data = Utils.convertMapSize(MapSize.LARGE);
  expect(data[0]).toBe(60);
  expect(data[1]).toBe(96);
  data = Utils.convertMapSize(MapSize.HUGE);
  expect(data[0]).toBe(66);
  expect(data[1]).toBe(106);
});
test('randomTileOfRow', () => {
  const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));
  let row = Utils.randomTileOfRow(grid, 10, 10, -1);
  expect(row).not.toBeUndefined();
});
test('getMinMaxOfEnum', () => {
  let data = Utils.getMinMaxOfEnum(MapSize);
  expect(data[0]).toBe(1);
  expect(data[1]).toBe(6);
});
test('findCommonTiles', () => {
  const array1 = new Grid(Tile, rectangle({ width: 2, height: 2 }));
  const array2 = new Grid(Tile, rectangle({ width: 1, height: 5 }));
  const array3 = new Grid(Tile, rectangle({ width: 5, height: 2 }));
  let tileArray1:Tile[] = [];
  array1.forEach((tile) => { tileArray1.push(tile); });
  let tileArray2:Tile[] = [];
  array2.forEach((tile) => { tileArray2.push(tile); });
  let tileArray3:Tile[] = [];
  array3.forEach((tile) => { tileArray3.push(tile); });
  let common = Utils.findCommonTiles([tileArray1, tileArray2]);
  expect(common.length).toBe(2);
  common = Utils.findCommonTiles([tileArray1, tileArray3]);
  expect(common.length).toBe(4);
  common = Utils.findCommonTiles([tileArray1, tileArray2, tileArray3]);
  expect(common.length).toBe(2);
});
test('removeCommonTiles', () => {
  const array1 = new Grid(Tile, rectangle({ width: 2, height: 2 }));
  const array2 = new Grid(Tile, rectangle({ width: 1, height: 5 }));
  const array3 = new Grid(Tile, rectangle({ width: 5, height: 2 }));
  let tileArray1:Tile[] = [];
  array1.forEach((tile) => { tileArray1.push(tile); });
  let tileArray2:Tile[] = [];
  array2.forEach((tile) => { tileArray2.push(tile); });
  let tileArray3:Tile[] = [];
  array3.forEach((tile) => { tileArray3.push(tile); });
  let common = Utils.removeCommonTiles(tileArray1, tileArray2);
  expect(common.length).toBe(2);
  common = Utils.removeCommonTiles(tileArray2, tileArray1);
  expect(common.length).toBe(3);
  common = Utils.removeCommonTiles(tileArray1, tileArray3);
  expect(common.length).toBe(0);
});
test('distanceToWater', () => {
  const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));
  grid.forEach((tile) => { tile.terrain = TerrainType.DESERT; });
  let tile = grid.getHex({ col: 4, row: 3 }) as Tile;
  tile.terrain = TerrainType.SHALLOW_WATER;
  let distance = Utils.distanceToWater(grid, 4, 4, 10, 10);
  expect(distance).toBe(2);

  const grid1 = new Grid(Tile, rectangle({ width: 10, height: 10 }));
  grid1.forEach((tile) => { tile.terrain = TerrainType.DESERT; });
  tile = grid1.getHex({ col: 0, row: 0 }) as Tile;
  tile.terrain = TerrainType.SHALLOW_WATER;
  distance = Utils.distanceToWater(grid1, 4, 4, 10, 10);
  expect(distance).toBe(8);

  const grid2 = new Grid(Tile, rectangle({ width: 10, height: 10 }));
  grid2.forEach((tile) => { tile.terrain = TerrainType.DESERT; });
  distance = Utils.distanceToWater(grid2, 4, 4, 10, 10);
  expect(distance).toBe(0);
});
test('createRiverPath', () => {
  const grid = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  let index = 0;
  grid.forEach((tile) => { tile.terrain = exampleMapEasy[index++] as TerrainType; });
  const mountain = new Mountain(mountainCoordinateEasy.col, mountainCoordinateEasy.row);
  let path = Utils.createRiverPath(grid, mountain);
  expect(path.length).toBeGreaterThanOrEqual(0);
  const grid1 = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  index = 0;
  grid1.forEach((tile) => { tile.terrain = exampleMapMedium[index++] as TerrainType; });
  const mountain1 = new Mountain(mountainCoordinateMedium.col, mountainCoordinateMedium.row);
  path = Utils.createRiverPath(grid1, mountain1);
  expect(path.length).toBeGreaterThanOrEqual(2);
  const grid2 = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  index = 0;
  grid2.forEach((tile) => { tile.terrain = exampleMapAdvanced[index++] as TerrainType; });
  const mountain2 = new Mountain(mountainCoordinateMedium.col, mountainCoordinateMedium.row);
  path = Utils.createRiverPath(grid2, mountain2);
  expect(path.length).toBeGreaterThanOrEqual(2);
});
