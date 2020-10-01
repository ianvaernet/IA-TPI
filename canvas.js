const canvasId = 'canvas';

class Canvas {
  constructor(main, plot, labels) {
    this.canvas = document.getElementById(canvasId);
    this.main = main;
    this.plot = plot;
    this.labels = labels;
  }

  toggleCanvas(value) {
    this.canvas.style.display = value ? 'block' : 'none';
    updateCanvas();
  }

  async updateCanvas(trainingData, k) {
    const ctx = canvas.getContext('2d');
    const xaxis = this.plot.chart._fullLayout.xaxis;
    const yaxis = this.plot.chart._fullLayout.yaxis;
    const left = this.plot.chart._fullLayout.margin.l;
    const top = this.plot.chart._fullLayout.margin.t;
    const width = this.plot.chart._fullLayout._size.w;
    const height = this.plot.chart._fullLayout._size.h;
    ctx.clearRect(0, 0, 800, 800);
    const delta = 100;
    const dWidth = width / delta;
    const dHeight = height / delta;
    const hdWidth = dWidth / 2;
    const hdHeight = dHeight / 2;
    let lastFrame = 0;
    const startTime = Date.now();
    for (let i = 0; i < delta; i++) {
      for (let j = 0; j < delta; j++) {
        const xi = i * dWidth;
        const yi = j * dHeight;
        const x = xaxis.p2c(xi + hdWidth);
        const y = yaxis.p2c(yi + hdHeight);
        const { d } = this.main.knn(trainingData, { x, y }, k);
        ctx.fillStyle = this.labels.getColor(d.label) + '40';
        ctx.fillRect(left + xi, top + yi, dWidth, dHeight);
        const now = Date.now();
        if (now - lastFrame > 1000) {
          lastFrame = now;
          await new Promise((res) => setTimeout(res, 0));
        }
      }
    }
    ctx.strokeRect(left, top, width, height);
  }
}
