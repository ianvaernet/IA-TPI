/**
 *
 * @param {Array} trainingData [ {x: x1, y: y1, label: 'etiqueta'}, ..., {x: xn, y: yn, label: 'etiqueta'} ]
 * @param {Object} newInstance {x: xi, yi}
 * @returns {Array} [ {x: x1, y: y1, label: 'etiqueta', distance: d1}, ..., {x: xn, y: yn, label: 'etiqueta', distance: dn} ]
 */

function calculateDistances(trainingData, newInstance) {
  for (let i = 0; i < trainingData.length; i++) {
    let element = trainingData[i];
    let distance = (newInstance.x - trainingData[i].x) ** 2 + (newInstance.y - trainingData[i].y) ** 2;
    element.distance = distance;
  }
  return trainingData;
}
