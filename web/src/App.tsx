import { useState, useEffect, useMemo, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { BookOpen, Edit3, Save, Layout, PlayCircle, PlusCircle, ArrowRight, ArrowLeft, Search, Bookmark, BookmarkCheck, ChevronDown, ChevronRight, CheckCircle2, XCircle, Trash2, Plus, BrainCircuit, RefreshCw, Zap, Flame, Calendar, Upload, Download, AlertTriangle, Shuffle, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PodcastListening, ShadowingDrill, WritingAnalyzer, DictationDrill } from './Features';
import { VocabEngine } from './VocabEngine';
import './App.css';

// --- UTILITIES & HOOKS ---

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
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

function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/['`’]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]$/, '');
}

// --- DICTIONARY FOR TOOLTIPS ---
const DICTIONARY = {
  "present perfect": "Tense to describe action before now, continuing or relevant to present.",
  "past simple": "Tense for completed action in the past.",
  "auxiliary verb": "Helping verb (e.g. am, is, have, do).",
  "participle": "Verb form (V3 or V-ing) used in complex tenses or as adjective.",
  "pronoun": "Word replacing a noun (e.g. I, you, it).",
  "adjective": "Word that describes a noun.",
  "adverb": "Word that modifies verbs, adjectives, or other adverbs.",
  "infinitive": "Base form of a verb, often preceded by 'to'."
};

import vocabData from './vocab.json';
import ieltsVocabData from './ielts_vocab.json';

function RichText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="syntax-highlight">{part.slice(2, -2)}</span>;
        }
        let html = part;
        Object.keys(DICTIONARY).forEach(term => {
          const regex = new RegExp(`\\b(${term})\\b`, 'gi');
          html = html.replace(regex, `<span class="tooltip-trigger">$&<span class="tooltip-content">${DICTIONARY[term]}</span></span>`);
        });
        return <span key={i} dangerouslySetInnerHTML={{__html: html}} />;
      })}
    </>
  );
}

// --- APP ENTRY ---

function App() {
  const [data, setData] = useState(null);
  const [bookmarks, setBookmarks] = useLocalStorage('grammar_bookmarks', []);
  const [progress, setProgress] = useLocalStorage('grammar_progress', {}); // { unitId: score }
  const [mistakes, setMistakes] = useLocalStorage('grammar_mistakes', []); // Error log
  const [vocab, setVocab] = useLocalStorage('grammar_vocab', []); // Personal vocab book
  const [lastActive, setLastActive] = useLocalStorage('grammar_last_active', null);
  const [streak, setStreak] = useLocalStorage('grammar_streak', 0);
  
  // Daily Tasks state
  const [dailyTasks, setDailyTasks] = useLocalStorage('grammar_daily_tasks', [
    { id: 'mix', title: 'Daily Mix Quiz', done: false },
    { id: 'vocab', title: 'Review 20 Vocab', done: false },
    { id: 'dictation', title: '1 Dictation Exercise', done: false }
  ]);

  useEffect(() => {
    // Check Streak & Tasks Expiry
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastActive && lastActive !== todayStr && lastActive !== yesterdayStr) {
      setStreak(0); // Lost streak
    }

    fetch('/api/units')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error(e));
  }, [lastActive, setStreak]);

  const recordActivity = () => {
    if (lastActive !== todayStr) {
      if (lastActive === yesterdayStr) {
        setStreak(s => s + 1);
      } else if (lastActive !== null) {
        setStreak(1);
      } else {
        setStreak(1);
      }
      setLastActive(todayStr);
      setDailyTasks(tasks => tasks.map(t => ({...t, done: false}))); // Reset tasks daily
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!data) return <div className="loading-screen"><div className="spinner"></div>Building Learning Platform...</div>;

  return (
    <Router>
      <div className="app-layout">
        <div className="mobile-header">
          <div className="mobile-header-brand">
            <BookOpen size={20} strokeWidth={1.5} className="text-accent" />
            <span>Grammar Base</span>
          </div>
          <button className="btn-icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
        
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
        )}

        <Sidebar 
          data={data} 
          bookmarks={bookmarks} 
          progress={progress} 
          mistakes={mistakes} 
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard data={data} progress={progress} bookmarks={bookmarks} mistakes={mistakes} streak={streak} dailyTasks={dailyTasks} setDailyTasks={setDailyTasks} />} />
            <Route path="/unit/:id" element={<UnitContainer data={data} setData={setData} bookmarks={bookmarks} setBookmarks={setBookmarks} progress={progress} setProgress={setProgress} mistakes={mistakes} setMistakes={setMistakes} recordActivity={recordActivity} />} />
            <Route path="/drill" element={<MistakeDrill mistakes={mistakes} setMistakes={setMistakes} recordActivity={recordActivity} />} />
            <Route path="/daily" element={<DailyQuiz data={data} progress={progress} mistakes={mistakes} setMistakes={setMistakes} recordActivity={() => {
              recordActivity();
              setDailyTasks(tasks => tasks.map(t => t.id === 'mix' ? {...t, done: true} : t));
            }} />} />
            <Route path="/mixed" element={<MixedDrill data={data} progress={progress} recordActivity={recordActivity} />} />
            <Route path="/vocab" element={<VocabEngine deckName="daily" title="Daily Vocab" initialData={vocabData} recordActivity={() => {
              recordActivity();
              setDailyTasks(tasks => tasks.map(t => t.id === 'vocab' ? {...t, done: true} : t));
            }} />} />
            <Route path="/ielts" element={<VocabEngine deckName="ielts" title="IELTS Vocab" initialData={ieltsVocabData} recordActivity={recordActivity} />} />
            <Route path="/writing" element={<WritingAnalyzer recordActivity={recordActivity} />} />
            <Route path="/dictation" element={<DictationDrill mistakes={mistakes} setMistakes={setMistakes} recordActivity={() => {
              recordActivity();
              setDailyTasks(tasks => tasks.map(t => t.id === 'dictation' ? {...t, done: true} : t));
            }} />} />
            <Route path="/shadowing" element={<ShadowingDrill recordActivity={recordActivity} />} />
            <Route path="/podcast" element={<PodcastListening recordActivity={recordActivity} />} />
            <Route path="/error-log" element={<ErrorLog mistakes={mistakes} setMistakes={setMistakes} />} />
                      </Routes>
        </main>
      </div>
    </Router>
  );
}

// --- SIDEBAR ---

