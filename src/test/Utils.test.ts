import { /*Direction,*/ Grid, rectangle } from 'honeycomb-grid';
//import { MapSize } from '../main/enums/MapSize';
import { Utils } from '../main/Utils';
//import { TileDistribution } from '../main/models/TileDistribution';
import { Tile } from '../main/models/Tile';
import { TerrainType } from '../main';
//import { Mountain } from '../main/models/Mountain';
//import { Utils as GlobalUtils } from '@ziagl/tiled-map-utils';

const mapSize = 8;
// DEEP_WATER = 1
// SHALLOW_WATER = 2
// DESERT = 3
// MOUNTAIN = 13
const exampleMapEasy: number[] = [
  2, 2, 2, 2, 2, 2, 2, 2, 
    2, 3, 4, 4, 3, 3, 3, 2, 
  2, 3, 4, 13, 4, 3, 3, 2, 
    2, 3, 4, 4, 3, 3, 3, 2, 
  2, 3, 3, 3, 3, 3, 3, 2, 
    2, 3, 3, 3, 3, 3, 3, 2, 
  2, 3, 3, 3, 3, 3, 3, 2, 
    2, 2, 2, 2, 2, 2, 2, 2,
];
const mountainCoordinateEasy = { q: 2, r: 2, s: -4 };
const exampleMapMedium: number[] = [
  2, 2, 2, 2, 2, 2, 2, 2,  
    2, 3, 3, 3, 3, 3, 3, 2, 
  2, 3, 3, 3, 3, 3, 3, 2, 
    2, 3, 3, 13, 3, 3, 3, 2, 
  2, 3, 3, 3, 3, 3, 3, 2, 
    2, 3, 3, 3, 3, 3, 3, 2, 
  2, 3, 3, 3, 3, 3, 3, 2, 
    2, 2, 2, 2, 2, 2, 2, 2, 
];
const mountainCoordinateMedium = { q: 2, r: 3, s:-5 };
const exampleMapAdvanced: number[] = [
  2, 2, 2, 2, 2, 2, 2, 2,  
    2, 3, 3, 3, 3, 3, 3, 2,
  2, 3, 3, 3, 3, 3, 3, 2, 
    2, 3, 3, 3, 3, 3, 3, 2, 
  2, 3, 3, 3, 13, 13, 3, 13,
    2, 3, 3, 3, 3, 3, 3, 13, 
  2, 3, 3, 3, 13, 3, 3, 13,
    2, 2, 2, 2, 2, 2, 2, 2, 
];

