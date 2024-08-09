import { MapLayer } from '../enums/MapLayer';
import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';
import { TerrainType } from '../enums/TerrainType';
import { IMapTerrainGenerator } from '../interfaces/IMapTerrainGenerator';
import { Tile } from './Tile';
import { Utils } from './Utils';
import { Grid, rectangle } from 'honeycomb-grid';

export class RandomGenerator implements IMapTerrainGenerator {
  public readonly type: MapType = MapType.HIGHLAND;
  public rows: number = 0;
  public columns: number = 0;
  size: MapSize = MapSize.TINY;

  public generate(size: MapSize): number[][] {
    this.size = size;
    var [min, max] = Utils.getMinMaxOfEnum(TerrainType);
    const [rows, columns] = Utils.convertMapSize(this.size);
    this.rows = rows;
    this.columns = columns;

    // create empty grid
    const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

    // compute grid
    grid.forEach((tile) => {
      tile.terrain = Utils.randomNumber(min, max);
    });

    return Utils.hexagonToArray(grid, rows, columns, MapLayer.TERRAIN);
  }
}
