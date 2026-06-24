const fetch = require('node-fetch');
const Papa = require('papaparse');

const url = 'https://docs.google.com/spreadsheets/d/1Ag7yh0SFSqGfm3LTNinHwlwV6h5Xa4M2yIuf03mq2uc/export?format=csv&gid=949197576';

fetch(url)
  .then(res => res.text())
  .then(csv => {
    Papa.parse(csv, {
      header: false,
      skipEmptyLines: true,
      complete: function(results) {
        const rawData = results.data;
        const headers = rawData[2];
        let obj = {};
        for (let j = 0; j < headers.length; j++) {
            let headerName = headers[j];
            if (!headerName) continue;
            if (obj.hasOwnProperty(headerName)) {
                headerName = headerName + '_' + j;
            }
            obj[headerName] = j;
        }
        console.log("Headers with their array index:");
        console.log(obj);
        console.log("-------------------");
        
        let sampleRow = rawData[3];
        console.log("Sample Data for ID:", sampleRow[obj['ID']]);
        console.log("Sample Data for เบอร์โทร:", sampleRow[obj['เบอร์โทร']]);
        console.log("Sample Data for ช่องทาง:", sampleRow[obj['ช่องทาง']]);
      }
    });
  });
