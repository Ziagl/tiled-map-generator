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
    private readonly maxLoops = 10000;
    private readonly factorWater = 0.15;
    private readonly factorMountain = 0.1;
    private readonly factorHills = 0.3;
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
        for(let i = 0; i < lakeCounter; ++i) {
            let tile: Tile|undefined = undefined;
            do {
                tile = Utils.randomTile(grid, this.rows, this.columns);
            } while(tile === undefined || tile.type === TileType.SHALLOW_WATER || tile.type === TileType.DEEP_WATER);
            tile.type = TileType.SHALLOW_WATER;
            --waterTiles;
            lakeTiles.push(tile);
        }
        // 3. expand lakes
        let loopMax = this.maxLoops;
        do {
            lakeTiles = Utils.shuffle<Tile>(lakeTiles);
            lakeTiles.forEach((tile) => {
                const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
                neighbors.forEach((neighbor) => {
                    if(neighbor.type != TileType.SHALLOW_WATER && neighbor.type != TileType.DEEP_WATER && waterTiles > 0) {
                        neighbor.type = TileType.SHALLOW_WATER;
                        --waterTiles;
                        lakeTiles.push(neighbor);
                    }
                });
            });
            --loopMax;
        } while(waterTiles > 0 && loopMax > 0);
        // 4. create deep water tiles
        grid.forEach((tile) => {
            if (tile.type === TileType.SHALLOW_WATER) {
                const neighbors = Utils.neighbors(grid, [tile.q, tile.r]);
                // if all neighbors are water tiles -> tile is deep water
                if(neighbors.every(neighbor => neighbor.type === TileType.DEEP_WATER || neighbor.type === TileType.SHALLOW_WATER)) {
                    tile.type = TileType.DEEP_WATER;
                }
            }
        });

        // get maximal number of mountain tiles
        let mountainTiles = grid.size * this.factorMountain;
        let hillTiles = grid.size * this.factorHills;
        hillTiles = hillTiles + mountainTiles; // mountains can only be generated from hills
        const hillCounter = hillTiles / Utils.randomNumber(5,7); // number of mountain ranges
        let mountainRangesTiles:Tile[] = [];
        // 5. create random hills
        for(let i = 0; i < hillCounter; ++i) {
            let tile: Tile|undefined = undefined;
            do {
                tile = Utils.randomTile(grid, this.rows, this.columns);
            } while(tile === undefined || tile.type != TileType.PLAIN);
            tile.type = TileType.HILLS;
            --hillTiles;
            mountainRangesTiles.push(tile);
        }
        // 6. expand hills
        loopMax = this.maxLoops;
        do {
            mountainRangesTiles = Utils.shuffle<Tile>(mountainRangesTiles);
            mountainRangesTiles.forEach((tile) => {
                const neighbors = Utils.randomNeighbors(grid, [tile.q, tile.r]);
                neighbors.forEach((neighbor) => {
                    if(neighbor.type != TileType.SHALLOW_WATER && 
                       neighbor.type != TileType.DEEP_WATER && 
                       neighbor.type != TileType.HILLS && 
                       hillTiles > 0) {
                        neighbor.type = TileType.HILLS;
                        --hillTiles;
                        mountainRangesTiles.push(neighbor);
                    }
                });
            });
            --loopMax;
        } while(waterTiles > 0 && loopMax > 0);
        // 7. create mountain tiles
        loopMax = this.maxLoops;
        do{
            let tile = Utils.randomTile(grid, this.rows, this.columns);
            if (tile != undefined && (tile.type === TileType.HILLS)) {
                const neighbors = Utils.neighbors(grid, [tile.q, tile.r]);
                // if all neighbors are hill tiles or water -> tile is mountain tile
                if(neighbors.every(neighbor => neighbor.type === TileType.MOUNTAIN || 
                                               neighbor.type === TileType.HILLS ||
                                               neighbor.type === TileType.SHALLOW_WATER ||
                                               neighbor.type === TileType.DEEP_WATER) && 
                   !neighbors.every(neighbor => neighbor.type === TileType.SHALLOW_WATER ||
                                                neighbor.type === TileType.DEEP_WATER)) {
                    tile.type = TileType.MOUNTAIN;
                    --mountainTiles;
                } else {
                    // if there is maximum one other additional tile
                    let countOthers = 0;
                    neighbors.forEach(neighbor => {
                        if (neighbor.type != TileType.MOUNTAIN &&
                            neighbor.type != TileType.HILLS &&
                            neighbor.type != TileType.SHALLOW_WATER &&
                            neighbor.type != TileType.DEEP_WATER) {
                            ++countOthers;
                        }
                    });

                    if(countOthers <= 1) {
                        tile.type = TileType.MOUNTAIN;
                        --mountainTiles;
                    }
                }
            }
            --loopMax;
        } while(mountainTiles > 0 && loopMax > 0);

        // 8. create random deserts
        let desertTiles = grid.size * this.factorDesert;
        loopMax = this.maxLoops;
        do {
            let tile = Utils.randomTile(grid, this.rows, this.columns);
            if (tile != undefined && tile.type === TileType.PLAIN) {
                tile.type = TileType.DESERT;
                --desertTiles;
            }
        } while(desertTiles > 0 && loopMax > 0);

        // 9. add forst and jungle
        let woodTiles = grid.size * this.factorWood;
        loopMax = this.maxLoops;
        do {
            let tile = Utils.randomTile(grid, this.rows, this.columns);
            if (tile != undefined && tile.type === TileType.PLAIN) {
                // depending on climate region chance is different for forest and jungle
                const third = this.rows / 3;
                let chanceForest = 5;  // 50:50 if random number 0-9
                if (tile.r < third || tile.r > (third * 2)) {
                    chanceForest = 8;
                }
                if (Utils.randomNumber(0,9) < chanceForest) {
                    tile.type = TileType.FOREST;
                } else {
                    tile.type = TileType.JUNGLE;
                }
                --woodTiles;
            }
        } while(woodTiles > 0 && loopMax > 0);

        // 10. add swamp
        let swampTiles = grid.size * this.factorSwamp;
        loopMax = this.maxLoops;
        do {
            let tile = Utils.randomTile(grid, this.rows, this.columns);
            if (tile != undefined && tile.type === TileType.PLAIN) {
                tile.type = TileType.SWAMP;
                --swampTiles;
            }
        } while(swampTiles > 0 && loopMax > 0);

        // 11. snow
        grid.forEach((tile) => {
            let chanceForSnow = 0;
            if(tile.r === 0 || tile.r === this.rows - 1) {
                chanceForSnow = 10;
            }
            if(tile.r === 1 || tile.r === this.rows - 2) {
                chanceForSnow = 7;
            }
            if(tile.r === 2 || tile.r === this.rows - 3) {
                chanceForSnow = 4;
            }

            if(chanceForSnow > 0) {
                if(Utils.randomNumber(0,9) < chanceForSnow) {
                    switch(tile.type) {
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