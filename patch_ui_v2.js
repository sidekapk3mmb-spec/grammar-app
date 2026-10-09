const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

// 2. Add /mixed Route
appCode = appCode.replace(
  '<Route path="/daily" element={<DailyQuiz data={data} progress={progress} recordActivity={recordActivity} />} />',
  '<Route path="/daily" element={<DailyQuiz data={data} progress={progress} recordActivity={recordActivity} />} />\n            <Route path="/mixed" element={<MixedDrill data={data} progress={progress} recordActivity={recordActivity} />} />'
);

// 3. Add Sidebar link
appCode = appCode.replace(
  '<Link to="/daily" className={`sidebar-link ${location.pathname === \'/daily\' ? \'active\' : \'\'}`}>',
  '<Link to="/mixed" className={`sidebar-link ${location.pathname === \'/mixed\' ? \'active\' : \'\'}`}>\n            <Shuffle size={16} /> Mixed Review\n          </Link>\n          <Link to="/daily" className={`sidebar-link ${location.pathname === \'/daily\' ? \'active\' : \'\'}`}>'
);

// 4. Update Dashboard Links
appCode = appCode.replace(
  '<Link to="/daily" className="btn btn-primary" style={{width: \'100%\'}}>Start 5-Min Drill</Link>',
  `<div style={{display: 'flex', gap: '0.5rem', width: '100%'}}>
            <Link to="/daily" className="btn btn-primary" style={{flex: 1}}>5-Min Drill</Link>
            <Link to="/mixed" className="btn btn-outline" style={{flex: 1, borderColor: 'var(--accent)', color: 'var(--accent)'}}>Mixed Review</Link>
          </div>`
);

// 5. PracticeTab States
appCode = appCode.replace(
  'const [score, setScore] = useState(0);\n  const [showResult, setShowResult] = useState(false);',
  `const [score, setScore] = useState(0);\n  const [showResult, setShowResult] = useState(false);\n  const [reorderSelected, setReorderSelected] = useState([]);`
);

appCode = appCode.replace(
  'setScore(0);\n    setShowResult(false);\n  }, [unit.unit]);',
  'setScore(0);\n    setShowResult(false);\n    setReorderSelected([]);\n  }, [unit.unit]);'
);

// 6. Add reorder handlers to PracticeTab
const reorderHandlers = `
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
`;
appCode = appCode.replace(
  '  const handleFillBlank = () => {',
  `${reorderHandlers}\n  const handleFillBlank = () => {`
);

// 7. Render reorder UI in PracticeTab
const fillBlankLine = "{q.type === 'fill_blank' && (";
appCode = appCode.replace(
  fillBlankLine,
  "{(q.type === 'fill_blank' || q.type === 'error_correction' || q.type === 'transformation') && ("
);

// We need to inject the reorder rendering exactly before the feedback box in PracticeTab
// The feedback box in PracticeTab starts with:
//       {feedback && (
//         <motion.div initial={{opacity:0, y:10}}
// Let's find this exact block.
const feedbackBlockStr = `      {feedback && (
        <motion.div initial={{opacity:0, y:10}}`;

const reorderUIRender = `
      {q.type === 'reorder' && (
        <div className="reorder-container">
          <div className="reorder-dropzone" style={{minHeight: '50px', padding: '1rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            {reorderSelected.length === 0 && <span style={{color: 'var(--text-muted)'}}>Select words below...</span>}
            {reorderSelected.map((w, i) => (
              <span key={i} className="badge" style={{fontSize: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', background: 'var(--accent)', color: 'white'}} onClick={() => handleReorderDeselect(i)}>{w}</span>
            ))}
          </div>
          <div className="reorder-words" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
            {q.words && q.words.map((w, i) => {
               const selectedCount = reorderSelected.filter(sw => sw === w).length;
               const totalCount = q.words.filter(tw => tw === w).length;
               const disabled = selectedCount >= totalCount || feedback !== null;
               return (
                 <button key={i} className="btn btn-outline" style={{padding: '0.5rem 1rem', opacity: disabled ? 0.5 : 1}} disabled={disabled} onClick={() => handleReorderSelect(w)}>{w}</button>
               );
            })}
          </div>
          {!feedback && q.words && reorderSelected.length === q.words.length && (
            <button className="btn btn-primary" onClick={handleReorderCheck}>Check Answer</button>
          )}
        </div>
      )}
`;

// Only replace the FIRST occurrence of `feedbackBlockStr` after `nextQuestion` of PracticeTab
const ptIndex = appCode.indexOf('function PracticeTab');
const fbIndex = appCode.indexOf(feedbackBlockStr, ptIndex);
if (fbIndex !== -1) {
  appCode = appCode.slice(0, fbIndex) + reorderUIRender + '\n' + appCode.slice(fbIndex);
}

