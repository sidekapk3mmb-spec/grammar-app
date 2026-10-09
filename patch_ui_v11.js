const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add import
if (!content.includes("ielts_vocab.json")) {
  content = content.replace("import vocabData from './vocab.json';", "import vocabData from './vocab.json';\nimport ieltsData from './ielts_vocab.json';");
}

// 2. Add route
if (!content.includes('<Route path="/ielts"')) {
  content = content.replace(
    '<Route path="/vocab" element={<VocabDrill recordActivity={recordActivity} />} />',
    '<Route path="/vocab" element={<VocabDrill recordActivity={recordActivity} />} />\n            <Route path="/ielts" element={<IeltsDrill recordActivity={recordActivity} />} />'
  );
}

// 3. Update Dashboard
if (!content.includes('IELTS Vocab')) {
  const dashOld = `<div className="content-box" style={{flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <Zap size={48} className="text-accent" style={{marginBottom: '1rem'}} />`;
  
  const dashNew = `<div className="content-box" style={{flex: 1, minWidth: '280px', background: '#f0fdf4', border: '1px solid #22c55e', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#16a34a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Flame size={18}/> IELTS Vocab</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>20 Phrases</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Phrasal Verbs, Collocations, Idioms (Environment, Tech, etc).</p>
          <Link to="/ielts" className="btn btn-outline" style={{width: '100%', borderColor: '#16a34a', color: '#16a34a', textAlign: 'center'}}>Start IELTS Drill</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <Zap size={48} className="text-accent" style={{marginBottom: '1rem'}} />`;
  
  content = content.replace(dashOld, dashNew);
  content = content.replace('50 Words', '20 Words');
  content = content.replace('Swipe through 50 essential', 'Swipe through 20 essential');
}

// 4. Update VocabDrill
if (content.includes('VOCAB DRILL (50 WORDS)')) {
  content = content.replace('VOCAB DRILL (50 WORDS)', 'VOCAB DRILL (20 WORDS)');
  content = content.replace(
    'return [...vocabData].sort(() => 0.5 - Math.random());',
    'return [...vocabData].sort(() => 0.5 - Math.random()).slice(0, 20);'
  );
}

// 5. Add IeltsDrill component
if (!content.includes('function IeltsDrill')) {
  const ieltsComp = `
// --- IELTS VOCAB DRILL (20 PHRASES) ---

function IeltsDrill({ recordActivity }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  
  const words = useMemo(() => {
    return [...ieltsData].sort(() => 0.5 - Math.random()).slice(0, 20);
  }, []);

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      recordActivity();
      navigate('/');
    }
  };

  const w = words[currentIndex];

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\\*\\*/g, ''));
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (words.length === 0) return <div className="content-box">No IELTS vocab data available.</div>;

  return (
    <div className="drill-container">
      <div className="drill-header">
        <h2>IELTS Vocab</h2>
        <span className="badge" style={{background: '#dcfce7', color: '#16a34a'}}>{currentIndex + 1} / {words.length}</span>
      </div>
      
      <div className="flashcard" style={{minHeight: '250px'}}>
        <div className="flashcard-front" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <span className="badge" style={{background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)'}}>{w.theme}</span>
            <span className="badge" style={{background: 'var(--accent-bg)', color: 'var(--accent)'}}>{w.type}</span>
          </div>
          <h2 style={{fontSize: '2.5rem', margin: '0 0 1rem 0', textAlign: 'center'}}>{w.word}</h2>
          <button className="btn-icon audio-btn" onClick={() => playAudio(w.word)} title="Listen to pronunciation">
            <PlayCircle size={28} />
          </button>
        </div>

        <AnimatePresence>
          {showAnswer && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="flashcard-back">
              <div style={{fontSize: '1.2rem', fontWeight: '500', marginBottom: '1rem', color: 'var(--text-muted)'}}>{w.meaning}</div>
              <div style={{background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)'}}>
                 <RichText text={w.example} />
                 <button className="btn-icon audio-btn" style={{marginLeft: '0.5rem', verticalAlign: 'middle'}} onClick={() => playAudio(w.example)}><PlayCircle size={18} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="drill-actions">
        {!showAnswer ? (
          <button className="btn btn-primary w-100" style={{background: '#16a34a', borderColor: '#16a34a'}} onClick={() => setShowAnswer(true)}>Flip Card</button>
        ) : (
          <button className="btn btn-primary w-100" style={{background: '#16a34a', borderColor: '#16a34a'}} onClick={handleNext}>Next Phrase <ArrowRight size={16} style={{marginLeft: '0.5rem'}}/></button>
        )}
      </div>
    </div>
  );
}
`;
  content = content.replace('// --- MISTAKE DRILL (FLASHCARDS) ---', ieltsComp + '\n// --- MISTAKE DRILL (FLASHCARDS) ---');
}

// 6. Fix PracticeTab bug
if (!content.includes('const [reorderSelected, setReorderSelected] = useState([])')) {
  content = content.replace(
    'const [showResult, setShowResult] = useState(false);',
    'const [showResult, setShowResult] = useState(false);\n  const [reorderSelected, setReorderSelected] = useState([]);'
  );
  
  content = content.replace(
    'setShowResult(false);\n  }, [unit.unit]);',
    'setShowResult(false);\n    setReorderSelected([]);\n  }, [unit.unit]);'
  );
  
  content = content.replace(
    'setInputValue(\'\');\n    if (qIndex < questions.length - 1)',
    'setInputValue(\'\');\n    setReorderSelected([]);\n    if (qIndex < questions.length - 1)'
  );
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.tsx updated successfully.');
