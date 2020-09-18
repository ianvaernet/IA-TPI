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

const plotLayout = {
  height: 800,
  width: 800,
  xaxis: {
    nticks: 21,
    range: [-10, 10]
  },
  yaxis: {
    nticks: 21,
    range: [-10, 10]
  },
  dragmode: "pan",
  hovermode: "closest",
  legend: {
    y: 0.5,
    yref: "paper",
    font: {
      family: "Avenir, Helvetica, Arial, sans-serif",
      size: 20,
      color: "grey"
    }
  }
};

const plotlyOptions = {
  scrollZoom: true,
  locale: "es",
  displayModeBar: false,
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: [
    "zoom2d",
    "select2d",
    "lasso2d",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
    "autoScale2d",
    "toImage",
    "toggleSpikelines"
  ]
};

updateTable(trainingData);
setupK();

Plotly.newPlot("chart", {}, plotLayout, plotlyOptions);

updateKNN();

function updateKNN() {
  let k = getK();
  let newInstance = { x: 4.5, y: 2.5 };
  let data = knn(trainingData, newInstance, k);
  Plotly.react("chart", formatDataToPlot(data), plotLayout, plotlyOptions);
}
