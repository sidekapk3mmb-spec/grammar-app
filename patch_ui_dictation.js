const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add import
if (!content.includes("dictation.json")) {
  content = content.replace(
    "import writingData from './writing_essays.json';",
    "import writingData from './writing_essays.json';\nimport dictationData from './dictation.json';"
  );
}

// 2. Add route
if (!content.includes('<Route path="/dictation"')) {
  content = content.replace(
    '<Route path="/writing" element={<WritingAnalyzer />} />',
    '<Route path="/writing" element={<WritingAnalyzer />} />\n            <Route path="/dictation" element={<DictationDrill recordActivity={recordActivity} />} />'
  );
}

// 3. Update Dashboard to include Dictation
if (!content.includes('Daily Dictation')) {
  // We'll append it as a new section or next to the Daily Vocab. Let's create a new flex row.
  const dashOld = `<div className="dashboard-section mt-4" style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>`;
          
  const dashNew = `<div className="dashboard-section mt-4" style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fdf4ff', border: '1px solid #d946ef', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <h3 style={{color: '#c026d3', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Zap size={18}/> Daily Dictation</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>Listen & Type</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Latih pendengaran dan ejaan Anda dengan kalimat Bahasa Inggris sehari-hari.</p>
          <Link to="/dictation" className="btn btn-outline" style={{width: '100%', borderColor: '#c026d3', color: '#c026d3', textAlign: 'center'}}>Mulai Dictation</Link>
        </div>`;
          
  content = content.replace(dashOld, dashNew);
}

// 4. Add Dictation Component
if (!content.includes('function DictationDrill')) {
  const comp = `
// --- DAILY DICTATION ---
function DictationDrill({ recordActivity }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const d = dictationData[currentIndex];

  const playAudio = (speed = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(d.text);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setInputValue('');
    if (currentIndex < dictationData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      recordActivity();
      navigate('/');
    }
  };

  if (!d) return null;

  return (
    <div className="drill-container" style={{maxWidth: '600px', margin: '2rem auto'}}>
      <div className="drill-header">
        <h2>Daily Dictation</h2>
        <span className="badge" style={{background: '#fdf4ff', color: '#c026d3'}}>{currentIndex + 1} / {dictationData.length}</span>
      </div>

      <div className="content-box" style={{textAlign: 'center', padding: '3rem 1rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
          <button className="btn btn-primary" style={{background: '#c026d3', borderColor: '#c026d3', borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => playAudio(1.0)}>
            <PlayCircle size={32} />
          </button>
          <button className="btn btn-outline" style={{borderColor: '#c026d3', color: '#c026d3', borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => playAudio(0.7)}>
            <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>0.7x</span>
          </button>
        </div>

        <textarea 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type what you hear..."
          disabled={showResult}
          style={{width: '100%', height: '120px', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1.1rem', marginBottom: '1rem', resize: 'none'}}
        />

        {!showResult ? (
          <button className="btn btn-primary w-100" style={{background: '#c026d3', borderColor: '#c026d3'}} onClick={checkAnswer}>Check Answer</button>
        ) : (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} style={{textAlign: 'left', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: '4px solid #c026d3'}}>
            <h4 style={{marginTop: 0}}>Correct Text:</h4>
            <p style={{fontSize: '1.1rem', color: 'var(--text-strong)', marginBottom: '1rem'}}>{d.text}</p>
            <div className="badge" style={{background: '#fdf4ff', color: '#c026d3', marginBottom: '1rem'}}><Zap size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> Hint: {d.hint}</div>
            
            <button className="btn btn-primary w-100" style={{background: '#c026d3', borderColor: '#c026d3'}} onClick={nextQuestion}>
              {currentIndex < dictationData.length - 1 ? 'Next Audio' : 'Finish Dictation'} <ArrowRight size={16} style={{marginLeft: '0.5rem'}}/>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
`;
  content = content.replace('export default App;', comp + 'export default App;');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('DictationDrill added to App.tsx');
