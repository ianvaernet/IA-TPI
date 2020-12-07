const { expect } = require("chai");
const main = require("../src/main");

const datasets = [
  [
    { x: 1, y: -6.5, label: 'E1' },
    { x: 2, y: -5.5, label: 'E1' },
    { x: 1.5, y: -1.5, label: 'E1' },
    { x: 3, y: 1.5, label: 'E1' },
    { x: 6, y: 6.5, label: 'E2' },
    { x: 7, y: 4.5, label: 'E2' },
    { x: 8, y: 7.5, label: 'E2' },
    { x: 6.5, y: 5.5, label: 'E2' }
  ],
  require("../src/datasets/dataset1"),
  require("../src/datasets/dataset2"),
  require("../src/datasets/dataset3"),
  require("../src/datasets/dataset4"),
  [
    { x: 0, y: 0, label: 'E1' },
    { x: 1, y: 0, label: 'E1' },
    { x: 2, y: 0, label: 'E1' },
    { x: 0, y: 1, label: 'E2' },
    { x: 1, y: 1, label: 'E2' },
    { x: 2, y: 1, label: 'E2' },
  ],
  [
    { x: 0, y: 0, label: 'E1' },
    { x: 1, y: 1, label: 'E1' },
    { x: 2, y: 0, label: 'E1' },
    { x: 0, y: 1, label: 'E2' },
    { x: 1, y: 0, label: 'E2' },
    { x: 2, y: 1, label: 'E2' },
  ],
];

describe("Main", () => {
  it("should be ordered by distance ASC", () => {
    const { P } = main.knn(datasets[0], { x: 0, y: 0 }, 1);
    P.forEach((p, j) => {
      if (j !== P.length - 1) expect(p.distance).to.be.lte(P[j + 1].distance);
    });
  });

  it("should be contain all original dataset examples", () => {
    const { P } = main.knn(datasets[0], { x: 0, y: 0 }, 1);
    datasets[0].forEach(d => {
      expect(P.some(p => d.x === p.x && d.y === p.y && d.label === p.label)).to.be.true;
    });
  });

  [
    { input: [datasets[0], { x: 0, y: 0 }, 1], result: "E1" },
    { input: [datasets[1], { x: 0, y: 0 }, 1], result: "C1" },
    { input: [datasets[2], { x: 0, y: 0 }, 1], result: "C2" },
    { input: [datasets[3], { x: 0, y: 0 }, 1], result: "C2" },
    { input: [datasets[4], { x: 0, y: 0 }, 1], result: "1" },
    { input: [datasets[5], { x: 0, y: 0.4 }, 1], result: "E1" },
    { input: [datasets[5], { x: 0, y: 0.5 }, 2], result: "NaN" },
    { input: [datasets[5], { x: 0, y: 0.6 }, 1], result: "E2" },
    { input: [datasets[5], { x: 0, y: 0 }, 10, "distanceWeighted"], result: "E1" },
    { input: [datasets[5], { x: 0, y: 0.1 }, 10, "distanceWeighted"], result: "E1" },
  ].forEach(({ input, result }, i) => {
    it("should calculate knn correctly " + i, () => {
      const { d } = main.knn(...input);
      expect(d.label).to.be.equal(result);
    });
  });

  [
    { input: [datasets[0]], result: 0 },
    { input: [datasets[1]], result: 20 },
    { input: [datasets[2]], result: 2 },
    { input: [datasets[3]], result: 0 },
    { input: [datasets[4]], result: 0 },
    { input: [datasets[5]], result: 0 },
    { input: [datasets[6]], result: 0 },
  ].forEach(({ input, result }, i) => {
    it("should calculate knn precision correctly " + i, () => {
      const optimumK = main.calculatePrecision(...input);
      expect(optimumK).to.be.equal(result);
    });
  });
});