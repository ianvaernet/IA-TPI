class Dataset {
  constructor(plot, tables, main, canvas) {
    this.plot = plot;
    this.tables = tables;
    this.main = main;
    this.canvas = canvas;
  }

  getTrainingData() {
    return this.trainingData;
  }

  updateTrainingData(trainingData, k) {
    this.trainingData = trainingData;
    const labels = [];
    trainingData.forEach((d) => (labels.includes(d.label) ? {} : labels.push(d.label)));
    this.plot.setPlotLabels(labels);
    this.plot.updateTrainingDataToPlot(trainingData);
    this.tables.updateDatasetTable(trainingData);
    this.main.updateKNN(trainingData, { x: 0, y: 0 }, k);
    this.canvas.updateCanvas(trainingData, k);
  }

  async loadDatasetFromURL(url, k) {
    const data = await axios.get(url).then((res) => res.data);
    const dataset = await csv(data, { separator: ';' });
    this.updateTrainingData(
      dataset.map((d) => ({ x: parseFloat(d.x1), y: parseFloat(d.x2), label: d.Clase })),
      k
    );
  }
}
