import { Direction, Grid } from 'honeycomb-grid';
import { MapSize } from '../enums/MapSize';
import { Tile } from './Tile';
import { TileType } from '../enums/TileType';

export class Utils {
  public static readonly MAXLOOPS = 10000;
  public static readonly MAXCONTINENTSEED = 999;

  // converts a map size type to 2d dimensional width and height
  public static convertMapSize(size: MapSize): [rows: number, columns: number] {
    let rows = 26;
    let columns = 44;

    switch (size) {
      case MapSize.MICRO:
        rows = 26;
        columns = 44;
        break;
      case MapSize.TINY:
        rows = 38;
        columns = 60;
        break;
      case MapSize.SMALL:
        rows = 46;
        columns = 74;
        break;
      case MapSize.MEDIUM:
        rows = 54;
        columns = 84;
        break;
      case MapSize.LARGE:
        rows = 60;
        columns = 96;
        break;
      case MapSize.HUGE:
        rows = 66;
        columns = 106;
        break;
    }

    return [rows, columns];
  }

  // generates a random number between min and max (both included)
  public static randomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // gets the minimal and maximal values of an enum
  public static getMinMaxOfEnum(e: object): [min: number, max: number] {
    const values = Object.keys(e)
      .map((k) => (k === '' ? NaN : +k))
      .filter((k) => !isNaN(k))
      .sort((k1, k2) => k1 - k2);

    return [values[0] ?? 0, values[values.length - 1] ?? 0];
  }

  // returns a random tile of given grid
  public static randomTile(grid: Grid<Tile>, rows: number, columns: number): Tile | undefined {
    const row = this.randomNumber(0, rows - 1);
    const column = this.randomNumber(0, columns - 1);
    return grid.getHex({ col: column, row: row });
  }

