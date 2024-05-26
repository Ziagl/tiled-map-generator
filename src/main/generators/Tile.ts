import { Orientation, defineHex } from 'honeycomb-grid'

export class Tile extends defineHex({ 
    dimensions: 1,
    orientation: Orientation.FLAT,
    origin: 'topLeft',
    offset: 1
}) {
    get prototypeProp() {
        return `this property won't be present in the instance, only in the prototype`
    }

    type: number = 0;

    // methods always exist in the prototype
    //customMethod() {}
};
