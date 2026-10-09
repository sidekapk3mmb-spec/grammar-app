import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, PlayCircle, Edit3, XCircle, CheckCircle2, Zap, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

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

export function PodcastListening({ recordActivity }) {
  const [vocabData, setVocabData] = useLocalStorage('grammar_daily_data', []);
  const [words, setWords] = useState(['', '', '']);
  const [meanings, setMeanings] = useState(['', '', '']);
  const [isDone, setIsDone] = useState(false);

  const recommendations = [
    { title: "6 Minute English (BBC)", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english", type: "Web" },
    { title: "Luke's English Podcast", url: "https://teacherluke.co.uk/", type: "Web / Spotify" },
    { title: "All Ears English", url: "https://www.allearsenglish.com/", type: "Web / Spotify" },
    { title: "TED Talks Daily", url: "https://www.ted.com/podcasts/ted-talks-daily", type: "Web / Spotify" }
  ];

  const handleFinish = () => {
    let added = 0;
    const newVocab = [...vocabData];
    for (let i = 0; i < 3; i++) {
      if (words[i].trim() && meanings[i].trim()) {
        newVocab.push({
          word: words[i].trim(),
          meaning: meanings[i].trim(),
          example: 'Learned from podcast.',
          nextReview: Date.now(),
          interval: 1,
          id: Date.now() + i
        });
        added++;
      }
    }
    
    if (added > 0) {
      setVocabData(newVocab);
    }
    
    setIsDone(true);
    if (recordActivity) recordActivity();
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1500);
  };

  return (
    <div className="content-box" style={{maxWidth: '700px', margin: '2rem auto', padding: '2rem'}}>
      <h2 style={{color: '#e11d48', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
        <PlayCircle size={28} /> Podcast Tracker
      </h2>
      <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Dengarkan 1 episode podcast bahasa Inggris, lalu catat 3 kosakata baru yang kamu temukan.</p>

      <div style={{background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem'}}>
        <h4 style={{marginTop: 0, marginBottom: '1rem'}}>Rekomendasi Podcast ESL:</h4>
        <ul style={{margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8'}}>
          {recommendations.map((r, i) => (
            <li key={i}>
              <a href={r.url} target="_blank" rel="noreferrer" style={{color: '#e11d48', fontWeight: 500, textDecoration: 'none'}}>{r.title}</a>
              <span style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem'}}>({r.type})</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{marginBottom: '2rem'}}>
        <h4 style={{marginBottom: '1rem'}}>Catat 3 Kosakata Baru:</h4>
        {[0, 1, 2].map(i => (
          <div key={i} style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
            <input 
              type="text" 
              placeholder={`Kata ${i+1}`} 
              className="form-control" 
              style={{flex: 1}} 
              value={words[i]} 
              onChange={e => { const w = [...words]; w[i] = e.target.value; setWords(w); }} 
            />
            <input 
              type="text" 
              placeholder="Artinya..." 
              className="form-control" 
              style={{flex: 1}} 
              value={meanings[i]} 
              onChange={e => { const m = [...meanings]; m[i] = e.target.value; setMeanings(m); }} 
            />
          </div>
        ))}
      </div>

      {isDone ? (
        <div style={{textAlign: 'center', color: 'var(--success)', padding: '1rem', background: 'var(--success-bg)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold'}}>
          <CheckCircle2 size={24} /> Selesai! Mengembalikan ke Dashboard...
        </div>
      ) : (
        <button className="btn btn-primary w-100" style={{background: '#e11d48', borderColor: '#e11d48', padding: '1rem', fontSize: '1.1rem'}} onClick={handleFinish}>
          <CheckCircle2 size={20} style={{verticalAlign: 'middle', marginRight: '0.5rem'}} />
          Selesaikan & Simpan Kosakata
        </button>
      )}
    </div>
  );
}

export function ShadowingDrill({ recordActivity }) {
  const { data, loading, saveData } = useFeatureData('shadowing');
  const [tab, setTab] = useState('practice');
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);

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
  
  const handleComplete = () => {
    setIsDone(true);
    if (recordActivity) recordActivity();
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1500);
  };

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto'}}>
      <div style={{display:'flex', gap:'1rem', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
        <button className={`btn ${tab==='practice'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('practice')}>Practice</button>
        <button className={`btn ${tab==='manage'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('manage')}>Manage / Edit</button>
      </div>

      {tab === 'practice' && session && (
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: '#ca8a04', marginBottom: '1.5rem'}}><PlayCircle size={28} style={{verticalAlign: 'middle', marginRight: '0.5rem'}}/> Speaking Shadowing</h2>
          
          <select value={sessionIndex} onChange={(e) => {setSessionIndex(Number(e.target.value)); setSentenceIndex(0);}} style={{width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}}>
            {data.map((s, i) => <option key={s.id} value={i}>{s.title}</option>)}
          </select>

          {session.videoId && (
            <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius)', marginBottom: '1.5rem', background: 'black'}}>
              <iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={`https://www.youtube.com/embed/${session.videoId}`} frameBorder="0" allowFullScreen></iframe>
            </div>
          )}
          
          {sentence && (
            <>
              <div style={{background: 'var(--surface)', padding: '2rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h3 style={{fontSize: '1.6rem', lineHeight: '1.5', margin: 0, color: isPlaying ? '#ca8a04' : 'var(--text-strong)'}}>{sentence}</h3>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
                <button className="btn btn-outline" disabled={sentenceIndex === 0} onClick={() => setSentenceIndex(sentenceIndex - 1)}><ArrowLeft size={18}/></button>
                <button className="btn btn-primary" style={{background: '#ca8a04', borderColor: '#ca8a04', borderRadius: '50px', padding: '0.75rem 2rem', fontSize: '1.2rem', minWidth: '180px'}} onClick={playSentence}>
                  {isPlaying ? 'Speaking...' : 'Play & Repeat'}
                </button>
                <button className="btn btn-outline" disabled={sentenceIndex === session.sentences.length - 1} onClick={() => setSentenceIndex(sentenceIndex + 1)}><ArrowRight size={18}/></button>
              </div>
              <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{background: '#ca8a04', width: `${((sentenceIndex + 1) / session.sentences.length) * 100}%`}}></div></div>
              <div style={{marginTop: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)'}}>{sentenceIndex + 1} / {session.sentences.length} Kalimat</div>
              
              {isDone ? (
                <div style={{color: 'var(--success)', fontWeight: 'bold'}}><CheckCircle2 size={20} style={{verticalAlign:'middle', marginRight:'5px'}} /> Shadowing Selesai!</div>
              ) : (
                <button className="btn btn-outline w-100" style={{borderColor: '#ca8a04', color: '#ca8a04', padding: '0.75rem'}} onClick={handleComplete}>
                  Tandai Selesai & Kembali ke Dashboard
                </button>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'manage' && (
        <CRUDManager data={data} saveData={saveData} type="Shadowing" columns={[{key:'title', label:'Title'}, {key:'videoId', label:'YouTube ID'}]} template={{title: 'New Session', difficulty: 'Intermediate', videoId: '', sentences: []}} />
      )}
    </div>
  );
}

export function WritingAnalyzer({ recordActivity }) {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const RULES = [
    { id: 'a_an_vowel', pattern: /\b([Aa])\s+([aeiou][a-z]*)\b/gi, message: 'Gunakan "an" sebelum huruf vokal.', type: 'grammar' },
    { id: 'an_consonant', pattern: /\b([Aa]n)\s+([^aeiou\W][a-z]*)\b/gi, message: 'Gunakan "a" sebelum huruf konsonan.', type: 'grammar' },
    { id: 'he_she_it_dont', pattern: /\b(he|she|it)\s+(don't|do not)\b/gi, message: 'Gunakan "doesn\'t" atau "does not" untuk he/she/it.', type: 'grammar' },
    { id: 'subject_verb_is', pattern: /\b(i|you|we|they)\s+is\b/gi, message: 'Periksa to-be. Gunakan am/are untuk subjek ini.', type: 'grammar' },
    { id: 'double_space', pattern: / {2,}/g, message: 'Terdapat spasi ganda.', type: 'typography' },
    { id: 'i_lowercase', pattern: /(^|\s)(i)(?=[\s.!?,'"]|$)/g, message: 'Kata ganti "I" harus selalu kapital.', type: 'capitalization' },
    { id: 'no_capital_start', pattern: /(^|[.!?]\s+)([a-z])/g, message: 'Awal kalimat harus menggunakan huruf kapital.', type: 'capitalization' },
    { id: 'punctuation_space', pattern: /\s+([.,!?])/g, message: 'Tidak boleh ada spasi sebelum tanda baca.', type: 'typography' }
  ];

  const analyzeText = () => {
    if (!text.trim()) return;
    const foundIssues = [];
    
    RULES.forEach(rule => {
      let match;
      // Reset lastIndex for global regex
      rule.pattern.lastIndex = 0;
      while ((match = rule.pattern.exec(text)) !== null) {
        foundIssues.push({
          ruleId: rule.id,
          message: rule.message,
          match: match[0],
          index: match.index,
          type: rule.type
        });
      }
    });

    setIssues(foundIssues.sort((a, b) => a.index - b.index));
    setIsAnalyzed(true);
  };

  const handleComplete = () => {
    if (recordActivity) recordActivity();
    window.location.hash = '#/';
  };

  return (
    <div className="content-box" style={{maxWidth: '800px', margin: '2rem auto', padding: '2rem'}}>
      <h2 style={{color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
        <Edit3 size={28} /> Writing Analyzer (RegEx)
      </h2>
      <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Ketik esai atau paragraf Anda di sini. Sistem akan mendeteksi kesalahan umum 100% secara lokal.</p>

      <textarea
        className="form-control"
        style={{width: '100%', height: '250px', padding: '1rem', fontSize: '1.1rem', resize: 'vertical', marginBottom: '1rem', fontFamily: 'inherit', lineHeight: '1.6'}}
        placeholder="Start typing your English text here..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setIsAnalyzed(false);
        }}
      />

      {!isAnalyzed ? (
        <button className="btn btn-primary w-100" style={{padding: '1rem', fontSize: '1.1rem', background: '#2563eb', borderColor: '#2563eb'}} onClick={analyzeText} disabled={!text.trim()}>
          <Zap size={20} style={{verticalAlign: 'middle', marginRight: '0.5rem'}} />
          Analyze Writing
        </button>
      ) : (
        <div style={{animation: 'fadeIn 0.3s'}}>
          <div style={{background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem'}}>
            <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              {issues.length === 0 ? <CheckCircle2 color="var(--success)" /> : <XCircle color="#e11d48" />}
              {issues.length === 0 ? 'Teks Terlihat Bagus!' : `Ditemukan ${issues.length} potensi kesalahan:`}
            </h3>
            
            {issues.length > 0 && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem'}}>
                {issues.map((issue, idx) => (
                  <div key={idx} style={{padding: '1rem', background: '#f8fafc', borderLeft: `4px solid ${issue.type === 'grammar' ? '#e11d48' : '#f59e0b'}`, borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'}}>
                    <div style={{fontWeight: 'bold', color: 'var(--text-strong)', marginBottom: '0.25rem'}}>
                      "{issue.match.trim()}"
                    </div>
                    <div style={{color: 'var(--text)', fontSize: '0.95rem'}}>{issue.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button className="btn btn-outline w-100" style={{padding: '1rem'}} onClick={handleComplete}>
            Tandai Selesai & Kembali ke Dashboard
          </button>
        </div>
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

