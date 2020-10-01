class Table {
  constructor(bodyId, columns = [], parsers = {}) {
    this.tableBody = document.getElementById(bodyId);
    this.columns = columns;
    this.parsers = parsers;
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

  updateTable(rows) {
    this.removeAllChildNodes(this.tableBody);
    rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      this.addTableData(tr, index + 1);
      this.columns.forEach(column => {
        this.addTableData(tr, this.parsers[column] ? this.parsers[column](row[column]) : row[column]);
        this.tableBody.appendChild(tr);
      });
    });
  }
}
