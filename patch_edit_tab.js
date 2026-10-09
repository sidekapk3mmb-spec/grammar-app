const fs = require('fs');

let code = fs.readFileSync('web/src/App.tsx', 'utf8');

// Insert Key Points and Contextual Examples editors into EditTab
const replacement = `
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
`;

code = code.replace(
  /<div className="input-group">\s*<label>Grammar Pattern<\/label>\s*<input type="text" value=\{formData\.explanation\.pattern\} onChange=\{e => setFormData\(\{\.\.\.formData, explanation: \{\.\.\.formData\.explanation, pattern: e\.target\.value\}\}\)\} \/>\s*<\/div>/,
  replacement
);

fs.writeFileSync('web/src/App.tsx', code);
console.log("EditTab patched successfully!");
