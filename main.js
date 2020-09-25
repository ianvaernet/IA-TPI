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
setPlotLabels(["Etiqueta 1", "Etiqueta 2"]);

function updateKNN(newInstance) {
  const k = getK();
  const { P, d } = knn(trainingData, newInstance, k);
  updatePlot(P, d);
}

updateTable(trainingData);
setupK();
setupPlot();
updateKNN({ x: 0, y: 0 });
