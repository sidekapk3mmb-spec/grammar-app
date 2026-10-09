const fs = require('fs');
const path = require('path');
const cors = require('cors');

const runCors = cors();

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

module.exports = async function handler(req, res) {
  await runMiddleware(req, res, runCors);

  const type = req.query.type;
  const allowedTypes = ['dictation', 'ielts_vocab', 'podcast', 'shadowing', 'writing_essays', 'vocab'];
  
  if (!type || !allowedTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid or missing type' });
  }

  // In Vercel, process.cwd() is the root of the project
  const DATA_FILE = path.join(process.cwd(), 'web', 'src', `${type}.json`);

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.status(200).json(JSON.parse(data));
      } else {
        res.status(200).json([]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data' });
    }
  } else if (req.method === 'POST') {
    try {
      const newData = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
