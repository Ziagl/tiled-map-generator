import { MapSize } from "../enums/MapSize";

export class Utils {

    // converts a map size type to 2d dimensional width and height
    public static convertMapSize(size:MapSize):[rows:number, columns:number] {
        let rows = 26;
        let columns = 44;

        switch(size) {
            case MapSize.MICRO: rows = 26; columns = 44; break;
            case MapSize.TINY: rows = 38; columns = 60; break;
            case MapSize.SMALL: rows = 46; columns = 74; break;
            case MapSize.MEDIUM: rows = 54; columns = 84; break;
            case MapSize.LARGE: rows = 60; columns = 96; break;
            case MapSize.HUGE: rows = 66; columns = 106; break;
        }

        return [rows, columns];
    }
    
    // generates a random number between min and max (both included)
    public static randomNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // gets the minimal and maximal values of an enum
    public static getMinMaxOfEnum(e: object): [min: number, max: number] {
        const values = Object.keys(e)
            .map(k => k === "" ? NaN : +k)
            .filter(k => !isNaN(k))
            .sort((k1, k2) => k1 - k2);
    
        return [values[0] ?? 0, values[values.length - 1] ?? 0];
    }
}