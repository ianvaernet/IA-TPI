const tableBodyId = "table-body";

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function addTableData(tr, value) {
  const td = document.createElement("td");
  td.innerText = value;
  tr.appendChild(td);
}

function updateTable(data) {
  const tableBody = document.getElementById(tableBodyId);
  removeAllChildNodes(tableBody);
  data.forEach(d => {
    const tr = document.createElement("tr");
    addTableData(tr, d.x);
    addTableData(tr, d.y);
    addTableData(tr, d.label);
    tableBody.appendChild(tr);
  });
}
