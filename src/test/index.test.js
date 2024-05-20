import * as index from "../main/index";

describe("index", () => {
    it("exports all functions", () => {
        expect(index.Generator).toBe(Generator);
    });
});
