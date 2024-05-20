import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";

export interface IMapGenerator {
    readonly type: MapType;
    readonly size: MapSize;
    readonly min: number;
    readonly max: number;
    readonly rows: number;
    readonly columns: number;

    generate(size: MapSize, min: number, max: number): number[][]
}