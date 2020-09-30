const sliderId = 'k-slider';
const labelId = 'k-label';

class K {
  constructor(main, canvas, dataset) {
    this.slider = document.getElementById(sliderId);
    this.label = document.getElementById(labelId);
    this.main = main;
    this.canvas = canvas;
    this.dataset = dataset;
    this.updateKLabel();
  }

  updateKLabel(k = this.getK()) {
    this.label.innerText = `K = ${k}`;
  }

  updateK() {
    this.updateKLabel();
    this.main.updateKNN(this.dataset.getTrainingData(), { x: 0, y: 0 }, this.getK());
    this.canvas.updateCanvas(this.dataset.getTrainingData(), this.getK());
  }

  getK() {
    return parseInt(this.slider.value);
  }
}
