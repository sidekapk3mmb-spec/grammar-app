const fs = require('fs');
let c = fs.readFileSync('web/src/App.tsx', 'utf8');
c = c.replace('<span>Grammar Base</span>$5</div>$6<button className="btn-icon close-sidebar-btn" onClick={closeSidebar}>$7<XCircle size={20} />$8</button>$9</div>', '<span>Grammar Base</span>\n        </div>\n        <button className="btn-icon close-sidebar-btn" onClick={closeSidebar}>\n          <XCircle size={20} />\n        </button>\n      </div>');
fs.writeFileSync('web/src/App.tsx', c);
