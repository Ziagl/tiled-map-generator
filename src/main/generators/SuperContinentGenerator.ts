import { Grid, rectangle } from "honeycomb-grid";
import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";
import { IMapGenerator } from "../interfaces/IMapGenerator";
import { Utils } from "./Utils";
import { Tile } from "./Tile";
import { TileType } from "../enums/TileType";

export class SuperContinentGenerator implements IMapGenerator {
    public readonly type:MapType = MapType.ARCHIPELAGO;
    public rows: number = 0;
    public columns: number = 0;
    size:MapSize = MapSize.TINY;

    // configs for external json?
    private readonly factorLand = 0.7;
    private readonly factorMountain = 0.05;
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

        // 1. create a map with grassland
        grid.forEach((tile) => {
            tile.type = TileType.SHALLOW_WATER;
        });

        // 2. create super continent landmass
        let landTiles = grid.size * this.factorLand;
        // 2a. add randomly land seeds in the middle of the map
        let tileFactor = landTiles / 6;
        const landCounter = Utils.randomNumber(tileFactor / 2, tileFactor); // number of continent seeds
        let plainTiles:Tile[] = [];
        for(let i = 0; i < landCounter; ++i) {
            let tile: Tile|undefined = undefined;
            let row_border = this.rows / 5;
            let col_border = this.columns / 5;
            let loopMax = Utils.MAXLOOPS;
            do {
                tile = Utils.randomTile(grid, this.rows, this.columns);
                if(tile != undefined) {
                    if(tile.row >= row_border && tile.row < this.rows - row_border &&
                        tile.col >= col_border && tile.col < this.columns - col_border) {
                        tile.type = TileType.PLAIN;
                        --landTiles;
                        plainTiles.push(tile);
                        break;
                    } 
                }
                --loopMax;
            } while(loopMax > 0);
        }
        // 2b. add some random land tiles
        let randomSeeds = Utils.randomNumber(5, 15);
        Utils.addRandomTileSeed(grid, this.rows, this.columns, plainTiles, TileType.PLAIN, TileType.SHALLOW_WATER, randomSeeds, landTiles);

        // 2c. expand land
        Utils.expandLand(grid, plainTiles, landTiles);

        // 3. add some lakes
        let lakeSeeds = Utils.randomNumber(10, 20);
        let lakeTiles:Tile[] = [];
        let waterTiles = lakeSeeds * Utils.randomNumber(4, 7);
        Utils.addRandomTileSeed(grid, this.rows, this.columns, lakeTiles, TileType.SHALLOW_WATER, TileType.PLAIN, lakeSeeds, waterTiles);

        // 4. exand created lakes
        Utils.expandWater(grid, lakeTiles, waterTiles);

        // 5. create deep water tiles
        Utils.shallowToDeepWater(grid);

        // get maximal number of mountain tiles
        let mountainTiles = grid.size * this.factorMountain;
        let hillTiles = grid.size * this.factorHills;
        hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
        const hillCounter = hillTiles / Utils.randomNumber(8,12); // number of mountain ranges
        let mountainRangesTiles:Tile[] = [];
        // 6. create random hills
        Utils.addRandomTileSeed(grid, this.rows, this.columns, mountainRangesTiles, TileType.HILLS, TileType.PLAIN, hillCounter, hillTiles);

        // 7. expand hills
        Utils.expandHills(grid, mountainRangesTiles, hillTiles);

        // 8. create mountain tiles
        Utils.hillsToMountains(grid, this.rows, this.columns, mountainTiles);

        // 9. create random deserts
        let desertTiles = grid.size * this.factorDesert;
        Utils.addRandomTile(grid, this.rows, this.columns, TileType.DESERT, desertTiles);

        // 10. add forst and jungle
        let woodTiles = grid.size * this.factorWood;
        Utils.addWoodTiles(grid, this.rows, this.columns, woodTiles);

        // 11. add swamp
        let swampTiles = grid.size * this.factorSwamp;
        Utils.addRandomTile(grid, this.rows, this.columns, TileType.SWAMP, swampTiles);

        // 12. snow
        Utils.createSnowTiles(grid, this.rows);

        return Utils.hexagonToArray(grid, this.rows, this.columns);
    }
}