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
main.classifyNewInstance = (sortedTrainingData, newInstance, k, distanceWeighted) => {
  const labels = []; // [{label: 'C1', count: n, distance: f}]
  const newInstanceCopy = { ...newInstance };
  if (k > sortedTrainingData.length) k = sortedTrainingData.length;
  let zeroDistance = false;
  for (let i = 0; i < k; i++) {
    if (sortedTrainingData[i].distance === 0 && distanceWeighted) {
      zeroDistance = true;
      var zeroDistanceLabel = sortedTrainingData[i].label;
      break;
    }
    const index = labels.findIndex((element) => element.label === sortedTrainingData[i].label);
    const deltaCount = distanceWeighted ? (1 / (sortedTrainingData[i].distance ** 2)) : 1;
    if (index === -1) {
      labels.push({
        label: sortedTrainingData[i].label,
        count: deltaCount,
      });
    }
    else {
      labels[index].count += deltaCount;
    }
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
};

/**
 * @param {DataLabeled[]} trainingData
 * @param {DataUnlabeled} newInstance
 * @param {Number} k
 * @returns {KNNResult}
 */
main.knn = (trainingData, newInstance, k, classificationMethod) => {
  let trainingDataWithDistances = main.calculateDistances(trainingData, newInstance);
  let sortedTrainingDataWithDistances = main.sortByDistance(trainingDataWithDistances);
  let newInstanceClassified = main.classifyNewInstance(
    sortedTrainingDataWithDistances,
    newInstance,
    k,
    classificationMethod === 'distanceWeighted'
  );
  return { P: sortedTrainingDataWithDistances, d: newInstanceClassified };
};

main.calculatePrecision = (trainingData, method) => {
  const distanceMatrix = []; //contains for each node the distance to others nodes
  trainingData.forEach((node1, index1) => {
    distanceMatrix.push([]);
    trainingData.forEach((node2, index2) => {
      if (index1 === index2) return;
      let distance;
      if (index2 < index1) {
        distance = distanceMatrix[index2][index1 - 1].distance;
      } else {
        distance = main.calculateDistance(node1, node2);
      }
      distanceMatrix[index1].push({ ...node2, distance });
    });
  });
  distanceMatrix.forEach((row, index) => distanceMatrix[index] = main.sortByDistance(row));
  const correctClassifications = []; //contains for each k the number of correct classifications
  let optimumK = 0;
  const distanceWeighted = method === 'distanceWeighted';
  for (let k = 0; k < trainingData.length - 1; k++) {
    correctClassifications.push(0);
    trainingData.forEach((node, index) => {
      let nodeClassified = main.classifyNewInstance(
        distanceMatrix[index],
        node,
        k + 1,
        distanceWeighted
      );
      if (nodeClassified.label === trainingData[index].label && nodeClassified.label !== 'NaN')
        correctClassifications[k]++;
    });
    if (correctClassifications[k] > correctClassifications[optimumK]) optimumK = k;
  }
  return optimumK;
};

module.exports = main;