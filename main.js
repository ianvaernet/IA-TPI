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
    this.precisionTable = new Table(
      this,
      'precision-table-body',
      ['correctClassifications', 'precision'],
      undefined,
      new Labels(['optimum'], ['#FFDD57|1'])
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
      this.k.value,
      true
    );
    this.grid = new Grid(this.canvas);
  }
  /**
   * @param {DataLabeled[]} trainingData
   * @param {DataUnlabeled} newInstance
   * @returns {DataLabeledDistance[]}
   */
  calculateDistances(trainingData, newInstance) {
    for (let i = 0; i < trainingData.length; i++) {
      let element = trainingData[i];
      let distance = Math.sqrt(
        (newInstance.x - trainingData[i].x) ** 2 + (newInstance.y - trainingData[i].y) ** 2
      );
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
    const sortedData = trainingDataWithDistances.filter((instance) => instance.label !== 'NaN');
    sortedData.sort((a, b) => a.distance - b.distance);
    return sortedData;
  }

  /**
   * @param {DataLabeledDistance[]} sortedTrainingData
   * @param {DataUnlabeled} newInstance
   * @param {Number} k
   * @returns {DataLabeled}
   */
  classifyNewInstance(sortedTrainingData, newInstance, k, method) {
    const labels = []; // [{label: 'C1', count: n, distance: f}]
    const newInstanceCopy = { ...newInstance };
    if (k > sortedTrainingData.length) k = sortedTrainingData.length;

    let zeroDistance = false;
    for (let i = 0; i < k; i++) {
      if (sortedTrainingData[i] == 0 && method === 'distanceWeighted') {
        zeroDistance = true;
        var zeroDistanceLabel = sortedTrainingData[i].label;
        break;
      }

      let index = labels.findIndex((element) => element.label === sortedTrainingData[i].label);
      if (index === -1)
        labels.push({
          label: sortedTrainingData[i].label,
          count: method === 'distanceWeighted' ? 1 / (sortedTrainingData[i].distance ** 2).toFixed(4) : 1,
        });
      else
        labels[index].count +=
          method === 'distanceWeighted' ? 1 / (sortedTrainingData[i].distance ** 2).toFixed(4) : 1;
    }

    if (zeroDistance) {
      newInstanceCopy.label = zeroDistanceLabel;
      zeroDistance = false;
    } else {
      let maxFrecuency = 0,
        maxFrecuencyIndex = 0,
        maxFrecuencyDuplicated = false;
      labels.forEach((label, index) => {
        if (label.count > maxFrecuency) {
          maxFrecuency = label.count;
          maxFrecuencyIndex = index;
          maxFrecuencyDuplicated = false;
        } else if (label.count === maxFrecuency) maxFrecuencyDuplicated = true;
      });
      if (!maxFrecuencyDuplicated) newInstanceCopy.label = labels[maxFrecuencyIndex].label;
      else {
        newInstanceCopy.label = 'NaN';
      }
    }

    return newInstanceCopy;
  }

  /**
   * @param {DataLabeled[]} trainingData
   * @param {DataUnlabeled} newInstance
   * @param {Number} k
   * @returns {KNNResult}
   */
  knn(trainingData, newInstance, k, classificationMethod) {
    let trainingDataWithDistances = this.calculateDistances(trainingData, newInstance);
    let sortedTrainingDataWithDistances = this.sortByDistance(trainingDataWithDistances);
    let newInstanceClassified = this.classifyNewInstance(
      sortedTrainingDataWithDistances,
      newInstance,
      k,
      classificationMethod
    );
    return { P: sortedTrainingDataWithDistances, d: newInstanceClassified };
  }

  updateKNN(trainingData, newInstance, k) {
    const { P, d } = this.knn(trainingData, newInstance, k, this.getClassificationMethod());
    this.plot.updatePlot(P, d, k);
    this.knnTable.updateTable(P.splice(0, k));
  }

  calculatePrecision(trainingData) {
    const distanceMatrix = []; //contains for each node the distance to others nodes
    const correctClassifications = []; //contains for each k the number of correct classifications
    let optimumK = 0;

    trainingData.forEach((node, index) => {
      let trainingDataWithoutCurrentNode = [...trainingData];
      trainingDataWithoutCurrentNode.splice(index, 1);
      let trainingDataWithDistances = this.calculateDistances(trainingDataWithoutCurrentNode, node);
      distanceMatrix.push(this.sortByDistance(trainingDataWithDistances));
    });

    for (let k = 0; k < trainingData.length - 1; k++) {
      correctClassifications.push(0);
      trainingData.forEach((node, index) => {
        let nodeClassified = this.classifyNewInstance(
          distanceMatrix[index],
          node,
          k + 1,
          this.getClassificationMethod()
        );
        if (nodeClassified.label === trainingData[index].label && nodeClassified.label !== 'NaN')
          correctClassifications[k]++;
      });
      if (correctClassifications[k] > correctClassifications[optimumK]) optimumK = k;
    }

    this.precisionTable.updateTable(
      correctClassifications.map((value) => {
        return {
          correctClassifications: value,
          precision: ((100 * value) / trainingData.length).toFixed(2),
          label: value === correctClassifications[optimumK] ? 'optimum' : null,
        };
      })
    );
    return optimumK;
  }

  updateClassificationMethod() {
    this.updateKNN(this.dataset.trainingData, { x: 0, y: 0 }, this.k.value, this.getClassificationMethod());
    this.canvas.updateCanvas(this.dataset.trainingData, this.k.value);
    this.calculatePrecision(this.dataset.trainingData);
  }

  getClassificationMethod() {
    return document.getElementById('select-classification-method').value;
  }
}

const main = new Main();
