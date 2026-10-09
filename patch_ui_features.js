const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add imports
if (!content.includes("shadowing.json")) {
  content = content.replace(
    "import dictationData from './dictation.json';",
    "import dictationData from './dictation.json';\nimport shadowingData from './shadowing.json';\nimport podcastData from './podcast.json';"
  );
}

// 2. Add routes
if (!content.includes('<Route path="/shadowing"')) {
  content = content.replace(
    '<Route path="/dictation" element={<DictationDrill recordActivity={recordActivity} />} />',
    '<Route path="/dictation" element={<DictationDrill recordActivity={recordActivity} />} />\n            <Route path="/shadowing" element={<ShadowingDrill />} />\n            <Route path="/podcast" element={<PodcastListening />} />'
  );
}

// 3. Update Dashboard to include Shadowing and Podcast
if (!content.includes('Shadowing')) {
  const dashOld = `<div className="dashboard-section mt-4" style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fdf4ff', border: '1px solid #d946ef', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>`;
          
  const dashNew = `<div className="dashboard-section mt-4" style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fff1f2', border: '1px solid #f43f5e', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <h3 style={{color: '#e11d48', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><PlayCircle size={18}/> Podcast Listening</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>TED & CEO</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Latih listening dengan video TED Talks dan Diary of a CEO.</p>
          <Link to="/podcast" className="btn btn-outline" style={{width: '100%', borderColor: '#e11d48', color: '#e11d48', textAlign: 'center'}}>Dengarkan</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fefce8', border: '1px solid #eab308', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <h3 style={{color: '#ca8a04', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><PlayCircle size={18}/> Shadowing</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>Speaking</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Latih pelafalan IELTS Speaking dengan metode Shadowing.</p>
          <Link to="/shadowing" className="btn btn-outline" style={{width: '100%', borderColor: '#ca8a04', color: '#ca8a04', textAlign: 'center'}}>Mulai Shadowing</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fdf4ff', border: '1px solid #d946ef', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>`;
          
  content = content.replace(dashOld, dashNew);
}

// 4. Add Components
if (!content.includes('function ShadowingDrill')) {
  const comps = `
// --- SHADOWING DRILL ---
function ShadowingDrill() {
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const session = shadowingData[sessionIndex];
  const sentence = session.sentences[sentenceIndex];

  const playSentence = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="content-box" style={{maxWidth: '700px', margin: '2rem auto', textAlign: 'center'}}>
      <h2 style={{color: '#ca8a04'}}><PlayCircle size={24} style={{verticalAlign: 'middle'}}/> Speaking Shadowing</h2>
      <div className="badge mb-4" style={{background: '#fefce8', color: '#ca8a04'}}>{session.title} ({session.difficulty})</div>
      
      <div style={{background: 'var(--surface)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h3 style={{fontSize: '1.8rem', lineHeight: '1.5', margin: 0, color: isPlaying ? '#ca8a04' : 'var(--text)'}}>
          {sentence}
        </h3>
      </div>

      <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
        <button 
          className="btn btn-outline" 
          disabled={sentenceIndex === 0}
          onClick={() => setSentenceIndex(sentenceIndex - 1)}
        ><ArrowLeft size={16}/></button>
        
        <button 
          className="btn btn-primary" 
          style={{background: '#ca8a04', borderColor: '#ca8a04', borderRadius: '50px', padding: '0.5rem 2rem', fontSize: '1.2rem'}}
          onClick={playSentence}
        >
          {isPlaying ? 'Speaking...' : 'Play & Repeat'}
        </button>
        
        <button 
          className="btn btn-outline" 
          disabled={sentenceIndex === session.sentences.length - 1}
          onClick={() => setSentenceIndex(sentenceIndex + 1)}
        ><ArrowRight size={16}/></button>
      </div>
      
      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{background: '#ca8a04', width: \`\${((sentenceIndex + 1) / session.sentences.length) * 100}%\`}}></div></div>
      <div style={{marginTop: '0.5rem', color: 'var(--text-muted)'}}>{sentenceIndex + 1} / {session.sentences.length}</div>
      
      <div style={{marginTop: '3rem'}}>
        <label>Select Session: </label>
        <select value={sessionIndex} onChange={(e) => {setSessionIndex(Number(e.target.value)); setSentenceIndex(0);}} style={{padding: '0.5rem', borderRadius: 'var(--radius-sm)'}}>
          {shadowingData.map((s, i) => <option key={s.id} value={i}>{s.title}</option>)}
        </select>
      </div>
    </div>
  );
}

// --- PODCAST LISTENING ---
function PodcastListening() {
  const [podcastIndex, setPodcastIndex] = useState(0);
  const podcast = podcastData[podcastIndex];

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <h2 style={{color: '#e11d48'}}><PlayCircle size={24} style={{verticalAlign: 'middle'}}/> Podcast Listening</h2>
      <select value={podcastIndex} onChange={(e) => setPodcastIndex(Number(e.target.value))} style={{width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}}>
        {podcastData.map((p, i) => <option key={p.id} value={i}>{p.source}: {p.title}</option>)}
      </select>

      <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius)', marginBottom: '1.5rem'}}>
        <iframe 
          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
          src={\`https://www.youtube.com/embed/\${podcast.videoId}\`} 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      <div style={{background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)'}}>
        <h3 style={{marginTop: 0}}>Interactive Transcript</h3>
        <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1rem'}}>Follow along with the video. (Timestamps are provided for reference)</p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '1rem'}}>
          {podcast.transcript.map((t, idx) => (
            <div key={idx} style={{display: 'flex', gap: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-bg)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span className="badge" style={{background: '#ffe4e6', color: '#e11d48', height: 'fit-content'}}>{t.time}</span>
              <span style={{lineHeight: '1.5'}}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

`;
  content = content.replace('export default App;', comps + 'export default App;');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('Shadowing and Podcast components added to App.tsx');
