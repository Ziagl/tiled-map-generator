import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";

export interface IMapGenerator {
    readonly type: MapType;
    readonly size: MapSize;
    readonly rows: number;
    readonly columns: number;

    generate(size: MapSize): number[][]
}