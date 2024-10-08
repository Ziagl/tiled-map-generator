import { Converter } from '../main/Converter';
import { Generator } from '../main/Generator';
import { MapHumidity } from '../main/enums/MapHumidity';
import { MapSize } from '../main/enums/MapSize';
import { MapTemperature } from '../main/enums/MapTemperature';
import { MapType } from '../main/enums/MapType';
import * as fs from 'fs';

test('convertToTiled', () => {
  let gen = new Generator();
  gen.generateMap(MapType.CONTINENTS_ISLANDS, MapSize.MICRO, MapTemperature.NORMAL, MapHumidity.NORMAL, 0.0);
  let converter = new Converter();
  const [map, rows, columns] = gen.exportMap();
  const data =
    '{ "compressionlevel":-1, "height":9, "hexsidelength":16, "infinite":false, "layers":[ { "data":[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 2, 3, 3, 3, 3, 9, 3, 3, 1, 5, 6, 5, 2, 2, 2, 3, 3, 3, 9, 9, 3, 3, 1, 5, 6, 5, 2, 2, 2, 3, 3, 3, 3, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 7, 9, 9, 9, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 7, 7, 9, 9, 3, 3, 3, 1, 1, 5, 6, 5, 5, 2, 7, 5, 5, 3, 3, 3, 1, 1, 5, 6, 5, 5, 5, 2, 7, 7, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 2], "height":9, "id":1, "name":"Layer 1", "opacity":1, "type":"tilelayer", "visible":true, "width":14, "x":0, "y":0 }, { "data":[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 2, 3, 3, 3, 3, 9, 3, 3, 1, 5, 6, 5, 2, 2, 2, 3, 3, 3, 9, 9, 3, 3, 1, 5, 6, 5, 2, 2, 2, 3, 3, 3, 3, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 7, 9, 9, 9, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 7, 7, 9, 9, 3, 3, 3, 1, 1, 5, 6, 5, 5, 2, 7, 5, 5, 3, 3, 3, 1, 1, 5, 6, 5, 5, 5, 2, 7, 7, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 2], "height":9, "id":1, "name":"Layer 2", "opacity":1, "type":"tilelayer", "visible":true, "width":14, "x":0, "y":0 }, { "data":[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 2, 3, 3, 3, 3, 9, 3, 3, 1, 5, 6, 5, 2, 2, 2, 3, 3, 3, 9, 9, 3, 3, 1, 5, 6, 5, 2, 2, 2, 3, 3, 3, 3, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 7, 9, 9, 9, 9, 9, 3, 1, 5, 6, 5, 5, 2, 2, 7, 7, 9, 9, 3, 3, 3, 1, 1, 5, 6, 5, 5, 2, 7, 5, 5, 3, 3, 3, 1, 1, 5, 6, 5, 5, 5, 2, 7, 7, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 2], "height":9, "id":1, "name":"Layer 1", "opacity":1, "type":"tilelayer", "visible":true, "width":14, "x":0, "y":0 }], "nextlayerid":2, "nextobjectid":1, "orientation":"hexagonal", "renderorder":"right-down", "staggeraxis":"y", "staggerindex":"odd", "tiledversion":"1.4.2", "tileheight":34, "tilesets":[ { "columns":13, "firstgid":1, "image":"tileset.png", "imageheight":34, "imagewidth":416, "margin":0, "name":"tileset", "spacing":0, "tilecount":13, "tileheight":34, "tilewidth":32, "transparentcolor":"#ffffff" }], "tilewidth":32, "type":"map", "version":1.4, "width":14 }';
  const result = converter.convertToTiled(map, rows, columns, data);
  expect(result).not.toBeNull();
});
test('generateTiledJson', () => {
  let gen = new Generator();
  gen.generateMap(MapType.CONTINENTS_ISLANDS, MapSize.MICRO, MapTemperature.NORMAL, MapHumidity.NORMAL, 0.0);
  let converter = new Converter();
  const [map, rows, columns] = gen.exportMap();
  const result = converter.generateTiledJson(map, rows, columns, 'tileset.png', 32, 34, 416, 34, 13, 13, '#ffffff');
  expect(result).not.toBeNull();
});
test('generateTiledFile', () => {
  let gen = new Generator();
  gen.generateMap(MapType.SUPER_CONTINENT, MapSize.MICRO, MapTemperature.NORMAL, MapHumidity.NORMAL, 0.0);
  let converter = new Converter();
  const [map, rows, columns] = gen.exportMap();
  const result = converter.generateTiledJson(map, rows, columns, 'tileset.png', 32, 34, 416, 34, 13, 13, '#ffffff');
  fs.writeFileSync('src/example/test.json', result);
});
