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
    this.labelColor = {};
    labels.forEach((label, i) => (this.labelColor[label] = this.colors[i % this.colors.length]));
  }

  getColor(label) {
    return this.labelColor[label];
  }
}
