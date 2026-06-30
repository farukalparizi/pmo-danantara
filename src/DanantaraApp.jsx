import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Projects from './components/Projects';
import CostEVM from './components/CostEVM';
import Risk from './components/Risk';
import { IP, IA } from './data/mockData';
import { TODAY, fmtD } from './utils/helpers';
import './index.css';

export default function App(){
  const [viewState, setViewState] = useState(window.location.hash.replace('#', '') || "dashboard");
  useEffect(() => {
    const onHashChange = () => setViewState(window.location.hash.replace('#', '') || "dashboard");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const setView = (v) => { window.location.hash = v; setViewState(v); };
  const view = viewState;

  const [sOpen,setSOpen]=useState(true);
  const [projs,setProjs]=useState(IP);
  const [acts,setActs]=useState(IA);
  const NAV=[
    {id:"dashboard",ico:"📊",lbl:"Dashboard"},
    {id:"portfolio",ico:"🏢",lbl:"Portfolio"},
    {id:"projects", ico:"📋",lbl:"Proyek"},
    {id:"cost",     ico:"💰",lbl:"Biaya & EVM"},
    {id:"risk",     ico:"⚠️",lbl:"Risiko & Isu"},
    {id:"reports",  ico:"📈",lbl:"Laporan"},
    {id:"admin",    ico:"⚙️",lbl:"Administrasi"},
  ];
  const cur=NAV.find(n=>n.id===view)||NAV[0];
  const render=()=>{
    if(view==="dashboard") return <Dashboard setView={setView}/>;
    if(view==="portfolio") return <Portfolio/>;
    if(view==="projects")  return <Projects projs={projs} setProjs={setProjs} acts={acts} setActs={setActs}/>;
    if(view==="cost")      return <CostEVM projs={projs} acts={acts}/>;
    if(view==="risk")      return <Risk projs={projs}/>;
    return <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-200"><div className="text-4xl mb-3">🚧</div><p className="font-semibold text-gray-700">Modul {cur.lbl} dalam Pengembangan</p></div>;
  };
  return (
    <div className="flex h-screen overflow-hidden" style={{fontFamily:"system-ui,-apple-system,sans-serif",background:"#F8FAFC"}}>
      <aside className="flex flex-col flex-shrink-0 transition-all duration-200 backdrop-blur-xl border-r border-gray-100" style={{width:sOpen?"205px":"54px",background:"rgba(255,255,255,0.7)"}}>
        <div className="flex items-center gap-2.5 p-3 border-b" style={{borderColor:"rgba(0,0,0,0.06)"}}>
          {sOpen ? (
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Danantara" className="h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{background:"#DC2626",color:"white"}}>D</div>
          )}
        </div>
        {sOpen&&<div className="px-3 py-2 border-b" style={{borderColor:"rgba(0,0,0,0.06)"}}><div className="text-xs font-semibold mb-1" style={{color:"#64748B"}}>PERUSAHAAN</div>
          <select className="w-full text-xs rounded-xl px-2 py-1.5 border-0 font-medium" style={{background:"#F1F5F9",color:"#334155"}}><option>Semua BUMN</option>{[...new Set(projs.map(p=>p.co))].map(c=><option key={c}>{c}</option>)}</select></div>}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV.map(item=>(<button key={item.id} onClick={()=>setView(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors relative" style={{background:view===item.id?"#FEE2E2":"transparent",color:view===item.id?"#B91C1C":"#64748B"}}>
            {view===item.id&&<div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{background:"#F5A623"}}></div>}
            <span className="text-base flex-shrink-0">{item.ico}</span>{sOpen&&<span className="text-xs font-medium truncate">{item.lbl}</span>}</button>))}
        </nav>
        <button onClick={()=>setSOpen(!sOpen)} className="p-3 text-xs text-center border-t" style={{borderColor:"rgba(0,0,0,0.06)",color:"#DC2626"}}>{sOpen?"◀ Tutup":"▶"}</button>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between" style={{boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
          <div><h1 className="font-bold text-gray-800 text-sm">{cur.ico} {cur.lbl}</h1><p className="text-xs text-gray-400">Danantara PMO System · {fmtD(TODAY)}</p></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border" style={{background:"#F0FDF4",borderColor:"#BBF7D0",color:"#15803D"}}><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>Live</div>
            <button onClick={()=>setView("risk")} className="text-xs px-2 py-1 rounded-xl" style={{background:"#FEF2F2",color:"#DC2626"}}>🔔 3 Alert</button>
            <button onClick={()=>setView("projects")} className="text-xs text-white px-3 py-1.5 rounded-xl font-medium" style={{background:"#DC2626"}}>+ Proyek</button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background:"#F5A623",color:"#DC2626"}}>DA</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{render()}</main>
      </div>
    </div>
  );
}