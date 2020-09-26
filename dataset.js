async function loadDatasetFromURL(url) {
  const data = await axios.get(url).then(res => res.data);
  const dataset = await csv(data, { separator: ";" });
  updateTrainingData(dataset.map(d => ({ x: parseFloat(d.x1), y: parseFloat(d.x2), label: d.Clase })));
}
