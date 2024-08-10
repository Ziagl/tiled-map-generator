import * as tiled from '@kayahr/tiled';
import { TileMap } from './models/TileMap';
import { TileLayer } from './models/TileLayer';
import { TileSet } from './models/TileSet';

// this converter is used to converts map (2D array) from a generator
// into file format from Tiled (https://www.mapeditor.org/)
export class Converter {
  /**
   * saves a generated map into an existing example.json from Tiled editor
   * @param map 2D array of map
   * @param rows number of rows
   * @param columns number of columns
   * @param data existing example.json from Tiled editor
   * @returns a string of the new map in Tiled editor format or null if given data is not a valid Tiled editor json
   */
  public convertToTiled(map: number[][], rows: number, columns: number, data: string): string {
    const mainMap = JSON.parse(data) as tiled.Map;

    mainMap.width = columns;
    mainMap.height = rows;
    for (let i = 0; i < map.length; i++) {
      let layer = mainMap.layers[i] as tiled.TileLayer;
      layer.width = columns;
      layer.height = rows;
      layer.data = map[i]!;
      layer.name = 'generated tile layer ' + i;
    }

    return JSON.stringify(mainMap);
  }

  /**
   * get a Tiled editor json string of generated map
   * @param map 2D array of map
   * @param rows number of rows
   * @param columns number of columns
   * @param imagefile image file name
   * @param tilewidth width of a tile
   * @param tileheight height of a tile
   * @param imagewidth width of the image
   * @param imageheight height of the image
   * @param tilecount number of tiles
   * @param tilecolumns number of columns of tiles
   * @param transparentcolor transparent color of the image
   * @returns a string of the new map in Tiled editor format
   */
  public generateTiledJson(
    map: number[][],
    rows: number,
    columns: number,
    imagefile: string,
    tilewidth: number,
    tileheight: number,
    imagewidth: number,
    imageheight: number,
    tilecount: number,
    tilecolumns: number,
    transparentcolor: string,
  ): string {
    const tileMap = new TileMap();
    tileMap.width = columns;
    tileMap.height = rows;
    tileMap.tilewidth = tilewidth;
    tileMap.tileheight = tileheight;
    tileMap.hexsidelength = tilewidth / 2;

    // add all layers
    for (let i = 0; i < map.length; i++) {
      let layer = new TileLayer();
      layer.width = columns;
      layer.height = rows;
      layer.data = map[i]!;
      layer.name = 'generated tile layer ' + i;

      tileMap.layers.push(layer);
    }

    let tileset = new TileSet();
    tileset.imageheight = imageheight;
    tileset.imagewidth = imagewidth;
    tileset.columns = tilecolumns;
    tileset.tilecount = tilecount;
    tileset.tilewidth = tilewidth;
    tileset.tileheight = tileheight;
    tileset.image = imagefile;
    tileset.transparentcolor = transparentcolor;

    tileMap.tilesets.push(tileset);

    return JSON.stringify(tileMap);
  }
}
