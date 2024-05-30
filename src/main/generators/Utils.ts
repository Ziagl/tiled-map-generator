import { Direction, Grid } from "honeycomb-grid";
import { MapSize } from "../enums/MapSize";
import { Tile } from "./Tile";

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

    public static randomTile(grid: Grid<Tile>, rows: number, columns: number) :Tile|undefined {
        const row = this.randomNumber(0, rows - 1);
        const column = this.randomNumber(0, columns - 1);
        return grid.getHex({ col: column, row: row });
    }

    public static neighbors(grid: Grid<Tile>, coordinates: [q: number, r: number]) :Tile[] {
        let neighbors:Tile[] = [];

        if(grid.neighborOf(coordinates, Direction.N, { allowOutside: false }) !== undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.N));
        }
        if(grid.neighborOf(coordinates, Direction.NE, { allowOutside: false }) !== undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.NE));
        }
        if(grid.neighborOf(coordinates, Direction.E, { allowOutside: false }) != undefined) {
           neighbors.push(grid.neighborOf(coordinates, Direction.E)); 
        }
        if(grid.neighborOf(coordinates, Direction.SE, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.SE));
        }
        if(grid.neighborOf(coordinates, Direction.S, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.S));
        }
        if(grid.neighborOf(coordinates, Direction.SW, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.SW));
        }
        if(grid.neighborOf(coordinates, Direction.W, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.W));
        }
        if(grid.neighborOf(coordinates, Direction.NW, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.NW));
        }

        return neighbors;
    }

    public static randomNeighbors(grid: Grid<Tile>, coordinates: [q: number, s: number]) :Tile[] {
        let allNeighbors = this.neighbors(grid, coordinates);
        let neighbors:Tile[] = [];

        // randomly select neighbors
        allNeighbors.forEach((neighbor) => {
            if(this.randomNumber(0, 1) === 0) { // 50 : 50 chance
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }

    public static shuffle<T>(arr: T[]): T[] {
        return arr
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
    }
}