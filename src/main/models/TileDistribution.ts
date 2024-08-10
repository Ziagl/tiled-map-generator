// stores distribution of tiles for earth like planets
// each hemisphere contains roughly of 4 different climate zones
// polar, temperate, dry, tropical
// they are mirrored on the other hemisphere (caused by earth axis)
export class TileDistribution {
  public readonly polar: number = 0.0;
  public readonly temperate: number = 0.0;
  public readonly dry: number = 0.0;
  public readonly tropical: number = 0.0;

  // approx. size of each climate zone (based on read earth data)
  public static readonly climateZoneSizes: number[] = [0.18, 0.38, 0.14, 0.3];

  constructor(polar: number = 0.0, temperate: number = 0.0, dry: number = 0.0, tropical: number = 0.0) {
    const max = polar + temperate + dry + tropical;
    if (max == 0.0) {
      this.polar = 0.25;
      this.temperate = 0.25;
      this.dry = 0.25;
      this.tropical = 0.25;
    } else {
      this.polar = polar / max;
      this.temperate = temperate / max;
      this.dry = dry / max;
      this.tropical = tropical / max;
    }
  }
}
