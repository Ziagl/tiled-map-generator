import { MapHumidity } from './enums/MapHumidity';
import { MapLayer } from './enums/MapLayer';
import { MapSize } from './enums/MapSize';
import { MapTemperature } from './enums/MapTemperature';
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
import { Utils } from './Utils';
import { IMapLandscapeShaper } from './interfaces/IMapLandscapeShaper';
import { IMapTerrainGenerator } from './interfaces/IMapTerrainGenerator';
import { DefaultShaper } from './shapers/DefaultShaper';
import { Direction } from 'honeycomb-grid';

// this generator class loads a specific generator (of MapType type)
// and generates a map with specific ruleset and exports its data
// print methods are useful for debug purposes
export class Generator {
  private readonly _layers: string[] = ['terrain', 'landscape', 'river']; // layers of map
  private readonly _riverbed: number = 3;
  private _map: number[][][] = []; // base data of map
  private _map_x: number = 0; // x dimension
  private _map_y: number = 0; // y dimension
  private _mapRiverTileDirections: Map<string, Direction[]> = null!; // river tile directions

  constructor() {
    this._map = [];
  }

  /**
   * generate a map of given type and size
   * @param type type of map
   * @param size size of map
   * @param temperature temperature of map
   * @param humidity humidity of map
   * @param factorRiver factor of rivers to create (factor * Map.Size)
   */
  public generateMap(
    type: MapType,
    size: MapSize,
    temperature: MapTemperature,
    humidity: MapHumidity,
    factorRiver: number,
  ) {
    let generator: IMapTerrainGenerator;
    let shaper: IMapLandscapeShaper;

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

    const [rows, columns] = Utils.convertMapSize(size);
    shaper = new DefaultShaper(temperature, humidity, size, rows, columns);

    const mapData = shaper.generate(generator.generate(size), factorRiver, this._riverbed);
    this._map = [mapData.terrain, mapData.landscape, mapData.rivers];
    this._mapRiverTileDirections = mapData.riverTileDirections;
    this._map_x = generator.rows;
    this._map_y = generator.columns;
  }

  /**
   * export generated map
   * @returns a tuple of map data, x dimension, and y dimension
   */
  public exportMap(): [number[][], number, number] {
    const terrainMap = this.exportTerrainMap();
    const landscapeMap = this.exportLandscapeMap();
    const riverMap = this.exportRiverMap();
    return [[terrainMap[0], landscapeMap[0], riverMap[0]], terrainMap[1], terrainMap[2]];
  }

  public exportTerrainMap(): [number[], number, number] {
    return [this._map[MapLayer.TERRAIN]!.flat(), this._map_x, this._map_y];
  }

  public exportLandscapeMap(): [number[], number, number] {
    return [this._map[MapLayer.LANDSCAPE]!.flat(), this._map_x, this._map_y];
  }

  public exportRiverMap(): [number[], number, number] {
    return [this._map[MapLayer.RIVERS]!.flat(), this._map_x, this._map_y];
  }

  public exportRiverTileDirections(): Map<string, Direction[]> {
    return this._mapRiverTileDirections;
  }

  /**
   * print generated map structured (one row as one line)
   * @returns a string of the map
   */
  public print(): string {
    let response: string = '';
    for (let type = 0; type < this._map.length; ++type) {
      const layer = this._map[type];
      response += this._layers[type] + '\n';
      if (layer !== undefined) {
        for (let i = 0; i < this._map_x; ++i) {
          const row = layer[i];
          // @ts-ignore
          response += row.join(' ');
          if (i < this._map_x - 1) {
            response += '\n';
          }
        }
      }
    }
    return response;
  }

  /**
   * print generated map unstructured
   * @returns a string of the map
   */
  public print_unstructured(): string {
    return this._map.flat().join(' ');
  }
}
