const canvasId = 'canvas';

class Canvas {
  constructor(main, plot, labels) {
    this.canvas = document.getElementById(canvasId);
    this.showGrid = document.getElementById('show-grid');
    this.main = main;
    this.plot = plot;
    this.labels = labels;
    this.deltaX = 100;
    this.deltaY = 100;
  }

  setVisible(value) {
    this.canvas.style.display = value ? 'block' : 'none';
  }

  async updateCanvas(trainingData, k) {
    // avoid multiple drawings, since I have no idea how to stop the previously running function
    if (this.updatingCanvas) {
      // when drawing finishes, the last dirty values will be used to draw the next time
      this.dirty = [trainingData, k];
      return;
    }
    this.dirty = null;
    this.updatingCanvas = true;
    // prevent initial freeze
    await new Promise((res) => setTimeout(res, 0));
    // hide canvas while drawing
    this.setVisible(false);
    this.lastData = [trainingData, k];
    const ctx = canvas.getContext('2d');
    const xaxis = this.plot.chart._fullLayout.xaxis;
    const yaxis = this.plot.chart._fullLayout.yaxis;
    const left = this.plot.chart._fullLayout.margin.l;
    const top = this.plot.chart._fullLayout.margin.t;
    const width = this.plot.chart._fullLayout._size.w;
    const height = this.plot.chart._fullLayout._size.h;
    ctx.clearRect(0, 0, 800, 800);
    const dWidth = width / this.deltaX;
    const dHeight = height / this.deltaY;
    const hdWidth = dWidth / 2;
    const hdHeight = dHeight / 2;
    const fps = 1000 / 30;
    let lastFrame = Date.now();
    let drawY = true;
    const distanceWeighted = this.main.getClassificationMethod() === 'distanceWeighted';
    if (this.dataset !== trainingData || !this.matrix) this.matrix = {};
    this.dataset = trainingData;
    const sort = (a, b) => a.distance - b.distance;
    for (let i = 0; i <= this.deltaX; i++) {
      const xi = i * dWidth;
      for (let j = 0; j <= this.deltaY; j++) {
        const yi = j * dHeight;
        const x = xaxis.p2c(xi);
        const y = yaxis.p2c(yi);
        if (!this.matrix[i]) this.matrix[i] = {};
        if (!this.matrix[i][j]) {
          let distances = [];
          for (let n = 0; n < trainingData.length; n++) {
            distances.push({ ...trainingData[n], distance: this.main.calculateDistance(trainingData[n], { x, y }) });
          }
          this.matrix[i][j] = distances;
          this.matrix[i][j].sort(sort);
        }
        const label = this.main.classifyNewInstance(this.matrix[i][j], { x, y }, k, distanceWeighted, false);
        ctx.fillStyle = this.labels.getColor(label, '40');
        ctx.fillRect(left + xi - hdWidth, top + yi - hdHeight, dWidth, dHeight);
        if (drawY && this.showGrid.checked) {
          this.drawLine(ctx, left, top + yi, left + width, top + yi);
        }
        const now = Date.now();
        if (now - lastFrame > fps) {
          lastFrame = now;
          await new Promise((res) => setTimeout(res, 0));
        }
      }
      drawY = false;
      if (this.showGrid.checked) this.drawLine(ctx, left + xi, top, left + xi, top + height);
    }

    ctx.strokeRect(left, top, width, height);
    // Clear colors outside stroke
    ctx.clearRect(0, 0, left - 1, 800);
    ctx.clearRect(left + width + 1, 0, 800, 800);
    ctx.clearRect(0, 0, 800, top - 1);
    ctx.clearRect(0, top + height + 1, 800, 800);
    this.setVisible(true);
    this.updatingCanvas = false;
    // is there anything to draw?
    if (this.dirty) {
      this.updateCanvas(...this.dirty);
    }
  }

  drawLine(ctx, startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  updateGrid(gridX, gridY) {
    this.deltaX = gridX;
    this.deltaY = gridY;
    this.updateCanvas(...this.lastData);
  }
}
