export const exportTableToCSV = (tableEle) => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  const rows = tableEle.querySelectorAll('tr');
  for (let i = 0; i < rows.length; i++) {
    const row = [], cols = rows[i].querySelectorAll('td, th');
    for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
    }
    csvContent += row + '\n';
  }

  const encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}
