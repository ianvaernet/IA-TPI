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
let newInstance = { x: 4.5, y: 2.5 };
setPlotLabels(["Etiqueta 1", "Etiqueta 2"]);

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
  // May not be useful if we update the newInstance to the mouse position
  // since it will be always hovering the newInstance point
  // hovermode: "closest",
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

const plotId = "chart";
const plot = document.getElementById(plotId);
plot.addEventListener("mousemove", onMouseMove);
plot.addEventListener("mousedown", onMouseDown);
Plotly.newPlot(plot, [], plotLayout, plotlyOptions);

updateKNN();

function updateKNN() {
  let k = getK();
  let { P, d } = knn(trainingData, newInstance, k);
  Plotly.react(plot, formatDataToPlot([...P, d]), plotLayout, plotlyOptions);
}

function onMouseDown(evt) {
  onMouseEvent(evt);
}

let nextUpdate = 0;
let timeout = null;
function onMouseMove(evt) {
  // check for too many updates, may be too heavy to execute on all move events
  const now = Date.now();
  if (nextUpdate > now) {
    if (timeout) clearTimeout(timeout);
    // Timeout helps if mouse stops moving and position is not centered
    timeout = setTimeout(() => onMouseEvent(evt), nextUpdate - now);
    return;
  }
  // play with this value until finding the sweet spot
  const fps = 30;
  nextUpdate = now + 1000 / fps;
  onMouseEvent(evt);
}

/**
 * Convert from mouse position to coordinates position
 * https://codepen.io/etpinard/pen/EyydEj
 */
function onMouseEvent(evt) {
  const xaxis = plot._fullLayout.xaxis;
  const yaxis = plot._fullLayout.yaxis;
  const l = plot.getBoundingClientRect().x + plot._fullLayout.margin.l;
  const t = plot.getBoundingClientRect().y + plot._fullLayout.margin.t;
  const x = xaxis.p2c(evt.x - l);
  const y = yaxis.p2c(evt.y - t);
  newInstance = { x, y };
  updateKNN();
}
