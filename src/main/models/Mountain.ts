export class Mountain {
  // coordinates on map
  public readonly pos_x: number;
  public readonly pos_y: number;

  // min distance to water/rivers
  public distanceToWater: number = -1; // distance to next water tile (const)
  public distanceToRiver: number = -1; // distance to next river tile (may change for each new river)

  constructor(x: number, y: number) {
    this.pos_x = x;
    this.pos_y = y;
  }
}
