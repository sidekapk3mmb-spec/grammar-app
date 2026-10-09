import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, PlayCircle, Edit3, XCircle, CheckCircle2, Zap, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function useFeatureData(type) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/' + type)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, [type]);

  const saveData = async (newData) => {
    try {
      const res = await fetch('/api/data/' + type, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) setData(newData);
      return res.ok;
    } catch(e) { return false; }
  };
  return { data, setData, loading, saveData };
}

function CRUDManager({ data, saveData, columns, type, template }) {
  const [editingItem, setEditingItem] = useState(null);
  const [editJson, setEditJson] = useState('');

  const openEdit = (item) => {
    setEditingItem(item);
    setEditJson(JSON.stringify(item, null, 2));
  };
  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(editJson);
      const newData = data.map(d => d.id === parsed.id ? parsed : d);
      if(!data.find(d => d.id === parsed.id)) newData.push(parsed);
      saveData(newData);
      setEditingItem(null);
    } catch(e) { alert("Invalid JSON format"); }
  };
  const handleDelete = (id) => {
    if(confirm("Delete this item?")) {
      saveData(data.filter(d => d.id !== id));
    }
  };
  const addNew = () => {
    const newItem = { id: Date.now(), ...template };
    openEdit(newItem);
  };

  return (
    <div style={{marginTop: '2rem'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
        <h3>Manage {type} Database</h3>
        <button className="btn btn-primary" onClick={addNew}>+ Add New</button>
      </div>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px'}}>
          <thead>
            <tr style={{borderBottom: '2px solid var(--border)'}}>
              {columns.map(c => <th key={c.key} style={{padding: '0.75rem'}}>{c.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.id || idx} style={{borderBottom: '1px solid var(--border)'}}>
                {columns.map(c => <td key={c.key} style={{padding: '0.75rem'}}>{item[c.key]}</td>)}
                <td>
                  <button className="btn-icon" onClick={()=>openEdit(item)}><Edit3 size={16}/></button>
                  <button className="btn-icon" onClick={()=>handleDelete(item.id)} style={{color:'var(--danger)'}}><XCircle size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: 'var(--surface)', padding: '2rem', width: '90%', maxWidth: '800px', borderRadius: 'var(--radius)'}}>
            <h3>Edit Item (JSON format)</h3>
            <p className="text-muted">Edit the JSON properties below. You can paste YouTube IDs in the videoId field.</p>
            <textarea value={editJson} onChange={e => setEditJson(e.target.value)} style={{width: '100%', height: '400px', fontFamily: 'monospace', background: '#1e293b', color: '#e2e8f0', padding: '1rem', border: 'none', borderRadius: '4px'}} />
            <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button className="btn btn-outline" onClick={()=>setEditingItem(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveJson}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTS ---

export function PodcastListening() {
  const { data, loading, saveData } = useFeatureData('podcast');
  const [tab, setTab] = useState('practice');
  const [podcastIndex, setPodcastIndex] = useState(0);

  if (loading) return <div style={{textAlign:'center', marginTop:'2rem'}}>Loading...</div>;
  const podcast = data[podcastIndex];

  return (
    <div className="content-box" style={{maxWidth: '900px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && podcast && (
        <div>
          <h2 style={{color: '#e11d48'}}><PlayCircle size={24} style={{verticalAlign: 'middle'}}/> Podcast Listening</h2>
          <select value={podcastIndex} onChange={(e) => setPodcastIndex(Number(e.target.value))} style={{width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}}>
            {data.map((p, i) => <option key={p.id} value={i}>{p.source}: {p.title}</option>)}
          </select>
          {podcast.videoId && (
            <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius)', marginBottom: '1.5rem'}}>
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={\`https://www.youtube.com/embed/\${podcast.videoId}\`} frameBorder="0" allowFullScreen></iframe>
            </div>
          )}
          {podcast.transcript && podcast.transcript.length > 0 && (
            <div style={{background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)'}}>
              <h3 style={{marginTop: 0}}>Interactive Transcript</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto'}}>
                {podcast.transcript.map((t, idx) => (
                  <div key={idx} style={{display: 'flex', gap: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)'}}>
                    <span className="badge" style={{background: '#ffe4e6', color: '#e11d48', height: 'fit-content'}}>{t.time}</span>
                    <span style={{lineHeight: '1.5'}}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="Podcast" columns={[{key:'source', label:'Source'}, {key:'title', label:'Title'}, {key:'videoId', label:'YouTube ID'}]} template={{source: 'New Source', title: 'New Podcast', videoId: 'YOUTUBE_ID', transcript: []}} />
      )}
    </div>
  );
}

export function ShadowingDrill() {
  const { data, loading, saveData } = useFeatureData('shadowing');
  const [tab, setTab] = useState('practice');
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (loading) return <div style={{textAlign:'center', marginTop:'2rem'}}>Loading...</div>;
  const session = data[sessionIndex];
  const sentence = session?.sentences?.[sentenceIndex] || '';

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
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && session && (
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: '#ca8a04'}}><PlayCircle size={24} style={{verticalAlign: 'middle'}}/> Speaking Shadowing</h2>
          
          <select value={sessionIndex} onChange={(e) => {setSessionIndex(Number(e.target.value)); setSentenceIndex(0);}} style={{width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)'}}>
            {data.map((s, i) => <option key={s.id} value={i}>{s.title}</option>)}
          </select>

          {session.videoId && (
            <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius)', marginBottom: '1.5rem'}}>
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={\`https://www.youtube.com/embed/\${session.videoId}\`} frameBorder="0" allowFullScreen></iframe>
            </div>
          )}
          
          {sentence && (
            <>
              <div style={{background: 'var(--surface)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h3 style={{fontSize: '1.8rem', lineHeight: '1.5', margin: 0, color: isPlaying ? '#ca8a04' : 'var(--text)'}}>{sentence}</h3>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
                <button className="btn btn-outline" disabled={sentenceIndex === 0} onClick={() => setSentenceIndex(sentenceIndex - 1)}><ArrowLeft size={16}/></button>
                <button className="btn btn-primary" style={{background: '#ca8a04', borderColor: '#ca8a04', borderRadius: '50px', padding: '0.5rem 2rem', fontSize: '1.2rem'}} onClick={playSentence}>{isPlaying ? 'Speaking...' : 'Play & Repeat'}</button>
                <button className="btn btn-outline" disabled={sentenceIndex === session.sentences.length - 1} onClick={() => setSentenceIndex(sentenceIndex + 1)}><ArrowRight size={16}/></button>
              </div>
              <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{background: '#ca8a04', width: \`\${((sentenceIndex + 1) / session.sentences.length) * 100}%\`}}></div></div>
              <div style={{marginTop: '0.5rem', color: 'var(--text-muted)'}}>{sentenceIndex + 1} / {session.sentences.length}</div>
            </>
          )}
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="Shadowing" columns={[{key:'title', label:'Title'}, {key:'difficulty', label:'Difficulty'}, {key:'videoId', label:'YouTube ID'}]} template={{title: 'New Session', difficulty: 'Intermediate', videoId: '', sentences: []}} />
      )}
    </div>
  );
}

export function WritingAnalyzer() {
  const { data, loading, saveData } = useFeatureData('writing_essays');
  const [tab, setTab] = useState('practice');
  const [essayIndex, setEssayIndex] = useState(0);
  const [activeSentence, setActiveSentence] = useState(null);

  if (loading) return <div style={{textAlign:'center', marginTop:'2rem'}}>Loading...</div>;
  const essay = data[essayIndex];

  return (
    <div className="content-box" style={{maxWidth: '900px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && essay && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
            <select value={essayIndex} onChange={(e) => setEssayIndex(Number(e.target.value))} style={{width: '70%', padding: '0.75rem', borderRadius: 'var(--radius-sm)'}}>
              {data.map((e, i) => <option key={e.id} value={i}>{e.title}</option>)}
            </select>
            <div className="badge" style={{fontSize: '1.2rem', background: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem'}}>Band {essay.band}</div>
          </div>

          {essay.videoId && (
            <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius)', marginBottom: '1.5rem'}}>
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={\`https://www.youtube.com/embed/\${essay.videoId}\`} frameBorder="0" allowFullScreen></iframe>
            </div>
          )}

          <div style={{background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', borderLeft: '4px solid #94a3b8'}}>
            <strong>Prompt:</strong> {essay.prompt}
          </div>

          <div className="essay-content" style={{lineHeight: '2.2', fontSize: '1.1rem'}}>
            {essay.paragraphs && essay.paragraphs.map((p, pIdx) => (
              <div key={pIdx} style={{marginBottom: '1.5rem'}}>
                {p.sentences && p.sentences.map((s, sIdx) => (
                  <span key={sIdx} style={{backgroundColor: s.highlight, padding: '2px 4px', borderRadius: '4px', cursor: 'pointer', transition: '0.2s', boxShadow: activeSentence === s ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'}} onMouseEnter={() => setActiveSentence(s)} onMouseLeave={() => setActiveSentence(null)} onClick={() => setActiveSentence(s)}>
                    {s.text}{' '}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeSentence && (
              <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} style={{position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '600px', zIndex: 100}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span className="badge" style={{background: activeSentence.highlight, color: '#0f172a'}}>{activeSentence.category}</span>
                  <button className="btn-icon" style={{color: 'white', padding: 0}} onClick={() => setActiveSentence(null)}><XCircle size={18} /></button>
                </div>
                <p style={{margin: 0, fontSize: '0.95rem'}}>{activeSentence.note}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="Writing Essays" columns={[{key:'title', label:'Title'}, {key:'band', label:'Band'}, {key:'videoId', label:'YouTube ID'}]} template={{title: 'New Essay', prompt: 'Prompt text', band: 8.0, videoId: '', paragraphs: []}} />
      )}
    </div>
  );
}

export function DictationDrill({ recordActivity }) {
  const { data, loading, saveData } = useFeatureData('dictation');
  const [tab, setTab] = useState('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  if (loading) return <div style={{textAlign:'center', marginTop:'2rem'}}>Loading...</div>;
  const d = data[currentIndex];

  const playAudio = (speed = 1.0) => {
    if ('speechSynthesis' in window && d) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(d.text);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setInputValue('');
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      recordActivity();
      window.location.hash = '#/';
    }
  };

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && d && (
        <div style={{textAlign: 'center', padding: '1rem'}}>
          <h2>Daily Dictation</h2>
          <div className="badge mb-4" style={{background: '#fdf4ff', color: '#c026d3'}}>{currentIndex + 1} / {data.length}</div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
            <button className="btn btn-primary" style={{background: '#c026d3', borderColor: '#c026d3', borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => playAudio(1.0)}>
              <PlayCircle size={32} />
            </button>
            <button className="btn btn-outline" style={{borderColor: '#c026d3', color: '#c026d3', borderRadius: '50px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => playAudio(0.7)}>
              <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>0.7x</span>
            </button>
          </div>
          <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type what you hear..." disabled={showResult} style={{width: '100%', height: '120px', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1.1rem', marginBottom: '1rem', resize: 'none'}} />
          {!showResult ? (
            <button className="btn btn-primary w-100" style={{background: '#c026d3', borderColor: '#c026d3'}} onClick={() => setShowResult(true)}>Check Answer</button>
          ) : (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} style={{textAlign: 'left', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: '4px solid #c026d3'}}>
              <h4 style={{marginTop: 0}}>Correct Text:</h4>
              <p style={{fontSize: '1.1rem', color: 'var(--text-strong)', marginBottom: '1rem'}}>{d.text}</p>
              <div className="badge" style={{background: '#fdf4ff', color: '#c026d3', marginBottom: '1rem'}}><Zap size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> Hint: {d.hint}</div>
              <button className="btn btn-primary w-100" style={{background: '#c026d3', borderColor: '#c026d3'}} onClick={nextQuestion}>
                {currentIndex < data.length - 1 ? 'Next Audio' : 'Finish Dictation'} <ArrowRight size={16} style={{marginLeft: '0.5rem'}}/>
              </button>
            </motion.div>
          )}
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="Dictation" columns={[{key:'text', label:'Text'}]} template={{text: 'New sentence...', hint: 'Hint...'}} />
      )}
    </div>
  );
}

export function IeltsDrill({ recordActivity }) {
  const { data, loading, saveData } = useFeatureData('ielts_vocab');
  const [tab, setTab] = useState('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  // We limit session to 20 just for practice view
  const practiceData = data.slice(0, 20);

  if (loading) return <div style={{textAlign:'center', marginTop:'2rem'}}>Loading...</div>;

  const nextCard = () => {
    if (currentIndex < practiceData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
    } else {
      recordActivity();
      window.location.hash = '#/';
    }
  };

  const playAudio = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const d = practiceData[currentIndex];

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && d && (
        <div className="drill-container">
          <div className="drill-header">
            <h2 style={{color: '#16a34a'}}>IELTS Vocab</h2>
            <span className="badge" style={{background: '#f0fdf4', color: '#16a34a'}}>{currentIndex + 1} / {practiceData.length}</span>
          </div>
          <div className="flashcard">
            <div className="flashcard-content">
              <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem'}}>
                <span className="badge" style={{background: '#e0f2fe', color: '#0369a1'}}>{d.type}</span>
                <span className="badge" style={{background: '#fef3c7', color: '#b45309'}}>{d.theme}</span>
              </div>
              <h2 className="word" style={{fontSize: '2.5rem', color: '#16a34a'}}>{d.word}</h2>
              <button className="btn-icon mt-2" onClick={() => playAudio(d.word)}>
                <PlayCircle size={24} color="#16a34a" />
              </button>
              {showMeaning ? (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="meaning-section mt-4">
                  <h4 style={{color: 'var(--text-strong)'}}>Meaning:</h4>
                  <p style={{fontSize: '1.2rem'}}>{d.meaning}</p>
                  <h4 className="mt-3" style={{color: 'var(--text-strong)'}}>Example:</h4>
                  <p className="example-text" dangerouslySetInnerHTML={{__html: d.example}}></p>
                </motion.div>
              ) : (
                <div className="mt-4"><button className="btn btn-outline" style={{borderColor: '#16a34a', color: '#16a34a'}} onClick={() => setShowMeaning(true)}>Show Meaning</button></div>
              )}
            </div>
            {showMeaning && (
              <div className="flashcard-footer"><button className="btn btn-primary w-100" style={{background: '#16a34a', borderColor: '#16a34a'}} onClick={nextCard}>Next Phrase <ArrowRight size={16} /></button></div>
            )}
          </div>
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="IELTS Vocab" columns={[{key:'word', label:'Phrase'}, {key:'type', label:'Type'}, {key:'theme', label:'Theme'}]} template={{word: 'New phrase', type: 'Idiom', theme: 'General', meaning: 'Definition...', example: 'Example sentence...'}} />
      )}
    </div>
  );
}