  // returns all up to 6 neighbors of given grid and coordinate
  public static neighbors(grid: Grid<Tile>, coordinates: [q: number, r: number]): Tile[] {
    let neighbors: Tile[] = [];

    if (grid.neighborOf(coordinates, Direction.N, { allowOutside: false }) !== undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.N));
    }
    if (grid.neighborOf(coordinates, Direction.NE, { allowOutside: false }) !== undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.NE));
    }
    if (grid.neighborOf(coordinates, Direction.E, { allowOutside: false }) != undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.E));
    }
    if (grid.neighborOf(coordinates, Direction.SE, { allowOutside: false }) != undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.SE));
    }
    if (grid.neighborOf(coordinates, Direction.S, { allowOutside: false }) != undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.S));
    }
    if (grid.neighborOf(coordinates, Direction.SW, { allowOutside: false }) != undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.SW));
    }
    if (grid.neighborOf(coordinates, Direction.W, { allowOutside: false }) != undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.W));
    }
    if (grid.neighborOf(coordinates, Direction.NW, { allowOutside: false }) != undefined) {
      neighbors.push(grid.neighborOf(coordinates, Direction.NW));
    }

    return neighbors;
  }

  // returns a random neighbor of given grid and coordinate
  public static randomNeighbors(grid: Grid<Tile>, coordinates: [q: number, s: number]): Tile[] {
    let allNeighbors = this.neighbors(grid, coordinates);
    let neighbors: Tile[] = [];

    // randomly select neighbors
    allNeighbors.forEach((neighbor) => {
      if (this.randomNumber(0, 1) === 0) {
        // 50 : 50 chance
        neighbors.push(neighbor);
      }
    });

    return neighbors;
  }

  // turns all shallow water tiles into deep water tiles if they are fully surrounded by water
  public static shallowToDeepWater(grid: Grid<Tile>) {
    grid.forEach((tile) => {
      if (tile.type === TileType.SHALLOW_WATER) {
        const neighbors = Utils.neighbors(grid, [tile.q, tile.r]);
        // if all neighbors are water tiles -> tile is deep water
        if (
          neighbors.every(
            (neighbor) => neighbor.type === TileType.DEEP_WATER || neighbor.type === TileType.SHALLOW_WATER,
          )
        ) {
          tile.type = TileType.DEEP_WATER;
        }
      }
    });
  }

  // expand given lakeTiles randomly till number of waterTiles were placed
  public static expandWater(grid: Grid<Tile>, lakeTiles: Tile[], waterTiles: number) {
    let loopMax = Utils.MAXLOOPS;
    do {
      lakeTiles = Utils.shuffle<Tile>(lakeTiles);
      lakeTiles.forEach((tile) => {
        const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
        neighbors.forEach((neighbor) => {
          if (neighbor.type != TileType.SHALLOW_WATER && neighbor.type != TileType.DEEP_WATER && waterTiles > 0) {
            neighbor.type = TileType.SHALLOW_WATER;
            --waterTiles;
            lakeTiles.push(neighbor);
          }
        });
      });
      --loopMax;
    } while (waterTiles > 0 && loopMax > 0);
  }

  // expand given landTiles randomly till number of landTiles were placed
  public static expandLand(grid: Grid<Tile>, plainTiles: Tile[], landTiles: number) {
    let loopMax = Utils.MAXLOOPS;
    do {
      plainTiles = Utils.shuffle<Tile>(plainTiles);
      plainTiles.forEach((tile) => {
        const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
        neighbors.forEach((neighbor) => {
          if (neighbor.type != TileType.PLAIN && landTiles > 0) {
            neighbor.type = TileType.PLAIN;
            --landTiles;
            plainTiles.push(neighbor);
          }
        });
      });
      --loopMax;
    } while (landTiles > 0 && loopMax > 0);
  }

  // expand given hillTiles randomly till number of hillTiles were placed
  public static expandHills(grid: Grid<Tile>, mountainRangesTiles: Tile[], hillTiles: number) {
    let loopMax = Utils.MAXLOOPS;
    do {
      mountainRangesTiles = Utils.shuffle<Tile>(mountainRangesTiles);
      mountainRangesTiles.forEach((tile) => {
        const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
        neighbors.forEach((neighbor) => {
          if (
            neighbor.type != TileType.SHALLOW_WATER &&
            neighbor.type != TileType.DEEP_WATER &&
            neighbor.type != TileType.HILLS &&
            hillTiles > 0
          ) {
            neighbor.type = TileType.HILLS;
            --hillTiles;
            mountainRangesTiles.push(neighbor);
          }
        });
      });
      --loopMax;
    } while (hillTiles > 0 && loopMax > 0);
  }

  // turn hills into mountains till number of mountains is reached
  public static hillsToMountains(grid: Grid<Tile>, rows: number, columns: number, mountainTiles: number) {
    let loopMax = Utils.MAXLOOPS;
    do {
      let tile = Utils.randomTile(grid, rows, columns);
      if (tile != undefined && tile.type === TileType.HILLS) {
        const neighbors = Utils.neighbors(grid, [tile.q, tile.r]);
        // if all neighbors are hill tiles or water -> tile is mountain tile
        if (
          neighbors.every(
            (neighbor) =>
              neighbor.type === TileType.MOUNTAIN ||
              neighbor.type === TileType.HILLS ||
              neighbor.type === TileType.SHALLOW_WATER ||
              neighbor.type === TileType.DEEP_WATER,
          ) &&
          !neighbors.every(
            (neighbor) => neighbor.type === TileType.SHALLOW_WATER || neighbor.type === TileType.DEEP_WATER,
          )
        ) {
          tile.type = TileType.MOUNTAIN;
          --mountainTiles;
        } else {
          // if there is maximum one other additional tile
          let countOthers = 0;
          neighbors.forEach((neighbor) => {
            if (
              neighbor.type != TileType.MOUNTAIN &&
              neighbor.type != TileType.HILLS &&
              neighbor.type != TileType.SHALLOW_WATER &&
              neighbor.type != TileType.DEEP_WATER
            ) {
              ++countOthers;
            }
          });

          if (countOthers <= 1) {
            tile.type = TileType.MOUNTAIN;
            --mountainTiles;
          }
        }
      }
      --loopMax;
    } while (mountainTiles > 0 && loopMax > 0);
  }

  // add random tiles of given type
  public static addRandomTileSeed(
    grid: Grid<Tile>,
    rows: number,
    columns: number,
    lakeTiles: Tile[],
    type: TileType,
    oldType: TileType,
    count: number,
    maxCount: number,
  ) {
    for (let i = 0; i < count; ++i) {
      let loopMax = Utils.MAXLOOPS;
      let tile: Tile | undefined = undefined;
      do {
        tile = Utils.randomTile(grid, rows, columns);
        --loopMax;
      } while (loopMax > 0 && (tile === undefined || tile.type != oldType));
      if (tile != undefined) {
        tile.type = type;
        --maxCount;
        lakeTiles.push(tile);
      }
    }
  }

  // add random continents of given type
  public static addRandomContinentSeed(
    grid: Grid<Tile>,
    rows: number,
    columns: number,
    oldType: TileType,
    count: number,
  ) {
    for (let i = 0; i < count; ++i) {
      let loopMax = Utils.MAXLOOPS;
      let tile: Tile | undefined = undefined;
      do {
        tile = Utils.randomTile(grid, rows, columns);
        --loopMax;
      } while (loopMax > 0 && (tile === undefined || tile.type != oldType));
      if (tile != undefined) {
        tile.type = Utils.MAXCONTINENTSEED - i;
      }
    }
  }

  // converts given number of plain tiles to given tile type
  public static addRandomTile(grid: Grid<Tile>, rows: number, columns: number, type: TileType, count: number) {
    let loopMax = Utils.MAXLOOPS;
    do {
      let tile = Utils.randomTile(grid, rows, columns);
      if (tile != undefined && tile.type === TileType.PLAIN) {
        tile.type = type;
        --count;
      }
      --loopMax;
    } while (count > 0 && loopMax > 0);
  }

  public static addWoodTiles(grid: Grid<Tile>, rows: number, columns: number, count: number) {
    let loopMax = Utils.MAXLOOPS;
    do {
      let tile = Utils.randomTile(grid, rows, columns);
      if (tile != undefined && tile.type === TileType.PLAIN) {
        // depending on climate region chance is different for forest and jungle
        const third = rows / 3;
        let chanceForest = 5; // 50:50 if random number 0-9
        if (tile.r < third || tile.r > third * 2) {
          chanceForest = 8;
        }
        if (Utils.randomNumber(0, 9) < chanceForest) {
          tile.type = TileType.FOREST;
        } else {
          tile.type = TileType.JUNGLE;
        }
        --count;
      }
      --loopMax;
    } while (count > 0 && loopMax > 0);
  }

  // create snow tiles in polar region
  public static createSnowTiles(grid: Grid<Tile>, rows: number) {
    grid.forEach((tile) => {
      let chanceForSnow = 0;
      if (tile.r === 0 || tile.r === rows - 1) {
        chanceForSnow = 10;
      }
      if (tile.r === 1 || tile.r === rows - 2) {
        chanceForSnow = 7;
      }
      if (tile.r === 2 || tile.r === rows - 3) {
        chanceForSnow = 4;
      }

      if (chanceForSnow > 0) {
        if (Utils.randomNumber(0, 9) < chanceForSnow) {
          switch (tile.type) {
            case TileType.DEEP_WATER:
            case TileType.SHALLOW_WATER:
              tile.type = TileType.SNOW_WATER;
              break;
            case TileType.HILLS:
              tile.type = TileType.SNOW_HILLS;
              break;
            case TileType.MOUNTAIN:
              tile.type = TileType.SNOW_MOUNTAIN;
              break;
            default:
              tile.type = TileType.SNOW_PLAIN;
          }
        }
      }
    });
  }

  // shuffle a given list (independent of type)
  public static shuffle<T>(arr: T[]): T[] {
    return arr
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  // converts a grid into a 2d number array
  public static hexagonToArray(grid: Grid<Tile>, rows: number, columns: number): number[][] {
    // create empty map
    let map = new Array(rows).fill([]).map(() => new Array(columns));

    // convert hexagon grid to 2d map
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < columns; ++j) {
        // @ts-ignore
        map[i][j] = grid.getHex({ col: j, row: i }).type;
      }
    }

    return map;
  }
}
