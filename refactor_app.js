const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'web/src/App.tsx');
let text = fs.readFileSync(file, 'utf8');

const ieltsIndex = text.indexOf('function IeltsDrill');
const mistakeIndex = text.indexOf('function MistakeDrill');
const writingIndex = text.indexOf('// --- WRITING ANALYZER (IELTS BAND 8) ---');
const exportIndex = text.indexOf('export default App;');

if (ieltsIndex !== -1 && mistakeIndex !== -1 && writingIndex !== -1 && exportIndex !== -1) {
  const part1 = text.substring(0, ieltsIndex);
  const part2 = text.substring(mistakeIndex, writingIndex);
  const part3 = text.substring(exportIndex);
  
  let newText = part1 + part2 + part3;

  newText = newText.replace(/import dictationData from '\.\/dictation\.json';\r?\n/, '');
  newText = newText.replace(/import shadowingData from '\.\/shadowing\.json';\r?\n/, '');
  newText = newText.replace(/import podcastData from '\.\/podcast\.json';\r?\n/, '');
  newText = newText.replace(/import writingData from '\.\/writing_essays\.json';\r?\n/, '');
  newText = newText.replace(/import ieltsData from '\.\/ielts_vocab\.json';\r?\n/, '');

  newText = newText.replace(
    "import { Menu, X, ArrowRight, ArrowLeft, RefreshCw, Zap, Bookmark, Star, BookOpen, Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, PlayCircle, Edit3, Save } from 'lucide-react';",
    "import { Menu, X, ArrowRight, ArrowLeft, RefreshCw, Zap, Bookmark, Star, BookOpen, Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, PlayCircle, Edit3, Save } from 'lucide-react';\nimport { PodcastListening, ShadowingDrill, WritingAnalyzer, DictationDrill, IeltsDrill } from './Features';"
  );

  // Remove Admin Route
  const routeRegex = /<Route path="\/admin" element=\{<DataEditor \/>\} \/>\r?\n?/;
  newText = newText.replace(routeRegex, '');

  // Remove Sidebar Link
  const linkRegex = /<Link to="\/admin" className=\{`sidebar-link \$\{location\.pathname === '\/admin' \? 'active' : ''\}`\}>[\s\S]*?<\/Link>/;
  newText = newText.replace(linkRegex, '');

  fs.writeFileSync(file, newText, 'utf8');
  console.log('App.tsx refactored successfully.');
} else {
  console.log('Could not find all indices!', { ieltsIndex, mistakeIndex, writingIndex, exportIndex });
}
