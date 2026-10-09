import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, PlayCircle, Edit3, XCircle, CheckCircle2, Zap, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function useFeatureData(type) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/' + type)
      .then(res => res.json())
      .then(json => { 
        if (Array.isArray(json)) {
          setData(json);
        } else {
          console.error("API returned non-array:", json);
          setData([]);
        }
        setLoading(false); 
      })
      .catch(e => { console.error(e); setLoading(false); setData([]); });
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
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={`https://www.youtube.com/embed/${podcast.videoId}`} frameBorder="0" allowFullScreen></iframe>
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
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={`https://www.youtube.com/embed/${session.videoId}`} frameBorder="0" allowFullScreen></iframe>
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
              <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{background: '#ca8a04', width: `${((sentenceIndex + 1) / session.sentences.length) * 100}%`}}></div></div>
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
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={`https://www.youtube.com/embed/${essay.videoId}`} frameBorder="0" allowFullScreen></iframe>
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

export function DictationDrill({ recordActivity, mistakes = [], setMistakes = null }) {
  const { data, loading, saveData } = useFeatureData('dictation');
  const [tab, setTab] = useState('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [accent, setAccent] = useState('en-US');
  const MAX_PLAYS = 3;

  if (loading) return <div style={{textAlign:'center', marginTop:'2rem'}}>Loading...</div>;
  const d = data[currentIndex];

  const playAudio = (speed = 1.0) => {
    if ('speechSynthesis' in window && d) {
      if (playCount >= MAX_PLAYS && !showResult) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(d.text);
      utterance.lang = accent;
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
      if (!showResult) setPlayCount(p => p + 1);
    }
  };

  const computeDiff = (typed, correct) => {
    const normalize = (s) => s.toLowerCase().replace(/[.,!?;:'"]/g, '').trim();
    const typedWords = typed.trim().split(/\s+/).filter(Boolean);
    const correctWords = correct.trim().split(/\s+/).filter(Boolean);
    return correctWords.map((cw, i) => {
      const tw = typedWords[i];
      if (!tw) return { word: cw, status: 'missing' };
      if (normalize(tw) === normalize(cw)) return { word: cw, typed: tw, status: 'correct' };
      return { word: cw, typed: tw, status: 'wrong' };
    });
  };

  const handleCheck = () => {
    setShowResult(true);
    if (d && setMistakes) {
      const diff = computeDiff(inputValue, d.text);
      const wrongWords = diff.filter(w => w.status !== 'correct').map(w => w.word);
      if (wrongWords.length > 0) {
        const already = (mistakes || []).some((m) => m.text === d.text && m.type === 'dictation');
        if (!already) {
          setMistakes([...(mistakes || []), { type: 'dictation', text: d.text, userInput: inputValue, wrongWords, hint: d.hint, timestamp: Date.now() }]);
        }
      }
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setInputValue('');
    setPlayCount(0);
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      recordActivity();
      window.location.hash = '#/';
    }
  };

  const diffResult = showResult && d ? computeDiff(inputValue, d.text) : [];
  const correctCount = diffResult.filter(w => w.status === 'correct').length;
  const accuracy = diffResult.length > 0 ? Math.round((correctCount / diffResult.length) * 100) : 0;

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && d && (
        <div style={{textAlign: 'center', padding: '0.5rem'}}>
          <h2 style={{color: '#c026d3', marginBottom: '0.5rem'}}>Daily Dictation</h2>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
            <span className="badge" style={{background: '#fdf4ff', color: '#c026d3'}}>{currentIndex + 1} / {data.length}</span>
            <select value={accent} onChange={e => setAccent(e.target.value)} style={{padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem', background: 'var(--surface)'}}>
              <option value="en-US">🇺🇸 US Accent</option>
              <option value="en-GB">🇬🇧 UK Accent</option>
            </select>
            {!showResult && (
              <span style={{fontSize: '0.85rem', color: playCount >= MAX_PLAYS ? 'var(--danger)' : 'var(--text-muted)'}}>Plays: {playCount}/{MAX_PLAYS}</span>
            )}
          </div>

          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
            <button className="btn btn-primary" style={{background: '#c026d3', borderColor: '#c026d3', borderRadius: '50px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!showResult && playCount >= MAX_PLAYS) ? 0.4 : 1}} onClick={() => playAudio(1.0)} disabled={!showResult && playCount >= MAX_PLAYS}>
              <PlayCircle size={30} />
            </button>
            <button className="btn btn-outline" style={{borderColor: '#c026d3', color: '#c026d3', borderRadius: '50px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!showResult && playCount >= MAX_PLAYS) ? 0.4 : 1}} onClick={() => playAudio(0.75)} disabled={!showResult && playCount >= MAX_PLAYS}>
              <span style={{fontSize: '0.75rem', fontWeight: 'bold'}}>0.75x</span>
            </button>
          </div>

          <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type what you hear..." disabled={showResult} style={{width: '100%', height: '120px', padding: '1rem', borderRadius: 'var(--radius)', border: `1px solid ${showResult ? 'var(--border)' : 'var(--accent)'}`, fontSize: '1.1rem', marginBottom: '1rem', resize: 'none', boxSizing: 'border-box', outline: 'none'}} />

          {!showResult ? (
            <button className="btn btn-primary w-100" style={{background: '#c026d3', borderColor: '#c026d3'}} onClick={handleCheck} disabled={!inputValue.trim()}>Check Answer</button>
          ) : (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} style={{textAlign: 'left'}}>
              <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                <div style={{fontSize: '3.5rem', fontWeight: 800, color: accuracy >= 80 ? 'var(--success)' : accuracy >= 50 ? '#f59e0b' : 'var(--danger)', lineHeight: 1}}>{accuracy}%</div>
                <div style={{color: 'var(--text-muted)', marginTop: '0.25rem'}}>{correctCount} / {diffResult.length} kata benar</div>
              </div>

              <div style={{background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', lineHeight: '2.5', fontSize: '1.05rem', border: '1px solid var(--border)'}}>
                <div style={{fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Hasil Per Kata</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center'}}>
                  {diffResult.map((item, i) => (
                    <span key={i} style={{padding: '2px 8px', borderRadius: '6px', background: item.status === 'correct' ? '#dcfce7' : item.status === 'missing' ? '#fee2e2' : '#fef9c3', color: item.status === 'correct' ? '#166534' : item.status === 'missing' ? '#991b1b' : '#854d0e', border: `1px solid ${item.status === 'correct' ? '#86efac' : item.status === 'missing' ? '#fca5a5' : '#fde047'}`}}>
                      {item.status === 'wrong' && <span style={{textDecoration: 'line-through', marginRight: '4px', opacity: 0.6}}>{item.typed}</span>}
                      {item.word}
                      {item.status === 'missing' && <span style={{fontStyle: 'italic', opacity: 0.6}}> (hilang)</span>}
                    </span>
                  ))}
                </div>
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem'}}>
                  <span style={{display:'flex',alignItems:'center',gap:'4px'}}><span style={{width:'12px',height:'12px',borderRadius:'3px',background:'#dcfce7',border:'1px solid #86efac',display:'inline-block'}}></span>Benar</span>
                  <span style={{display:'flex',alignItems:'center',gap:'4px'}}><span style={{width:'12px',height:'12px',borderRadius:'3px',background:'#fef9c3',border:'1px solid #fde047',display:'inline-block'}}></span>Salah</span>
                  <span style={{display:'flex',alignItems:'center',gap:'4px'}}><span style={{width:'12px',height:'12px',borderRadius:'3px',background:'#fee2e2',border:'1px solid #fca5a5',display:'inline-block'}}></span>Kurang/Hilang</span>
                </div>
              </div>

              <div style={{background: 'var(--accent-bg)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--accent)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                <Zap size={16} style={{color: 'var(--accent)', marginTop: '2px', flexShrink: 0}} />
                <span style={{fontSize: '0.95rem'}}><strong>Hint:</strong> {d.hint}</span>
              </div>

              <button className="btn btn-outline w-100" style={{marginBottom: '0.75rem', borderColor: '#c026d3', color: '#c026d3'}} onClick={() => playAudio(1.0)}>
                <PlayCircle size={16} style={{marginRight: '0.5rem', verticalAlign: 'middle'}} /> Dengarkan Jawaban Benar
              </button>

              <button className="btn btn-primary w-100" style={{background: '#c026d3', borderColor: '#c026d3'}} onClick={nextQuestion}>
                {currentIndex < data.length - 1 ? 'Audio Berikutnya' : 'Selesai Dictation'} <ArrowRight size={16} style={{marginLeft: '0.5rem', verticalAlign: 'middle'}}/>
              </button>
            </motion.div>
          )}
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="Dictation" columns={[{key:'text', label:'Kalimat'}, {key:'hint', label:'Hint'}]} template={{text: 'New sentence...', hint: 'Hint tentang kesulitan...'}} />
      )}
    </div>
  );
}

