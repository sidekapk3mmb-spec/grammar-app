const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Replace MicroLearnBlock entirely
const oldMicroLearnBlock = appCode.match(/function MicroLearnBlock[^]+?<\/div>\s*\);\s*\}/)[0];

const newMicroLearnBlock = `function MicroLearnBlock({ content }) {
  let formatted = content || "";
  // Jika teks menumpuk tanpa newline, paksa pisahkan setiap dua kalimat (setelah titik spasi huruf besar)
  if (!formatted.includes('\\n\\n') && formatted.length > 200) {
     formatted = formatted.replace(/\\. ([A-Z])/g, '.\\n\\n$1');
  }
  
  const blocks = formatted.split('\\n\\n').filter(s => s.trim());
  const [visibleCount, setVisibleCount] = useState(2);
  
  return (
    <div className="micro-learning-container">
      {blocks.slice(0, visibleCount).map((b, i) => (
        <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className="summary-text" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", marginBottom: "1.2rem", fontSize: "1.05rem", color: "var(--text)" }}>
          <RichText text={b} />
        </motion.p>
      ))}
      {visibleCount < blocks.length && (
        <button className="btn btn-outline mb-4" onClick={() => setVisibleCount(v => v + 2)} style={{width: '100%', borderColor: 'var(--accent-light)', color: 'var(--accent)'}}>
          Continue Reading <ChevronDown size={16} />
        </button>
      )}
    </div>
  );
}`;

appCode = appCode.replace(oldMicroLearnBlock, newMicroLearnBlock);

// 2. Replace pattern box entirely
const oldPatternBox = appCode.match(/\{unit\.explanation\.pattern && \([^]+?<\/div>\s*\)\}/)[0];

const newPatternBox = `{unit.explanation.pattern && (
        <div className="pattern-box" style={{ background: 'var(--surface-alt)', borderLeft: '4px solid var(--primary)', padding: '1.2rem', borderRadius: 'var(--radius)', margin: '1.5rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div className="pattern-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.8rem', letterSpacing: '1px' }}>GRAMMAR PATTERN</div>
          <div className="pattern-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {unit.explanation.pattern.split(';').map(s => s.trim()).filter(Boolean).map((line, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.95rem', background: 'var(--surface)', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-strong)' }}>
                <RichText text={line} />
              </div>
            ))}
          </div>
        </div>
      )}`;

appCode = appCode.replace(oldPatternBox, newPatternBox);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log("App.tsx UI significantly improved.");
