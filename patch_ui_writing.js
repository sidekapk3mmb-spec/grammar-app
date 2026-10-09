const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add import
if (!content.includes("writing_essays.json")) {
  content = content.replace(
    "import ieltsData from './ielts_vocab.json';",
    "import ieltsData from './ielts_vocab.json';\nimport writingData from './writing_essays.json';"
  );
}

// 2. Add route
if (!content.includes('<Route path="/writing"')) {
  content = content.replace(
    '<Route path="/ielts" element={<IeltsDrill recordActivity={recordActivity} />} />',
    '<Route path="/ielts" element={<IeltsDrill recordActivity={recordActivity} />} />\n            <Route path="/writing" element={<WritingAnalyzer />} />'
  );
}

// 3. Update Dashboard to include Writing Analyzer
if (!content.includes('Writing Analyzer')) {
  const dashOld = `<div className="content-box" style={{flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <Zap size={48} className="text-accent" style={{marginBottom: '1rem'}} />
          <h3>Daily Mix Quiz</h3>`;
          
  const dashNew = `<div className="content-box" style={{flex: 1, minWidth: '280px', background: '#eff6ff', border: '1px solid #3b82f6', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#2563eb', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Edit3 size={18}/> Writing Analyzer</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>Band 8.0+</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Bedah struktur dan kosakata esai IELTS berstandar tinggi.</p>
          <Link to="/writing" className="btn btn-outline" style={{width: '100%', borderColor: '#2563eb', color: '#2563eb', textAlign: 'center'}}>Bedah Esai</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <Zap size={48} className="text-accent" style={{marginBottom: '1rem'}} />
          <h3>Daily Mix Quiz</h3>`;
          
  content = content.replace(dashOld, dashNew);
}

// 4. Add WritingAnalyzer Component
if (!content.includes('function WritingAnalyzer')) {
  const comp = `
// --- WRITING ANALYZER (IELTS BAND 8) ---
function WritingAnalyzer() {
  const [activeSentence, setActiveSentence] = useState(null);
  const essay = writingData[0];

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
        <div>
          <h2><Edit3 size={24} style={{verticalAlign: 'middle', marginRight: '0.5rem', color: '#2563eb'}} /> IELTS Writing Task 2</h2>
          <p className="text-muted" style={{marginTop: '0.5rem'}}>Hover or tap on highlighted sentences to see the analysis.</p>
        </div>
        <div className="badge" style={{fontSize: '1.2rem', background: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem'}}>
          Band {essay.band}
        </div>
      </div>

      <div style={{background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', borderLeft: '4px solid #94a3b8'}}>
        <strong>Prompt:</strong> {essay.prompt}
      </div>

      <div className="essay-content" style={{lineHeight: '2.2', fontSize: '1.1rem'}}>
        {essay.paragraphs.map((p, pIdx) => (
          <div key={pIdx} style={{marginBottom: '1.5rem'}}>
            {p.sentences.map((s, sIdx) => (
              <span 
                key={sIdx} 
                style={{
                  backgroundColor: s.highlight, 
                  padding: '2px 4px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: activeSentence === s ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'
                }}
                onMouseEnter={() => setActiveSentence(s)}
                onMouseLeave={() => setActiveSentence(null)}
                onClick={() => setActiveSentence(s)}
              >
                {s.text}{' '}
              </span>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeSentence && (
          <motion.div 
            initial={{opacity: 0, y: 20}} 
            animate={{opacity: 1, y: 0}}
            className="analysis-panel"
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1e293b',
              color: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              width: '90%',
              maxWidth: '600px',
              zIndex: 100
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span className="badge" style={{background: activeSentence.highlight, color: '#0f172a'}}>{activeSentence.category}</span>
              <button className="btn-icon" style={{color: 'white', padding: 0}} onClick={() => setActiveSentence(null)}><XCircle size={18} /></button>
            </div>
            <p style={{margin: 0, fontSize: '0.95rem'}}>{activeSentence.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

`;
  content = content.replace('export default App;', comp + 'export default App;');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('WritingAnalyzer added to App.tsx');
