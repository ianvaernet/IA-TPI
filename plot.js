const plotId = "chart";
const plot = document.getElementById(plotId);
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

let nextUpdate = 0;
let timeout = null;

function getLayout(data) {
  const xaxis = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
  const yaxis = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
  data.forEach(d => {
    if (d.x < xaxis.min) xaxis.min = d.x;
    if (d.x > xaxis.max) xaxis.max = d.x;
    if (d.y < yaxis.min) yaxis.min = d.y;
    if (d.y > yaxis.max) yaxis.max = d.y;
  });
  const xDiff = (xaxis.max - xaxis.min) * 0.1;
  const yDiff = (yaxis.max - yaxis.min) * 0.1;
  xaxis.min -= xDiff;
  xaxis.max += xDiff;
  yaxis.min -= yDiff;
  yaxis.max += yDiff;
  return {
    height: 800,
    width: 800,
    xaxis: {
      nticks: 21,
      range: [xaxis.min, xaxis.max]
    },
    yaxis: {
      nticks: 23,
      range: [yaxis.min, yaxis.max],
      scaleanchor: "x",
      scaleratio: 1
    },
    // dragmode: "pan",
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
}

function updatePlot(P, d, k) {
  Plotly.react(
    plot,
    formatDataToPlot([...P, d], d, k),
    getLayout(P),
    plotlyOptions
  );
}

function onMouseDown(evt) {
  onMouseEvent(evt);
}

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
  updateKNN({ x, y });
}

function setupPlot(trainingData) {
  Plotly.newPlot(plot, trainingData, getLayout(trainingData), plotlyOptions);
  // get the actual rect, not the whole div
  const rect = document.querySelector(".nsewdrag.drag");
  rect.addEventListener("mousemove", onMouseMove);
  rect.addEventListener("mousedown", onMouseDown);
}
