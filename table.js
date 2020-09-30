const datasetTableBodyId = 'table-body';
const knnTableBodyId = 'knn-table-body';

class Tables {
  constructor() {
    this.datasetTableBody = document.getElementById(datasetTableBodyId);
    this.knnTableBody = document.getElementById(knnTableBodyId);
  }

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  addTableData(tr, value) {
    const td = document.createElement('td');
    td.innerText = value;
    tr.appendChild(td);
  }

  updateDatasetTable(data) {
    this.removeAllChildNodes(this.datasetTableBody);
    data.forEach((d) => {
      const tr = document.createElement('tr');
      this.addTableData(tr, d.x);
      this.addTableData(tr, d.y);
      this.addTableData(tr, d.label);
      this.datasetTableBody.appendChild(tr);
    });
  }

  updateKnnTable(orderedTrainingDataWithDistances, k) {
    this.removeAllChildNodes(this.knnTableBody);
    const max = orderedTrainingDataWithDistances.length < k ? orderedTrainingDataWithDistances.length : k;
    for (let i = 0; i < max; i++) {
      const data = orderedTrainingDataWithDistances[i];
      const tr = document.createElement('tr');
      this.addTableData(tr, data.x.toFixed(4));
      this.addTableData(tr, data.y.toFixed(4));
      this.addTableData(tr, data.label);
      this.addTableData(tr, data.distance.toFixed(4));
      this.knnTableBody.appendChild(tr);
    }
  }
}
