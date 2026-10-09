const fs = require('fs');
let css = fs.readFileSync('web/src/App.css', 'utf8');

const sampleStyles = `
/* Contextual Sample Enhancements */
.examples-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .examples-list {
    grid-template-columns: 1fr 1fr;
  }
}

.example-item {
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--text);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.example-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.en-text {
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.id-text {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-style: italic;
  padding-left: 1.5rem;
}

.audio-btn {
  color: var(--text-light);
  padding: 0.25rem;
  border-radius: 50%;
  margin-left: -0.25rem;
}

.audio-btn:hover {
  color: var(--text);
  background: var(--border);
}
`;

fs.writeFileSync('web/src/App.css', css + '\n' + sampleStyles);
console.log("App.css contextual samples patched!");
