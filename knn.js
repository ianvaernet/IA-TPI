/**
 * @typedef {{ x: number, y: number }} DataUnlabeled
 * @typedef {{ x: number, y: number, label: string }} DataLabeled
 * @typedef {{ x: number, y: number, label: string, distance: number }} DataLabeledDistance
 * @typedef {{ P: DataLabeledDistance[], d: DataLabeled }} KNNResult
 * @param {DataLabeled[]} trainingData [{ x: x1, y: y1, label: 'etiqueta' }, ..., { x: xn, y: yn, label: 'etiqueta', distance: dn }]
 * @param {DataUnlabeled} newInstance { x: xi, y: yi}
 * @param {Number} k
 * @returns {KNNResult} { P:[{ x: x1, y: y1, label: 'etiqueta', distance: d1 }, ..., { x: xn, y: yn, label: 'etiqueta', distance: dn }], d: { x: xi, y: yi, label: 'etiqueta' } }
 */
function knn(trainingData, newInstance, k) {
  let trainingDataWithDistances = calculateDistances(trainingData, newInstance);
  let orderedTrainingDataWithDistances = orderByDistance(trainingDataWithDistances);
  let newInstanceClassified = classifyNewInstance(orderedTrainingDataWithDistances, newInstance, k);
  return { P: orderedTrainingDataWithDistances, d: newInstanceClassified };
}
