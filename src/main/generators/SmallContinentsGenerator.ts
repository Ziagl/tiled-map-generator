import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';
import { IMapGenerator } from '../interfaces/IMapGenerator';
import { Tile } from './Tile';
import { Utils } from './Utils';
import { TileType } from '../enums/TileType';

export class SmallContinentsGenerator implements IMapGenerator {
  public readonly type: MapType = MapType.ARCHIPELAGO;
  public rows: number = 0;
  public columns: number = 0;
  size: MapSize = MapSize.TINY;

  // configs for external json?
  private readonly factorLand = 0.8;
  private readonly factorWater = 0.15;
  private readonly factorMountain = 0.04;
  private readonly factorHills = 0.08;
  private readonly factorDesert = 0.1;
  private readonly factorSwamp = 0.05;
  private readonly factorWood = 0.15;

  public generate(size: MapSize): number[][] {
    this.size = size;
    const [rows, columns] = Utils.convertMapSize(this.size);
    this.rows = rows;
    this.columns = columns;

    // create empty grid
    const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

    // 1. create a map with water
    grid.forEach((tile) => {
      tile.type = TileType.SHALLOW_WATER;
    });

    // get maximal number of land tiles
    let landTiles = grid.size * this.factorLand;
    // 2. add randomly continents
    const continentCounter = Utils.randomNumber(5, 9); // number of continents
    // set contintent seeds to the map with numbering MAXCONTINENTSEED - continentCounter
    Utils.addRandomContinentSeed(grid, this.rows, this.columns, TileType.SHALLOW_WATER, continentCounter);

    // 3. expand continents without touching other continents
    let continentTiles: { key: number; value: Tile[] }[] = [];
    // create continent data structure
    for (let i = Utils.MAXCONTINENTSEED; i > Utils.MAXCONTINENTSEED - continentCounter; --i) {
      // find seed
      grid.forEach((tile) => {
        if (tile.type === i) {
          let tileArray: Tile[] = [];
          tileArray.push(tile);
          continentTiles.push({ key: i, value: tileArray });
        }
      });
    }
    // fill continent data structures with new tiles
    let loopMax = Utils.MAXLOOPS;
    const minContinentSeed = Utils.MAXCONTINENTSEED - continentCounter + 1;
    do {
      const continentToExpand = Utils.randomNumber(minContinentSeed, Utils.MAXCONTINENTSEED);
      let continentTilesArray = continentTiles.find((entry) => entry.key === continentToExpand)?.value;
      if (continentTilesArray != undefined) {
        continentTilesArray = Utils.shuffle<Tile>(continentTilesArray);
        continentTilesArray.forEach((tile) => {
          const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
          neighbors.forEach((neighbor) => {
            if (neighbor.type === TileType.SHALLOW_WATER && landTiles > 0) {
              // check if an adjacent field is not from another continent (continents should not touch!)
              const tileNeighbors = Utils.neighbors(grid, [neighbor.q, neighbor.r]);
              if (
                !tileNeighbors.some(
                  (tileNeighbor) => tileNeighbor.type >= minContinentSeed && tileNeighbor.type != continentToExpand,
                )
              ) {
                neighbor.type = continentToExpand;
                --landTiles;
                // @ts-ignore
                continentTilesArray.push(neighbor);
              }
            }
          });
        });
      }
      const index1 = continentTiles.findIndex((entry) => entry.key === continentToExpand);
      if (index1 !== -1) {
        // @ts-ignore
        continentTiles[index1].value = continentTilesArray;
      }
      --loopMax;
    } while (landTiles > 0 && loopMax > 0);
    // expand random water tiles that are betweed continents
    let waterTiles = grid.size * (this.factorWater / 2);
    loopMax = Utils.MAXLOOPS;
    do {
      let tile = Utils.randomTile(grid, rows, columns);
      if (tile != undefined && tile.type === TileType.SHALLOW_WATER) {
        const tileNeighbors = Utils.neighbors(grid, [tile.q, tile.r]);
        let continentCounter = 0;
        let continentDistinguisher: TileType[] = [];
        tileNeighbors.forEach((neighbor) => {
          if (neighbor.type >= minContinentSeed && !continentDistinguisher.includes(neighbor.type)) {
            continentDistinguisher.push(neighbor.type);
            ++continentCounter;
          }
        });
        if (continentCounter > 1) {
          const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
          neighbors.forEach((neighbor) => {
            if (neighbor.type != TileType.SHALLOW_WATER) {
              neighbor.type = TileType.SHALLOW_WATER;
              --waterTiles;
            }
          });
        }
      }
      --loopMax;
    } while (waterTiles > 0 && loopMax > 0);
    // convert all continent helpers to plains
    const [, maxValue] = Utils.getMinMaxOfEnum(TileType);
    grid.forEach((tile) => {
      if (tile.type > maxValue) {
        tile.type = TileType.PLAIN;
      }
    });

    // 4. add lakes
    waterTiles = grid.size * (this.factorWater / 2);
    // 4a. add randomly lakes
    const lakeCounter = waterTiles / Utils.randomNumber(5, 7); // number of lakes (fifth, sixth or seventh or max number of tiles)
    let lakeTiles: Tile[] = [];
    Utils.addRandomTileSeed(
      grid,
      this.rows,
      this.columns,
      lakeTiles,
      TileType.SHALLOW_WATER,
      TileType.PLAIN,
      lakeCounter,
      waterTiles,
    );

    // 4b. expand lakes
    Utils.expandWater(grid, lakeTiles, waterTiles);

    // 4c. create deep water tiles
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
      TileType.HILLS,
      TileType.PLAIN,
      hillCounter,
      hillTiles,
    );

    // 6. expand hills
    Utils.expandHills(grid, mountainRangesTiles, hillTiles);

    // 7. create mountain tiles
    Utils.hillsToMountains(grid, this.rows, this.columns, mountainTiles);

    // 8. create random deserts
    let desertTiles = grid.size * this.factorDesert;
    Utils.addRandomTile(grid, this.rows, this.columns, TileType.DESERT, desertTiles);

    // 9. add forst and jungle
    let woodTiles = grid.size * this.factorWood;
    Utils.addWoodTiles(grid, this.rows, this.columns, woodTiles);

    // 10. add swamp
    let swampTiles = grid.size * this.factorSwamp;
    Utils.addRandomTile(grid, this.rows, this.columns, TileType.SWAMP, swampTiles);

    // 11. snow
    Utils.createSnowTiles(grid, this.rows);

    return Utils.hexagonToArray(grid, this.rows, this.columns);
  }
}
