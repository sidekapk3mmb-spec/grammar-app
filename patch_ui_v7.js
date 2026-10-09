const fs = require('fs');

let css = fs.readFileSync('web/src/App.css', 'utf8');

// Replace Root variables for elegant timeless design (monochrome base + clean accent)
css = css.replace(
  /:root \{[\s\S]*?\}/,
  `:root {
  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --text: #171717;
  --text-muted: #525252;
  --text-light: #A3A3A3;
  --accent: #000000;
  --accent-light: #F5F5F5;
  --accent-hover: #404040;
  --border: #E5E5E5;
  --border-strong: #D4D4D4;
  --success: #16A34A;
  --success-bg: #F0FDF4;
  --danger: #DC2626;
  --danger-bg: #FEF2F2;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}`
);

// Append mobile layout classes at the end of the file
const mobileCSS = `
/* Mobile & Responsive */
.mobile-header {
  display: none;
}

.sidebar-backdrop {
  display: none;
}

.close-sidebar-btn {
  display: none;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 40;
  }
  
  .mobile-header-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 45;
    backdrop-filter: blur(2px);
  }

  .close-sidebar-btn {
    display: block;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 1rem;
  }
  
  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .unit-main-title {
    font-size: 1.75rem;
  }

  .content-box {
    padding: 1.5rem;
  }
  
  .tabs {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .flashcard {
    padding: 2rem 1rem;
    min-height: auto;
  }
}
`;

fs.writeFileSync('web/src/App.css', css + '\\n' + mobileCSS);
console.log("App.css patched!");
