import { MapSize } from './enums/MapSize';
import { MapType } from './enums/MapType';
import { ArchipelagoGenerator } from './generators/ArchipelagoGenerator';
import { ContinentsGenerator } from './generators/ContinentsGenerator';
import { ContinentsIslandsGenerator } from './generators/ContinentsIslandsGenerator';
import { HighlandGenerator } from './generators/HighlandGenerator';
import { InlandSeaGenerator } from './generators/InlandSeaGenerator';
import { IslandsGenerator } from './generators/IslandsGenerator';
import { LakesGenerator } from './generators/LakesGenerator';
import { RandomGenerator } from './generators/RandomGenerator';
import { SmallContinentsGenerator } from './generators/SmallContinentsGenerator';
import { SuperContinentGenerator } from './generators/SuperContinentGenerator';
import { IMapGenerator } from './interfaces/IMapGenerator';

// this generator class loads a specific generator (of MapType type)
// and generates a map with specific ruleset and exports its data
// print methods are useful for debug purposes
export class Generator {
  private _map: number[][] = []; // base data of map
  private _map_x: number = 0; // x dimension
  private _map_y: number = 0; // y dimension

  constructor() {
    this._map = [];
  }

  // generate a map of given type and size
  public generateMap(type: MapType, size: MapSize) {
    let generator: IMapGenerator;

    switch (type) {
      case MapType.ARCHIPELAGO:
        generator = new ArchipelagoGenerator();
        break;
      case MapType.INLAND_SEA:
        generator = new InlandSeaGenerator();
        break;
      case MapType.HIGHLAND:
        generator = new HighlandGenerator();
        break;
      case MapType.ISLANDS:
        generator = new IslandsGenerator();
        break;
      case MapType.SMALL_CONTINENTS:
        generator = new SmallContinentsGenerator();
        break;
      case MapType.CONTINENTS:
        generator = new ContinentsGenerator();
        break;
      case MapType.CONTINENTS_ISLANDS:
        generator = new ContinentsIslandsGenerator();
        break;
      case MapType.SUPER_CONTINENT:
        generator = new SuperContinentGenerator();
        break;
      case MapType.LAKES:
        generator = new LakesGenerator();
        break;
      default:
        generator = new RandomGenerator();
    }

    this._map = generator.generate(size);
    this._map_x = generator.rows;
    this._map_y = generator.columns;
  }

  // export generated map
  public exportMap(): [number[], number, number] {
    return [this._map.flat(), this._map_x, this._map_y];
  }

  // print generated map structured (one row as one line)
  public print(): string {
    let response: string = '';
    for (let i = 0; i < this._map_x; ++i) {
      const row = this._map[i];
      // @ts-ignore
      response += row.join(' ');
      if (i < this._map_x - 1) {
        response += '\n';
      }
    }
    return response;
  }

  // print generated map unstructured
  public print_unstructured(): string {
    return this._map.flat().join(' ');
  }
}
