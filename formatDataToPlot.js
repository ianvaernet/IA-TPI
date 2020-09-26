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

function formatDataToPlot(dataset, d, k) {
  let groupedData = Object.keys(labelColor).map(label => ({
    x: [],
    y: [],
    mode: "markers",
    marker: {
      size: 8,
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
  for (let i = 0; i < k; i++) {
    const data = dataset[i];
    groupedData.push({
      x: [data.x, d.x],
      y: [data.y, d.y],
      mode: "lines",
      line: {
        width: 2,
        color: labelColor[data.label]
      },
      showlegend: false,
      hoverinfo: "none"
    });
  }
  return groupedData;
}
