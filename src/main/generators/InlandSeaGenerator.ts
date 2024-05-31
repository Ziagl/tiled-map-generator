import { Grid, rectangle } from "honeycomb-grid";
import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";
import { IMapGenerator } from "../interfaces/IMapGenerator";
import { Utils } from "./Utils";
import { Tile } from "./Tile";
import { TileType } from "../enums/TileType";

export class InlandSeaGenerator implements IMapGenerator {
    public readonly type:MapType = MapType.ARCHIPELAGO;
    public rows: number = 0;
    public columns: number = 0;
    size:MapSize = MapSize.TINY;

    // configs for external json?
    private readonly maxLoops = 10000;
    private readonly factorWater = 0.3;
    private readonly factorMountain = 0.1;
    private readonly factorHills = 0.1;
    private readonly factorDesert = 0.1;
    private readonly factorSwamp = 0.1;
    private readonly factorWood = 0.2;

    public generate(size: MapSize): number[][] {
        this.size = size;
        const [rows, columns] = Utils.convertMapSize(this.size);
        this.rows = rows;
        this.columns = columns;

        // create empty grid
        const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

        // 1. create a map with grassland
        grid.forEach((tile) => {
            tile.type = TileType.PLAIN;
        });

        // 2. create a lake in the middle of map
        let waterTiles = grid.size * this.factorWater;
        // 2a. add randomly lake seeds in the middle of the map
        let tileFactor = waterTiles / 5;
        const lakeCounter = Utils.randomNumber(tileFactor / 2, tileFactor); // number of lakes seeds
        let lakeTiles:Tile[] = [];
        for(let i = 0; i < lakeCounter; ++i) {
            let tile: Tile|undefined = undefined;
            let row_border = this.rows / 5;
            let col_border = this.columns / 5;
            let loopMax = this.maxLoops;
            do {
                tile = Utils.randomTile(grid, this.rows, this.columns);
                if(tile != undefined) {
                    if(tile.row >= row_border && tile.row < this.rows - row_border &&
                        tile.col >= col_border && tile.col < this.columns - col_border) {
                        tile.type = TileType.SHALLOW_WATER;
                        --waterTiles;
                        lakeTiles.push(tile);
                        break;
                    } 
                }
                --loopMax;
            } while(loopMax > 0);
        }
        // 2b. add some random water tiles
        let randomSeeds = Utils.randomNumber(5, 15);
        Utils.addRandomTileSeed(grid, this.rows, this.columns, lakeTiles, TileType.SHALLOW_WATER, randomSeeds, waterTiles, this.maxLoops);

        // 2c. expand lakes
        Utils.expandWater(grid, lakeTiles, waterTiles, this.maxLoops);

        // 2d. create deep water tiles
        Utils.shallowToDeepWater(grid);

        // get maximal number of mountain tiles
        let mountainTiles = grid.size * this.factorMountain;
        let hillTiles = grid.size * this.factorHills;
        hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
        const hillCounter = hillTiles / Utils.randomNumber(8,12); // number of mountain ranges
        let mountainRangesTiles:Tile[] = [];
        // 5. create random hills
        Utils.addRandomTileSeed(grid, this.rows, this.columns, mountainRangesTiles, TileType.HILLS, hillCounter, hillTiles, this.maxLoops);

        // 6. expand hills
        Utils.expandHills(grid, mountainRangesTiles, hillTiles, this.maxLoops);

        // 7. create mountain tiles
        Utils.hillsToMountains(grid, this.rows, this.columns, mountainTiles, this.maxLoops);

        // 8. create random deserts
        let desertTiles = grid.size * this.factorDesert;
        Utils.addRandomTile(grid, this.rows, this.columns, TileType.DESERT, desertTiles, this.maxLoops);

        // 9. add forst and jungle
        let woodTiles = grid.size * this.factorWood;
        Utils.addWoodTiles(grid, this.rows, this.columns, woodTiles, this.maxLoops);

        // 10. add swamp
        let swampTiles = grid.size * this.factorSwamp;
        Utils.addRandomTile(grid, this.rows, this.columns, TileType.SWAMP, swampTiles, this.maxLoops);

        // 11. snow
        Utils.createSnowTiles(grid, this.rows);

        // create empty map
        let map = new Array(rows).fill([]).map(() => new Array(columns));
        
        // convert hexagon grid to 2d map
        for(let i = 0; i < rows; ++i) {
            for(let j = 0; j < columns; ++j) {
                // @ts-ignore
                map[i][j] = grid.getHex({ col: j, row: i }).type;
            }
        }

        return map;
    }
}