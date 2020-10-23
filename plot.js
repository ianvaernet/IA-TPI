const chartId = 'chart';
const plotlyOptions = {
  scrollZoom: false,
  locale: 'es',
  displaylogo: false,
  responsive: true,
  modeBarButtons: [
    [
      {
        name: 'K vecinos próximos',
        active: 'true',
        icon: Plotly.Icons.tooltip_compare,
        click: () => main.plot.setMode('knn'),
      },
      {
        name: 'Modo Panorámica',
        icon: Plotly.Icons.pan,
        click: () => main.plot.setMode('pan'),
      },
      // 'pan2d',
      // 'zoomIn2d',
      // 'zoomOut2d',
      // 'resetScale2d',
      // 'toImage',
    ],
  ],
};

class Plot {
  constructor(labels, knnTable) {
    this.labels = labels;
    this.knnTable = knnTable;
    this.chart = document.getElementById(chartId);
    this.layout = {
      autosize: false,
      height: 800,
      width: 800,
      margin: {
        l: 40,
        r: 40,
        b: 40,
        t: 40,
        pad: 8,
      },
      xaxis: {
        nticks: 21,
        range: [-15, 15],
        showgrid: false,
        zeroline: false,
      },
      yaxis: {
        nticks: 23,
        range: [-15, 15],
        showgrid: false,
        zeroline: false,
      },
      legend: {
        orientation: 'h',
        x: -0.02,
        y: -0.04,
        yref: 'paper',
        font: {
          family: 'Avenir, Helvetica, Arial, sans-serif',
          size: 20,
          color: 'grey',
        },
      },
    };
    Plotly.newPlot(chart, [], this.layout, plotlyOptions);
    this.setMode('knn');
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
    if (this.mode === 'knn')
      Plotly.react(this.chart, this.formatNewInstanceToPlot(P, d, k), this.layout, plotlyOptions);
    else Plotly.react(this.chart, this.plotedTrainingData, this.layout, plotlyOptions);
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

  setMode(mode) {
    this.mode = mode;
    if (mode === 'knn') {
      document.getElementsByClassName('draglayer')[0].style.cursor = 'none';
    }
    if (mode === 'pan') {
      document.getElementsByClassName('draglayer')[0].style.cursor = 'move';
      document.getElementById('mouse-position').innerHTML = '';
      this.updatePlot();
      this.knnTable.updateTable([]);
    }
  }

  toggleAxisGrid() {
    this.layout.xaxis.showgrid = !this.layout.xaxis.showgrid;
    this.layout.yaxis.showgrid = !this.layout.yaxis.showgrid;
    Plotly.react(this.chart, this.plotedTrainingData, this.layout, plotlyOptions);
  }
}
