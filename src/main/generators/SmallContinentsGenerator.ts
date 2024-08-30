import { Grid, rectangle } from 'honeycomb-grid';
import { MapSize } from '../enums/MapSize';
import { MapType } from '../enums/MapType';
import { IMapTerrainGenerator } from '../interfaces/IMapTerrainGenerator';
import { Tile } from '../models/Tile';
import { Utils } from '../Utils';
import { TerrainType } from '../enums/TerrainType';
import { MapLayer } from '../enums/MapLayer';

export class SmallContinentsGenerator implements IMapTerrainGenerator {
  public readonly type: MapType = MapType.ARCHIPELAGO;
  public rows: number = 0;
  public columns: number = 0;
  size: MapSize = MapSize.TINY;

  // configs for external json?
  private readonly factorLand = 0.8;
  private readonly factorWater = 0.15;
  private readonly factorMountain = 0.04;
  private readonly factorHills = 0.08;

  public generate(size: MapSize): number[][] {
    this.size = size;
    const [rows, columns] = Utils.convertMapSize(this.size);
    this.rows = rows;
    this.columns = columns;

    // create empty grid
    const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

    // 1. create a map with water
    grid.forEach((tile) => {
      tile.terrain = TerrainType.SHALLOW_WATER;
    });

    // get maximal number of land tiles
    let landTiles = grid.size * this.factorLand;
    // 2. add randomly continents
    const continentCounter = Utils.randomNumber(5, 9); // number of continents
    // set contintent seeds to the map with numbering MAXCONTINENTSEED - continentCounter
    Utils.addRandomContinentSeed(grid, this.rows, this.columns, TerrainType.SHALLOW_WATER, continentCounter);

    // 3. expand continents without touching other continents
    let continentTiles: { key: number; value: Tile[] }[] = [];
    // create continent data structure
    for (let i = Utils.MAXCONTINENTSEED; i > Utils.MAXCONTINENTSEED - continentCounter; --i) {
      // find seed
      grid.forEach((tile) => {
        if (tile.terrain === i) {
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
          const neighbors = Utils.randomNeighbors(grid, { q: tile.q, r: tile.r, s: tile.s });
          neighbors.forEach((neighbor) => {
            if (neighbor.terrain === TerrainType.SHALLOW_WATER && landTiles > 0) {
              // check if an adjacent field is not from another continent (continents should not touch!)
              const tileNeighbors = Utils.neighbors(grid, { q: neighbor.q, r: neighbor.r, s: neighbor.s });
              if (
                !tileNeighbors.some(
                  (tileNeighbor) =>
                    tileNeighbor.terrain >= minContinentSeed && tileNeighbor.terrain != continentToExpand,
                )
              ) {
                neighbor.terrain = continentToExpand;
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
      if (tile != undefined && tile.terrain === TerrainType.SHALLOW_WATER) {
        const tileNeighbors = Utils.neighbors(grid, { q: tile.q, r: tile.r, s: tile.s });
        let continentCounter = 0;
        let continentDistinguisher: TerrainType[] = [];
        tileNeighbors.forEach((neighbor) => {
          if (neighbor.terrain >= minContinentSeed && !continentDistinguisher.includes(neighbor.terrain)) {
            continentDistinguisher.push(neighbor.terrain);
            ++continentCounter;
          }
        });
        if (continentCounter > 1) {
          const neighbors = Utils.randomNeighbors(grid, { q: tile.q, r: tile.r, s: tile.s });
          neighbors.forEach((neighbor) => {
            if (neighbor.terrain != TerrainType.SHALLOW_WATER) {
              neighbor.terrain = TerrainType.SHALLOW_WATER;
              --waterTiles;
            }
          });
        }
      }
      --loopMax;
    } while (waterTiles > 0 && loopMax > 0);
    // convert all continent helpers to plains
    const [, maxValue] = Utils.getMinMaxOfEnum(TerrainType);
    grid.forEach((tile) => {
      if (tile.terrain > maxValue) {
        tile.terrain = TerrainType.PLAIN;
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
      TerrainType.SHALLOW_WATER,
      TerrainType.PLAIN,
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
