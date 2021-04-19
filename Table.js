export class Table {
  head = [];
  rows = [];

  constructor(head) {
    this.head = head;
  }

  _buildHeader() {
    let headerHTML = '';
    this.head.forEach((columnName) => {
      headerHTML += `<th>${columnName}</th>`;
    });
    return headerHTML;
  }

  _buildRow(row) {
    return `<tr>${row}</tr>`;
  }

  _buildTable(rows) {
    return `<table>${rows}</table>`;
  }

  _buildRowCells(row) {
    let rowHTML = '';
    row.forEach((cell) => (rowHTML += `<td>${cell}</td>`));
    return rowHTML;
  }

  _buildTableContent() {
    let contentHTML = '';
    this.rows.forEach((row) => {
      const cellsHTML = this._buildRowCells(row);
      const rowHTML = `<tr>${cellsHTML}</tr>`;
      contentHTML += rowHTML;
    });
    return contentHTML;
  }
  toHTML() {
    console.log(this);
    const header = this._buildHeader();
    const headerRow = this._buildRow(header);
    const content = this._buildTableContent();
    const table = this._buildTable(headerRow + content);
    return table;
  }
  push(row) {
    this.rows.push(row);
  }
}
