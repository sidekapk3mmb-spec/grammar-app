const fs = require('fs');
let code = fs.readFileSync('web/src/App.tsx', 'utf8');

// 1. Update Grammar Pattern Parsing
code = code.replace(
  /\{unit\.explanation\.pattern\.split\(';'\)\.map\(s => s\.trim\(\)\)\.filter\(Boolean\)\.map\(\(line, i\) => \(/,
  `{unit.explanation.pattern.replace(/(Negatif:|Tanya:|Positif:|\\[\\+\\]|\\[-\\]|\\[\\?\\]|Negative:|Question:)/gi, '\\n$1').split(/[;\\n]/).map(s => s.trim()).filter(Boolean).map((line, i) => (`
);

// 2. Update MicroLearnBlock for better readability (handling (1), (2) and \n\n)
code = code.replace(
  /function MicroLearnBlock\(\{ content \}\) \{([\s\S]*?)return \([\s\S]*?className="micro-learning-container">([\s\S]*?)<\/div>\s*\);\s*\}/,
  `function MicroLearnBlock({ content }) {
  let formatted = content || "";
  // Auto format lists (1) (2) (3) or a), b), c) into newlines
  formatted = formatted.replace(/\\s*\\((\\d+|[a-c])\\)\\s*/g, '\\n\\n• ');
  
  if (!formatted.includes('\\n\\n') && formatted.length > 200) {
     formatted = formatted.replace(/\\. ([A-Z])/g, '.\\n\\n$1');
  }
  
  const blocks = formatted.split('\\n\\n').filter(s => s.trim());
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
}`
);

// 3. Add Save Buttons to EditTab Sections
// We will replace occurrences of section headers in EditTab with a flex container containing a Save button.
code = code.replace(
  /<h3 style={{marginBottom: '1\.5rem'}}>General Content<\/h3>/,
  `<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h3 style={{margin: 0}}>General Content</h3>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save Section'}
        </button>
      </div>`
);

// For Quiz Builder header, it already has a flex layout:
// <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
code = code.replace(
  /<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>\s*<div>\s*<h3 style={{marginBottom: '0\.25rem'}}>Practice Quiz Builder<\/h3>/,
  `<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem'}}>
            <h3 style={{margin: 0}}>Practice Quiz Builder</h3>
            <button className="btn btn-outline" onClick={handleSave} disabled={saving} style={{padding: '0.2rem 0.75rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)'}}>
              <Save size={14} /> Save Quiz
            </button>
          </div>`
);

fs.writeFileSync('web/src/App.tsx', code);
console.log("App.tsx patched for UI/UX improvements (MicroLearnBlock, Pattern, Edit Save buttons).");
