import * as tiled from "@kayahr/tiled";

// this converter is used to converts map (2D array) from a generator
// into file format from Tiled (https://www.mapeditor.org/)
export class Converter
{
    // saves a generated map into an existing example.json from Tiled editor
    public convertToTiled(map:number[], rows: number, columns: number, data: string):string|null {
        const mainMap = JSON.parse(data) as tiled.Map;
        if(mainMap) {
            mainMap.width = columns;
            mainMap.height = rows;
            let layer = mainMap.layers[0] as tiled.TileLayer;
            layer.width = columns;
            layer.height = rows;
            layer.data = map;

            return JSON.stringify(mainMap);
        }

        return null;
    }
}