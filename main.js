/**
 * @typedef {{ x: number, y: number }} DataUnlabeled
 * @typedef {{ x: number, y: number, label: string }} DataLabeled
 * @typedef {{ x: number, y: number, label: string, distance: number }} DataLabeledDistance
 * @typedef {{ P: DataLabeledDistance[], d: DataLabeled }} KNNResult
 */

class Main {
  constructor() {
    const labels = new Labels();
    const floatParser = (v) => parseFloat(v).toFixed(4);
    this.datasetTable = new Table(
      this,
      'dataset-table-body',
      ['x', 'y', 'label'],
      {
        x: floatParser,
        y: floatParser,
      },
      null,
      true
    );
    this.knnTable = new Table(
      this,
      'knn-table-body',
      ['x', 'y', 'label', 'distance'],
      { x: floatParser, y: floatParser, distance: floatParser },
      labels,
      false
    );
    this.plot = new Plot(labels, this.knnTable);
    this.canvas = new Canvas(this, this.plot, labels);
    this.dataset = new Dataset(this.plot, this.datasetTable, this, this.canvas, labels);
    this.k = new K(this, this.plot, this.canvas, this.dataset);
    this.events = new Events(this, this.plot, this.dataset, this.k, this.canvas);
    this.dataset.updateTrainingData(
      [
        { x: 1, y: -6.5, label: 'E1' },
        { x: 2, y: -5.5, label: 'E1' },
        { x: 1.5, y: -1.5, label: 'E1' },
        { x: 3, y: 1.5, label: 'E1' },
        { x: 6, y: 6.5, label: 'E2' },
        { x: 7, y: 4.5, label: 'E2' },
        { x: 8, y: 7.5, label: 'E2' },
        { x: 6.5, y: 5.5, label: 'E2' },
      ],
      this.k.getK(),
      true
    );
  }
  /**
   * @param {DataLabeled[]} trainingData
   * @param {DataUnlabeled} newInstance
   * @returns {DataLabeledDistance[]}
   */
  calculateDistances(trainingData, newInstance) {
    for (let i = 0; i < trainingData.length; i++) {
      let element = trainingData[i];
      let distance = (newInstance.x - trainingData[i].x) ** 2 + (newInstance.y - trainingData[i].y) ** 2;
      element.distance = distance;
    }
    return trainingData;
  }

  /**
   * @param {DataLabeledDistance[]} trainingDataWithDistances
   * @returns {DataLabeledDistance[]}
   */
  sortByDistance(trainingDataWithDistances) {
    // making a copy of the training data to avoid adding new points to the original data
    const sortedData = [...trainingDataWithDistances];
    sortedData.sort((a, b) => a.distance - b.distance);
    return sortedData;
  }

  /**
   * @param {DataLabeledDistance[]} sortedTrainingData
   * @param {DataUnlabeled} newInstance
   * @param {Number} k
   * @returns {DataLabeled}
   */
  classifyNewInstance(sortedTrainingData, newInstance, k) {
    let labels = []; // [{label: 'etiqueta', count: n}]
    if (k > sortedTrainingData.length) k = sortedTrainingData.length;
    for (let i = 0; i < k; i++) {
      let index = labels.findIndex((element) => element.label === sortedTrainingData[i].label);
      if (index === -1) labels.push({ label: sortedTrainingData[i].label, count: 1 });
      else labels[index].count++;
    }
    let maxFrecuency = Math.max(...labels.map((label) => label.count));
    let mostFrequentLabelIndex = labels.findIndex((label) => label.count === maxFrecuency);
    newInstance.label = labels[mostFrequentLabelIndex].label;
    return newInstance;
  }

  /**
   * @param {DataLabeled[]} trainingData
   * @param {DataUnlabeled} newInstance
   * @param {Number} k
   * @returns {KNNResult}
   */
  knn(trainingData, newInstance, k) {
    let trainingDataWithDistances = this.calculateDistances(trainingData, newInstance);
    let sortedTrainingDataWithDistances = this.sortByDistance(trainingDataWithDistances);
    let newInstanceClassified = this.classifyNewInstance(sortedTrainingDataWithDistances, newInstance, k);
    return { P: sortedTrainingDataWithDistances, d: newInstanceClassified };
  }

  updateKNN(trainingData, newInstance, k) {
    const { P, d } = this.knn(trainingData, newInstance, k);
    this.plot.updatePlot(P, d, k);
    this.knnTable.updateTable(P.splice(0, k));
  }
}

const main = new Main();
