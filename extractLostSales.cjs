const fs = require('fs');
const Papa = require('./node_modules/papaparse/papaparse.js');

const filePath = 'C:\\Users\\Acer\\.gemini\\antigravity\\brain\\f1929547-185b-4afa-9b78-63661e7569b9\\.system_generated\\steps\\529\\content.md';
let fileContent = fs.readFileSync(filePath, 'utf8');

// The file has an 8-line header added by the tool. Remove it.
const lines = fileContent.split('\n');
const csvData = lines.slice(8).join('\n');

const parsed = Papa.parse(csvData, { header: false });
const rows = parsed.data;

// Column AQ is index 42 (0-indexed: A=0... AQ=42)
const lostSalesIndex = 42;

const filteredRows = rows.filter((row, idx) => {
  // Keep the first 14 rows (headers/titles)
  if (idx < 14) return true;
  
  // Keep rows where the 'lost sale' column is not empty
  const lostSaleReason = row[lostSalesIndex];
  return lostSaleReason && lostSaleReason.toString().trim() !== '';
});

const outputCsv = Papa.unparse(filteredRows);
fs.writeFileSync('lost_sales_filtered.csv', outputCsv);
console.log('Successfully created lost_sales_filtered.csv with', filteredRows.length - 14, 'data rows.');
