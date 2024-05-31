import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";
import { TileType } from "../enums/TileType";
import { IMapGenerator } from "../interfaces/IMapGenerator";
import { Tile } from "./Tile";
import { Utils } from "./Utils";
import { Grid, rectangle } from 'honeycomb-grid'

export class HighlandGenerator implements IMapGenerator {
    public readonly type:MapType = MapType.HIGHLAND;
    public rows: number = 0;
    public columns: number = 0;
    size:MapSize = MapSize.TINY;

    // configs for external json?
    private readonly factorWater = 0.15;
    private readonly factorMountain = 0.1;
    private readonly factorHills = 0.2;
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
            tile.type = TileType.PLAIN;
        });

        // get maximal number of water tiles
        let waterTiles = grid.size * this.factorWater;
        // 2. add randomly lakes
        const lakeCounter = waterTiles / Utils.randomNumber(5,7); // number of lakes (fifth, sixth or seventh or max number of tiles)
        let lakeTiles:Tile[] = [];
        Utils.addRandomTileSeed(grid, this.rows, this.columns, lakeTiles, TileType.SHALLOW_WATER, TileType.PLAIN, lakeCounter, waterTiles);

        // 3. expand lakes
        Utils.expandWater(grid, lakeTiles, waterTiles);

        // 4. create deep water tiles
        Utils.shallowToDeepWater(grid);

        // get maximal number of mountain tiles
        let mountainTiles = grid.size * this.factorMountain;
        let hillTiles = grid.size * this.factorHills;
        hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
        const hillCounter = hillTiles / Utils.randomNumber(5,7); // number of mountain ranges
        let mountainRangesTiles:Tile[] = [];
        // 5. create random hills
        Utils.addRandomTileSeed(grid, this.rows, this.columns, mountainRangesTiles, TileType.HILLS, TileType.PLAIN, hillCounter, hillTiles);

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