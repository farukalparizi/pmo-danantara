const fs = require('fs');
const file = 'c:/Users/BMPC2024-13/Desktop/pmo/src/danantara-pmo.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Shadows and rounded corners (Bento Box style)
content = content.replace(/const SH\s*=\s*\{[^}]+\};/g, 'const SH = {boxShadow:"0 4px 20px rgba(0,0,0,.04)", borderRadius:"20px", border:"1px solid rgba(0,0,0,.03)", background:"#FFFFFF"};');
content = content.replace(/const SH2\s*=\s*\{[^}]+\};/g, 'const SH2 = {boxShadow:"0 12px 40px -8px rgba(14,165,233,.20)", borderRadius:"24px", border:"1px solid rgba(255,255,255,.4)"};');
content = content.replace(/rounded-xl/g, 'rounded-2xl');
content = content.replace(/rounded-lg/g, 'rounded-xl');

// 2. Primary Theme colors (Red -> Sky Blue)
content = content.replace(/#DC2626/gi, '#0EA5E9');
content = content.replace(/#B91C1C/gi, '#0284C7');
content = content.replace(/#7F1D1D/gi, '#075985');

// 3. Main app layout (Sidebar & Header)
content = content.replace(/background:"#EEF2F7"/g, 'background:"#F8FAFC"');
content = content.replace(/linear-gradient\(180deg,#1C1917,#0C0A09\)/g, 'rgba(255,255,255,0.7)');
content = content.replace(/borderColor:"#292524"/g, 'borderColor:"rgba(0,0,0,0.06)"');
content = content.replace(/color:"#1C1917"/g, 'color:"#0EA5E9"'); // Logo 'D' text -> Blue
content = content.replace(/background:"#292524",color:"white"/g, 'background:"#F1F5F9",color:"#334155"');
content = content.replace(/background:view===item\.id\?"#991B1B":"transparent"/g, 'background:view===item.id?"#E0F2FE":"transparent"');
content = content.replace(/color:view===item\.id\?"#FFFFFF":"#FCA5A5"/g, 'color:view===item.id?"#0284C7":"#64748B"');
content = content.replace(/color:"#FCA5A5"/g, 'color:"#0EA5E9"');
content = content.replace(/text-white font-bold text-xs/g, 'text-gray-800 font-bold text-xs');
content = content.replace(/backdropFilter:"blur\(2px\)"/g, 'backdropFilter:"blur(12px)"');

// Update sidebar class to include backdrop-blur
content = content.replace(/className="flex flex-col flex-shrink-0 transition-all duration-200"/, 'className="flex flex-col flex-shrink-0 transition-all duration-200 backdrop-blur-xl border-r border-gray-100"');

// Update gradients
content = content.replace(/linear-gradient\(120deg,#1C1917 0%,#991B1B 60%,#0EA5E9 100%\)/g, 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)');
content = content.replace(/linear-gradient\(120deg,#1C1917 0%,#991B1B 60%,#EF4444 100%\)/g, 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)');
content = content.replace(/linear-gradient\(120deg,#1C1917,#991B1B 60%,#0EA5E9\)/g, 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)');

fs.writeFileSync(file, content);
