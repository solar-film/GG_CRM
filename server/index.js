const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Get all records
app.get('/api/records', (req, res) => {
  db.all('SELECT * FROM records ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const parsedRows = rows.map(row => ({
      ...row,
      details: row.details ? JSON.parse(row.details) : {}
    }));
    res.json({ data: parsedRows });
  });
});

// Create new record
app.post('/api/records', (req, res) => {
  const { customer_name, contact, site_location, sale, status, details } = req.body;
  const sql = `INSERT INTO records (customer_name, contact, site_location, sale, status, details) VALUES (?,?,?,?,?,?)`;
  const params = [customer_name, contact, site_location, sale, status, JSON.stringify(details || {})];
  
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: { id: this.lastID }
    });
  });
});

// Get all settings
app.get('/api/settings', (req, res) => {
  db.all('SELECT * FROM settings', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = JSON.parse(r.value);
    });
    res.json({ data: settings });
  });
});

// Update a setting
app.put('/api/settings/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body; // value is expected to be an array

  db.run(`INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`, [key, JSON.stringify(value)], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'success' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
