/**
 *
 * @param {Array} trainingData [ {x: x1, y: y1, label: 'etiqueta'}, ..., {x: xn, y: yn, label: 'etiqueta', distance: dn} ]
 * @param {Object} newInstance {x: xi, y:yi}
 * @param {Number} k
 * @returns {Array} [ {x: x1, y: y1, label: 'etiqueta', distance: d1}, ..., {x: xn, y: yn, label: 'etiqueta', distance: dn}, {x: xn+1, y: yn+1, label: 'etiqueta'} ]
 */

function knn(trainingData, newInstance, k) {
  let trainingDataWithDistances = calculateDistances(trainingData, newInstance);
  let orderedTrainingDataWithDistances = orderByDistance(trainingDataWithDistances);
  let newInstanceClassified = classifyNewInstance(orderedTrainingDataWithDistances, newInstance, k);
  orderedTrainingDataWithDistances.push(newInstanceClassified);
  return orderedTrainingDataWithDistances;
}
