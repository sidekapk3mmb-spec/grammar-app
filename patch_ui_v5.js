const fs = require('fs');
const path = require('path');

// 1. Fix App.tsx wrong CSS variables
const appPath = path.join(__dirname, 'web', 'src', 'App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

// Replace --primary with --accent, and --surface-alt with --accent-light
appCode = appCode.replace(/var\(--primary\)/g, 'var(--accent)');
appCode = appCode.replace(/var\(--surface-alt\)/g, 'var(--accent-light)');
appCode = appCode.replace(/fontFamily: 'monospace'/g, 'fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", color: "var(--accent)"');

fs.writeFileSync(appPath, appCode, 'utf8');

// 2. Overhaul App.css for Minimalist Premium Look
const cssPath = path.join(__dirname, 'web', 'src', 'App.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

cssCode = cssCode.replace(/:root \{[^]+?\}/, `:root {
  --bg: #FDFDFD;
  --surface: #FFFFFF;
  --text: #2D3142;
  --text-muted: #9BA4B5;
  --text-light: #C0C6D4;
  --accent: #2563EB;
  --accent-light: #EFF6FF;
  --accent-hover: #1D4ED8;
  --border: #F1F5F9;
  --border-strong: #E2E8F0;
  --success: #059669;
  --success-bg: #ECFDF5;
  --danger: #DC2626;
  --danger-bg: #FEF2F2;
  --radius: 16px;
  --radius-sm: 8px;
  --shadow-sm: 0 2px 4px rgba(149, 157, 165, 0.05);
  --shadow: 0 8px 24px rgba(149, 157, 165, 0.08);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`);

// Increase padding and font sizes for readability
cssCode = cssCode.replace(/\.content-box \{[^]+?\}/, `.content-box {
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 3rem;
  box-shadow: var(--shadow-sm);
}`);

cssCode = cssCode.replace(/\.sidebar \{[^]+?\}/, `.sidebar {
  width: 320px;
  background: var(--bg);
  border-right: 1px solid var(--border-strong);
  display: flex;
  flex-direction: column;
  height: 100%;
}`);

fs.writeFileSync(cssPath, cssCode, 'utf8');

// 3. Remove index.css body font override
const indexCssPath = path.join(__dirname, 'web', 'src', 'index.css');
if (fs.existsSync(indexCssPath)) {
    let indexCss = fs.readFileSync(indexCssPath, 'utf8');
    indexCss = indexCss.replace(/font: 18px\/145% var\(--sans\);/, '/* font overridden by App.css */');
    fs.writeFileSync(indexCssPath, indexCss, 'utf8');
}

console.log("Premium Minimalist UI applied.");
