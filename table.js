class Table {
  constructor(bodyId, columns = [], parsers = {}, labels) {
    this.tableBody = document.getElementById(bodyId);
    this.columns = columns;
    this.parsers = parsers;
    this.labels = labels;
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
      if (this.labels && row.label) {
        tr.style.backgroundColor = this.labels.getColor(row.label) + "40";
      }
      this.addTableData(tr, index + 1);
      this.columns.forEach(column => {
        this.addTableData(tr, this.parsers[column] ? this.parsers[column](row[column]) : row[column]);
        this.tableBody.appendChild(tr);
      });
    });
  }
}
