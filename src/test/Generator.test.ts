import { Generator } from '../main/Generator';
import { MapHumidity } from '../main/enums/MapHumidity';
import { MapSize } from '../main/enums/MapSize';
import { MapTemperature } from '../main/enums/MapTemperature';
import { MapType } from '../main/enums/MapType';

test('RandomGenerator', () => {
  const gen = new Generator();
  //@ts-ignore
  gen.generateMap(-1, MapSize.TINY, MapTemperature.HOT, MapHumidity.DRY);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
  expect(gen.print.length).not.toBeGreaterThan(0);
  expect(gen.print_unstructured.length).not.toBeGreaterThan(0);
  let mapString = gen.print();
  expect(mapString.length).toBeGreaterThan(0);
  mapString = gen.print_unstructured();
  expect(mapString.length).toBeGreaterThan(0);
});
test('Archipelago', () => {
  const gen = new Generator();
  gen.generateMap(MapType.ARCHIPELAGO, MapSize.TINY, MapTemperature.COLD, MapHumidity.WET);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('Continents', () => {
  const gen = new Generator();
  gen.generateMap(MapType.CONTINENTS, MapSize.TINY, MapTemperature.HOT, MapHumidity.DRY);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('ContinentsIslands', () => {
  const gen = new Generator();
  gen.generateMap(MapType.CONTINENTS_ISLANDS, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('Highland', () => {
  const gen = new Generator();
  gen.generateMap(MapType.HIGHLAND, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('InlandSea', () => {
  const gen = new Generator();
  gen.generateMap(MapType.INLAND_SEA, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('Islands', () => {
  const gen = new Generator();
  gen.generateMap(MapType.ISLANDS, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('Lakes', () => {
  const gen = new Generator();
  gen.generateMap(MapType.LAKES, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('SmallContinents', () => {
  const gen = new Generator();
  gen.generateMap(MapType.SMALL_CONTINENTS, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
test('SuperContinent', () => {
  const gen = new Generator();
  gen.generateMap(MapType.SUPER_CONTINENT, MapSize.TINY, MapTemperature.NORMAL, MapHumidity.NORMAL);
  const [map, rows, columns] = gen.exportTerrainMap();
  expect(map.length).toEqual(rows * columns);
});
