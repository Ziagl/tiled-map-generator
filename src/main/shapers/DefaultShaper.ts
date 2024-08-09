import { Grid, rectangle } from "honeycomb-grid";
import { MapHumidity } from "../enums/MapHumidity";
import { MapTemperature } from "../enums/MapTemperature";
import { Tile } from "../generators/Tile";
import { Utils } from "../generators/Utils";
import { IMapLandscapeShaper } from "../interfaces/IMapLandscapeShaper";
import { LandscapeType } from "../enums/LandscapeType";
import { MapLayer } from "../enums/MapLayer";
import { TerrainType } from "../enums/TerrainType";
import { TileDistribution } from "../models/TileDistribution";

export class DefaultShaper implements IMapLandscapeShaper {
    readonly temperature: MapTemperature;
    readonly humidity: MapHumidity;
    readonly rows: number;
    readonly columns: number;

    constructor(temperature: MapTemperature, humidity: MapHumidity, rows: number, columns: number) {
        this.temperature = temperature;
        this.humidity = humidity;
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
        });

        const factorGrass = 0.3;
        const factorDesert = 0.05;
        const factorSwamp = 0.05;
        //const factorWood = 0.15;

        // generate snow tiles and consider temperature
        Utils.createSnowTiles(grid, this.rows, this.temperature);

        // generate tundra and consider temperature
        Utils.createTundraTiles(grid, this.rows, this.temperature);

        // generate grass tile and consider humidity
        let defaultTiles = Utils.countTiles(grid, [TerrainType.PLAIN, TerrainType.PLAIN_HILLS]);
        const grassTiles = Math.round(defaultTiles * factorGrass * (1.5 - 0.5 * this.humidity));
        const grassDistribution = new TileDistribution(0.0, 0.5, 0.1, 0.4);
        Utils.addRandomTerrain(grid, this.rows, this.columns, TerrainType.GRASS, TerrainType.GRASS_HILLS, grassTiles, grassDistribution);

        // generate desert tile and consider humidity
        defaultTiles = Utils.countTiles(grid, [TerrainType.PLAIN, TerrainType.PLAIN_HILLS]);
        const desertTiles = Math.round(defaultTiles * factorDesert * (0.5 + 0.5 * this.humidity));
        const desertDistribution = new TileDistribution(0.0, 0.1, 0.8, 0.1);
        Utils.addRandomTerrain(grid, this.rows, this.columns, TerrainType.DESERT, TerrainType.DESERT_HILLS, desertTiles, desertDistribution);

        /*
        REEF = 2, // water specific tropical
        OASIS = 3, // desert specific
        */
        const affectedTerrain = [TerrainType.PLAIN, TerrainType.TUNDRA];
        defaultTiles = Utils.countTiles(grid, affectedTerrain);
        const swampTiles = Math.round(defaultTiles * factorSwamp * (1.5 - 0.5 * this.humidity));
        const swampDistribution = new TileDistribution(0.2, 0.5, 0.0, 0.3);
        Utils.addRandomLandscape(grid, this.rows, this.columns, LandscapeType.SWAMP, affectedTerrain, swampTiles, swampDistribution);
        /*
        FOREST = 5, // plain / grass / tundra specific
        JUNGLE = 6, // plain / grass specific tropical
        VOLCANO
        */

        const terrain = Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.TERRAIN);
        const landscape = Utils.hexagonToArray(grid, this.rows, this.columns, MapLayer.LANDSCAPE);
        return [terrain, landscape];
    }
}