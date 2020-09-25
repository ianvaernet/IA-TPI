const colors = [
  "#636EFA",
  "#EF553B",
  "#00CC96",
  "#AB63FA",
  "#FFA15A",
  "#19D3F3",
  "#FF6692",
  "#B6E880",
  "#FF97FF",
  "#FECB52"
];

let labelColor = {};

function setPlotLabels(labels) {
  labelColor = {};
  labels.forEach((label, i) => (labelColor[label] = colors[i % colors.length]));
}

function formatDataToPlot(dataset) {
  let groupedData = Object.keys(labelColor).map(label => ({
    x: [],
    y: [],
    mode: "markers",
    marker: {
      size: 12,
      color: labelColor[label]
    },
    name: label,
    hoverinfo: "none"
  }));
  dataset.forEach(element => {
    let index = groupedData.findIndex(data => data.name === element.label);
    if (index !== -1) {
      groupedData[index].x.push(element.x);
      groupedData[index].y.push(element.y);
    }
  });
  return groupedData;
}
