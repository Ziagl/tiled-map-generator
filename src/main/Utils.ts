import { Direction, Grid, ring } from 'honeycomb-grid';
import { MapSize } from './enums/MapSize';
import { Tile } from './models/Tile';
import { TerrainType } from './enums/TerrainType';
import { LandscapeType } from './enums/LandscapeType';
import { MapLayer } from './enums/MapLayer';
import { MapTemperature } from './enums/MapTemperature';
import { TileDistribution } from './models/TileDistribution';
import { Mountain } from './models/Mountain';
import { WaterFlowType } from './enums/WaterFlowType';

export class Utils {
  public static readonly MAXLOOPS = 10000;
  public static readonly MAXCONTINENTSEED = 999;

  // converts a map size type to 2d dimensional width and height
  public static convertMapSize(size: MapSize): [rows: number, columns: number] {
    let rows = 26;
    let columns = 44;

    switch (size) {
      case MapSize.MICRO: // 1144
        rows = 26;
        columns = 44;
        break;
      case MapSize.TINY: // 2280
        rows = 38;
        columns = 60;
        break;
      case MapSize.SMALL: // 3404
        rows = 46;
        columns = 74;
        break;
      case MapSize.MEDIUM: // 4536
        rows = 54;
        columns = 84;
        break;
      case MapSize.LARGE: // 5760
        rows = 60;
        columns = 96;
        break;
      case MapSize.HUGE: // 6996
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

  // returns a random tile of given grid and row
  public static randomTileOfRow(grid: Grid<Tile>, rows: number, columns: number, row: number): Tile | undefined {
    if (row < 0 || row >= rows) {
      row = 0;
    }
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
      if (tile.terrain === TerrainType.SHALLOW_WATER) {
        const neighbors = Utils.neighbors(grid, [tile.q, tile.r]);
        // if all neighbors are water tiles -> tile is deep water
        if (
          neighbors.every(
            (neighbor) => neighbor.terrain === TerrainType.DEEP_WATER || neighbor.terrain === TerrainType.SHALLOW_WATER,
          )
        ) {
          tile.terrain = TerrainType.DEEP_WATER;
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
          if (
            neighbor.terrain != TerrainType.SHALLOW_WATER &&
            neighbor.terrain != TerrainType.DEEP_WATER &&
            waterTiles > 0
          ) {
            neighbor.terrain = TerrainType.SHALLOW_WATER;
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
          if (neighbor.terrain != TerrainType.PLAIN && landTiles > 0) {
            neighbor.terrain = TerrainType.PLAIN;
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
            neighbor.terrain != TerrainType.SHALLOW_WATER &&
            neighbor.terrain != TerrainType.DEEP_WATER &&
            neighbor.terrain != TerrainType.PLAIN_HILLS &&
            hillTiles > 0
          ) {
            neighbor.terrain = TerrainType.PLAIN_HILLS;
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
      if (tile != undefined && tile.terrain === TerrainType.PLAIN_HILLS) {
        const neighbors = Utils.neighbors(grid, [tile.q, tile.r]);
        // if all neighbors are hill tiles or water -> tile is mountain tile
        if (
          neighbors.every(
            (neighbor) =>
              neighbor.terrain === TerrainType.MOUNTAIN ||
              neighbor.terrain === TerrainType.PLAIN_HILLS ||
              neighbor.terrain === TerrainType.SHALLOW_WATER ||
              neighbor.terrain === TerrainType.DEEP_WATER,
          ) &&
          !neighbors.every(
            (neighbor) => neighbor.terrain === TerrainType.SHALLOW_WATER || neighbor.terrain === TerrainType.DEEP_WATER,
          )
        ) {
          tile.terrain = TerrainType.MOUNTAIN;
          --mountainTiles;
        } else {
          // if there is maximum one other additional tile
          let countOthers = 0;
          neighbors.forEach((neighbor) => {
            if (
              neighbor.terrain != TerrainType.MOUNTAIN &&
              neighbor.terrain != TerrainType.PLAIN_HILLS &&
              neighbor.terrain != TerrainType.SHALLOW_WATER &&
              neighbor.terrain != TerrainType.DEEP_WATER
            ) {
              ++countOthers;
            }
          });

          if (countOthers <= 1) {
            tile.terrain = TerrainType.MOUNTAIN;
            --mountainTiles;
          }
        }
      }
      --loopMax;
    } while (mountainTiles > 0 && loopMax > 0);
  }

  // counts given list of tile types in grid
  public static countTiles(grid: Grid<Tile>, types: TerrainType[]): number {
    let count = 0;
    grid.forEach((tile) => {
      if (types.includes(tile.terrain)) {
        ++count;
      }
    });
    return count;
  }

  // add random tiles of given type
  public static addRandomTileSeed(
    grid: Grid<Tile>,
    rows: number,
    columns: number,
    tiles: Tile[],
    type: TerrainType,
    oldType: TerrainType,
    count: number,
    maxCount: number,
  ) {
    for (let i = 0; i < count; ++i) {
      let loopMax = Utils.MAXLOOPS;
      let tile: Tile | undefined = undefined;
      do {
        tile = Utils.randomTile(grid, rows, columns);
        --loopMax;
      } while (loopMax > 0 && (tile === undefined || tile.terrain != oldType));
      if (tile != undefined) {
        tile.terrain = type;
        --maxCount;
        tiles.push(tile);
      }
    }
  }

  // add random continents of given type
  public static addRandomContinentSeed(
    grid: Grid<Tile>,
    rows: number,
    columns: number,
    oldType: TerrainType,
    count: number,
  ) {
    for (let i = 0; i < count; ++i) {
      let loopMax = Utils.MAXLOOPS;
      let tile: Tile | undefined = undefined;
      do {
        tile = Utils.randomTile(grid, rows, columns);
        --loopMax;
      } while (loopMax > 0 && (tile === undefined || tile.terrain != oldType));
      if (tile != undefined) {
        tile.terrain = Utils.MAXCONTINENTSEED - i;
      }
    }
  }

  // adds given landscape type to given terrain tiles
  public static addRandomLandscape(
    grid: Grid<Tile>,
    rows: number,
    columns: number,
    type: LandscapeType,
    terrains: TerrainType[],
    count: number,
    distribution: TileDistribution,
  ) {
    let loopMax = Utils.MAXLOOPS;
    const rowsPerZone = Utils.climateZonesSeparation(rows);
    const tilesPerZone: number[] = [];
    tilesPerZone.push(Math.floor(distribution.polar * count));
    tilesPerZone.push(Math.floor(distribution.temperate * count));
    tilesPerZone.push(Math.floor(distribution.dry * count));
    tilesPerZone.push(Math.floor(distribution.tropical * count));
    let currentZone = 0;
    do {
      // place tile for current zone
      if (tilesPerZone[currentZone]! > 0) {
        const randomRowIndex = Utils.randomNumber(0, rowsPerZone[currentZone]!.length - 1);
        let tile = Utils.randomTileOfRow(grid, rows, columns, rowsPerZone[currentZone]![randomRowIndex]!);
        if (tile != undefined && terrains.includes(tile.terrain)) {
          tile.landscape = type;
          --count;
          --tilesPerZone[currentZone]!;
        }
      } else {
        if (currentZone < tilesPerZone.length - 1) {
          ++currentZone;
        } else {
          // place random landscape instead? TODO
          count = 0;
        }
      }
      --loopMax;
    } while (count > 0 && loopMax > 0);
  }

  // converts given number of plain terrain tiles to given tile type
  public static addRandomTerrain(
    grid: Grid<Tile>,
    rows: number,
    columns: number,
    type_flat: TerrainType,
    type_hill: TerrainType,
    count: number,
    distribution: TileDistribution,
  ) {
    let loopMax = Utils.MAXLOOPS;
    const rowsPerZone = Utils.climateZonesSeparation(rows);
    const tilesPerZone: number[] = [];
    tilesPerZone.push(Math.floor(distribution.polar * count));
    tilesPerZone.push(Math.floor(distribution.temperate * count));
    tilesPerZone.push(Math.floor(distribution.dry * count));
    tilesPerZone.push(Math.floor(distribution.tropical * count));
    let currentZone = 0;
    do {
      // place tile for current zone
      if (tilesPerZone[currentZone]! > 0) {
        const randomRowIndex = Utils.randomNumber(0, rowsPerZone[currentZone]!.length - 1);
        let tile = Utils.randomTileOfRow(grid, rows, columns, rowsPerZone[currentZone]![randomRowIndex]!);
        if (tile != undefined && tile.terrain === TerrainType.PLAIN) {
          tile.terrain = type_flat;
          --count;
          --tilesPerZone[currentZone]!;
        } else if (tile != undefined && tile.terrain === TerrainType.PLAIN_HILLS) {
          tile.terrain = type_hill;
          --count;
          --tilesPerZone[currentZone]!;
        }
      } else {
        if (currentZone < tilesPerZone.length - 1) {
          ++currentZone;
        } else {
          // place random tile instead? TODO
          count = 0;
        }
      }
      --loopMax;
    } while (count > 0 && loopMax > 0);
  }

  // returns an array of map rows for each climate zone
  public static climateZonesSeparation(rows: number): number[][] {
    let climateZoneRows: number[][] = [];
    let lastRows = 0;
    for (let zoneSize of TileDistribution.climateZoneSizes) {
      // create new array of lines for climate zone
      let rowNumbers: number[] = [];
      // rows per hemisphere
      const neededRows = Math.round((zoneSize * rows) / 2);
      for (let i = 0; i < neededRows; ++i) {
        rowNumbers.push(lastRows + i);
        rowNumbers.push(rows - (lastRows + i + 1));
      }
      climateZoneRows.push(rowNumbers);
      lastRows += rowNumbers.length / 2;
    }
    return climateZoneRows;
  }

  // create snow tiles in polar region
  public static createSnowTiles(grid: Grid<Tile>, rows: number, temperature: MapTemperature) {
    grid.forEach((tile) => {
      let chance = 0;
      if (tile.r === 0 || tile.r === rows - 1) {
        chance = 10;
      }
      if (temperature < MapTemperature.HOT) {
        if (tile.r === 1 || tile.r === rows - 2) {
          if (temperature < MapTemperature.NORMAL) {
            chance = 6;
          } else {
            chance = 4;
          }
        }
      }
      if (temperature < MapTemperature.NORMAL) {
        if (tile.r === 2 || tile.r === rows - 3) {
          chance = 4;
        }
      }

      if (chance > 0) {
        if (Utils.randomNumber(0, 9) < chance) {
          switch (tile.terrain) {
            case TerrainType.SHALLOW_WATER:
            case TerrainType.DEEP_WATER:
              tile.landscape = LandscapeType.ICE;
              break;
            case TerrainType.PLAIN_HILLS:
              tile.terrain = TerrainType.SNOW_HILLS;
              break;
            case TerrainType.PLAIN:
              tile.terrain = TerrainType.SNOW;
          }
        }
      }
    });
  }

  // create tundra tiles in polar region
  public static createTundraTiles(grid: Grid<Tile>, rows: number, temperature: MapTemperature) {
    grid.forEach((tile) => {
      let chance = 0;
      if (tile.r === 1 || tile.r === rows - 2) {
        chance = 10;
      }
      if (tile.r === 2 || tile.r === rows - 3) {
        switch (temperature) {
          case MapTemperature.HOT:
            chance = 3;
            break;
          case MapTemperature.NORMAL:
            chance = 8;
            break;
          case MapTemperature.COLD:
            chance = 9;
            break;
        }
      }
      if (temperature < MapTemperature.NORMAL) {
        if (tile.r === 3 || tile.r === rows - 4) {
          chance = 6;
        }
        if (tile.r === 4 || tile.r === rows - 5) {
          chance = 3;
        }
      }

      if (chance > 0) {
        if (Utils.randomNumber(0, 9) < chance) {
          switch (tile.terrain) {
            case TerrainType.PLAIN_HILLS:
              tile.terrain = TerrainType.TUNDRA_HILLS;
              break;
            case TerrainType.PLAIN:
              tile.terrain = TerrainType.TUNDRA;
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
  public static hexagonToArray(grid: Grid<Tile>, rows: number, columns: number, layer: MapLayer): number[][] {
    // create empty map
    let map = new Array(rows).fill([]).map(() => new Array(columns));

    // convert hexagon grid to 2d map
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < columns; ++j) {
        switch (layer) {
          case MapLayer.TERRAIN:
            map[i]![j] = (grid.getHex({ col: j, row: i }) as Tile).terrain;
            break;
          case MapLayer.LANDSCAPE:
            map[i]![j] = (grid.getHex({ col: j, row: i }) as Tile).landscape;
            break;
          case MapLayer.RIVERS:
            map[i]![j] = (grid.getHex({ col: j, row: i }) as Tile).river;
            break;
        }
      }
    }

    return map;
  }

  // computes the distance to next water tile
  public static distanceToWater(grid: Grid<Tile>, x: number, y: number, rows:number, columns:number):number {
    let distance = 0;
    let radius = 1;
    const maxRadius = Math.max(rows, columns);
    do{
      const radiusRing = ring<Tile>({ center: [y, x], radius: radius });
      const tiles = grid.traverse(radiusRing);
      tiles.forEach((tile) => {
        if(tile.terrain === TerrainType.SHALLOW_WATER || tile.terrain === TerrainType.DEEP_WATER){
          distance = radius;
        }
      });
      ++radius;
    } while (distance === 0 && radius <= maxRadius);
    return distance;
  }

  // computes the distance to next river tile
  public static distanceToRiver(grid: Grid<Tile>, x: number, y: number, rows:number, columns:number):number {
    let distance = 0;
    let radius = 1;
    const maxRadius = Math.max(rows, columns);
    do{
      const radiusRing = ring<Tile>({ center: [y, x], radius: radius });
      const tiles = grid.traverse(radiusRing);
      tiles.forEach((tile) => {
        if(tile.river === WaterFlowType.RIVER){
          distance = radius;
        }
      });
      ++radius;
    } while (distance === 0 && radius <= maxRadius);
    return distance;
  }

  // creates a path from given mountain to a water tile nearby
  public static createRiverPath(grid: Grid<Tile>, mountain: Mountain): Tile[] {
    let openList: Tile[] = [];
    let closedList: Tile[][] = [];
    let riverPath: Tile[] = [];
    let loopMax = Utils.MAXLOOPS;
    let nextTile:Tile = grid.getHex({ col: mountain.pos_x, row: mountain.pos_y }) as Tile;
    let success = false;
    do{
      // add current open list to closed list
      if(openList.length > 0){
        closedList.push(openList);
        openList = [];
      }
      // get neighbors and add neighbors to open list
      let neighbors = Utils.neighbors(grid, [nextTile.q, nextTile.r]);
      neighbors.forEach((neighbor) => {
        if(success === false) {
          if(neighbor.terrain === TerrainType.SHALLOW_WATER || neighbor.terrain === TerrainType.DEEP_WATER){
            // found water tile -> clear open list
            openList = [];
            success = true;
          }
          else if(neighbor.terrain != TerrainType.MOUNTAIN){
            // if it is not a mountain tile and not already in closed list
            if(!closedList.some((list) => list.includes(neighbor))){
              openList.push(neighbor);
            }
          }
        }
      });
      // select next tile
      if(openList.length > 0 && success === false){
        nextTile = openList[Utils.randomNumber(0, openList.length - 1)] as Tile;
        // TODO
        // tile that is at least far away from water instead of random???
        riverPath.push(nextTile);
      }
      --loopMax;
    }while(loopMax > 0 && openList.length > 0);
    if(success) {
      return riverPath;
    } else {
      return [];
    }
  }
}
