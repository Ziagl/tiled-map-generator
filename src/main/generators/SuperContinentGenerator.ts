import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';
import { IMapTerrainGenerator } from '../interfaces/IMapTerrainGenerator';
import { Utils } from '../Utils';
import { Tile } from '../models/Tile';
import { TerrainType } from '../enums/TerrainType';
import { MapLayer } from '../enums/MapLayer';

export class SuperContinentGenerator implements IMapTerrainGenerator {
  public readonly type: MapType = MapType.ARCHIPELAGO;
  public rows: number = 0;
  public columns: number = 0;
  size: MapSize = MapSize.TINY;

  // configs for external json?
  private readonly factorLand = 0.7;
  private readonly factorMountain = 0.05;
  private readonly factorHills = 0.08;

  public generate(size: MapSize): number[][] {
    this.size = size;
    const [rows, columns] = Utils.convertMapSize(this.size);
    this.rows = rows;
    this.columns = columns;

    // create empty grid
    const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

    // 1. create a default water map
    grid.forEach((tile) => {
      tile.terrain = TerrainType.SHALLOW_WATER;
    });

    // 2. create super continent landmass
    let landTiles = grid.size * this.factorLand;
    // 2a. add randomly land seeds in the middle of the map
    let tileFactor = landTiles / 6;
    const landCounter = Utils.randomNumber(tileFactor / 2, tileFactor); // number of continent seeds
    let plainTiles: Tile[] = [];
    for (let i = 0; i < landCounter; ++i) {
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
            tile.terrain = TerrainType.PLAIN;
            --landTiles;
            plainTiles.push(tile);
            break;
          }
        }
        --loopMax;
      } while (loopMax > 0);
    }
    // 2b. add some random land tiles
    let randomSeeds = Utils.randomNumber(5, 15);
    Utils.addRandomTileSeed(
      grid,
      this.rows,
      this.columns,
      plainTiles,
      TerrainType.PLAIN,
      TerrainType.SHALLOW_WATER,
      randomSeeds,
      landTiles,
    );

    // 2c. expand land
    Utils.expandLand(grid, plainTiles, landTiles);

    // 3. add some lakes
    let lakeSeeds = Utils.randomNumber(10, 20);
    let lakeTiles: Tile[] = [];
    let waterTiles = lakeSeeds * Utils.randomNumber(4, 7);
    Utils.addRandomTileSeed(
      grid,
      this.rows,
      this.columns,
      lakeTiles,
      TerrainType.SHALLOW_WATER,
      TerrainType.PLAIN,
      lakeSeeds,
      waterTiles,
    );

    // 4. exand created lakes
    Utils.expandWater(grid, lakeTiles, waterTiles);

    // 5. create deep water tiles
    Utils.shallowToDeepWater(grid);

    // get maximal number of mountain tiles
    let mountainTiles = grid.size * this.factorMountain;
    let hillTiles = grid.size * this.factorHills;
    hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
    const hillCounter = hillTiles / Utils.randomNumber(8, 12); // number of mountain ranges
    let mountainRangesTiles: Tile[] = [];
    // 6. create random hills
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

    // 7. expand hills
    Utils.expandHills(grid, mountainRangesTiles, hillTiles);

    // 8. create mountain tiles
    Utils.hillsToMountains(grid, this.rows, this.columns, mountainTiles);

    return Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.TERRAIN);
  }
}
