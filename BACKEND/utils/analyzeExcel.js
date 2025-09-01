import * as XLSX from 'xlsx';

const analyzeExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' }); // ✅ ensure type is 'buffer'
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  if (!jsonData || jsonData.length === 0) return null;

  const columns = Object.keys(jsonData[0]);
  const columnTypes = {};
  const metrics = {};

  columns.forEach(col => {
    const values = jsonData.map(row => row[col]);
    const numericValues = values.filter(v => typeof v === 'number');

    columnTypes[col] = typeof values[0];

    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;
      metrics[col] = { sum, avg };
    }
  });

  return { columns, columnTypes, metrics };
};

export default analyzeExcel;
