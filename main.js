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
    this.grid = new Grid(this.canvas);
    this.dataset.loadDefaultDataset();
  }
  /**
   * @param {DataLabeled[]} trainingData
   * @param {DataUnlabeled} newInstance
   * @returns {DataLabeledDistance[]}
   */
  calculateDistances(trainingData, newInstance) {
    for (let i = 0; i < trainingData.length; i++) {
      trainingData[i].distance = Math.sqrt(
        (newInstance.x - trainingData[i].x) ** 2 + (newInstance.y - trainingData[i].y) ** 2
      );
    }
    return trainingData;
  }

  /**
   * @param {DataUnlabeled} from
   * @param {DataUnlabeled} to
   * @returns {number}
   */
  calculateDistance(from, to) {
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
  }

  /**
   * @param {DataLabeledDistance[]} trainingDataWithDistances
   * @returns {DataLabeledDistance[]}
   */
  sortByDistance(trainingDataWithDistances) {
    // making a copy of the training data to avoid adding new points to the original data
    return trainingDataWithDistances
      .filter((instance) => instance.label !== 'NaN')
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * @param {DataLabeledDistance[]} sortedTrainingData
   * @param {DataUnlabeled} newInstance
   * @param {Number} k
   * @returns {DataLabeled}
   */
  classifyNewInstance(sortedTrainingData, newInstance, k, distanceWeighted, copy = true) {
    const labels = []; // [{label: 'C1', count: n, distance: f}]
    let label = 'NaN';
    if (k > sortedTrainingData.length) k = sortedTrainingData.length;
    let zeroDistance = false;
    for (let i = 0; i < k; i++) {
      if (sortedTrainingData[i].distance === 0 && distanceWeighted) {
        zeroDistance = true;
        var zeroDistanceLabel = sortedTrainingData[i].label;
        break;
      }
      const deltaCount = distanceWeighted ? (1 / (sortedTrainingData[i].distance ** 2)) : 1;
      let exists = false;
      for (let j = 0; j < labels.length; j++) {
        if (labels[j].label === sortedTrainingData[i].label) {
          labels[j].count += deltaCount;
          exists = true;
          break;
        }
      }
      if (!exists) {
        labels.push({
          label: sortedTrainingData[i].label,
          count: deltaCount,
        });
      }
    }

    if (zeroDistance) {
      label = zeroDistanceLabel;
    } else {
      let maxFrecuency = 0,
        maxFrecuencyIndex = 0,
        maxFrecuencyDuplicated = false;
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].count > maxFrecuency) {
          maxFrecuency = labels[i].count;
          maxFrecuencyIndex = i;
          maxFrecuencyDuplicated = false;
        } else if (labels[i].count === maxFrecuency) maxFrecuencyDuplicated = true;
      }
      if (!maxFrecuencyDuplicated) {
        label = labels[maxFrecuencyIndex].label;
      }
    }
    return copy ? { ...newInstance, label } : label;
  }

  /**
   * @param {DataLabeled[]} trainingData
   * @param {DataUnlabeled} newInstance
   * @param {Number} k
   * @returns {KNNResult}
   */
  knn(trainingData, newInstance, k, classificationMethod, copy = true) {
    let trainingDataWithDistances = this.calculateDistances(trainingData, newInstance);
    let sortedTrainingDataWithDistances = this.sortByDistance(trainingDataWithDistances);
    let newInstanceClassified = this.classifyNewInstance(
      sortedTrainingDataWithDistances,
      newInstance,
      k,
      classificationMethod === 'distanceWeighted',
      copy
    );
    return copy ? { P: sortedTrainingDataWithDistances, d: newInstanceClassified } : newInstanceClassified;
  }

  updateKNN(trainingData, newInstance, k) {
    const { P, d } = this.knn(trainingData, newInstance, k, this.getClassificationMethod());
    this.plot.updatePlot(P, d, k);
    this.knnTable.updateTable(P.splice(0, k));
  }

  async calculatePrecision(trainingData, method) {
    // avoid multiple drawings, since I have no idea how to stop the previously running function
    if (this.updatingPrecision) {
      // when drawing finishes, the last dirty values will be used to draw the next time
      this.dirty = [trainingData, method];
      return;
    }
    this.dirty = null;
    this.updatingPrecision = true;
    this.precisionTable.updateTable([], true);
    // prevent initial freeze
    await new Promise((res) => setTimeout(res, 0));
    const fps = 1000 / 30;
    let lastFrame = Date.now();
    const distanceMatrix = []; //contains for each node the distance to others nodes
    for (let index1 = 0; index1 < trainingData.length; index1++) {
      distanceMatrix.push([]);
      for (let index2 = 0; index2 < trainingData.length; index2++) {
        if (index1 === index2) continue;
        let distance;
        if (index2 < index1) {
          distance = distanceMatrix[index2][index1 - 1].distance;
        } else {
          distance = this.calculateDistance(trainingData[index1], trainingData[index2]);
        }
        distanceMatrix[index1].push({ ...trainingData[index2], distance });
        const now = Date.now();
        if (now - lastFrame > fps) {
          lastFrame = now;
          await new Promise((res) => setTimeout(res, 0));
        }
      }
    }
    const sort = (a, b) => a.distance - b.distance;
    for (let i = 0; i < distanceMatrix.length; i++) {
      distanceMatrix[i].sort(sort);
    }
    const correctClassifications = []; //contains for each k the number of correct classifications
    let optimumK = 0;
    const distanceWeighted = method === 'distanceWeighted';
    for (let k = 0; k < trainingData.length - 1; k++) {
      correctClassifications.push(0);
      for (let i = 0; i < trainingData.length; i++) {
        let label = this.classifyNewInstance(
          distanceMatrix[i],
          trainingData[i],
          k + 1,
          distanceWeighted,
          false
        );
        if (label === trainingData[i].label && label !== 'NaN') {
          correctClassifications[k]++;
        }
        const now = Date.now();
        if (now - lastFrame > fps) {
          lastFrame = now;
          await new Promise((res) => setTimeout(res, 0));
        }
      }
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
    this.updatingPrecision = false;
    // is there anything to draw?
    if (this.dirty) {
      this.calculatePrecision(...this.dirty);
    }
    return optimumK;
  }

  updateClassificationMethod() {
    this.updateKNN(this.dataset.trainingData, { x: 0, y: 0 }, this.k.value, this.getClassificationMethod());
    this.canvas.updateCanvas(this.dataset.trainingData, this.k.value);
    this.calculatePrecision(this.dataset.trainingData, this.getClassificationMethod());
  }

  getClassificationMethod() {
    return document.getElementById('select-classification-method').value;
  }
}

const main = new Main();
