import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";
import { IMapGenerator } from "../interfaces/IMapGenerator";
import { Tile } from "./Tile";
import { Utils } from "./Utils";
import { Grid, rectangle } from 'honeycomb-grid'

export class HighlandGenerator implements IMapGenerator {
    public readonly type:MapType = MapType.HIGHLAND;
    public rows: number = 0;
    public columns: number = 0;
    size:MapSize = MapSize.TINY;
    min: number = 0;
    max: number = 0;

    public generate(size: MapSize, min: number, max: number): number[][] {
        this.size = size;
        this.min = min;
        this.max = max;
        const [rows, columns] = Utils.convertMapSize(this.size);
        this.rows = rows;
        this.columns = columns;

        // create empty grid
        const grid = new Grid(Tile, rectangle({ width: columns, height: rows }));

        // compute grid
        grid.forEach((tile) => {
            tile.type = Utils.randomNumber(this.min, this.max);
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