/**
 *
 * @param {Array} trainingDataWithDistances [ {x: x1, y: y1, label: 'etiqueta', distance: d1}, ..., {x: xn, y: yn, label: 'etiqueta', distance: dn} ]
 * @returns {Array} [ {x: x6, y: y6, label: 'etiqueta', distance: d6}, ..., {x: x2, y: y2, label: 'etiqueta', distance: d2} ]
 */

function orderByDistance(trainingDataWithDistances) {
  trainingDataWithDistances.sort((a, b) => a.distance - b.distance);
  return trainingDataWithDistances;
}