/*test('tileDistributionClass', () => {
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
  let tileArray1: Tile[] = [];
  array1.forEach((tile) => {
    tileArray1.push(tile);
  });
  let tileArray2: Tile[] = [];
  array2.forEach((tile) => {
    tileArray2.push(tile);
  });
  let tileArray3: Tile[] = [];
  array3.forEach((tile) => {
    tileArray3.push(tile);
  });
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
  let tileArray1: Tile[] = [];
  array1.forEach((tile) => {
    tileArray1.push(tile);
  });
  let tileArray2: Tile[] = [];
  array2.forEach((tile) => {
    tileArray2.push(tile);
  });
  let tileArray3: Tile[] = [];
  array3.forEach((tile) => {
    tileArray3.push(tile);
  });
  let common = Utils.removeCommonTiles(tileArray1, tileArray2);
  expect(common.length).toBe(2);
  common = Utils.removeCommonTiles(tileArray2, tileArray1);
  expect(common.length).toBe(3);
  common = Utils.removeCommonTiles(tileArray1, tileArray3);
  expect(common.length).toBe(0);
});
test('detectNeighborhood', () => {
  const tile1 = { q: 1, r: 1, s: -2 } as Tile;
  const tile2 = { q: 2, r: 0, s: -2 } as Tile;
  const tile3 = { q: 2, r: 1, s: -3 } as Tile;
  const tile4 = { q: 1, r: 2, s: -3 } as Tile;
  const tile5 = { q: 0, r: 2, s: -2 } as Tile;
  const tile6 = { q: 0, r: 1, s: -1 } as Tile;
  const tile7 = { q: 1, r: 0, s: -1 } as Tile;
  let direction = Utils.detectNeighborhood(tile2, tile6);
  expect(direction).toBeUndefined();
  direction = Utils.detectNeighborhood(tile1, tile2);
  expect(direction).toBe(Direction.NE);
  direction = Utils.detectNeighborhood(tile1, tile3);
  expect(direction).toBe(Direction.E);
  direction = Utils.detectNeighborhood(tile1, tile4);
  expect(direction).toBe(Direction.SE);
  direction = Utils.detectNeighborhood(tile1, tile5);
  expect(direction).toBe(Direction.SW);
  direction = Utils.detectNeighborhood(tile1, tile6);
  expect(direction).toBe(Direction.W);
  direction = Utils.detectNeighborhood(tile1, tile7);
  expect(direction).toBe(Direction.NW);
});*/
test('findNearestTile', () => {
  // easy
  const grid = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  let index = 0;
  grid.forEach((tile) => {
    tile.terrain = exampleMapEasy[index++] as TerrainType;
  });
  let data = Utils.findNearestTile(grid, mountainCoordinateEasy, 10, TerrainType.SHALLOW_WATER);
  expect(data?.distance).toBe(2);
  data = Utils.findNearestTile(grid, mountainCoordinateEasy, 10, TerrainType.DEEP_WATER);
  expect(data).toBeUndefined;
  // medium
  const grid1 = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  index = 0;
  grid1.forEach((tile) => {
    tile.terrain = exampleMapMedium[index++] as TerrainType;
  });
  data = Utils.findNearestTile(grid1, mountainCoordinateMedium, 10, TerrainType.SHALLOW_WATER);
  expect(data?.distance).toBeGreaterThanOrEqual(3);
  // advanced
  const grid2 = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  index = 0;
  grid2.forEach((tile) => {
    tile.terrain = exampleMapAdvanced[index++] as TerrainType;
  });
  data = Utils.findNearestTile(grid2, mountainCoordinateMedium, 10, TerrainType.SHALLOW_WATER);
  expect(data?.distance).toBeGreaterThanOrEqual(3);
});/*
test('createRiverPath', () => {
  // easy
  const grid = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  let index = 0;
  grid.forEach((tile) => {
    tile.terrain = exampleMapEasy[index++] as TerrainType;
  });
  let mountain = new Mountain(mountainCoordinateEasy.col, mountainCoordinateEasy.row);
  let distanceToWater = Utils.distanceToWater(grid, mountain.pos_x, mountain.pos_y, mapSize, mapSize);
  expect(distanceToWater).toBeGreaterThan(0);
  let path = Utils.createRiverPath(grid, mountain, distanceToWater);
  expect(path.length).toBeGreaterThanOrEqual(0);
  // medium
  const grid1 = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  index = 0;
  grid1.forEach((tile) => {
    tile.terrain = exampleMapMedium[index++] as TerrainType;
  });
  const mountain1 = new Mountain(mountainCoordinateMedium.col, mountainCoordinateMedium.row);
  distanceToWater = Utils.distanceToWater(grid1, mountain.pos_x, mountain.pos_y, mapSize, mapSize);
  expect(distanceToWater).toBeGreaterThan(0);
  path = Utils.createRiverPath(grid1, mountain1, distanceToWater + 5);
  // advanced
  expect(path.length).toBeGreaterThanOrEqual(2);
  const grid2 = new Grid(Tile, rectangle({ width: mapSize, height: mapSize }));
  index = 0;
  grid2.forEach((tile) => {
    tile.terrain = exampleMapAdvanced[index++] as TerrainType;
  });
  const mountain2 = new Mountain(mountainCoordinateMedium.col, mountainCoordinateMedium.row);
  distanceToWater = Utils.distanceToWater(grid2, mountain.pos_x, mountain.pos_y, mapSize, mapSize);
  expect(distanceToWater).toBeGreaterThan(0);
  path = Utils.createRiverPath(grid2, mountain2, distanceToWater + 5);
  expect(path.length).toBeGreaterThanOrEqual(2);
});
test('generateRiverTileDirections', () => {
  const tile1 = { q: 0, r: 0, s: 0 } as Tile;
  tile1.coordinates = { q: 0, r: 0, s: 0 };
  const tile2 = { q: 1, r: 0, s: -1 } as Tile;
  tile2.coordinates = { q: 1, r: 0, s: -1 };
  const tile3 = { q: 0, r: 1, s: -1 } as Tile;
  tile3.coordinates = { q: 0, r: 1, s: -1 };
  const tile4 = { q: 1, r: 1, s: -2 } as Tile;
  tile4.coordinates = { q: 1, r: 1, s: -2 };
  const river: Tile[] = [tile1, tile2, tile3, tile4];
  const directionMap = Utils.generateRiverTileDirections(river);
  let directions = directionMap.get(GlobalUtils.coordinateToKey(tile1));
  expect(directions?.length).toBe(1);
  expect(directions![0]).toBe(Direction.E);
  directions = directionMap.get(GlobalUtils.coordinateToKey(tile3));
  expect(directions?.length).toBe(2);
  expect(directions![0]).toBe(Direction.NE);
  expect(directions![1]).toBe(Direction.E);
});*/
