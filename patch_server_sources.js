const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

if (!content.includes('/api/data/:type')) {
  const newApi = `
app.get('/api/data/:type', (req, res) => {
  const allowedTypes = ['dictation', 'ielts_vocab', 'podcast', 'shadowing', 'writing_essays', 'vocab'];
  const type = req.params.type;
  if (!allowedTypes.includes(type)) return res.status(400).json({error: 'Invalid type'});
  
  const file = path.join(__dirname, 'web', 'src', \`\${type}.json\`);
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
  
  const file = path.join(__dirname, 'web', 'src', \`\${type}.json\`);
  try {
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({success: true});
  } catch(e) {
    res.status(500).json({error: 'Failed to save data'});
  }
});

// Serve frontend in production
`;
  
  content = content.replace('// Serve frontend in production', newApi);
  fs.writeFileSync(serverPath, content, 'utf8');
  console.log('Server updated');
}
