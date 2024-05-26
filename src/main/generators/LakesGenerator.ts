import { MapSize } from "../enums/MapSize";
import { MapType } from "../enums/MapType";
import { IMapGenerator } from "../interfaces/IMapGenerator";
//import { Utils } from "./Utils";

export class LakesGenerator implements IMapGenerator {
    public readonly type:MapType = MapType.ARCHIPELAGO;
    public rows: number = 0;
    public columns: number = 0;
    size:MapSize = MapSize.TINY;

    generate(size: MapSize): number[][] {
        throw new Error("Method not implemented.");
    }
}