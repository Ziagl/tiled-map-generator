import { Utils } from "../main/generators/Utils";
import { TileDistribution } from "../main/models/TileDistribution";

test('tileDistributionClass', () => {
    let distribution = new TileDistribution(0.0, 0.1, 0.8, 0.1);
    expect(distribution.polar).toBe(0.0);
    expect(distribution.temperate).toBe(0.1);
    expect(distribution.dry).toBe(0.8);
    expect(distribution.tropical).toBe(0.1);
    distribution = new TileDistribution(0.9, 0.2, 1.5, 0.7);
    expect(distribution.polar).toBeCloseTo(0.27);
    expect(distribution.temperate).toBeCloseTo(0.06);
    expect(distribution.dry).toBeCloseTo(0.45);
    expect(distribution.tropical).toBeCloseTo(0.21);
    distribution = new TileDistribution(0.0, 0.0, 0.0, 0.0);
    expect(distribution.polar).toBe(0.25);
    expect(distribution.temperate).toBe(0.25);
    expect(distribution.dry).toBe(0.25);
    expect(distribution.tropical).toBe(0.25);
});
test('climateZonesSeparation', () => {
    let rows = Utils.climateZonesSeparation(100);
    expect(rows[0]?.length).toBe(18);   // polar
    expect(rows[1]?.length).toBe(38);   // temperate
    expect(rows[2]?.length).toBe(14);   // dry
    expect(rows[3]?.length).toBe(30);   // tropical
});