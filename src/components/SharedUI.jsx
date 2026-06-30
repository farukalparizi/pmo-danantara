import React from 'react';

export const BCF = {"on-track":["#DCFCE7","#15803D","On Track"],"at-risk":["#FEF3C7","#92400E","At Risk"],"delayed":["#FEE2E2","#991B1B","Delayed"]};
export function Badge({st}){ const [bg,c,lb]=BCF[st]||BCF["on-track"]; return <span className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{background:bg,color:c}}>{lb}</span>; }
export function PBar({v,h="h-1.5",col}){ const c=col||(v>=80?"#16A34A":v>=40?"#F59E0B":"#EF4444"); return <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${h}`}><div className="h-full rounded-full transition-all" style={{width:`${Math.min(100,v)}%`,background:c}}></div></div>; }
export const TIC={summary:"📁",task:"📌",milestone:"🔷"};
export const TCL={summary:"#7F1D1D",task:"#EF4444",milestone:"#7C3AED"};
export const calcProg = acts => { const t=acts.filter(a=>a.tp==="task"); return t.length?Math.round(t.reduce((s,a)=>s+a.p,0)/t.length):0; };

/* EVM calc helper */
export function evmCalc(bac, ac, pct){
  const ev = bac * pct/100;
  const cv = ev - ac;
  const cpi = ac>0 ? ev/ac : 1;
  const eac = cpi>0 ? bac/cpi : bac;
  const vac = bac - eac;
  return {ev, cv, cpi, eac, vac};
}

/* ════════════ MODALS ════════════ */
export function Modal({title,sub,children,onClose,w="480px",accent="#DC2626"}){
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background:"rgba(28,25,23,.55)",backdropFilter:"blur(12px)"}}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{width:w,maxHeight:"92vh"}}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-start" style={{borderTop:`3px solid ${accent}`,borderRadius:"16px 16px 0 0"}}>
          <div><h3 className="font-bold text-gray-800">{title}</h3>{sub&&<p className="text-xs text-gray-400 mt-0.5">{sub}</p>}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
export const Inp = ({label,...p}) => (
  <div><label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-red-400 focus:outline-none" {...p}/></div>
);
export const Sel = ({label,children,...p}) => (
  <div><label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
    <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-red-400 focus:outline-none bg-white" {...p}>{children}</select></div>
);

/* ─── Add Project ─── */