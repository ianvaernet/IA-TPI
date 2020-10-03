class Dataset {
  constructor(plot, datasetTable, main, canvas, labels) {
    this.plot = plot;
    this.datasetTable = datasetTable;
    this.main = main;
    this.canvas = canvas;
    this.labels = labels;
    this.addDatasetButton = document.getElementById('add-dataset-button');
    this.fileInput = document.getElementById('file-input');
    this.addDatasetButton.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', () => this.loadLocalDataset());
  }

  getTrainingData() {
    return this.trainingData;
  }

  updateTrainingData(trainingData, k, updateLayout) {
    this.trainingData = trainingData;
    const labels = [];
    trainingData.forEach((d) => (labels.includes(d.label) ? {} : labels.push(d.label)));
    this.labels.setLabels(labels);
    this.plot.updateTrainingDataToPlot(trainingData);
    this.datasetTable.updateTable(trainingData);
    if (updateLayout) {
      this.plot.updateLayout(trainingData);
      if (this.plot.mode === 'knn') this.main.updateKNN(trainingData, { x: 0, y: 0 }, k);
      else this.plot.updatePlot();
    }
    this.canvas.updateCanvas(trainingData, k);
  }

  loadLocalDataset() {
    const reader = new FileReader();
    reader.readAsBinaryString(this.fileInput.files[0]);
    reader.onload = () => {
      this.processDatasetFile(reader.result);
    };
  }

  async loadDatasetFromURL(url) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => this.processDatasetFile(data));
  }

  async processDatasetFile(data) {
    const separator = data.indexOf(';') !== -1 ? ';' : ',';
    const dataset = await csv(data, { separator });
    this.updateTrainingData(
      dataset.map((d) => ({ x: parseFloat(d.x1), y: parseFloat(d.x2), label: d.Clase })),
      this.main.k.getK(),
      true
    );
  }
}
