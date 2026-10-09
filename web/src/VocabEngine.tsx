import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Save, Trash2, Edit3, XCircle, Search, Filter } from 'lucide-react';

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

export function VocabEngine({ deckName, title, initialData, recordActivity }: { deckName: string, title: string, initialData: any[], recordActivity: () => void }) {
  const [tab, setTab] = useState<'practice' | 'manage'>('practice');
  const [vocabData, setVocabData] = useLocalStorage(`grammar_${deckName}_data`, initialData);
  const [progress, setProgress] = useLocalStorage(`grammar_${deckName}_progress`, {});
  // progress map: { [word]: { status: 'baru' | 'dipelajari' | 'hafal', nextReview: timestamp, interval: number } }

  const [sessionCards, setSessionCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Table edit state
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    // Generate session cards: 20 cards max (mix of due cards + new cards)
    if (tab !== 'practice') return;
    
    const now = Date.now();
    let dueCards = [];
    let newCards = [];

    vocabData.forEach((item: any) => {
      const p = progress[item.word];
      if (!p || p.status === 'baru') {
        newCards.push(item);
      } else if (p.nextReview <= now) {
        dueCards.push(item);
      }
    });

    // Shuffle
    dueCards.sort(() => 0.5 - Math.random());
    newCards.sort(() => 0.5 - Math.random());

    let selected = [...dueCards.slice(0, 20)];
    if (selected.length < 20) {
      selected = [...selected, ...newCards.slice(0, 20 - selected.length)];
    }

    setSessionCards(selected);
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [tab, vocabData]); // regenerate when entering practice tab

  const handleReview = (isKnown: boolean) => {
    const card = sessionCards[currentIndex];
    const currentP = progress[card.word] || { status: 'baru', interval: 0, nextReview: 0 };
    
    let newInterval = 1;
    let newStatus = 'dipelajari';

    if (isKnown) {
      if (currentP.interval === 0) newInterval = 1;
      else if (currentP.interval === 1) newInterval = 3;
      else if (currentP.interval === 3) newInterval = 7;
      else if (currentP.interval >= 7) {
        newInterval = 14;
        newStatus = 'hafal';
      }
    } else {
      newInterval = 0; // Repeat today/tomorrow
      newStatus = 'dipelajari';
    }

    const nextReview = Date.now() + (newInterval * 24 * 60 * 60 * 1000);
    setProgress({ ...progress, [card.word]: { status: newStatus, interval: newInterval, nextReview } });

    setShowAnswer(false);
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      recordActivity();
      setSessionCards([]); // End of session
    }
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentCard = sessionCards[currentIndex];

  const renderPractice = () => {
    if (sessionCards.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
          <h2>You're all caught up!</h2>
          <p className="text-muted">You have reviewed all your due cards for {title}.</p>
          <button className="btn btn-outline mt-4" onClick={() => setTab('manage')}>View Vocab List</button>
        </div>
      );
    }

    return (
      <div className="drill-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="drill-header">
          <h2 style={{ color: 'var(--accent)' }}>{title}</h2>
          <span className="badge" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            {currentIndex + 1} / {sessionCards.length}
          </span>
        </div>

        <div className="flashcard" style={{ minHeight: '300px' }}>
          <div className="flashcard-front" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
            {currentCard.type && (
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{currentCard.type}</span>
                {currentCard.theme && <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>{currentCard.theme}</span>}
              </div>
            )}
            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-strong)' }}>{currentCard.word}</h2>
            {currentCard.ipa && <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontFamily: 'monospace' }}>{currentCard.ipa}</div>}
            
            <button className="btn-icon audio-btn mt-2" onClick={() => playAudio(currentCard.word)}>
              <PlayCircle size={32} color="var(--accent)" />
            </button>
          </div>

          <AnimatePresence>
            {showAnswer && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flashcard-back" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '1.2rem', color: 'var(--text-strong)' }}>
                  {currentCard.meaning}
                </div>
                {currentCard.definition && (
                  <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    <strong>EN:</strong> {currentCard.definition}
                  </div>
                )}
                <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', lineHeight: '1.6' }}>
                  <span dangerouslySetInnerHTML={{ __html: currentCard.example.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent)">$1</strong>') }} />
                  <button className="btn-icon" style={{ marginLeft: '0.5rem', verticalAlign: 'middle', display: 'inline-flex' }} onClick={() => playAudio(currentCard.example)}>
                    <PlayCircle size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="drill-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {!showAnswer ? (
            <button className="btn btn-primary w-100" onClick={() => setShowAnswer(true)}>Tampilkan Jawaban</button>
          ) : (
            <>
              <button className="btn btn-outline" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleReview(false)}>
                <RotateCcw size={16} /> Ulangi
              </button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => handleReview(true)}>
                <CheckCircle2 size={16} /> Sudah Hafal
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderManage = () => {
    const filteredData = vocabData.filter((item: any) => item.word.toLowerCase().includes(searchQuery.toLowerCase()) || (item.meaning && item.meaning.toLowerCase().includes(searchQuery.toLowerCase())));

    return (
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', flex: 1, minWidth: '250px' }}>
            <Search size={18} className="text-muted" style={{ marginRight: '0.5rem' }} />
            <input type="text" placeholder="Cari kata atau arti..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
          </div>
          <button className="btn btn-primary" onClick={() => setEditingItem({ id: Date.now(), word: '', meaning: '', example: '' })}>+ Tambah Kata</button>
        </div>

        <div style={{ overflowX: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Kata</th>
                <th style={{ padding: '1rem' }}>Arti</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Review Berikutnya</th>
                <th style={{ padding: '1rem' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any) => {
                const p = progress[item.word];
                const status = p ? p.status : 'baru';
                const nextReview = p && p.nextReview ? new Date(p.nextReview).toLocaleDateString() : '-';
                return (
                  <tr key={item.word} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-strong)' }}>{item.word}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{item.meaning}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ background: status === 'hafal' ? 'var(--success-bg)' : status === 'dipelajari' ? 'var(--accent-bg)' : 'var(--bg)', color: status === 'hafal' ? 'var(--success)' : status === 'dipelajari' ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{nextReview}</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn-icon" onClick={() => setEditingItem(item)}><Edit3 size={16} /></button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => {
                        if (confirm('Hapus kata ini?')) setVocabData(vocabData.filter((v: any) => v.word !== item.word));
                      }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editingItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="content-box" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Edit Flashcard</h3>
                <button className="btn-icon" onClick={() => setEditingItem(null)}><XCircle size={20} /></button>
              </div>
              <div className="input-group">
                <label>Kata / Phrase</label>
                <input type="text" value={editingItem.word} onChange={e => setEditingItem({ ...editingItem, word: e.target.value })} />
              </div>
              {title.includes('IELTS') && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Tipe</label>
                    <input type="text" placeholder="Phrasal Verb, dll" value={editingItem.type || ''} onChange={e => setEditingItem({ ...editingItem, type: e.target.value })} />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Tema</label>
                    <input type="text" placeholder="Environment, Tech" value={editingItem.theme || ''} onChange={e => setEditingItem({ ...editingItem, theme: e.target.value })} />
                  </div>
                </div>
              )}
              <div className="input-group">
                <label>Arti (Indonesia)</label>
                <input type="text" value={editingItem.meaning} onChange={e => setEditingItem({ ...editingItem, meaning: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Contoh Kalimat</label>
                <textarea rows={3} value={editingItem.example} onChange={e => setEditingItem({ ...editingItem, example: e.target.value })} placeholder="Gunakan **kata** untuk highlight" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-outline" onClick={() => setEditingItem(null)}>Batal</button>
                <button className="btn btn-primary" onClick={() => {
                  const newData = [...vocabData];
                  const idx = newData.findIndex(v => v.word === editingItem.word || v.id === editingItem.id);
                  if (idx >= 0) newData[idx] = editingItem;
                  else newData.push(editingItem);
                  setVocabData(newData);
                  setEditingItem(null);
                }}>Simpan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="content-box" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button className={`btn ${tab === 'practice' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('practice')}>Practice</button>
        <button className={`btn ${tab === 'manage' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('manage')}>Daftar Kata</button>
      </div>
      {tab === 'practice' ? renderPractice() : renderManage()}
    </div>
  );
}
