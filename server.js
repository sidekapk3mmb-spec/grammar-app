const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join(__dirname, 'grammar-units.json');

app.get('/api/units', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/units', (req, res) => {
  try {
    const newData = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (err) {
    console.error("Error saving file:", err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});


app.get('/api/data/:type', (req, res) => {
  const allowedTypes = ['dictation', 'ielts_vocab', 'podcast', 'shadowing', 'writing_essays', 'vocab'];
  const type = req.params.type;
  if (!allowedTypes.includes(type)) return res.status(400).json({error: 'Invalid type'});
  
  const file = path.join(__dirname, 'web', 'src', `${type}.json`);
  try {
    const data = fs.readFileSync(file, 'utf8');
    res.json(JSON.parse(data));
  } catch(e) {
    res.status(500).json({error: 'Failed to read data'});
  }
});

app.post('/api/data/:type', (req, res) => {
  const allowedTypes = ['dictation', 'ielts_vocab', 'podcast', 'shadowing', 'writing_essays', 'vocab'];
  const type = req.params.type;
  if (!allowedTypes.includes(type)) return res.status(400).json({error: 'Invalid type'});
  
  const file = path.join(__dirname, 'web', 'src', `${type}.json`);
  try {
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({success: true});
  } catch(e) {
    res.status(500).json({error: 'Failed to save data'});
  }
});

// Serve frontend in production

app.use(express.static(path.join(__dirname, 'web/dist')));

// Catch-all route to support React Router (SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'web/dist/index.html'));
});

const PORT = process.env.PORT || 3001;

// Only listen if not running on Vercel (Vercel uses module.exports)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless function
module.exports = app;
