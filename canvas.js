const canvasId = "canvas";
const canvas = document.getElementById(canvasId);

function toggleCanvas(value) {
  canvas.style.display = value ? "block" : "none";
  updateCanvas();
}

async function updateCanvas() {
  const ctx = canvas.getContext("2d");
  const k = getK();
  const xaxis = plot._fullLayout.xaxis;
  const yaxis = plot._fullLayout.yaxis;
  const left = plot._fullLayout.margin.l;
  const top = plot._fullLayout.margin.t;
  const width = plot._fullLayout._size.w;
  const height = plot._fullLayout._size.h;
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
      const { d } = knn(trainingData, { x, y }, k);
      ctx.fillStyle = labelColor[d.label] + "40";
      ctx.fillRect(left + xi, top + yi, dWidth, dHeight);
      const now = Date.now();
      if (now - lastFrame > 1000) {
        lastFrame = now;
        await new Promise(res => setTimeout(res, 0));
      }
    }
  }
  ctx.strokeRect(left, top, width, height);
  const endTime = Date.now();
  console.log("Duration:", (endTime - startTime) / 1000);
}
