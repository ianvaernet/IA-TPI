const tableBodyId = 'table-body';
const KNNTableBodyId = 'knn-table-body';

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function addTableData(tr, value) {
  const td = document.createElement('td');
  td.innerText = value;
  tr.appendChild(td);
}

function updateTable(data) {
  const tableBody = document.getElementById(tableBodyId);
  removeAllChildNodes(tableBody);
  data.forEach((d) => {
    const tr = document.createElement('tr');
    addTableData(tr, d.x);
    addTableData(tr, d.y);
    addTableData(tr, d.label);
    tableBody.appendChild(tr);
  });
}

function updateKNNTable(orderedTrainingDataWithDistances, k) {
  const KNNTableBody = document.getElementById(KNNTableBodyId);
  removeAllChildNodes(KNNTableBody);
  const max = orderedTrainingDataWithDistances.length < k ? orderedTrainingDataWithDistances.length : k;
  for (let i = 0; i < max; i++) {
    const data = orderedTrainingDataWithDistances[i];
    const tr = document.createElement('tr');
    addTableData(tr, data.x.toFixed(4));
    addTableData(tr, data.y.toFixed(4));
    addTableData(tr, data.label);
    addTableData(tr, data.distance.toFixed(4));
    KNNTableBody.appendChild(tr);
  }
}
