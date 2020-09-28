// Should be editable
let trainingData = [
  { x: 1, y: -6.5, label: "Etiqueta 1" },
  { x: 2, y: -5.5, label: "Etiqueta 1" },
  { x: 1.5, y: -1.5, label: "Etiqueta 1" },
  { x: 3, y: 1.5, label: "Etiqueta 1" },
  { x: 6, y: 6.5, label: "Etiqueta 2" },
  { x: 7, y: 4.5, label: "Etiqueta 2" },
  { x: 8, y: 7.5, label: "Etiqueta 2" },
  { x: 6.5, y: 5.5, label: "Etiqueta 2" }
];

function updateKNN(newInstance = { x: 0, y: 0 }) {
  const k = getK();
  const { P, d } = knn(trainingData, newInstance, k);
  updatePlot(P, d, k);
}

function updateTrainingData(newTrainingData) {
  if (newTrainingData) trainingData = newTrainingData;
  const labels = [];
  trainingData.forEach(d => (labels.includes(d.label) ? {} : labels.push(d.label)));
  setPlotLabels(labels);
  updateTable(trainingData);
  updateKNN();
}

setupK();
setupPlot(trainingData);
updateTrainingData();
