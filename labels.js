const colors = [
  '#636EFA',
  '#EF553B',
  '#00CC96',
  '#AB63FA',
  '#FFA15A',
  '#19D3F3',
  '#FF6692',
  '#B6E880',
  '#FF97FF',
  '#FECB52',
];

class Labels {
  constructor(labels, labelsColors) {
    this.colors = labelsColors || colors;
    if (labels) this.setLabels(labels);
  }

  getLabels() {
    return this.labels;
  }

  setLabels(labels) {
    this.labels = labels;
    this.labelColor = { NaN: '#00000000' };
    labels.forEach((label, i) => {
      if (label !== 'NaN') this.labelColor[label] = this.colors[i % this.colors.length];
    });
  }

  getColor(label, alpha) {
    if (alpha) {
      const color = this.labelColor[label];
      const colorPart = color.slice(0, 7);
      const alphaPart = color.slice(7, 9);
      if (alphaPart.length > 0) {
        return alphaPart === "|1" ? colorPart : color;
      } else {
        return color + alpha;
      }
    } else {
      return this.labelColor[label];
    }
  }
}
