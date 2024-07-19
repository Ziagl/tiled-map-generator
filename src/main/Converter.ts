import * as tiled from '@kayahr/tiled';
import { TileMap } from './models/TileMap';
import { TileLayer } from './models/TileLayer';
import { TileSet } from './models/TileSet';

// this converter is used to converts map (2D array) from a generator
// into file format from Tiled (https://www.mapeditor.org/)
export class Converter {
  // saves a generated map into an existing example.json from Tiled editor
  public convertToTiled(map: number[], rows: number, columns: number, data: string): string | null {
    const mainMap = JSON.parse(data) as tiled.Map;
    if (mainMap) {
      mainMap.width = columns;
      mainMap.height = rows;
      let layer = mainMap.layers[0] as tiled.TileLayer;
      layer.width = columns;
      layer.height = rows;
      layer.data = map;

      return JSON.stringify(mainMap);
    }

    return null;
  }

  // get a Tiled editor json string of generated map
  public generateTiledJson(
    map: number[],
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

    let layer = new TileLayer();
    layer.width = columns;
    layer.height = rows;
    layer.data = map;
    layer.name = 'generated tile layer';

    tileMap.layers.push(layer);

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
