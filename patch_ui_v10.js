const fs = require('fs');
let code = fs.readFileSync('web/src/App.tsx', 'utf8');

// Use a very careful regex to completely replace the MicroLearnBlock function
code = code.replace(
  /function MicroLearnBlock\(\{ content \}\) \{[\s\S]*?\}\s*function LearnTab/g,
  `function MicroLearnBlock({ content }) {
  let formatted = content || "";
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
}

function LearnTab`
);

fs.writeFileSync('web/src/App.tsx', code);
