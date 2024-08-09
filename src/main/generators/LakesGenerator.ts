import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';
import { IMapTerrainGenerator } from '../interfaces/IMapTerrainGenerator';
import { Utils } from './Utils';
import { Tile } from './Tile';
import { TerrainType } from '../enums/TerrainType';
import { MapLayer } from '../enums/MapLayer';

export class LakesGenerator implements IMapTerrainGenerator {
  public readonly type: MapType = MapType.ARCHIPELAGO;
  public rows: number = 0;
  public columns: number = 0;
  size: MapSize = MapSize.TINY;

  // configs for external json?
  private readonly factorWater = 0.2;
  private readonly factorMountain = 0.06;
  private readonly factorHills = 0.07;

  public generate(size: MapSize): number[][] {
    this.size = size;
    const [rows, columns] = Utils.convertMapSize(this.size);
    this.rows = rows;
    this.columns = columns;

    // create empty grid
    const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

    // 1. create a map with grassland
    grid.forEach((tile) => {
      tile.terrain = TerrainType.PLAIN;
    });

    // get maximal number of water tiles
    let waterTiles = grid.size * this.factorWater;
    // 2. add randomly lakes
    const lakeCounter = waterTiles / Utils.randomNumber(20, 40); // number of lakes
    let lakeTiles: Tile[] = [];
    Utils.addRandomTileSeed(
      grid,
      this.rows,
      this.columns,
      lakeTiles,
      TerrainType.SHALLOW_WATER,
      TerrainType.PLAIN,
      lakeCounter,
      waterTiles,
    );

    // 3. expand lakes
    Utils.expandWater(grid, lakeTiles, waterTiles);

    // 4. create deep water tiles
    Utils.shallowToDeepWater(grid);

    // get maximal number of mountain tiles
    let mountainTiles = grid.size * this.factorMountain;
    let hillTiles = grid.size * this.factorHills;
    hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
    const hillCounter = hillTiles / Utils.randomNumber(5, 7); // number of mountain ranges
    let mountainRangesTiles: Tile[] = [];
    // 5. create random hills
    Utils.addRandomTileSeed(
      grid,
      this.rows,
      this.columns,
      mountainRangesTiles,
      TerrainType.PLAIN_HILLS,
      TerrainType.PLAIN,
      hillCounter,
      hillTiles,
    );

    // 6. expand hills
    Utils.expandHills(grid, mountainRangesTiles, hillTiles);

    // 7. create mountain tiles
    Utils.hillsToMountains(grid, this.rows, this.columns, mountainTiles);

    return Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.TERRAIN);
  }
}
