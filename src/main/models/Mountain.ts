import { CubeCoordinates } from 'honeycomb-grid';

export class Mountain {
  // coordinates on map
  public readonly coordinates: CubeCoordinates;

  // min distance to water/rivers
  public distanceToWater: number = -1; // distance to next water tile (const)
  public distanceToRiver: number = -1; // distance to next river tile (may change for each new river)

  constructor(coordinates: CubeCoordinates) {
    this.coordinates = coordinates;
  }
}
