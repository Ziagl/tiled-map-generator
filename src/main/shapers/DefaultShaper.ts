import { Grid, rectangle } from 'honeycomb-grid';
import { MapHumidity } from '../enums/MapHumidity';
import { MapTemperature } from '../enums/MapTemperature';
import { Tile } from '../models/Tile';
import { Utils } from '../Utils';
import { IMapLandscapeShaper } from '../interfaces/IMapLandscapeShaper';
import { LandscapeType } from '../enums/LandscapeType';
import { MapLayer } from '../enums/MapLayer';
import { TerrainType } from '../enums/TerrainType';
import { TileDistribution } from '../models/TileDistribution';
import { WaterFlowType } from '../enums/WaterFlowType';
import { MapSize } from '../enums/MapSize';
import { Mountain } from '../models/Mountain';

export class DefaultShaper implements IMapLandscapeShaper {
  readonly temperature: MapTemperature;
  readonly humidity: MapHumidity;
  readonly size: MapSize;
  readonly rows: number;
  readonly columns: number;

  constructor(temperature: MapTemperature, humidity: MapHumidity, size: MapSize, rows: number, columns: number) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.size = size;
    this.rows = rows;
    this.columns = columns;
  }

  generate(map: number[][]): number[][][] {
    // create empty grid
    const grid = new Grid(Tile, rectangle({ width: this.columns, height: this.rows }));

    // initialize empty landscape
    let mapIndex = 0;
    const flatMap = map.flat();
    grid.forEach((tile) => {
      tile.terrain = flatMap[mapIndex++]! as TerrainType;
      tile.landscape = LandscapeType.NONE;
      tile.river = WaterFlowType.NONE;
    });

    const factorGrass = 0.3;
    const factorDesert = 0.07;
    const factorReef = 0.05;
    const factorOasis = 0.05;
    const factorSwamp = 0.05;
    const factorWood = 0.3;
    const factorRiver = 1.5;
    
    // how many rivers should we create? depending on map size
    const riverCount = Math.floor(factorRiver * this.size);

    // generate rivers
    this.computeRivers(grid, riverCount);

    // generate SNOW tiles and consider temperature
    Utils.createSnowTiles(grid, this.rows, this.temperature);

    // generate TUNDRA and consider temperature
    Utils.createTundraTiles(grid, this.rows, this.temperature);

    // generate GRASS tile and consider humidity
    let defaultTiles = Utils.countTiles(grid, [TerrainType.PLAIN, TerrainType.PLAIN_HILLS]);
    const grassTiles = Math.round(defaultTiles * factorGrass * (1.5 - 0.5 * this.humidity));
    const grassDistribution = new TileDistribution(0.0, 0.5, 0.1, 0.4);
    Utils.addRandomTerrain(
      grid,
      this.rows,
      this.columns,
      TerrainType.GRASS,
      TerrainType.GRASS_HILLS,
      grassTiles,
      grassDistribution,
    );

    // generate DESERT tile and consider humidity
    defaultTiles = Utils.countTiles(grid, [TerrainType.PLAIN, TerrainType.PLAIN_HILLS]);
    const desertTiles = Math.round(defaultTiles * factorDesert * (0.5 + 0.5 * this.humidity));
    const desertDistribution = new TileDistribution(0.0, 0.1, 0.8, 0.1);
    Utils.addRandomTerrain(
      grid,
      this.rows,
      this.columns,
      TerrainType.DESERT,
      TerrainType.DESERT_HILLS,
      desertTiles,
      desertDistribution,
    );

    // generate REEF tiles
    let affectedTerrain = [TerrainType.DEEP_WATER];
    defaultTiles = Utils.countTiles(grid, affectedTerrain);
    const reefTiles = Math.round(defaultTiles * factorReef);
    const reefDistribution = new TileDistribution(0.0, 0.4, 0.2, 0.4);
    Utils.addRandomLandscape(
      grid,
      this.rows,
      this.columns,
      LandscapeType.REEF,
      affectedTerrain,
      reefTiles,
      reefDistribution,
    );

    // generate OASIS tiles
    if (this.temperature === MapTemperature.HOT) {
      affectedTerrain = [TerrainType.DESERT];
      defaultTiles = Utils.countTiles(grid, affectedTerrain);
      const oasisTiles = Math.round(defaultTiles * factorOasis);
      const oasisDistribution = new TileDistribution(0.0, 0.1, 0.8, 0.1);
      Utils.addRandomLandscape(
        grid,
        this.rows,
        this.columns,
        LandscapeType.OASIS,
        affectedTerrain,
        oasisTiles,
        oasisDistribution,
      );
    }

    // generate SWAMP tiles
    affectedTerrain = [TerrainType.GRASS, TerrainType.PLAIN, TerrainType.TUNDRA];
    defaultTiles = Utils.countTiles(grid, affectedTerrain);
    const swampTiles = Math.round(defaultTiles * factorSwamp * (1.5 - 0.5 * this.humidity));
    const swampDistribution = new TileDistribution(0.2, 0.5, 0.0, 0.3);
    Utils.addRandomLandscape(
      grid,
      this.rows,
      this.columns,
      LandscapeType.SWAMP,
      affectedTerrain,
      swampTiles,
      swampDistribution,
    );

    // generate FOREST tiles
    affectedTerrain = [
      TerrainType.GRASS,
      TerrainType.PLAIN,
      TerrainType.TUNDRA,
      TerrainType.GRASS_HILLS,
      TerrainType.PLAIN_HILLS,
      TerrainType.TUNDRA_HILLS,
    ];
    defaultTiles = Utils.countTiles(grid, affectedTerrain);
    const forestTiles = Math.round(defaultTiles * factorWood * 0.5 * (1.5 - 0.5 * this.humidity));
    const forestDistribution = new TileDistribution(0.05, 0.5, 0.05, 0.4);
    Utils.addRandomLandscape(
      grid,
      this.rows,
      this.columns,
      LandscapeType.FOREST,
      affectedTerrain,
      forestTiles,
      forestDistribution,
    );

    // generate JUNGLE tiles
    affectedTerrain = [TerrainType.GRASS, TerrainType.PLAIN, TerrainType.GRASS_HILLS, TerrainType.PLAIN_HILLS];
    defaultTiles = Utils.countTiles(grid, affectedTerrain);
    const jungleTiles = Math.round(defaultTiles * factorWood * 0.5 * (1.5 - 0.5 * this.humidity));
    const jungleDistribution = new TileDistribution(0.0, 0.0, 0.2, 0.8);
    Utils.addRandomLandscape(
      grid,
      this.rows,
      this.columns,
      LandscapeType.JUNGLE,
      affectedTerrain,
      jungleTiles,
      jungleDistribution,
    );

    // generate VOLCANO tiles
    affectedTerrain = [TerrainType.MOUNTAIN];
    defaultTiles = Utils.countTiles(grid, affectedTerrain);
    const volcanoTiles = Utils.randomNumber(0, Math.min(10, defaultTiles / 10));
    const volcanoDistribution = new TileDistribution();
    Utils.addRandomLandscape(
      grid,
      this.rows,
      this.columns,
      LandscapeType.VOLCANO,
      affectedTerrain,
      volcanoTiles,
      volcanoDistribution,
    );

    const terrain = Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.TERRAIN);
    const landscape = Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.LANDSCAPE);
    const rivers = Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.RIVERS);
    //const riverTileDirections = Utils.generateRiverTileDirections(grid, rivers);
    return [terrain, landscape, rivers];
  }

  // compute given number of rivers on given grid
  private computeRivers(grid: Grid<Tile>, rivers: number): void {
    // create a list of mountains
    let mountains: Mountain[] = [];
    for (let y = 0; y < this.rows; ++y) {
      for (let x = 0; x < this.columns; ++x) {
        if ((grid.getHex({ col: x, row: y }) as Tile).terrain === TerrainType.MOUNTAIN) {
          mountains.push(new Mountain(x, y));
        }
      }
    }
    // compute distance to water for each mountain
    mountains.forEach((mountain) => {
      mountain.distanceToWater = Utils.distanceToWater(grid, mountain.pos_x, mountain.pos_y, this.rows, this.columns);
    });
    // sort mountains descending by distance to water
    mountains.sort((a, b) => b.distanceToWater - a.distanceToWater);

    // create given amount of rivers
    let generatedRivers:Tile[][] = [];
    for(let i = 0; i < rivers; ++i) {
      const mountain = mountains.shift();
      let maxTry = 10;
      let riverPath:Tile[] = [];
      // try maxTry times to get a random river from this mountain
      do{
        riverPath = Utils.createRiverPath(grid, mountain!);
        --maxTry;
      }while(maxTry > 0 && riverPath.length === 0);
      if(riverPath.length > 0) {
        // mark all river tiles on the grid
        riverPath.forEach((tile) => {
          tile.river = WaterFlowType.RIVER;
        });
        // add river to list of rivers
        generatedRivers.push(riverPath);
        // compute distance to next river
        mountains.forEach((mountain) => {
          mountain.distanceToRiver = Utils.distanceToRiver(grid, mountain.pos_x, mountain.pos_y, this.rows, this.columns);
        });
        // sort list of mountains
        mountains.sort((a, b) => (b.distanceToWater + b.distanceToRiver) - (a.distanceToWater + a.distanceToRiver));
      }
    }
    console.log("Generated rivers: " + generatedRivers.length);
  }
}
