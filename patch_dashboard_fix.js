const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Normalize line endings to help matching, then restore later if needed (though writing LF is fine for git)
content = content.replace(/\r\n/g, '\n');

// We need to inject the boxes into the dashboard.
// Let's find this specific section:
// <div className="dashboard-section mt-4" style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
// ...
// </div> (before weakestUnits check)

const oldSectionRegex = /<div className="dashboard-section mt-4" style=\{\{display: 'flex', gap: '1\.5rem', flexWrap: 'wrap'\}\}>[\s\S]*?(?=\{weakestUnits\.length > 0)/;

const newSection = `<div className="dashboard-section mt-4" style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem'}}>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: 'var(--accent-bg)', border: '1px solid var(--accent)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Calendar size={18}/> Daily Vocab</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>20 Words</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Swipe through 20 essential vocabulary words every day to enrich your grammar.</p>
          <Link to="/vocab" className="btn btn-outline" style={{width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)', textAlign: 'center'}}>Start Vocab Drill</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#f0fdf4', border: '1px solid #22c55e', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#16a34a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Flame size={18}/> IELTS Vocab</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>20 Phrases</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Phrasal Verbs, Collocations, Idioms (Environment, Tech, dll).</p>
          <Link to="/ielts" className="btn btn-outline" style={{width: '100%', borderColor: '#16a34a', color: '#16a34a', textAlign: 'center'}}>Mulai IELTS Vocab</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#eff6ff', border: '1px solid #3b82f6', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#2563eb', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Edit3 size={18}/> Writing Analyzer</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>Band 8.0+</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Bedah struktur dan kosakata esai IELTS berstandar tinggi.</p>
          <Link to="/writing" className="btn btn-outline" style={{width: '100%', borderColor: '#2563eb', color: '#2563eb', textAlign: 'center'}}>Bedah Esai</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fdf4ff', border: '1px solid #d946ef', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#c026d3', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Zap size={18}/> Daily Dictation</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>Listen & Type</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Latih pendengaran dan ejaan dengan kalimat Bahasa Inggris.</p>
          <Link to="/dictation" className="btn btn-outline" style={{width: '100%', borderColor: '#c026d3', color: '#c026d3', textAlign: 'center'}}>Mulai Dictation</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fff1f2', border: '1px solid #f43f5e', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#e11d48', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><PlayCircle size={18}/> Podcast Listening</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>TED & CEO</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Latih listening dengan video TED Talks dan Diary of a CEO.</p>
          <Link to="/podcast" className="btn btn-outline" style={{width: '100%', borderColor: '#e11d48', color: '#e11d48', textAlign: 'center'}}>Dengarkan</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', background: '#fefce8', border: '1px solid #eab308', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3 style={{color: '#ca8a04', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><PlayCircle size={18}/> Shadowing</h3>
          <h2 style={{fontSize: '1.8rem', marginBottom: '0.2rem'}}>Speaking</h2>
          <p className="text-muted" style={{fontStyle: 'italic', marginBottom: '1.5rem'}}>Latih pelafalan IELTS Speaking dengan metode Shadowing.</p>
          <Link to="/shadowing" className="btn btn-outline" style={{width: '100%', borderColor: '#ca8a04', color: '#ca8a04', textAlign: 'center'}}>Mulai Shadowing</Link>
        </div>

        <div className="content-box" style={{flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <Zap size={48} className="text-accent" style={{marginBottom: '1rem'}} />
          <h3>Daily Mix Quiz</h3>
          <p className="text-muted mb-4">5 quick questions to keep your grammar sharp and maintain your streak!</p>
          <div style={{display: 'flex', gap: '0.5rem', width: '100%'}}>
            <Link to="/daily" className="btn btn-primary" style={{flex: 1}}>5-Min Drill</Link>
            <Link to="/mixed" className="btn btn-outline" style={{flex: 1, borderColor: 'var(--accent)', color: 'var(--accent)'}}>Mixed Review</Link>
          </div>
        </div>

      </div>

      `;

if (oldSectionRegex.test(content)) {
  content = content.replace(oldSectionRegex, newSection);
  fs.writeFileSync(appPath, content, 'utf8');
  console.log('Dashboard successfully updated with all features!');
} else {
  console.log('Could not match regex.');
}