// 8. Add MixedDrill component
const mixedDrillComponent = `
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
      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{width: \`\${(qIndex / questions.length) * 100}%\`}}></div></div>
      
      <h3 className="quiz-prompt"><RichText text={q.prompt} /></h3>
      
      {q.type === 'multiple_choice' && (
        <div className="options-grid">
          {q.options && q.options.map((opt, idx) => (
             <button key={idx} className={\`quiz-option \${feedback ? (idx === q.answer_index ? 'correct' : (idx !== q.answer_index && !feedback.isCorrect ? 'disabled' : '')) : ''}\`} onClick={() => handleAnswer(idx === q.answer_index, q.options[q.answer_index])}>
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

      {feedback && (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={\`feedback-box \${feedback.isCorrect ? 'correct' : 'incorrect'}\`}>
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

`;

appCode = appCode.replace(
  '// --- VOCAB DRILL (50 WORDS) ---',
  `${mixedDrillComponent}\n// --- VOCAB DRILL (50 WORDS) ---`
);


// EditTab updates for new types
const addQuestionStr = `  const addQuestion = (type) => {
    const newQ = type === 'multiple_choice' 
      ? { id: \`q_\${Date.now()}\`, type: 'multiple_choice', prompt: 'New question prompt...', options: ['Option A', 'Option B'], answer_index: 0, explanation: 'Explanation goes here' }
      : { id: \`q_\${Date.now()}\`, type: 'fill_blank', prompt: 'Type the missing word: ___', accepted_answers: ['answer'], explanation: 'Explanation goes here' };
`;

const newAddQuestionStr = `  const addQuestion = (type) => {
    let newQ;
    if (type === 'multiple_choice') newQ = { id: \`q_\${Date.now()}\`, type: 'multiple_choice', prompt: 'New prompt...', options: ['A', 'B'], answer_index: 0, explanation: '' };
    else if (type === 'fill_blank' || type === 'error_correction' || type === 'transformation') newQ = { id: \`q_\${Date.now()}\`, type: type, prompt: 'Prompt...', accepted_answers: ['answer'], explanation: '' };
    else if (type === 'reorder') newQ = { id: \`q_\${Date.now()}\`, type: 'reorder', prompt: 'Rearrange the words', words: ['word1', 'word2'], accepted_answers: ['word1 word2'], explanation: '' };
`;
appCode = appCode.replace(addQuestionStr, newAddQuestionStr);

const addButtonsStr = `          <button className="btn btn-outline" onClick={() => addQuestion('multiple_choice')} style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
            <Plus size={14} /> Multiple Choice
          </button>
          <button className="btn btn-outline" onClick={() => addQuestion('fill_blank')} style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
            <Plus size={14} /> Fill in Blank
          </button>`;

const newAddButtonsStr = `          <select className="btn btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto'}} value="" onChange={(e) => { if(e.target.value) { addQuestion(e.target.value); e.target.value=''; } }}>
            <option value="" disabled>+ Add Question...</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_blank">Fill in Blank</option>
            <option value="error_correction">Error Correction</option>
            <option value="transformation">Transformation</option>
            <option value="reorder">Reorder</option>
          </select>`;

appCode = appCode.replace(addButtonsStr, newAddButtonsStr);

const qTypeBadgeStr = "<span className=\"badge\">{q.type === 'multiple_choice' ? 'Multiple Choice' : 'Fill in the Blank'}</span>";
const newQTypeBadgeStr = "<span className=\"badge\" style={{textTransform:'capitalize'}}>{q.type.replace('_', ' ')}</span>";
appCode = appCode.replace(qTypeBadgeStr, newQTypeBadgeStr);

const editFillBlankRender = `{q.type === 'fill_blank' && (
              <div className="input-group" style={{marginBottom: '1.5rem'}}>
                <label>Accepted Answers (comma separated)</label>
                <input type="text" value={q.accepted_answers?.join(', ')} onChange={e => updateAcceptedAnswers(qIndex, e.target.value)} placeholder="ans1, ans2..." />
              </div>
            )}`;

const newEditFillBlankRender = `{(q.type === 'fill_blank' || q.type === 'error_correction' || q.type === 'transformation') && (
              <div className="input-group" style={{marginBottom: '1.5rem'}}>
                <label>Accepted Answers (comma separated)</label>
                <input type="text" value={q.accepted_answers?.join(', ')} onChange={e => updateAcceptedAnswers(qIndex, e.target.value)} placeholder="ans1, ans2..." />
              </div>
            )}
            {q.type === 'reorder' && (
              <div className="input-group" style={{marginBottom: '1.5rem'}}>
                <label>Words (comma separated)</label>
                <input type="text" value={q.words?.join(', ')} onChange={e => updateQuestion(qIndex, 'words', e.target.value.split(',').map(s=>s.trim()).filter(s=>s))} placeholder="word1, word2..." />
                <label style={{marginTop: '1rem'}}>Accepted Sentence</label>
                <input type="text" value={q.accepted_answers?.join(', ')} onChange={e => updateAcceptedAnswers(qIndex, e.target.value)} />
              </div>
            )}`;

appCode = appCode.replace(editFillBlankRender, newEditFillBlankRender);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Successfully patched App.tsx v2');
