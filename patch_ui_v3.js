const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Fix MicroLearnBlock styling
appCode = appCode.replace(/className="summary-text"/g, 'className="summary-text" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", marginBottom: "1rem" }}');

// 2. Inject Reorder UI into PracticeTab
const reorderUI = `
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
`;

const ptIndex = appCode.indexOf('function PracticeTab');
if (ptIndex !== -1) {
    const feedbackBlockStr = `      {feedback && (
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className=\`feedback-box \${feedback.isCorrect ? 'correct' : 'incorrect'}\`>`;
    const fbIndex = appCode.indexOf(feedbackBlockStr, ptIndex);
    if (fbIndex !== -1) {
        appCode = appCode.slice(0, fbIndex) + reorderUI + '\n' + appCode.slice(fbIndex);
        console.log("Successfully injected Reorder UI into PracticeTab.");
    } else {
        console.error("Could not find feedback block in PracticeTab.");
    }
} else {
    console.error("Could not find PracticeTab.");
}

fs.writeFileSync(appPath, appCode, 'utf8');
console.log("App.tsx patched.");
