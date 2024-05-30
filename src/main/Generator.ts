// generates a 2d array that represents a map

import { MapSize } from "./enums/MapSize";
import { MapType } from "./enums/MapType";
import { HighlandGenerator } from "./generators/HighlandGenerator";
import { InlandSeaGenerator } from "./generators/InlandSeaGenerator";
import { RandomGenerator } from "./generators/RandomGenerator";
import { IMapGenerator } from "./interfaces/IMapGenerator";

export class Generator
{
    private _map:number[][] = [];    // base data of map
    private _map_x:number = 0;       // x dimension
    private _map_y:number = 0;       // y dimension
    private map_min:number = 0;     // minimal height value
    private map_max:number = 0;     // maximal height value
    //private type:tiled.MapOrientation = tiled.MapOrientation.HEXAGONAL;

    constructor() {
        this._map = [];
    }

    public initialize(size_x:number, size_y:number, min:number, max:number) {
        this._map_x = size_x;
        this._map_y = size_y;
        this.map_min = min;
        this.map_max = max;
        this._map = new Array(this._map_x).fill(undefined).map(() => new Array(this._map_y).fill(0));
    }

    public generateRandomMap(min:number, max:number) {
        for (let i = 0; i < this._map_x; i++) {
            for (let j = 0; j < this._map_y; j++) {
                // @ts-ignore
                this.map[i][j] = Utils.randomNumber(this.map_min, this.map_max);
            }
        }
    }

    public generateMap(type:MapType, size:MapSize) {
        let generator: IMapGenerator;

        switch(type) {
            case MapType.ARCHIPELAGO:
            case MapType.INLAND_SEA:
                generator = new InlandSeaGenerator(); break;
            case MapType.HIGHLAND:
                generator = new HighlandGenerator(); break;
            case MapType.ISLANDS:
            case MapType.SMALL_CONTINENTS:
            case MapType.CONTINENTS:
            case MapType.CONTINENTS_ISLANDS:
            case MapType.SUPER_CONTINENT:
            case MapType.LAKES:
            default:
                generator = new RandomGenerator();
        }

        this._map = generator.generate(size);
        this._map_x = generator.rows;
        this._map_y = generator.columns;
    }

    public exportMap() :[number[], number, number] {
        return [this._map.flat(), this._map_x, this._map_y];
    }

    public print() :string {
        let response: string = "";
        for (let i=0; i < this._map_x; ++i) {
            const row = this._map[i];
            // @ts-ignore
            response += (row.join(' '));
            if(i < this._map_x - 1) {
                response += '\n';
            }
        }
        return response;
    }
    
    public print_unstructured() :string {
        return this._map.flat().join(" ");
    }
};