function Sidebar({ data, bookmarks, progress, mistakes, isOpen, closeSidebar }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (window.innerWidth <= 768 && closeSidebar) {
      closeSidebar();
    }
  }, [location.pathname, closeSidebar]);

  const sections = useMemo(() => {
    const secs = [];
    let currentSection = null;
    
    data.units.forEach(u => {
      const matchSearch = u.title.toLowerCase().includes(searchQuery.toLowerCase()) || u.unit.toString().includes(searchQuery);
      if (!currentSection || currentSection.title !== u.section.title) {
        currentSection = { title: u.section.title, units: [] };
        secs.push(currentSection);
      }
      if (matchSearch) currentSection.units.push(u);
    });
    return secs.filter(s => s.units.length > 0);
  }, [data, searchQuery]);

  const toggleSection = (title) => {
    setExpandedSections(prev => ({...prev, [title]: !prev[title]}));
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
        <BookOpen size={20} strokeWidth={1.5} className="text-accent" />
      <span>Grammar Base</span>
        </div>
        <button className="btn-icon close-sidebar-btn" onClick={closeSidebar}>
          <XCircle size={20} />
        </button>
      </div>
      
      <div className="sidebar-search">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search units..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <Link to="/" className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Layout size={16} /> Dashboard
          </Link>
          <Link to="/mixed" className={`sidebar-link ${location.pathname === '/mixed' ? 'active' : ''}`}>
            <Shuffle size={16} /> Mixed Review
          </Link>
          <Link to="/daily" className={`sidebar-link ${location.pathname === '/daily' ? 'active' : ''}`}>
            <Zap size={16} /> Daily Mix Quiz
          </Link>
          {mistakes.length > 0 && (
            <Link to="/drill" className={`sidebar-link ${location.pathname === '/drill' ? 'active' : ''}`} style={{color: 'var(--danger)', marginTop: '0.25rem'}}>
              <BrainCircuit size={16} /> Mistake Drill ({mistakes.length})
            </Link>
          )}
          
        </div>
        
        {sections.map((sec, idx) => {
          const isExpanded = expandedSections[sec.title] !== false || searchQuery !== '';
          return (
            <div key={idx} className="sidebar-section">
              <h3 onClick={() => toggleSection(sec.title)} className="section-title-toggle">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {sec.title}
              </h3>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="section-units">
                    {sec.units.map(u => {
                      const isBookmarked = bookmarks.includes(u.unit);
                      const isCompleted = progress[u.unit] !== undefined;
                      return (
                        <Link 
                          to={`/unit/${u.unit}`} 
                          key={u.unit} 
                          className={`sidebar-link unit-link ${location.pathname === `/unit/${u.unit}` ? 'active' : ''}`}
                        >
                          <span className="unit-num">{u.unit}.</span>
                          <span className="unit-name">{u.title}</span>
                          {isBookmarked && <BookmarkCheck size={12} className="icon-bookmarked" />}
                          {isCompleted && <CheckCircle2 size={12} className="icon-completed" />}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// --- DASHBOARD ---

function Dashboard({ data, progress, bookmarks, mistakes, streak, dailyTasks, setDailyTasks }) {
  const totalUnits = data.units.length;
  const completedCount = Object.keys(progress).length;
  const completionPct = Math.round((completedCount / totalUnits) * 100) || 0;
  const bookmarkedUnits = data.units.filter(u => bookmarks.includes(u.unit));

  const weakestUnitsMap = {};
  mistakes.forEach(m => { weakestUnitsMap[m.unitId] = (weakestUnitsMap[m.unitId] || 0) + 1; });
  const weakestUnits = Object.keys(weakestUnitsMap)
    .sort((a, b) => weakestUnitsMap[b] - weakestUnitsMap[a])
    .slice(0, 3)
    .map(unitId => {
      const u = data.units.find(u => u.unit === parseInt(unitId));
      return u ? { ...u, mistakeCount: weakestUnitsMap[unitId] } : null;
    }).filter(Boolean);

  const handleExport = () => {
    const backup = {
      progress: JSON.parse(localStorage.getItem('grammar_progress') || '{}'),
      bookmarks: JSON.parse(localStorage.getItem('grammar_bookmarks') || '[]'),
      mistakes: JSON.parse(localStorage.getItem('grammar_mistakes') || '[]'),
      streak: JSON.parse(localStorage.getItem('grammar_streak') || '0'),
      lastActive: JSON.parse(localStorage.getItem('grammar_last_active') || 'null')
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grammar_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.progress) localStorage.setItem('grammar_progress', JSON.stringify(parsed.progress));
        if (parsed.bookmarks) localStorage.setItem('grammar_bookmarks', JSON.stringify(parsed.bookmarks));
        if (parsed.mistakes) localStorage.setItem('grammar_mistakes', JSON.stringify(parsed.mistakes));
        if (parsed.streak !== undefined) localStorage.setItem('grammar_streak', JSON.stringify(parsed.streak));
        if (parsed.lastActive) localStorage.setItem('grammar_last_active', JSON.stringify(parsed.lastActive));
        alert('Progress imported successfully! The page will reload.');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-dashboard">
      <div className="hero" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
        <div>
          <h1>{data.book ? data.book.title : "Overview"}</h1>
          <p className="subtitle">{data.book ? `${data.book.edition} by ${data.book.author} (${data.book.year})` : "Track your progress and continue where you left off."}</p>
        </div>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button className="btn btn-outline" onClick={handleExport} style={{background: 'rgba(255,255,255,0.2)', color: 'inherit', borderColor: 'rgba(255,255,255,0.3)', padding: '0.5rem 1rem'}}><Download size={16} style={{marginRight:'0.5rem'}}/> Export Progress</button>
          <label className="btn btn-outline" style={{background: 'rgba(255,255,255,0.2)', color: 'inherit', borderColor: 'rgba(255,255,255,0.3)', padding: '0.5rem 1rem', cursor: 'pointer', margin: 0}}>
            <Upload size={16} style={{marginRight:'0.5rem'}}/> Import Backup
            <input type="file" accept=".json" style={{display: 'none'}} onChange={handleImport} />
          </label>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalUnits}</div>
          <div className="stat-label">Total Units</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Units Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completionPct}%</div>
          <div className="stat-label">Mastery</div>
        </div>
        <div className="stat-card" style={{borderColor: streak > 0 ? '#f97316' : 'var(--border)', background: streak > 0 ? '#fff7ed' : 'var(--surface)'}}>
          <div className="stat-value" style={{color: '#ea580c'}}><Flame size={24} style={{display:'inline', verticalAlign:'text-bottom'}} /> {streak}</div>
          <div className="stat-label" style={{color: streak > 0 ? '#ea580c' : 'var(--text-muted)'}}>Day Streak</div>
        </div>
      </div>

      <div className="dashboard-section mt-4">
        <h2>Target Hari Ini</h2>
        <div style={{background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden'}}>
          {dailyTasks.map(task => (
            <div key={task.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '24px', height: '24px', borderRadius: '50%', border: task.done ? 'none' : '2px solid var(--border)', background: task.done ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
                  {task.done && <CheckCircle2 size={16} />}
                </div>
                <span style={{fontSize: '1.1rem', textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-muted)' : 'var(--text-strong)'}}>{task.title}</span>
              </div>
              {!task.done && (
                <Link to={task.id === 'mix' ? '/daily' : task.id === 'vocab' ? '/vocab' : '/dictation'} className="btn btn-outline" style={{padding: '0.4rem 1rem'}}>Mulai</Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section mt-5">
        <h2 style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>Fitur Latihan Tambahan</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
          
          <Link to="/mixed" className="content-box" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem'}}>
            <Shuffle size={20} className="text-accent" />
            <span style={{fontWeight: 500}}>Mixed Review</span>
          </Link>

          <Link to="/ielts" className="content-box" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem'}}>
            <Flame size={20} style={{color: '#16a34a'}} />
            <span style={{fontWeight: 500}}>IELTS Vocab</span>
          </Link>

          <Link to="/writing" className="content-box" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem'}}>
            <Edit3 size={20} style={{color: '#2563eb'}} />
            <span style={{fontWeight: 500}}>Writing Analyzer</span>
          </Link>

          <Link to="/podcast" className="content-box" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem'}}>
            <PlayCircle size={20} style={{color: '#e11d48'}} />
            <span style={{fontWeight: 500}}>Podcast Listening</span>
          </Link>

          <Link to="/shadowing" className="content-box" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem'}}>
            <PlayCircle size={20} style={{color: '#ca8a04'}} />
            <span style={{fontWeight: 500}}>Shadowing Speaking</span>
          </Link>

          <Link to="/error-log" className="content-box" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderColor: mistakes.length > 0 ? 'var(--danger)' : 'var(--border)'}}>
            <AlertTriangle size={20} style={{color: mistakes.length > 0 ? 'var(--danger)' : 'var(--text-muted)'}} />
            <span style={{fontWeight: 500}}>Error Log</span>
            {mistakes.length > 0 && <span className="badge" style={{background: 'var(--danger-bg)', color: 'var(--danger)', marginLeft: 'auto'}}>{mistakes.length}</span>}
          </Link>
          
        </div>
      </div>


      {weakestUnits.length > 0 && (
        <div className="dashboard-section mt-4">
          <h2 style={{color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={20} /> Weakest Units (Needs Review)</h2>
          <div className="cards-grid">
            {weakestUnits.map(u => (
              <Link to={`/unit/${u.unit}`} key={u.unit} className="content-box card-link" style={{borderColor: 'var(--danger-bg)'}}>
                <div className="badge" style={{background: 'var(--danger-bg)', color: 'var(--danger)'}}>{u.mistakeCount} Mistakes</div>
                <h3>Unit {u.unit}: {u.title}</h3>
                <div className="card-footer" style={{color: 'var(--danger)'}}>
                  <span>Review this unit's theory</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {bookmarkedUnits.length > 0 && (
        <div className="dashboard-section mt-4">
          <h2>Your Bookmarks</h2>
          <div className="cards-grid">
            {bookmarkedUnits.map(u => (
              <Link to={`/unit/${u.unit}`} key={u.unit} className="content-box card-link">
                <div className="badge">{u.section.title}</div>
                <h3>Unit {u.unit}: {u.title}</h3>
                <div className="card-footer">
                  <BookmarkCheck size={16} className="text-accent" />
                  <span>Review marked unit</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data.notes && data.notes.length > 0 && (
        <div className="dashboard-section mt-4">
          <h2>Notes & Info</h2>
          <div className="content-box">
            <ul className="notes-list">
              {data.notes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// --- DAILY MIX QUIZ ---

function DailyQuiz({ data, progress, mistakes, setMistakes, recordActivity }) {
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const questions = useMemo(() => {
    let pool = [...mistakes].sort(() => 0.5 - Math.random());
    
    if (pool.length < 5) {
      const weakestUnits = [...data.units].map(u => ({
          unitId: u.unit, 
          mistakeCount: mistakes.filter((m: any) => m.unitId === u.unit).length
      })).sort((a,b) => b.mistakeCount - a.mistakeCount).slice(0, 3);
      
      let fillerPool: any[] = [];
      weakestUnits.forEach(wu => {
          const u = data.units.find((x: any) => x.unit === wu.unitId);
          if(u && u.practice && u.practice.questions) fillerPool.push(...u.practice.questions);
      });
      
      if (fillerPool.length === 0) {
          const completedUnits = Object.keys(progress).map(Number);
          if (completedUnits.length > 0) {
              data.units.filter((u: any) => completedUnits.includes(u.unit)).forEach((u: any) => {
                  if(u.practice && u.practice.questions) fillerPool.push(...u.practice.questions);
              });
          } else {
              data.units.slice(0, 3).forEach((u: any) => {
                  if(u.practice && u.practice.questions) fillerPool.push(...u.practice.questions);
              });
          }
      }

      fillerPool = fillerPool.filter(fq => !pool.some(pq => pq.prompt === fq.prompt));
      fillerPool.sort(() => 0.5 - Math.random());
      pool = [...pool, ...fillerPool.slice(0, 5 - pool.length)];
    }

    return pool.slice(0, 5).sort(() => 0.5 - Math.random());
  }, [data, progress, mistakes]);

  if (!questions) return <div className="loading-screen"><div className="spinner"></div>Loading Quiz...</div>;
  if (questions.length === 0) return (
    <div className="content-box" style={{maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem 1rem'}}>
      <h2 style={{color: 'var(--danger)', marginBottom: '1rem'}}>No Questions Available</h2>
      <p className="text-muted">There are no practice questions found in your completed units yet. Please complete some lessons or add questions via Edit Tab first.</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );

  if (showResult) {
    return (
      <div className="content-box result-screen" style={{maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem 1rem'}}>
        <CheckCircle2 size={64} className="text-success mx-auto" />
        <h2 style={{marginTop: '1rem'}}>Daily Drill Complete!</h2>
        <p>You scored <strong>{score}</strong> out of {questions.length}</p>
        <div style={{color: '#ea580c', margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem'}}>
          <Flame size={24} /> Daily Streak Maintained!
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  const q = questions[qIndex];
  
  const handleAnswer = (isCorrect: boolean, correctAns: string) => {
    if (feedback) return;
    
    if (isCorrect) {
      setScore(s => s + 1);
      const newMistakes = mistakes.filter((m: any) => m.prompt !== q.prompt);
      if (newMistakes.length !== mistakes.length) {
          setMistakes(newMistakes);
      }
    } else {
      const isAlreadyInMistakes = mistakes.some((m: any) => m.prompt === q.prompt);
      if (!isAlreadyInMistakes) {
          const unitIdToSave = q.unitId || data.units.find((u: any) => u.practice && u.practice.questions && u.practice.questions.some((pq: any) => pq.prompt === q.prompt))?.unit;
          setMistakes([...mistakes, { unitId: unitIdToSave, ...q }]);
      }
    }
    
    setFeedback({ isCorrect, explanation: q.explanation, correctAns });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (qIndex < questions.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      recordActivity();
      setShowResult(true);
    }
  };

  return (
    <div className="content-box quiz-box" style={{maxWidth: '600px', margin: '2rem auto'}}>
      <div className="quiz-progress-text">Daily Drill: Question {qIndex + 1} of {questions.length}</div>
      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{width: `${(qIndex / questions.length) * 100}%`}}></div></div>
      <h3 className="quiz-prompt"><RichText text={q.prompt} /></h3>
      
      {q.type === 'multiple_choice' ? (
        <div className="options-grid">
          {q.options.map((opt, idx) => (
            <button key={idx} className={`quiz-option ${feedback ? (idx === q.answer_index ? 'correct' : (idx !== q.answer_index && !feedback.isCorrect ? 'disabled' : '')) : ''}`} onClick={() => handleAnswer(idx === q.answer_index, q.options[q.answer_index])}>
              <RichText text={opt} />
            </button>
          ))}
        </div>
      ) : (
        <div className="fill-blank-container">
          <input type="text" id="daily-input" className="fill-input" placeholder="Type answer..." disabled={feedback !== null} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = e.target.value;
              handleAnswer(q.accepted_answers.some(ans => normalizeText(ans) === normalizeText(val)), q.accepted_answers[0]);
            }
          }} />
        </div>
      )}

      {feedback && (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`feedback-box ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            {feedback.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <h4>{feedback.isCorrect ? 'Correct!' : 'Incorrect.'}</h4>
          </div>
          {!feedback.isCorrect && <div className="correct-answer-show"><strong>Correct:</strong> <RichText text={feedback.correctAns} /></div>}
          <button className="btn btn-primary mt-3" onClick={nextQuestion} autoFocus>
            {qIndex < questions.length - 1 ? 'Next Question' : 'Finish Drill'} <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}


// --- MIXED REVIEW DRILL ---

function MixedDrill({ data, progress, recordActivity }) {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [reorderSelected, setReorderSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [setupMode, setSetupMode] = useState(true);
  const [selectedSections, setSelectedSections] = useState([]);
  const navigate = useNavigate();

  const sections = Array.from(new Set(data.units.map(u => u.section.title)));

  const toggleSection = (sec) => {
    if (selectedSections.includes(sec)) setSelectedSections(selectedSections.filter(s => s !== sec));
    else setSelectedSections([...selectedSections, sec]);
  };

  const startDrill = () => {
    let pool = [];
    data.units.forEach(u => {
      if (selectedSections.length === 0 || selectedSections.includes(u.section.title)) {
        if (u.practice && u.practice.questions) pool.push(...u.practice.questions.map(q => ({...q, unitTitle: u.title})));
      }
    });
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    setSetupMode(false);
  };

  if (setupMode) {
    return (
      <div className="content-box" style={{maxWidth: '600px', margin: '2rem auto'}}>
        <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Shuffle size={24} className="text-accent" /> Custom Mixed Review</h2>
        <p className="text-muted mb-4">Select the topics you want to review. We'll generate a 10-question mixed quiz.</p>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
          {sections.map((sec, i) => (
            <label key={i} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', background: selectedSections.includes(sec) ? 'var(--accent-bg)' : 'transparent'}}>
              <input type="checkbox" checked={selectedSections.includes(sec)} onChange={() => toggleSection(sec)} />
              <span style={{fontWeight: selectedSections.includes(sec) ? 600 : 400}}>{sec}</span>
            </label>
          ))}
        </div>
        <button className="btn btn-primary w-100" onClick={startDrill}>Start Mixed Drill</button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="content-box result-screen" style={{maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem 1rem'}}>
        <CheckCircle2 size={64} className="text-success mx-auto" />
        <h2 style={{marginTop: '1rem'}}>Review Complete!</h2>
        <p>You scored <strong>{score}</strong> out of {questions.length}</p>
        <button className="btn btn-primary mt-4" onClick={() => { setSetupMode(true); setQIndex(0); setScore(0); setShowResult(false); }}>New Mixed Drill</button>
      </div>
    );
  }

  if (questions.length === 0) return <div className="content-box">No questions found for the selected topics.</div>;

  const q = questions[qIndex];

  const handleAnswer = (isCorrect, correctAns) => {
    if (feedback) return;
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ isCorrect, explanation: q.explanation, correctAns });
  };

  const handleReorderCheck = () => {
    if (feedback || !q.words || reorderSelected.length !== q.words.length) return;
    const answerStr = reorderSelected.join(' ');
    const isCorrect = q.accepted_answers.some(ans => normalizeText(ans) === normalizeText(answerStr));
    handleAnswer(isCorrect, q.accepted_answers[0]);
  };

  const nextQuestion = () => {
    setFeedback(null);
    setInputValue('');
    setReorderSelected([]);
    if (qIndex < questions.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      if (recordActivity) recordActivity();
      setShowResult(true);
    }
  };

  return (
    <div className="content-box quiz-box" style={{maxWidth: '600px', margin: '2rem auto'}}>
      <div className="quiz-progress-text" style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>Mixed Review: {qIndex + 1} of {questions.length}</span>
        <span className="badge">{q.unitTitle}</span>
      </div>
      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{width: `${(qIndex / questions.length) * 100}%`}}></div></div>
      
      <h3 className="quiz-prompt"><RichText text={q.prompt} /></h3>
      
      {q.type === 'multiple_choice' && (
        <div className="options-grid">
          {q.options && q.options.map((opt, idx) => (
             <button key={idx} className={`quiz-option ${feedback ? (idx === q.answer_index ? 'correct' : (idx !== q.answer_index && !feedback.isCorrect ? 'disabled' : '')) : ''}`} onClick={() => handleAnswer(idx === q.answer_index, q.options[q.answer_index])}>
               <RichText text={opt} />
             </button>
          ))}
        </div>
      )}

      {(q.type === 'fill_blank' || q.type === 'error_correction' || q.type === 'transformation') && (
        <div className="fill-blank-container">
          <input type="text" className="fill-input" placeholder="Type answer..." disabled={feedback !== null} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAnswer(q.accepted_answers.some(ans => normalizeText(ans) === normalizeText(inputValue)), q.accepted_answers[0]);
            }
          }} />
          {!feedback && <button className="btn btn-primary mt-3" onClick={() => handleAnswer(q.accepted_answers.some(ans => normalizeText(ans) === normalizeText(inputValue)), q.accepted_answers[0])}>Check</button>}
        </div>
      )}

      {q.type === 'reorder' && (
        <div className="reorder-container">
          <div className="reorder-dropzone" style={{minHeight: '50px', padding: '1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {reorderSelected.length === 0 && <span style={{color: 'var(--text-muted)'}}>Select words below...</span>}
            {reorderSelected.map((w, i) => (
              <span key={i} className="badge" style={{fontSize: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--accent)', color: 'white'}} onClick={() => { if(!feedback) { const n = [...reorderSelected]; n.splice(i,1); setReorderSelected(n); } }}>{w}</span>
            ))}
          </div>
          <div className="reorder-words" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
            {q.words && q.words.map((w, i) => {
               const selectedCount = reorderSelected.filter(sw => sw === w).length;
               const totalCount = q.words.filter(tw => tw === w).length;
               const disabled = selectedCount >= totalCount || feedback !== null;
               return (
                 <button key={i} className="btn btn-outline" style={{padding: '0.5rem 1rem', opacity: disabled ? 0.5 : 1}} disabled={disabled} onClick={() => { if(!feedback) setReorderSelected([...reorderSelected, w]); }}>{w}</button>
               );
            })}
          </div>
          {!feedback && q.words && reorderSelected.length === q.words.length && (
            <button className="btn btn-primary" onClick={handleReorderCheck}>Check Answer</button>
          )}
        </div>
      )}

      {q.type === 'reorder' && (
        <div className="reorder-container">
          <div className="reorder-dropzone" style={{minHeight: '50px', padding: '1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {reorderSelected.length === 0 && <span style={{color: 'var(--text-muted)'}}>Select words below...</span>}
            {reorderSelected.map((w, i) => (
              <span key={i} className="badge" style={{fontSize: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--accent)', color: 'white'}} onClick={() => { if(!feedback) { const n = [...reorderSelected]; n.splice(i,1); setReorderSelected(n); } }}>{w}</span>
            ))}
          </div>
          <div className="reorder-words" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
            {q.words && q.words.map((w, i) => {
               const selectedCount = reorderSelected.filter(sw => sw === w).length;
               const totalCount = q.words.filter(tw => tw === w).length;
               const disabled = selectedCount >= totalCount || feedback !== null;
               return (
                 <button key={i} className="btn btn-outline" style={{padding: '0.5rem 1rem', opacity: disabled ? 0.5 : 1}} disabled={disabled} onClick={() => { if(!feedback) setReorderSelected([...reorderSelected, w]); }}>{w}</button>
               );
            })}
          </div>
          {!feedback && q.words && reorderSelected.length === q.words.length && (
            <button className="btn btn-primary" onClick={handleReorderCheck}>Check Answer</button>
          )}
        </div>
      )}

      {feedback && (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`feedback-box ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            {feedback.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <h4>{feedback.isCorrect ? 'Correct!' : 'Incorrect.'}</h4>
          </div>
          {!feedback.isCorrect && <div className="correct-answer-show"><strong>Correct:</strong> <RichText text={feedback.correctAns} /></div>}
          {feedback.explanation && <p className="feedback-exp"><RichText text={feedback.explanation} /></p>}
          <button className="btn btn-primary mt-3" onClick={nextQuestion} autoFocus>
            {qIndex < questions.length - 1 ? 'Next Question' : 'Finish Drill'} <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}


// --- ERROR LOG ---

function ErrorLog({ mistakes, setMistakes }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const grammarMistakes = mistakes.filter(m => !m.type || m.type === 'grammar');
  const dictationMistakes = mistakes.filter(m => m.type === 'dictation');

  const filtered = filter === 'grammar' ? grammarMistakes : filter === 'dictation' ? dictationMistakes : mistakes;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--danger)' }}>📋 Error Log</h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{mistakes.length} kesalahan tercatat — dipakai Daily Mix untuk review personal</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${filter==='all'?'btn-primary':'btn-outline'}`} onClick={() => setFilter('all')}>Semua</button>
          <button className={`btn ${filter==='grammar'?'btn-primary':'btn-outline'}`} onClick={() => setFilter('grammar')}>Grammar</button>
          <button className={`btn ${filter==='dictation'?'btn-primary':'btn-outline'}`} onClick={() => setFilter('dictation')}>Dictation</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="content-box" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
          <h3>Error log kosong!</h3>
          <p className="text-muted">Jawab kuis atau dictation untuk mulai mengisi buku kesalahan.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/daily')}>Mulai Daily Mix</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((m, i) => {
            const isDictation = m.type === 'dictation';
            return (
              <div key={i} className="content-box" style={{ padding: '1.25rem 1.5rem', borderLeft: `4px solid ${isDictation ? '#c026d3' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="badge" style={{ background: isDictation ? '#fdf4ff' : 'var(--danger-bg)', color: isDictation ? '#c026d3' : 'var(--danger)' }}>
                        {isDictation ? 'Dictation' : `Unit ${m.unitId}`}
                      </span>
                      {m.timestamp && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(m.timestamp).toLocaleDateString()}</span>}
                    </div>
                    {isDictation ? (
                      <>
                        <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-strong)' }}>{m.text}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Kamu tulis: <em>"{m.userInput}"</em></div>
                        {m.wrongWords?.length > 0 && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                            {m.wrongWords.map((w, wi) => (
                              <span key={wi} style={{ padding: '1px 6px', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', fontSize: '0.85rem', border: '1px solid #fca5a5' }}>{w}</span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{m.prompt}</div>
                        {m.explanation && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{m.explanation}</div>}
                      </>
                    )}
                  </div>
                  <button className="btn-icon" style={{ color: 'var(--danger)', flexShrink: 0 }} onClick={() => setMistakes(mistakes.filter((_, idx) => idx !== i))} title="Hapus dari log">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/daily')}>Latih Semua di Daily Mix</button>
            <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { if(confirm('Hapus seluruh error log?')) setMistakes([]); }}>Bersihkan Log</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MISTAKE DRILL ---

function MistakeDrill({ mistakes, setMistakes, recordActivity }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  if (mistakes.length === 0) {
    return (
      <div className="content-box" style={{textAlign: 'center', padding: '4rem', maxWidth: '600px', margin: '2rem auto'}}>
        <CheckCircle2 size={48} className="text-success mx-auto" style={{marginBottom: '1rem'}} />
        <h2>All Caught Up!</h2>
        <p className="text-muted">You have no mistakes to review. Great job!</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  const q = mistakes[currentIndex];

  const handleMastered = () => {
    const newMistakes = [...mistakes];
    newMistakes.splice(currentIndex, 1);
    setMistakes(newMistakes);
    setShowAnswer(false);
    recordActivity();
    if (currentIndex >= newMistakes.length) {
      setCurrentIndex(Math.max(0, newMistakes.length - 1));
    }
  };

  const handleKeepReviewing = () => {
    setShowAnswer(false);
    setCurrentIndex((currentIndex + 1) % mistakes.length);
  };

  return (
    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="drill-container">
      <div className="drill-header">
        <h2>Flashcard Drill</h2>
        <span className="badge text-danger" style={{background: 'var(--danger-bg)'}}>{mistakes.length} items left</span>
      </div>
      
      <div className="flashcard">
        <div className="flashcard-front">
          <div className="badge mb-2">Unit {q.unitId}</div>
          <h3 className="quiz-prompt"><RichText text={q.prompt} /></h3>
          
          {q.type === 'multiple_choice' && (
            <ul className="flashcard-options">
              {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
            </ul>
          )}
        </div>

        <AnimatePresence>
          {showAnswer && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="flashcard-back">
              <div className="correct-answer-banner">
                <strong>Answer: </strong> 
                {q.type === 'multiple_choice' ? q.options[q.answer_index] : q.accepted_answers.join(' OR ')}
              </div>
              <p className="flashcard-explanation"><RichText text={q.explanation} /></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="drill-actions">
        {!showAnswer ? (
          <button className="btn btn-primary w-100" onClick={() => setShowAnswer(true)}>Show Answer</button>
        ) : (
          <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
            <button className="btn btn-outline" style={{flex: 1}} onClick={handleKeepReviewing}>
              <RefreshCw size={16} /> Still Learning
            </button>
            <button className="btn btn-primary" style={{flex: 1, background: 'var(--success)'}} onClick={handleMastered}>
              <CheckCircle2 size={16} /> I Got It!
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- UNIT CONTAINER & TABS ---

function UnitContainer({ data, setData, bookmarks, setBookmarks, progress, setProgress, mistakes, setMistakes, recordActivity }) {
  const { id } = useParams();
  const unitId = parseInt(id);
  const unit = data.units.find(u => u.unit === unitId);
  const [activeTab, setActiveTab] = useState('learn');
  const [currentUnitId, setCurrentUnitId] = useState(unitId);
  const navigate = useNavigate();

  if (unitId !== currentUnitId) {
    setCurrentUnitId(unitId);
    setActiveTab('learn');
  }

  if (!unit) return <div className="content-box">Unit not found</div>;

  const isBookmarked = bookmarks.includes(unitId);
  const toggleBookmark = () => {
    if (isBookmarked) setBookmarks(bookmarks.filter(b => b !== unitId));
    else setBookmarks([...bookmarks, unitId]);
  };

  const hasNext = unitId < data.units.length;
  const hasPrev = unitId > 1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={id} className="unit-view">
      <div className="unit-header-top">
        <div className="badge">{unit.section.title}</div>
        <button className={`btn-icon ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark} title="Bookmark this unit">
          {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>
      
      <h1 className="unit-main-title">Unit {unit.unit}: <RichText text={unit.title} /></h1>

      <div className="tabs">
        <button className={`tab ${activeTab === 'learn' ? 'active' : ''}`} onClick={() => setActiveTab('learn')}>
          <BookOpen size={16} /> Learn
        </button>
        <button className={`tab ${activeTab === 'practice' ? 'active' : ''}`} onClick={() => setActiveTab('practice')}>
          <PlayCircle size={16} /> Practice
        </button>
        <button className={`tab ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
          <Edit3 size={16} /> Edit Content
        </button>
      </div>

      <div className="tab-content">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} transition={{ duration: 0.15 }}>
            {activeTab === 'learn' && <LearnTab unit={unit} />}
            {activeTab === 'practice' && <PracticeTab unit={unit} setProgress={setProgress} progress={progress} mistakes={mistakes} setMistakes={setMistakes} recordActivity={recordActivity} />}
            {activeTab === 'edit' && <EditTab unit={unit} data={data} setData={setData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="unit-navigation mt-4">
        {hasPrev ? (
          <button className="btn btn-outline" onClick={() => navigate(`/unit/${unitId - 1}`)}>
            <ArrowLeft size={16} /> Previous Unit
          </button>
        ) : <div />}
        {hasNext && (
          <button className="btn btn-primary" onClick={() => navigate(`/unit/${unitId + 1}`)}>
            Next Unit <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function MicroLearnBlock({ content }) {
  let formatted = content || "";
  formatted = formatted.replace(/\s*\((\d+|[a-c])\)\s*/g, '\n\n• ');
  
  if (!formatted.includes('\n\n') && formatted.length > 200) {
     formatted = formatted.replace(/\. ([A-Z])/g, '.\n\n$1');
  }
  
  const blocks = formatted.split('\n\n').filter(s => s.trim());
  const [visibleCount, setVisibleCount] = useState(3);
  
  return (
    <div className="micro-learning-container" style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--text)' }}>
      {blocks.slice(0, visibleCount).map((b, i) => (
        <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className="summary-text" style={{ whiteSpace: "pre-wrap", marginBottom: "1.5rem", paddingLeft: b.startsWith('•') ? '1.5rem' : '0', textIndent: b.startsWith('•') ? '-1.5rem' : '0' }}>
          <RichText text={b} />
        </motion.p>
      ))}
      {visibleCount < blocks.length && (
        <button className="btn btn-outline mb-4" onClick={() => setVisibleCount(v => v + 3)} style={{width: '100%', borderColor: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600}}>
          Read More <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
}

function LearnTab({ unit }) {
  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="content-box learn-box">
      <MicroLearnBlock content={unit.explanation.summary} />
      
      {unit.explanation.pattern && (
        <div className="pattern-box" style={{ background: 'var(--accent-light)', borderLeft: '4px solid var(--accent)', padding: '1.2rem', borderRadius: 'var(--radius)', margin: '1.5rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="pattern-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.8rem', letterSpacing: '1px' }}>GRAMMAR PATTERN</div>
          <div className="pattern-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {unit.explanation.pattern.replace(/(Negatif:|Tanya:|Positif:|\[\+\]|\[-\]|\[\?\]|Negative:|Question:)/gi, '\n$1').split(/[;\n]/).map(s => s.trim()).filter(Boolean).map((line, i) => (
              <div key={i} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: '0.95rem', background: 'var(--surface)', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                <RichText text={line} />
              </div>
            ))}
          </div>
        </div>
      )}

      {unit.explanation.key_points && unit.explanation.key_points.length > 0 && (
        <>
          <h4>Key Points</h4>
          <ul className="key-points-list">
            {unit.explanation.key_points.map((kp, i) => <li key={i}><RichText text={kp} /></li>)}
          </ul>
        </>
      )}

      <h4>Contextual Examples</h4>
      <div className="examples-list">
        {unit.explanation.examples.map((ex, i) => (
          <div key={i} className="example-item">
            <div className="en-text" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
              <RichText text={ex.en} />
              <button className="btn-icon audio-btn" onClick={() => playAudio(ex.en)} title="Listen to pronunciation">
                <PlayCircle size={18} />
              </button>
            </div>
            {ex.id && <div className="id-text"><RichText text={ex.id} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeTab({ unit, setProgress, progress, mistakes, setMistakes, recordActivity }) {
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [reorderSelected, setReorderSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(unit.unit);

  if (unit.unit !== currentUnit) {
    setCurrentUnit(unit.unit);
    setQIndex(0);
    setFeedback(null);
    setInputValue('');
    setReorderSelected([]);
    setScore(0);
    setShowResult(false);
  }

  const questions = unit.practice.questions;

  if (!questions || questions.length === 0) {
    return <div className="content-box empty-state">No practice questions available for this unit.</div>
  }

  if (showResult) {
    return (
      <div className="content-box result-screen">
        <CheckCircle2 size={64} className="text-success result-icon" />
        <h2>Practice Complete!</h2>
        <p>You scored <strong>{score}</strong> out of {questions.length}</p>
        <button className="btn btn-primary" onClick={() => {
          setQIndex(0); setScore(0); setShowResult(false);
        }}>Retry Practice</button>
      </div>
    );
  }

  const q = questions[qIndex];

  const handleIncorrect = () => {
    const isAlreadyInMistakes = mistakes.some(m => m.unitId === unit.unit && m.prompt === q.prompt);
    if (!isAlreadyInMistakes) {
      setMistakes([...mistakes, { unitId: unit.unit, ...q }]);
    }
  };

  const handleMultipleChoice = (idx) => {
    if (feedback) return;
    const isCorrect = idx === q.answer_index;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      handleIncorrect();
    }
    setFeedback({ isCorrect, explanation: q.explanation, correctAns: q.options[q.answer_index] });
  };


  const handleReorderSelect = (word) => {
    if (feedback) return;
    setReorderSelected([...reorderSelected, word]);
  };

  const handleReorderDeselect = (idx) => {
    if (feedback) return;
    const newSel = [...reorderSelected];
    newSel.splice(idx, 1);
    setReorderSelected(newSel);
  };

  const handleReorderCheck = () => {
    if (feedback || reorderSelected.length !== q.words.length) return;
    const answerStr = reorderSelected.join(' ');
    const isCorrect = q.accepted_answers.some(ans => normalizeText(ans) === normalizeText(answerStr));
    
    if (isCorrect) setScore(s => s + 1);
    else handleIncorrect();
    
    setFeedback({ isCorrect, explanation: q.explanation, correctAns: q.accepted_answers[0] });
  };

  const handleFillBlank = () => {
    if (feedback || !inputValue.trim()) return;
    const normalizedInput = normalizeText(inputValue);
    const isCorrect = q.accepted_answers.some(ans => normalizeText(ans) === normalizedInput);
    
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      handleIncorrect();
    }
    setFeedback({ isCorrect, explanation: q.explanation, correctAns: q.accepted_answers[0] });
  };

  const nextQuestion = () => {
    setFeedback(null);
    setInputValue('');
    setReorderSelected([]);
    if (qIndex < questions.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      setProgress(prev => ({...prev, [unit.unit]: Math.max(prev[unit.unit] || 0, score + (feedback?.isCorrect ? 1 : 0))}));
      recordActivity();
      setShowResult(true);
    }
  };

  return (
    <div className="content-box quiz-box">
      <div className="quiz-progress-text">
        Question {qIndex + 1} of {questions.length}
      </div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{width: `${(qIndex / questions.length) * 100}%`}}></div>
      </div>
      
      <h3 className="quiz-prompt"><RichText text={q.prompt} /></h3>
      
      {q.type === 'multiple_choice' && (
        <div className="options-grid">
          {q.options.map((opt, idx) => {
            let className = "quiz-option";
            if (feedback) {
              if (idx === q.answer_index) className += " correct";
              else if (!feedback.isCorrect && idx !== q.answer_index) className += " disabled";
            }
            return (
              <button key={idx} className={className} onClick={() => handleMultipleChoice(idx)}>
                <RichText text={opt} />
              </button>
            );
          })}
        </div>
      )}

      {(q.type === 'fill_blank' || q.type === 'error_correction' || q.type === 'transformation') && (
        <div className="fill-blank-container">
          <input 
            type="text" 
            className="fill-input" 
            placeholder="Type your answer here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={feedback !== null}
            onKeyDown={(e) => { if (e.key === 'Enter') handleFillBlank() }}
            autoFocus
          />
          {!feedback && (
            <button className="btn btn-primary mt-3" onClick={handleFillBlank}>Check Answer</button>
          )}
        </div>
      )}

      {q.type === 'reorder' && (
        <div className="reorder-container">
          <div className="reorder-dropzone" style={{minHeight: '50px', padding: '1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {reorderSelected.length === 0 && <span style={{color: 'var(--text-muted)'}}>Select words below...</span>}
            {reorderSelected.map((w, i) => (
              <span key={i} className="badge" style={{fontSize: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--accent)', color: 'white'}} onClick={() => { if(!feedback) { const n = [...reorderSelected]; n.splice(i,1); setReorderSelected(n); } }}>{w}</span>
            ))}
          </div>
          <div className="reorder-words" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
            {q.words && q.words.map((w, i) => {
               const selectedCount = reorderSelected.filter(sw => sw === w).length;
               const totalCount = q.words.filter(tw => tw === w).length;
               const disabled = selectedCount >= totalCount || feedback !== null;
               return (
                 <button key={i} className="btn btn-outline" style={{padding: '0.5rem 1rem', opacity: disabled ? 0.5 : 1}} disabled={disabled} onClick={() => { if(!feedback) setReorderSelected([...reorderSelected, w]); }}>{w}</button>
               );
            })}
          </div>
          {!feedback && q.words && reorderSelected.length === q.words.length && (
            <button className="btn btn-primary" onClick={handleReorderCheck}>Check Answer</button>
          )}
        </div>
      )}

      {feedback && (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`feedback-box ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            {feedback.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <h4>{feedback.isCorrect ? 'Correct!' : 'Incorrect.'}</h4>
          </div>
          {!feedback.isCorrect && (
            <div className="correct-answer-show">
              <strong>Correct answer:</strong> <RichText text={feedback.correctAns} />
            </div>
          )}
          {feedback.explanation && <p className="feedback-exp"><RichText text={feedback.explanation} /></p>}
          <button className="btn btn-primary mt-3" onClick={nextQuestion} autoFocus>
            {qIndex < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

function EditTab({ unit, data, setData }) {
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(unit)));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUnit, setCurrentUnit] = useState(unit.unit);

  if (unit.unit !== currentUnit) {
    setCurrentUnit(unit.unit);
    setFormData(JSON.parse(JSON.stringify(unit)));
    setMessage('');
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const newData = { ...data, units: data.units.map(u => u.unit === unit.unit ? formData : u) };
    
    try {
      const res = await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setData(newData);
        setMessage('Changes saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving changes.');
      }
    } catch (e) {
      console.error(e);
      setMessage('Error connecting to API.');
    }
    setSaving(false);
  };

  const addQuestion = (type) => {
    const newQ = type === 'multiple_choice' 
      ? { id: `q_${Date.now()}`, type: 'multiple_choice', prompt: 'New question prompt...', options: ['Option A', 'Option B'], answer_index: 0, explanation: 'Explanation goes here' }
      : { id: `q_${Date.now()}`, type: 'fill_blank', prompt: 'Type the missing word: ___', accepted_answers: ['answer'], explanation: 'Explanation goes here' };
    
    const currentQuestions = formData.practice.questions || [];
    setFormData({...formData, practice: {...formData.practice, questions: [...currentQuestions, newQ]}});
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.practice.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({...formData, practice: {...formData.practice, questions: newQuestions}});
  };

  const removeQuestion = (index) => {
    if (!confirm("Delete this question?")) return;
    const newQuestions = [...formData.practice.questions];
    newQuestions.splice(index, 1);
    setFormData({...formData, practice: {...formData.practice, questions: newQuestions}});
  };

  const handleOptionsChange = (qIndex, optIndex, value) => {
    const newQuestions = [...formData.practice.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setFormData({...formData, practice: {...formData.practice, questions: newQuestions}});
  };

  const addOption = (qIndex) => {
    const newQuestions = [...formData.practice.questions];
    newQuestions[qIndex].options.push('New Option');
    setFormData({...formData, practice: {...formData.practice, questions: newQuestions}});
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...formData.practice.questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    if (newQuestions[qIndex].answer_index >= newQuestions[qIndex].options.length) {
      newQuestions[qIndex].answer_index = Math.max(0, newQuestions[qIndex].options.length - 1);
    }
    setFormData({...formData, practice: {...formData.practice, questions: newQuestions}});
  };

  const updateAcceptedAnswers = (qIndex, value) => {
    const newQuestions = [...formData.practice.questions];
    newQuestions[qIndex].accepted_answers = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({...formData, practice: {...formData.practice, questions: newQuestions}});
  };

  const questions = formData.practice.questions || [];

  return (
    <div className="content-box edit-box">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h3 style={{margin: 0}}>General Content</h3>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save Section'}
        </button>
      </div>
      <div className="input-group">
        <label>Unit Title</label>
        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>
      
      <div className="input-group">
        <label>Summary / Explanation</label>
        <textarea rows={4} value={formData.explanation.summary} onChange={e => setFormData({...formData, explanation: {...formData.explanation, summary: e.target.value}})} />
        <span className="mut" style={{fontSize:'0.8rem'}}>Separate paragraphs with double newlines. Use **bold** for color highlights.</span>
      </div>
      
      
      <div className="input-group">
        <label>Grammar Pattern</label>
        <input type="text" value={formData.explanation.pattern || ''} onChange={e => setFormData({...formData, explanation: {...formData.explanation, pattern: e.target.value}})} />
      </div>

      {/* KEY POINTS EDITOR */}
      <div className="input-group" style={{marginTop: '1.5rem'}}>
        <label style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          Key Points
          <button className="btn-icon" onClick={() => setFormData({...formData, explanation: {...formData.explanation, key_points: [...(formData.explanation.key_points || []), 'New key point']}})} title="Add Key Point">
            <Plus size={16} />
          </button>
        </label>
        {(formData.explanation.key_points || []).map((kp, i) => (
          <div key={i} style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <input type="text" value={kp} onChange={e => {
              const newKp = [...formData.explanation.key_points];
              newKp[i] = e.target.value;
              setFormData({...formData, explanation: {...formData.explanation, key_points: newKp}});
            }} />
            <button className="btn-icon" onClick={() => {
              const newKp = [...formData.explanation.key_points];
              newKp.splice(i, 1);
              setFormData({...formData, explanation: {...formData.explanation, key_points: newKp}});
            }}><XCircle size={16} color="var(--danger)" /></button>
          </div>
        ))}
      </div>

      {/* CONTEXTUAL EXAMPLES EDITOR */}
      <div className="input-group" style={{marginTop: '1.5rem'}}>
        <label style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          Contextual Examples
          <button className="btn-icon" onClick={() => setFormData({...formData, explanation: {...formData.explanation, examples: [...(formData.explanation.examples || []), {en: 'English text', id: 'Indonesian context'}]}})} title="Add Example">
            <Plus size={16} />
          </button>
        </label>
        {(formData.explanation.examples || []).map((ex, i) => (
          <div key={i} style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', background: 'var(--bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'}}>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <input type="text" value={ex.en} placeholder="English Text" onChange={e => {
                const newEx = [...formData.explanation.examples];
                newEx[i].en = e.target.value;
                setFormData({...formData, explanation: {...formData.explanation, examples: newEx}});
              }} />
              <input type="text" value={ex.id || ''} placeholder="Indonesian Context/Translation" onChange={e => {
                const newEx = [...formData.explanation.examples];
                newEx[i].id = e.target.value;
                setFormData({...formData, explanation: {...formData.explanation, examples: newEx}});
              }} />
            </div>
            <button className="btn-icon" style={{alignSelf: 'flex-start'}} onClick={() => {
              const newEx = [...formData.explanation.examples];
              newEx.splice(i, 1);
              setFormData({...formData, explanation: {...formData.explanation, examples: newEx}});
            }}><Trash2 size={16} color="var(--danger)" /></button>
          </div>
        ))}
      </div>

      
      <div className="divider" style={{margin: '3rem 0', borderTop: '1px solid var(--border)'}}></div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem'}}>
            <h3 style={{margin: 0}}>Practice Quiz Builder</h3>
            <button className="btn btn-outline" onClick={handleSave} disabled={saving} style={{padding: '0.2rem 0.75rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)'}}>
              <Save size={14} /> Save Quiz
            </button>
          </div>
          <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Manage questions for this unit ({questions.length} total)</p>
        </div>
        <div style={{display: 'flex', gap: '0.75rem'}}>
          <button className="btn btn-outline" onClick={() => addQuestion('multiple_choice')} style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
            <Plus size={14} /> Multiple Choice
          </button>
          <button className="btn btn-outline" onClick={() => addQuestion('fill_blank')} style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
            <Plus size={14} /> Fill in Blank
          </button>
        </div>
      </div>

      <div className="questions-editor-list">
        {questions.length === 0 && (
          <div className="notice-box" style={{textAlign: 'center', background: 'var(--bg)', borderStyle: 'dashed'}}>
            No questions yet. Click the buttons above to add some!
          </div>
        )}
        
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="q-edit-card" style={{border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)'}}>
              <span className="badge" style={{textTransform:'capitalize'}}>{q.type.replace('_', ' ')}</span>
              <button className="btn-icon" style={{color: 'var(--danger)'}} onClick={() => removeQuestion(qIndex)} title="Delete Question">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="input-group">
              <label>Question Prompt</label>
              <textarea rows={2} value={q.prompt} onChange={e => updateQuestion(qIndex, 'prompt', e.target.value)} placeholder="E.g. I ___ to the store yesterday." />
            </div>

            {q.type === 'multiple_choice' && (
              <div className="options-editor" style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Answers / Options</label>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                    <input 
                      type="radio" 
                      name={`correct_ans_${qIndex}`} 
                      checked={q.answer_index === optIndex}
                      onChange={() => updateQuestion(qIndex, 'answer_index', optIndex)}
                      style={{cursor: 'pointer'}}
                      title="Set as correct answer"
                    />
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={e => handleOptionsChange(qIndex, optIndex, e.target.value)}
                      style={{flex: 1, padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}
                    />
                    <button className="btn-icon" onClick={() => removeOption(qIndex, optIndex)} disabled={q.options.length <= 2}>
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={() => addOption(qIndex)} style={{color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.5rem'}}>+ Add Option</button>
              </div>
            )}

            {q.type === 'fill_blank' && (
              <div className="input-group">
                <label>Accepted Answers (Comma separated)</label>
                <input 
                  type="text" 
                  value={(q.accepted_answers || []).join(', ')} 
                  onChange={e => updateAcceptedAnswers(qIndex, e.target.value)} 
                  placeholder="e.g. went, did go" 
                />
              </div>
            )}

            <div className="input-group mt-3" style={{marginBottom: 0}}>
              <label>Explanation (Shown after answering)</label>
              <input type="text" value={q.explanation} onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <div className="edit-actions" style={{marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{padding: '0.75rem 2rem'}}>
          <Save size={18} /> {saving ? 'Saving to Database...' : 'Save All Changes'}
        </button>
        {message && <span className="save-message">{message}</span>}
      </div>
    </div>
  );
}


export default App;
