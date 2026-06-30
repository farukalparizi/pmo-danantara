const fs = require('fs');
const file = 'c:/Users/BMPC2024-13/Desktop/pmo/src/danantara-pmo.jsx';
let content = fs.readFileSync(file, 'utf8');

// Reverse Sky Blue to Red
content = content.replace(/#0EA5E9/gi, '#DC2626'); // Sky-500 -> Red-600
content = content.replace(/#0284C7/gi, '#B91C1C'); // Sky-600 -> Red-700
content = content.replace(/#075985/gi, '#7F1D1D'); // Sky-800 -> Red-900
content = content.replace(/#E0F2FE/gi, '#FEE2E2'); // Sky-100 -> Red-100
content = content.replace(/#F0F9FF/gi, '#FEF2F2'); // Sky-50 -> Red-50
content = content.replace(/rgba\(14,165,233/g, 'rgba(220,38,38'); // shadow colors

// Reverse Emerald to Amber for the fresh contrast
content = content.replace(/#10B981/gi, '#F59E0B'); 

// Replace Sidebar Logo with the Danantara Logo image
// Search for the Sidebar header part:
// <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{background:"#F5A623",color:"#DC2626"}}>D</div>
// {sOpen&&<div><div className="text-gray-800 font-bold text-xs">Danantara</div><div className="text-xs" style={{color:"#DC2626"}}>PMO System</div></div>}
const oldLogo = `<div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{background:"#F5A623",color:"#DC2626"}}>D</div>
          {sOpen&&<div><div className="text-gray-800 font-bold text-xs">Danantara</div><div className="text-xs" style={{color:"#DC2626"}}>PMO System</div></div>}`;

const newLogo = `{sOpen ? (
            <img src="/logo.png" alt="Danantara" className="h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{background:"#DC2626",color:"white"}}>D</div>
          )}`;

content = content.replace(oldLogo, newLogo);

fs.writeFileSync(file, content);
