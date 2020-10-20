const gridXId = 'grid-x-slider';
const gridYId = 'grid-y-slider';
const labelXId = 'grid-x-label';
const labelYId = 'grid-y-label';
class Grid {
  constructor(canvas) {
    this.canvas = canvas;
    this.sliderX = new Input('Divisiones del grid X', gridXId, labelXId, () =>
      this.canvas.updateGrid(this.sliderX.value, this.sliderY.value)
    );
    this.sliderY = new Input('Divisiones del grid Y', gridYId, labelYId, () =>
      this.canvas.updateGrid(this.sliderX.value, this.sliderY.value)
    );
  }
}
