function formatDataToPlot(data) {
  let groupedData = [];
  data.forEach((element) => {
    let index = groupedData.findIndex((data) => data.name === element.label);
    if (index === -1) {
      groupedData.push({
        x: [element.x],
        y: [element.y],
        mode: 'markers',
        marker: { size: 12 },
        name: element.label,
      });
    } else {
      groupedData[index].x.push(element.x);
      groupedData[index].y.push(element.y);
    }
  });
  return groupedData;
}
