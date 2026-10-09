const fs = require('fs');
let code = fs.readFileSync('web/src/App.tsx', 'utf8');

// Replace 1: Imports
code = code.replace(
  "import { BookOpen, Edit3, Save, Layout, PlayCircle, PlusCircle, ArrowRight, ArrowLeft, Search, Bookmark, BookmarkCheck, ChevronDown, ChevronRight, CheckCircle2, XCircle, Trash2, Plus, BrainCircuit, RefreshCw, Zap, Flame, Calendar, Upload, Download, AlertTriangle, Shuffle } from 'lucide-react';",
  "import { BookOpen, Edit3, Save, Layout, PlayCircle, PlusCircle, ArrowRight, ArrowLeft, Search, Bookmark, BookmarkCheck, ChevronDown, ChevronRight, CheckCircle2, XCircle, Trash2, Plus, BrainCircuit, RefreshCw, Zap, Flame, Calendar, Upload, Download, AlertTriangle, Shuffle, Menu } from 'lucide-react';"
);

// Replace 2: App component Layout
code = code.replace(
  /if \(!data\)([\s\S]*?)<div className="app-layout">[\s\S]*?<Sidebar data=\{data\} bookmarks=\{bookmarks\} progress=\{progress\} mistakes=\{mistakes\} \/>[\s\S]*?<main className="main-content">/,
  `const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <main className="main-content">`
);

// Replace 3: Sidebar signature
code = code.replace(
  /function Sidebar\(\{ data, bookmarks, progress, mistakes \}\) \{([\s\S]*?)const \[expandedSections, setExpandedSections\] = useState\(\{\}\);/,
  `function Sidebar({ data, bookmarks, progress, mistakes, isOpen, closeSidebar }) {$1const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (window.innerWidth <= 768 && closeSidebar) {
      closeSidebar();
    }
  }, [location.pathname]);`
);

// Replace 4: Sidebar header
code = code.replace(
  /<aside className="sidebar">([\s\S]*?)<div className="sidebar-header">([\s\S]*?)<BookOpen size=\{20\} strokeWidth=\{1\.5\} className="text-accent" \/>([\s\S]*?)<span>Grammar Base<\/span>([\s\S]*?)<\/div>/,
  `<aside className={\`sidebar \${isOpen ? 'open' : ''}\`}>$1<div className="sidebar-header">$2<div className="sidebar-brand">$3<BookOpen size={20} strokeWidth={1.5} className="text-accent" />$4<span>Grammar Base</span>$5</div>$6<button className="btn-icon close-sidebar-btn" onClick={closeSidebar}>$7<XCircle size={20} />$8</button>$9</div>`
);
// wait the last regex is a bit messy, let's just do exact string replace for the sidebar header but handling \r\n
code = code.replace(
  /<aside className="sidebar">\s*<div className="sidebar-header">\s*<BookOpen size=\{20\} strokeWidth=\{1\.5\} className="text-accent" \/>\s*<span>Grammar Base<\/span>\s*<\/div>/,
  `<aside className={\`sidebar \${isOpen ? 'open' : ''}\`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <BookOpen size={20} strokeWidth={1.5} className="text-accent" />
          <span>Grammar Base</span>
        </div>
        <button className="btn-icon close-sidebar-btn" onClick={closeSidebar}>
          <XCircle size={20} />
        </button>
      </div>`
);


fs.writeFileSync('web/src/App.tsx', code);
console.log("App.tsx patched!");
