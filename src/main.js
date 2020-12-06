const main = {};

/**
 * @param {DataLabeled[]} trainingData
 * @param {DataUnlabeled} newInstance
 * @returns {DataLabeledDistance[]}
 */
main.calculateDistances = (trainingData, newInstance) => {
  for (let i = 0; i < trainingData.length; i++) {
    trainingData[i].distance = Math.sqrt(
      (newInstance.x - trainingData[i].x) ** 2 + (newInstance.y - trainingData[i].y) ** 2
    );
  }
  return trainingData;
};

/**
 * @param {DataUnlabeled} from
 * @param {DataUnlabeled} to
 * @returns {number}
 */
main.calculateDistance = (from, to) => {
  return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);
};

/**
 * @param {DataLabeledDistance[]} trainingDataWithDistances
 * @returns {DataLabeledDistance[]}
 */
main.sortByDistance = (trainingDataWithDistances) => {
  // making a copy of the training data to avoid adding new points to the original data
  return trainingDataWithDistances
    .filter((instance) => instance.label !== 'NaN')
    .sort((a, b) => a.distance - b.distance);
};

/**
 * @param {DataLabeledDistance[]} sortedTrainingData
 * @param {DataUnlabeled} newInstance
 * @param {Number} k
 * @returns {DataLabeled}
 */
main.classifyNewInstance = (sortedTrainingData, newInstance, k, distanceWeighted, copy = true) => {
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
};

/**
 * @param {DataLabeled[]} trainingData
 * @param {DataUnlabeled} newInstance
 * @param {Number} k
 * @returns {KNNResult}
 */
main.knn = (trainingData, newInstance, k, classificationMethod, copy = true) => {
  let trainingDataWithDistances = main.calculateDistances(trainingData, newInstance);
  let sortedTrainingDataWithDistances = main.sortByDistance(trainingDataWithDistances);
  let newInstanceClassified = main.classifyNewInstance(
    sortedTrainingDataWithDistances,
    newInstance,
    k,
    classificationMethod === 'distanceWeighted',
    copy
  );
  return copy ? { P: sortedTrainingDataWithDistances, d: newInstanceClassified } : newInstanceClassified;
};

main.calculatePrecision = (trainingData, method) => {
  const distanceMatrix = []; //contains for each node the distance to others nodes
  for (let index1 = 0; index1 < trainingData.length; index1++) {
    distanceMatrix.push([]);
    for (let index2 = 0; index2 < trainingData.length; index2++) {
      if (index1 === index2) continue;
      let distance;
      if (index2 < index1) {
        distance = distanceMatrix[index2][index1 - 1].distance;
      } else {
        distance = main.calculateDistance(trainingData[index1], trainingData[index2]);
      }
      distanceMatrix[index1].push({ ...trainingData[index2], distance });
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
      let label = main.classifyNewInstance(
        distanceMatrix[i],
        trainingData[i],
        k + 1,
        distanceWeighted,
        false
      );
      if (label === trainingData[i].label && label !== 'NaN') {
        correctClassifications[k]++;
      }
    }
    if (correctClassifications[k] > correctClassifications[optimumK]) optimumK = k;
  }
  return optimumK;
};

module.exports = main;