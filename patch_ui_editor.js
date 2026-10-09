const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Add route
if (!content.includes('<Route path="/admin"')) {
  content = content.replace(
    '<Route path="/podcast" element={<PodcastListening />} />',
    '<Route path="/podcast" element={<PodcastListening />} />\n            <Route path="/admin" element={<DataEditor />} />'
  );
}

// 2. Add sidebar link
if (!content.includes('Data Sources')) {
  content = content.replace(
    '<BrainCircuit size={16} /> Mistake Drill ({mistakes.length})\n            </Link>\n          )}',
    '<BrainCircuit size={16} /> Mistake Drill ({mistakes.length})\n            </Link>\n          )}\n          <Link to="/admin" className={`sidebar-link ${location.pathname === \'/admin\' ? \'active\' : \'\'}`}>\n            <Edit3 size={16} /> Data Sources\n          </Link>'
  );
}

// 3. Add Component
if (!content.includes('function DataEditor')) {
  const comp = `
// --- DATA SOURCES EDITOR ---
function DataEditor() {
  const [selectedType, setSelectedType] = useState('dictation');
  const [dataStr, setDataStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const types = ['dictation', 'ielts_vocab', 'podcast', 'shadowing', 'writing_essays', 'vocab'];

  const loadData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(\`/api/data/\${selectedType}\`);
      if (res.ok) {
        const json = await res.json();
        setDataStr(JSON.stringify(json, null, 2));
      } else {
        setMessage('Error loading data');
      }
    } catch(e) {
      setMessage('Error fetching API (Make sure server is running)');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedType]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(dataStr);
      setLoading(true);
      setMessage('Saving...');
      const res = await fetch(\`/api/data/\${selectedType}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      if (res.ok) {
        setMessage('Data saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving data');
      }
    } catch(e) {
      setMessage('Invalid JSON Format! Please check for syntax errors.');
    }
    setLoading(false);
  };

  return (
    <div className="content-box" style={{maxWidth: '900px', margin: '2rem auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{margin: 0}}><Edit3 size={24} style={{verticalAlign: 'middle', marginRight: '0.5rem'}}/> Data Source Editor</h2>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={{padding: '0.5rem', borderRadius: 'var(--radius-sm)'}}>
            {types.map(t => <option key={t} value={t}>{t}.json</option>)}
          </select>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}><Save size={16} style={{marginRight: '0.5rem'}}/> {loading ? 'Processing...' : 'Save File'}</button>
        </div>
      </div>
      
      {message && <div className="badge mb-4" style={{background: message.includes('Invalid') || message.includes('Error') ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.includes('Invalid') || message.includes('Error') ? 'var(--danger)' : 'var(--success)', fontSize: '1rem', padding: '0.5rem 1rem'}}>{message}</div>}

      <div style={{background: '#1e293b', padding: '1rem', borderRadius: 'var(--radius)'}}>
        <textarea 
          value={dataStr} 
          onChange={e => setDataStr(e.target.value)}
          style={{
            width: '100%', 
            height: '60vh', 
            background: 'transparent', 
            color: '#e2e8f0', 
            border: 'none', 
            fontFamily: 'monospace', 
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>
    </div>
  );
}

`;
  content = content.replace('export default App;', comp + 'export default App;');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('DataEditor added');
