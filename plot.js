const chartId = 'chart';
const plotlyOptions = {
  scrollZoom: true,
  locale: 'es',
  displayModeBar: false,
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: [
    'zoom2d',
    'select2d',
    'lasso2d',
    'hoverClosestCartesian',
    'hoverCompareCartesian',
    'autoScale2d',
    'toImage',
    'toggleSpikelines',
  ],
};
const colors = [
  '#636EFA',
  '#EF553B',
  '#00CC96',
  '#AB63FA',
  '#FFA15A',
  '#19D3F3',
  '#FF6692',
  '#B6E880',
  '#FF97FF',
  '#FECB52',
];

class Plot {
  constructor() {
    this.chart = document.getElementById(chartId);
    this.labelColor = {};
    Plotly.newPlot(chart, [], this.getLayout([]), plotlyOptions);
  }

  setPlotLabels(labels) {
    this.labelColor = {};
    labels.forEach((label, i) => (this.labelColor[label] = colors[i % colors.length]));
  }

  getLayout(data) {
    const xaxis = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
    const yaxis = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
    data.forEach((d) => {
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
        range: [xaxis.min, xaxis.max],
      },
      yaxis: {
        nticks: 23,
        range: [yaxis.min, yaxis.max],
        scaleanchor: 'x',
        scaleratio: 1,
      },
      // dragmode: "pan",
      // May not be useful if we update the newInstance to the mouse position
      // since it will be always hovering the newInstance point
      // hovermode: "closest",
      legend: {
        y: 0.5,
        yref: 'paper',
        font: {
          family: 'Avenir, Helvetica, Arial, sans-serif',
          size: 20,
          color: 'grey',
        },
      },
    };
  }

  updatePlot(P, d, k) {
    Plotly.react(this.chart, this.formatNewInstanceToPlot(P, d, k), this.getLayout(P), plotlyOptions);
  }

  updateTrainingDataToPlot(trainingData) {
    const plotableData = Object.keys(this.labelColor).map((label) => ({
      x: [],
      y: [],
      mode: 'markers',
      marker: {
        size: 8,
        color: this.labelColor[label],
      },
      name: label,
      hoverinfo: 'none',
    }));
    trainingData.forEach((element) => {
      let index = plotableData.findIndex((data) => data.name === element.label);
      if (index !== -1) {
        plotableData[index].x.push(element.x);
        plotableData[index].y.push(element.y);
      }
    });
    this.plotedTrainingData = plotableData;
  }

  formatNewInstanceToPlot(P, d, k) {
    const plotableData = JSON.parse(JSON.stringify(this.plotedTrainingData));
    const index = plotableData.findIndex((data) => data.name === d.label);
    if (index !== -1) {
      plotableData[index].x.push(d.x);
      plotableData[index].y.push(d.y);
    }
    const max = k < P.length ? k : P.length;
    for (let i = 0; i < max; i++) {
      const data = P[i];
      plotableData.push({
        x: [data.x, d.x],
        y: [data.y, d.y],
        mode: 'lines',
        line: {
          width: 2,
          color: this.labelColor[data.label],
        },
        showlegend: false,
        hoverinfo: 'none',
      });
    }
    return plotableData;
  }
}
