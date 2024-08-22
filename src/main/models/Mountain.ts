export class Mountain {
    // coordinates on map
    public readonly pos_x: number;
    public readonly pos_y: number;

    // min distance to water
    public distanceToWater: number = -1;

    constructor(x: number, y: number) {
        this.pos_x = x;
        this.pos_y = y;
    }
}