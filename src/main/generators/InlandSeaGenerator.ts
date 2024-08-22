import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';
import { IMapTerrainGenerator } from '../interfaces/IMapTerrainGenerator';
import { Utils } from '../Utils';
import { Tile } from '../models/Tile';
import { TerrainType } from '../enums/TerrainType';
import { MapLayer } from '../enums/MapLayer';

export class InlandSeaGenerator implements IMapTerrainGenerator {
  public readonly type: MapType = MapType.ARCHIPELAGO;
  public rows: number = 0;
  public columns: number = 0;
  size: MapSize = MapSize.TINY;

  // configs for external json?
  private readonly factorWater = 0.3;
  private readonly factorMountain = 0.1;
  private readonly factorHills = 0.1;

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

    // 2. create a lake in the middle of map
    let waterTiles = grid.size * this.factorWater;
    // 2a. add randomly lake seeds in the middle of the map
    let tileFactor = waterTiles / 5;
    const lakeCounter = Utils.randomNumber(tileFactor / 2, tileFactor); // number of lakes seeds
    let lakeTiles: Tile[] = [];
    for (let i = 0; i < lakeCounter; ++i) {
      let tile: Tile | undefined = undefined;
      let row_border = this.rows / 5;
      let col_border = this.columns / 5;
      let loopMax = Utils.MAXLOOPS;
      do {
        tile = Utils.randomTile(grid, this.rows, this.columns);
        if (tile != undefined) {
          if (
            tile.row >= row_border &&
            tile.row < this.rows - row_border &&
            tile.col >= col_border &&
            tile.col < this.columns - col_border
          ) {
            tile.terrain = TerrainType.SHALLOW_WATER;
            --waterTiles;
            lakeTiles.push(tile);
            break;
          }
        }
        --loopMax;
      } while (loopMax > 0);
    }
    // 2b. add some random water tiles
    let randomSeeds = Utils.randomNumber(5, 15);
    Utils.addRandomTileSeed(
      grid,
      this.rows,
      this.columns,
      lakeTiles,
      TerrainType.SHALLOW_WATER,
      TerrainType.PLAIN,
      randomSeeds,
      waterTiles,
    );

    // 2c. expand lakes
    Utils.expandWater(grid, lakeTiles, waterTiles);

    // 2d. create deep water tiles
    Utils.shallowToDeepWater(grid);

    // get maximal number of mountain tiles
    let mountainTiles = grid.size * this.factorMountain;
    let hillTiles = grid.size * this.factorHills;
    hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
    const hillCounter = hillTiles / Utils.randomNumber(8, 12); // number of mountain ranges
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
