const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize CORS middleware
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
  // Run CORS
  await runMiddleware(req, res, runCors);

  // In Vercel, process.cwd() is the root of the project
  const DATA_FILE = path.join(process.cwd(), 'grammar-units.json');

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data' });
    }
  } else if (req.method === 'POST') {
    try {
      const newData = req.body;
      // Note: fs.writeFileSync will not persist data across Vercel function invocations
      fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
      res.status(200).json({ success: true, message: 'Data saved successfully (ephemeral)' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
