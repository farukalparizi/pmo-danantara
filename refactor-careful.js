const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/BMPC2024-13/Desktop/pmo/src';
const mainFile = path.join(srcDir, 'danantara-pmo.jsx');
const content = fs.readFileSync(mainFile, 'utf8');

// Ensure directories exist
['components', 'data', 'utils'].forEach(dir => {
  const p = path.join(srcDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p);
});

// Helper function to extract a block between two strings
function extractBlock(content, startStr, endStr) {
  const start = content.indexOf(startStr);
  if (start === -1) throw new Error(`Could not find start string: ${startStr}`);
  const end = endStr ? content.indexOf(endStr, start) : content.length;
  if (end === -1) throw new Error(`Could not find end string: ${endStr}`);
  return content.slice(start, end).trim();
}

// 1. Extract Helpers
let helpers = extractBlock(content, 'const TODAY = "2025-06-29";', '/* ════════════ DATA: PROJECTS ════════════ */');
helpers += '\n' + extractBlock(content, 'const projProg = (acts,pid)', 'function Projects({');
helpers = helpers.replace(/const /g, 'export const ');
fs.writeFileSync(path.join(srcDir, 'utils', 'helpers.js'), helpers);

// 2. Extract Data
let mockData = extractBlock(content, 'const IP = [', '/* ════════════ COMPANY PORTFOLIO ════════════ */');
mockData += '\n' + extractBlock(content, 'const COS_PF = [', 'const BCF =');
mockData = mockData.replace(/const /g, 'export const ');
fs.writeFileSync(path.join(srcDir, 'data', 'mockData.js'), mockData);

// 3. Extract SharedUI
let sharedUI = extractBlock(content, 'const BCF =', 'function AddProjModal');
sharedUI = sharedUI.replace(/const BCF/g, 'export const BCF');
sharedUI = sharedUI.replace(/function Badge/g, 'export function Badge');
sharedUI = sharedUI.replace(/function PBar/g, 'export function PBar');
sharedUI = sharedUI.replace(/const TIC/g, 'export const TIC');
sharedUI = sharedUI.replace(/const TCL/g, 'export const TCL');
sharedUI = sharedUI.replace(/const calcProg/g, 'export const calcProg');
sharedUI = sharedUI.replace(/function evmCalc/g, 'export function evmCalc');
sharedUI = sharedUI.replace(/function Modal/g, 'export function Modal');
sharedUI = sharedUI.replace(/const Inp/g, 'export const Inp');
sharedUI = sharedUI.replace(/const Sel/g, 'export const Sel');

const sharedUIImports = `import React from 'react';\n\n`;
fs.writeFileSync(path.join(srcDir, 'components', 'SharedUI.jsx'), sharedUIImports + sharedUI);

// Recharts all imports for simplicity and avoiding no-undef (warnings are fine)
const rechartsImports = `import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";`;

// 4. Extract Projects
let projectsCode = extractBlock(content, 'function AddProjModal', 'const SCURVE=');
projectsCode = projectsCode.replace('function Projects', 'export default function Projects');
const projImports = `import React, { useState } from 'react';\nimport { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';\nimport { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';\nimport { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';\nimport { exportToPDF, exportToExcel } from '../utils/exportData';\n${rechartsImports}\n\n`;
fs.writeFileSync(path.join(srcDir, 'components', 'Projects.jsx'), projImports + projectsCode);

// 5. Extract Dashboard
let dashStartStr = 'const SCURVE=';
let dashCode = extractBlock(content, dashStartStr, 'function Portfolio');
dashCode = dashCode.replace('function Dashboard', 'export default function Dashboard');
const dashImports = `import React, { useState } from 'react';\nimport { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';\nimport { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';\nimport { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';\nimport { exportToPDF, exportToExcel } from '../utils/exportData';\n${rechartsImports}\n\n`;
fs.writeFileSync(path.join(srcDir, 'components', 'Dashboard.jsx'), dashImports + dashCode);

// 6. Extract Portfolio
let portCode = extractBlock(content, 'function Portfolio', 'function CostEVM');
portCode = portCode.replace('function Portfolio', 'export default function Portfolio');
const portImports = `import React, { useState } from 'react';\nimport { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';\nimport { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';\nimport { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';\n${rechartsImports}\n\n`;
fs.writeFileSync(path.join(srcDir, 'components', 'Portfolio.jsx'), portImports + portCode);

// 7. Extract CostEVM
let costCode = extractBlock(content, 'function CostEVM', 'const rCol=');
costCode = costCode.replace('function CostEVM', 'export default function CostEVM');
const costImports = `import React, { useState } from 'react';\nimport { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';\nimport { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';\nimport { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';\n${rechartsImports}\n\n`;
fs.writeFileSync(path.join(srcDir, 'components', 'CostEVM.jsx'), costImports + costCode);

// 8. Extract Risk
let riskCode = extractBlock(content, 'const rCol=', 'export default function App()');
riskCode = riskCode.replace('function Risk', 'export default function Risk');
const riskImports = `import React, { useState } from 'react';\nimport { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';\nimport { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';\nimport { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';\n${rechartsImports}\n\n`;
fs.writeFileSync(path.join(srcDir, 'components', 'Risk.jsx'), riskImports + riskCode);

// 9. Create App.jsx
let appCode = extractBlock(content, 'export default function App()', '');
const appImports = `import React, { useState, useEffect } from 'react';\nimport Dashboard from './components/Dashboard';\nimport Portfolio from './components/Portfolio';\nimport Projects from './components/Projects';\nimport CostEVM from './components/CostEVM';\nimport Risk from './components/Risk';\nimport { IP, IA } from './data/mockData';\nimport { TODAY, fmtD } from './utils/helpers';\nimport './index.css';\n\n`;
fs.writeFileSync(path.join(srcDir, 'App.jsx'), appImports + appCode);

console.log('Careful refactoring complete!');
