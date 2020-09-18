/**
 *
 * @param {Array} orderedTrainingData [ {x: x1, y: y1, label: 'etiqueta', distance: d1}, ..., {x: xn, y: yn, label: 'etiqueta', distance: dn} ]
 * @param {Object} newInstance {x: xi, y:yi}
 * @param {Number} k
 * @returns {Array} [ {x: x1, y: y1, label: 'etiqueta', distance: d1}, ..., {x: xn, y: yn, label: 'etiqueta', distance: dn} ]
 */

function classifyNewInstance(orderedTrainingData, newInstance, k) {
  let labels = []; // [{label: 'etiqueta', count: n}]
  if (k > orderedTrainingData.length) k = orderedTrainingData.length;
  for (let i = 0; i < k; i++) {
    let index = labels.findIndex((element) => element.label === orderedTrainingData[i].label);
    if (index === -1) labels.push({ label: orderedTrainingData[i].label, count: 1 });
    else labels[index].count++;
  }
  let maxFrecuency = Math.max(...labels.map((label) => label.count));
  let mostFrequentLabelIndex = labels.findIndex((label) => label.count === maxFrecuency);
  newInstance.label = labels[mostFrequentLabelIndex].label;
  console.log(labels);
  return newInstance;
}
