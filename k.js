const sliderId = 'k-slider';
const inputId = 'k-input';

class K {
  constructor(main, canvas, dataset) {
    this.slider = document.getElementById(sliderId);
    this.input = document.getElementById(inputId);
    this.main = main;
    this.canvas = canvas;
    this.dataset = dataset;
    this.k = parseInt(this.slider.value);
  }

  onKInputUpdate() {
    this.k = this.input.value;
    this.slider.value = this.k;
    this.updateK(this.k);
  }

  onKSliderUpdate() {
    this.k = this.slider.value;
    this.input.value = this.k;
    this.updateK(this.k);
  }

  updateK(k) {
    this.main.updateKNN(this.dataset.getTrainingData(), { x: 0, y: 0 }, k);
    this.canvas.updateCanvas(this.dataset.getTrainingData(), k);
  }

  getK() {
    return this.k;
  }
}
