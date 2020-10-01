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

class Plot {
  constructor(labels) {
    this.labels = labels;
    this.chart = document.getElementById(chartId);
    this.layout = {
      height: 800,
      width: 800,
      xaxis: {
        nticks: 21,
        range: [-15, 15],
      },
      yaxis: {
        nticks: 23,
        range: [-15, 15],
        scaleanchor: 'x',
        scaleratio: 1,
      },
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
    Plotly.newPlot(chart, [], this.layout, plotlyOptions);
  }

  updateLayout(data) {
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
    this.layout.xaxis.range = [xaxis.min, xaxis.max];
    this.layout.yaxis.range = [yaxis.min, yaxis.max];
  }

  updatePlot(P, d, k) {
    Plotly.react(this.chart, this.formatNewInstanceToPlot(P, d, k), this.layout, plotlyOptions);
  }

  updateTrainingDataToPlot(trainingData) {
    const plotableData = this.labels.getLabels().map((label) => ({
      x: [],
      y: [],
      mode: 'markers',
      marker: {
        size: 8,
        color: this.labels.getColor(label),
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
    this.updateLayout(trainingData);
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
          color: this.labels.getColor(data.label),
        },
        showlegend: false,
        hoverinfo: 'none',
      });
    }
    return plotableData;
  }
}
