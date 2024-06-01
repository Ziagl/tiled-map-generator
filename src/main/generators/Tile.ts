import { Orientation, defineHex } from 'honeycomb-grid'
import { TileType } from '../enums/TileType';

export class Tile extends defineHex({ 
    dimensions: 1,
    orientation: Orientation.POINTY,
    origin: 'topLeft',
    offset: -1
}) {
    
    type: TileType = TileType.SHALLOW_WATER;
};
