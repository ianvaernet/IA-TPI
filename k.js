const sliderId = 'k-slider';
const inputId = 'k-input';

class K {
  constructor(main, plot, canvas, dataset) {
    this.slider = document.getElementById(sliderId);
    this.input = document.getElementById(inputId);
    this.main = main;
    this.plot = plot;
    this.canvas = canvas;
    this.dataset = dataset;
    this.k = parseInt(this.slider.value);
  }

  updateK(k) {
    this.k = k;
    this.input.value = k;
    this.slider.value = k;
    if (this.plot.mode === 'knn') this.main.updateKNN(this.dataset.getTrainingData(), { x: 0, y: 0 }, k);
    else this.plot.updatePlot();
    this.canvas.updateCanvas(this.dataset.getTrainingData(), k);
  }

  getK() {
    return this.k;
  }
}
