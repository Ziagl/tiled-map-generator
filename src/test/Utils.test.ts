import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../main/enums/MapSize';
import { Utils } from '../main/Utils';
import { TileDistribution } from '../main/models/TileDistribution';
import { Tile } from '../main/models/Tile';
import { TerrainType } from '../main';

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