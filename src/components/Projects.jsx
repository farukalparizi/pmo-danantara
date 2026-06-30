import React, { useState } from 'react';
import { pd, fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, uid, projProg, projSpiCpi } from '../utils/helpers';
import { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';
import { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';
import { exportToPDF, exportToExcel } from '../utils/exportData';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";

function AddProjModal({onSave,onClose}){
  const COS=["Pertamina","PLN","MIND ID","Hutama Karya","Waskita Karya","INALUM","Pelindo","Jasa Marga"];
  const [f,setF]=useState({code:"",name:"",co:COS[0],start:TODAY,end:addD(TODAY,180),bud:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title="🏗️ Tambah Proyek Baru" sub="Input oleh perusahaan di bawah Danantara" onClose={onClose}>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3"><Inp label="Kode Proyek *" placeholder="PTM-003" value={f.code} onChange={e=>s("code",e.target.value)}/>
          <Sel label="Perusahaan" value={f.co} onChange={e=>s("co",e.target.value)}>{COS.map(c=><option key={c}>{c}</option>)}</Sel></div>
        <Inp label="Nama Proyek *" placeholder="Nama proyek..." value={f.name} onChange={e=>s("name",e.target.value)}/>
        <div className="grid grid-cols-3 gap-3">
          <Inp label="Mulai" type="date" value={f.start} onChange={e=>s("start",e.target.value)}/>
          <Inp label="Selesai" type="date" value={f.end} onChange={e=>s("end",e.target.value)}/>
          <Inp label="Anggaran (M)" type="number" placeholder="5000" value={f.bud} onChange={e=>s("bud",e.target.value)}/>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
        <button onClick={()=>{if(!f.code||!f.name)return alert("Kode & Nama wajib diisi");onSave({...f,id:uid(),st:"on-track",bud:+f.bud||0});}}
          className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{background:"#DC2626"}}>Simpan Proyek</button>
      </div>
    </Modal>
  );
}

/* ─── Add Activity ─── */
function AddActModal({proj,onSave,onClose}){
  const [f,setF]=useState({wbs:"",nm:"",lv:2,tp:"task",s:proj.start,d:10,e:addD(proj.start,10),p:0,pr:"",cr:false,res:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <Modal title="+ Tambah Aktivitas / WBS" sub={proj.name} onClose={onClose} w="540px" accent="#22C55E">
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3"><Inp label="WBS Code *" placeholder="3.4" value={f.wbs} onChange={e=>s("wbs",e.target.value)}/>
          <Sel label="Tipe" value={f.tp} onChange={e=>s("tp",e.target.value)}><option value="task">📌 Task</option><option value="summary">📁 Summary</option><option value="milestone">🔷 Milestone</option></Sel></div>
        <Inp label="Nama Aktivitas *" placeholder="Nama aktivitas..." value={f.nm} onChange={e=>s("nm",e.target.value)}/>
        <div className="grid grid-cols-3 gap-3">
          <Inp label="Mulai" type="date" value={f.s} onChange={e=>{s("s",e.target.value);s("e",addD(e.target.value,f.d));}}/>
          <Inp label="Durasi (hari)" type="number" min="0" value={f.d} onChange={e=>{const n=+e.target.value;s("d",n);s("e",addD(f.s,n));}}/>
          <Inp label="Selesai" type="date" value={f.e} onChange={e=>{s("e",e.target.value);s("d",dif(f.s,e.target.value));}}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Inp label="Progress Awal (%)" type="number" min="0" max="100" value={f.p} onChange={e=>s("p",+e.target.value)}/>
          <Inp label="Penanggung Jawab" placeholder="Nama / role" value={f.res} onChange={e=>s("res",e.target.value)}/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Inp label="Pendahulu (ID)" placeholder="A06,A07" value={f.pr} onChange={e=>s("pr",e.target.value)}/>
          <Sel label="Level" value={f.lv} onChange={e=>s("lv",+e.target.value)}><option value={1}>Level 1</option><option value={2}>Level 2</option><option value={3}>Level 3</option></Sel>
          <Sel label="Jalur Kritis" value={String(f.cr)} onChange={e=>s("cr",e.target.value==="true")}><option value="false">Normal</option><option value="true">Critical</option></Sel>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
        <button onClick={()=>{if(!f.wbs||!f.nm)return alert("WBS & Nama wajib diisi");onSave({...f,id:uid(),pid:proj.id,d:dif(f.s,f.e)});}}
          className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{background:"#22C55E"}}>Simpan</button>
      </div>
    </Modal>
  );
}

/* ─── Update Progress ─── */
function ProgModal({act,onSave,onClose}){
  const [prog,setProg]=useState(act.p); const [note,setNote]=useState("");
  const col=prog>=80?"#16A34A":prog>=40?"#F59E0B":"#EF4444";
  return (
    <Modal title="📊 Update Progress Pekerjaan" sub={`${act.wbs} · ${act.nm}`} onClose={onClose} w="430px" accent="#22C55E">
      <div className="p-5 space-y-4">
        <div className="text-center">
          <div className="text-5xl font-extrabold" style={{color:col}}>{prog}<span className="text-2xl">%</span></div>
        </div>
        <input type="range" min="0" max="100" value={prog} onChange={e=>setProg(+e.target.value)} className="w-full cursor-pointer" style={{accentColor:col}}/>
        <PBar v={prog} h="h-3" col={col}/>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl p-2.5 text-center" style={{background:"#F8FAFC"}}><div className="text-gray-400">Sebelumnya</div><div className="font-bold text-gray-600 text-lg">{act.p}%</div></div>
          <div className="rounded-xl p-2.5 text-center" style={{background:"#F8FAFC"}}><div className="text-gray-400">Perubahan</div><div className="font-bold text-lg" style={{color:prog>=act.p?"#16A34A":"#EF4444"}}>{prog>=act.p?"+":""}{prog-act.p}%</div></div>
        </div>
        <div><label className="text-xs font-semibold text-gray-500 block mb-1">Catatan / Kendala</label>
          <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:border-red-400 focus:outline-none" placeholder="Perkembangan, kendala, rencana..." value={note} onChange={e=>setNote(e.target.value)}/></div>
        <div className="text-xs text-gray-400">Update oleh: Admin Perusahaan · {fmtD(TODAY)}</div>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
        <button onClick={()=>onSave(prog)} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{background:"#22C55E"}}>Simpan Update</button>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════
   GANTT CHART (Primavera-style)
════════════════════════════════════════════════ */
function GanttChart({proj,myActs}){
  const CW=900, RH=30, LW=300;
  const total=Math.max(1,dif(proj.start,proj.end));
  const todayPx=Math.max(0,Math.min(CW,dif(proj.start,TODAY)/total*CW));
  const px=date=>Math.max(0,dif(proj.start,date)/total*CW);

  // months
  const months=[]; { let d=pd(proj.start),y=d.getFullYear(),m=d.getMonth();
    for(let i=0;i<40;i++){ const ms=`${y}-${String(m+1).padStart(2,"0")}-01`; const lx=Math.max(0,px(ms)); if(lx>=CW)break;
      let nm=m+1,ny=y; if(nm>11){nm=0;ny++;} const rx=Math.min(CW,px(`${ny}-${String(nm+1).padStart(2,"0")}-01`));
      months.push({lbl:`${MO[m]} ${String(y).slice(2)}`,short:MO[m],lx,w:rx-lx}); m=nm;y=ny; } }

  const getBar=a=>{ const lx=px(a.s); const rw=a.tp==="milestone"?0:Math.max(4,(dif(proj.start,a.e)-dif(proj.start,a.s))/total*CW); return {lx,rw}; };

  // dependency arrows
  const arrows=[];
  myActs.forEach((a,ri)=>{ if(!a.pr)return; a.pr.split(",").map(x=>x.trim()).filter(Boolean).forEach(pid=>{
    const pa=myActs.find(x=>x.id===pid); if(!pa)return; const pi=myActs.indexOf(pa);
    const {lx:plx,rw:pw}=getBar(pa); const {lx:slx}=getBar(a);
    arrows.push({key:`${a.id}-${pid}`,x1:plx+pw,y1:pi*RH+RH/2,x2:slx,y2:ri*RH+RH/2,mx:plx+pw+12}); }); });

  const totalH=myActs.length*RH;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={SH}>
      <div className="p-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2" style={{background:"linear-gradient(90deg,#F8FAFC,#FEF2F2)"}}>
        <div><span className="font-bold text-sm text-gray-800">{proj.name}</span>
          <span className="text-xs text-gray-400 ml-2">Gantt Chart · {fmtD(proj.start)} → {fmtD(proj.end)}</span></div>
        <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1"><div className="w-4 h-2.5 rounded-sm border border-red-400" style={{background:"#FCA5A5"}}></div>Kritis</span>
          <span className="flex items-center gap-1"><div className="w-4 h-2.5 rounded-sm border border-red-400" style={{background:"#FCA5A5"}}></div>Normal</span>
          <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rotate-45" style={{background:"#7C3AED"}}></div>Milestone</span>
          <span className="flex items-center gap-1"><div className="w-3 border-t-2 border-dashed border-gray-400"></div>Relasi</span>
          <span className="flex items-center gap-1"><div className="w-0.5 h-3 bg-red-500"></div>Hari ini</span>
        </div>
      </div>
      <div className="flex overflow-x-auto">
        {/* Left */}
        <div style={{width:`${LW}px`,flexShrink:0,borderRight:"2px solid #E5E7EB"}}>
          <div className="grid border-b border-gray-200 font-semibold text-xs text-gray-500" style={{height:"40px",background:"#F1F5F9",gridTemplateColumns:"1fr 52px 38px",alignItems:"center"}}>
            <div className="px-2">WBS · Aktivitas</div><div className="text-center">Durasi</div><div className="text-center">%</div>
          </div>
          {myActs.map(a=>(
            <div key={a.id} className="grid items-center border-b" style={{height:`${RH}px`,borderColor:"#F1F5F9",background:a.tp==="summary"?"#F8FAFC":"white",gridTemplateColumns:"1fr 52px 38px"}}>
              <div className="flex items-center px-2 overflow-hidden" style={{paddingLeft:`${8+(a.lv-1)*14}px`}}>
                <span className="text-xs mr-1 flex-shrink-0">{TIC[a.tp]}</span>
                <span className={`text-xs truncate ${a.tp==="summary"?"font-bold text-gray-800":"text-gray-700"} ${a.cr?"text-red-700":""}`} title={`${a.wbs} ${a.nm} · ${a.res}`}>{a.wbs} {a.nm}</span>
              </div>
              <div className="text-center text-xs text-gray-500">{a.tp==="milestone"?"0":a.d}h</div>
              <div className="text-center text-xs font-bold" style={{color:a.p>=80?"#16A34A":a.p>=40?"#F59E0B":a.p>0?"#EF4444":"#CBD5E1"}}>{a.p}</div>
            </div>
          ))}
        </div>
        {/* Right */}
        <div style={{overflowX:"auto",flexGrow:1}}>
          <div style={{width:`${CW}px`,minWidth:`${CW}px`}}>
            <div className="relative border-b border-gray-200" style={{height:"40px",background:"#F1F5F9"}}>
              {months.map((m,i)=>(<div key={i} className="absolute top-0 bottom-0 flex items-center justify-center border-r border-gray-200 overflow-hidden" style={{left:`${m.lx}px`,width:`${m.w}px`,fontSize:"10px",color:"#6B7280",fontWeight:600}}>{m.w>50?m.lbl:m.w>26?m.short:""}</div>))}
            </div>
            <div style={{position:"relative",height:`${totalH}px`}}>
              {myActs.map((a,i)=>(<div key={a.id} className="absolute w-full border-b" style={{top:`${i*RH}px`,height:`${RH}px`,borderColor:"#F1F5F9",background:a.tp==="summary"?"#FAFAFA":"white"}}></div>))}
              {months.map((m,i)=>(<div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{left:`${m.lx}px`}}></div>))}
              <div className="absolute top-0 bottom-0 z-20" style={{left:`${todayPx}px`,width:"2px",background:"#EF4444",opacity:.85}}></div>
              <div className="absolute z-20 font-bold px-1 rounded" style={{left:`${todayPx+3}px`,top:"3px",background:"#EF4444",color:"white",fontSize:"8px"}}>Hari ini</div>
              <svg style={{position:"absolute",top:0,left:0,width:CW,height:totalH,pointerEvents:"none",zIndex:15}}>
                <defs><marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#94A3B8"/></marker></defs>
                {arrows.map(a=>(<path key={a.key} d={`M${a.x1},${a.y1} H${a.mx} V${a.y2} H${a.x2-3}`} fill="none" stroke="#94A3B8" strokeWidth="1.4" strokeDasharray="4,2" markerEnd="url(#ah)"/>))}
              </svg>
              {myActs.map((a,i)=>{
                const {lx,rw}=getBar(a); const bh=a.tp==="summary"?13:10; const by=i*RH+(RH-bh)/2;
                const col=a.cr?"#EF4444":a.tp==="summary"?"#1E40AF":"#EF4444";
                if(a.tp==="milestone"){const ms=8;return <div key={a.id} title={`${a.wbs} ${a.nm}\n${fmtD(a.s)}`} style={{position:"absolute",top:`${i*RH+RH/2-ms}px`,left:`${lx-ms}px`,width:`${ms*2}px`,height:`${ms*2}px`,background:"#7C3AED",transform:"rotate(45deg)",zIndex:12,cursor:"pointer",boxShadow:"0 1px 3px rgba(124,58,237,.4)"}}></div>;}
                if(a.tp==="summary"){return (<div key={a.id} style={{position:"absolute",top:`${by}px`,left:`${lx}px`,width:`${rw}px`,height:`${bh}px`,zIndex:12}}>
                  <div style={{height:"7px",background:col,borderRadius:"2px",position:"relative"}}>
                    <div style={{width:`${a.p}%`,height:"100%",background:"#0F172A",borderRadius:"2px 0 0 2px",opacity:.35}}></div></div>
                  <div style={{position:"absolute",left:0,top:"6px",width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",borderTop:`6px solid ${col}`}}></div>
                  <div style={{position:"absolute",right:0,top:"6px",width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",borderTop:`6px solid ${col}`}}></div>
                </div>);}
                const pw=Math.max(0,Math.min(rw,rw*(a.p/100)));
                return (<div key={a.id} title={`${a.wbs} ${a.nm}\nMulai: ${fmtD(a.s)}\nSelesai: ${fmtD(a.e)}\nDurasi: ${a.d} hari\nProgress: ${a.p}%\nPIC: ${a.res}`}
                  style={{position:"absolute",top:`${by}px`,left:`${lx}px`,width:`${rw}px`,height:`${bh}px`,background:`${col}26`,border:`1.5px solid ${col}99`,borderRadius:"3px",zIndex:12,overflow:"hidden",cursor:"pointer"}}>
                  <div style={{width:`${pw}px`,height:"100%",background:`${col}DD`,borderRadius:"2px 0 0 2px"}}></div>
                  {rw>34&&<span style={{position:"absolute",top:"50%",left:"4px",transform:"translateY(-50%)",fontSize:"8px",color:"#fff",fontWeight:"bold",mixBlendMode:"difference"}}>{a.p}%</span>}
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Critical path note */}
      <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500 flex-wrap" style={{background:"#FEF9F9"}}>
        <span className="font-semibold text-red-600">🔴 Critical Path:</span>
        <span>{myActs.filter(a=>a.cr&&a.tp==="task").map(a=>a.wbs).join(" → ")||"—"}</span>
        <span className="ml-auto text-gray-400">Float = 0 pada jalur kritis · keterlambatan langsung berdampak ke COD</span>
      </div>
    </div>
  );
}

/* ════════════ WBS TABLE EDITOR ════════════ */
function WBSTable({proj,myActs,setActs}){
  const [editId,setEditId]=useState(null); const [ed,setEd]=useState({});
  const [showAdd,setShowAdd]=useState(false); const [progAct,setProgAct]=useState(null);
  const e=(k,v)=>setEd(p=>({...p,[k]:v}));
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">{myActs.length} aktivitas · <span className="text-red-600 font-semibold">● kritis</span> · klik ✏️ edit · 📊 update progress</p>
        <button onClick={()=>setShowAdd(true)} className="text-xs text-white px-3 py-1.5 rounded-xl font-medium shadow-sm" style={{background:"#22C55E"}}>+ Tambah Aktivitas</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={SH}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{minWidth:"900px"}}>
            <thead><tr style={{background:"#F1F5F9"}}>{["ID","WBS","Nama Aktivitas","Tipe","PIC","Mulai","Selesai","Dur","Progress","Pred","Aksi"].map((h,i)=>(<th key={i} className={`p-2.5 font-semibold text-gray-500 whitespace-nowrap ${i<3?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
            <tbody>
              {myActs.map(a=>{ const isE=editId===a.id; const pc=a.p>=80?"#16A34A":a.p>=40?"#F59E0B":"#EF4444";
                return (<tr key={a.id} className={`border-t transition-colors ${isE?"bg-red-50":a.tp==="summary"?"bg-gray-50/70":""} hover:bg-red-50/30`} style={{borderColor:"#F1F5F9"}}>
                  <td className="p-2 font-mono text-gray-400 text-center">{a.id}</td>
                  <td className="p-2 font-mono font-bold" style={{color:a.cr?"#DC2626":"#6B7280"}}>{isE?<input className="border rounded px-1 py-0.5 w-12" value={ed.wbs} onChange={ev=>e("wbs",ev.target.value)}/>:a.wbs}</td>
                  <td className="p-2" style={{paddingLeft:`${8+(a.lv-1)*14}px`}}><div className="flex items-center gap-1.5">
                    <span className="flex-shrink-0">{TIC[a.tp]}</span>
                    {isE?<input className="border rounded px-1.5 py-0.5 w-44 font-medium" value={ed.nm} onChange={ev=>e("nm",ev.target.value)}/>:<span className={`${a.tp==="summary"?"font-bold text-gray-800":"font-medium text-gray-700"} ${a.cr?"text-red-700":""}`}>{a.nm}</span>}
                    {a.cr&&!isE&&<span className="text-red-500">●</span>}</div></td>
                  <td className="p-2 text-center">{isE?<select className="border rounded px-1 py-0.5" value={ed.tp} onChange={ev=>e("tp",ev.target.value)}><option value="task">task</option><option value="summary">summary</option><option value="milestone">milestone</option></select>:<span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{background:`${TCL[a.tp]}18`,color:TCL[a.tp]}}>{a.tp}</span>}</td>
                  <td className="p-2 text-center text-gray-500">{isE?<input className="border rounded px-1 py-0.5 w-20" value={ed.res} onChange={ev=>e("res",ev.target.value)}/>:a.res}</td>
                  <td className="p-2 text-center whitespace-nowrap">{isE?<input type="date" className="border rounded px-1 py-0.5" value={ed.s} onChange={ev=>{e("s",ev.target.value);e("e",addD(ev.target.value,ed.d||1));}}/>:<span className="text-gray-600">{fmtD(a.s)}</span>}</td>
                  <td className="p-2 text-center whitespace-nowrap">{isE?<input type="date" className="border rounded px-1 py-0.5" value={ed.e} onChange={ev=>{e("e",ev.target.value);e("d",dif(ed.s,ev.target.value));}}/>:<span className="text-gray-600">{fmtD(a.e)}</span>}</td>
                  <td className="p-2 text-center">{isE?<input type="number" className="border rounded px-1 py-0.5 w-12 text-center" value={ed.d} min={0} onChange={ev=>{const n=+ev.target.value;e("d",n);e("e",addD(ed.s,n));}}/>:<span className="font-medium text-gray-700">{a.d}h</span>}</td>
                  <td className="p-2">{isE?<input type="number" className="border rounded px-1 py-0.5 w-14 text-center" value={ed.p} min={0} max={100} onChange={ev=>e("p",+ev.target.value)}/>:<div className="flex items-center gap-1.5 min-w-[88px]"><div className="flex-1"><PBar v={a.p} col={pc}/></div><span className="font-bold w-7 text-right" style={{color:pc}}>{a.p}%</span></div>}</td>
                  <td className="p-2 text-center font-mono text-gray-400">{isE?<input className="border rounded px-1 py-0.5 w-16" value={ed.pr} onChange={ev=>e("pr",ev.target.value)}/>:a.pr||"—"}</td>
                  <td className="p-2 text-center"><div className="flex items-center justify-center gap-0.5">
                    {isE?(<><button onClick={()=>{setActs(p=>p.map(x=>x.id===editId?{...x,...ed,d:dif(ed.s,ed.e)}:x));setEditId(null);}} className="px-2 py-1 rounded text-white font-bold" style={{background:"#22C55E"}}>💾</button><button onClick={()=>setEditId(null)} className="px-2 py-1 rounded bg-gray-200 text-gray-600 font-bold">✕</button></>)
                    :(<><button onClick={()=>{setEditId(a.id);setEd({...a});}} className="px-1.5 py-1 rounded hover:bg-red-100" title="Edit">✏️</button>{a.tp!=="summary"&&<button onClick={()=>setProgAct(a)} className="px-1.5 py-1 rounded hover:bg-green-100" title="Update Progress">📊</button>}<button onClick={()=>{if(window.confirm("Hapus aktivitas?"))setActs(p=>p.filter(x=>x.id!==a.id));}} className="px-1.5 py-1 rounded hover:bg-red-100" title="Hapus">🗑️</button></>)}
                  </div></td>
                </tr>);
              })}
              {myActs.length===0&&<tr><td colSpan={11} className="p-8 text-center text-gray-400"><div className="text-3xl mb-2">📋</div><div className="font-medium">Belum ada aktivitas</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showAdd&&<AddActModal proj={proj} onSave={a=>{setActs(p=>[...p,a]);setShowAdd(false);}} onClose={()=>setShowAdd(false)}/>}
      {progAct&&<ProgModal act={progAct} onSave={p2=>{setActs(prev=>prev.map(x=>x.id===progAct.id?{...x,p:p2}:x));setProgAct(null);}} onClose={()=>setProgAct(null)}/>}
    </div>
  );
}

/* ════════════ PROJECT DETAIL ════════════ */
function ProjDetail({proj,acts,setActs,onBack}){
  const [tab,setTab]=useState("wbs");
  const myActs=acts.filter(a=>a.pid===proj.id).sort((a,b)=>a.wbs.localeCompare(b.wbs,undefined,{numeric:true}));
  const prog=calcProg(myActs);
  const totalDays=dif(proj.start,proj.end);
  const timeUsed=Math.round(Math.max(0,dif(proj.start,TODAY))/totalDays*100);
  const spi=proj.spi||(timeUsed>0?(prog/timeUsed):1);
  const done=myActs.filter(a=>a.p===100&&a.tp==="task").length;
  const totalTask=myActs.filter(a=>a.tp==="task").length;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm"><button onClick={onBack} className="text-red-600 hover:underline font-medium">← Daftar Proyek</button><span className="text-gray-300">/</span><span className="text-gray-700 font-semibold truncate">{proj.name}</span></div>
      {/* Hero header with gradient */}
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{background:"linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)",...SH2}}>
        <div className="absolute right-0 top-0 opacity-10 text-9xl">🏗️</div>
        <div className="relative flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{background:"rgba(255,255,255,.2)"}}>{proj.code}</span>
              <Badge st={proj.st}/>
            </div>
            <h2 className="font-bold text-2xl">{proj.name}</h2>
            <p className="text-sm mt-1" style={{color:"#BFDBFE"}}>{proj.co} · Anggaran <b className="text-white">{rp(proj.bud)} M</b></p>
          </div>
          <div className="flex gap-4 text-center">
            {[["Progress",`${prog}%`],["Waktu",`${timeUsed}%`],["Durasi",`${totalDays}h`],["Task",`${done}/${totalTask}`]].map(([l,v],i)=>(
              <div key={i}><div className="text-2xl font-extrabold">{v}</div><div className="text-xs" style={{color:"#DC2626"}}>{l}</div></div>
            ))}
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-3">
          {[
            {l:"Progress Fisik",v:prog,unit:"%",col:"#FBBF24"},
            {l:"SPI (Jadwal)",  v:spi,fmt:x=>x.toFixed(2),col:spi>=1?"#4ADE80":spi>=.9?"#FBBF24":"#F87171"},
            {l:"CPI (Biaya)",   v:proj.cpi||1,fmt:x=>x.toFixed(2),col:(proj.cpi||1)>=1?"#4ADE80":(proj.cpi||1)>=.9?"#FBBF24":"#F87171"},
          ].map((x,i)=>(
            <div key={i} className="rounded-2xl p-3" style={{background:"rgba(255,255,255,.1)"}}>
              <div className="flex justify-between text-xs mb-1.5"><span style={{color:"#BFDBFE"}}>{x.l}</span><span className="font-bold" style={{color:x.col}}>{x.fmt?x.fmt(x.v):x.v+x.unit}</span></div>
              <div className="w-full rounded-full h-1.5 overflow-hidden" style={{background:"rgba(255,255,255,.2)"}}><div className="h-full rounded-full" style={{width:`${x.unit?x.v:Math.min(100,x.v*100)}%`,background:x.col}}></div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[["wbs","📋 WBS & Aktivitas"],["gantt","📅 Gantt Chart"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab===id?"border-red-600 text-red-600":"border-transparent text-gray-500 hover:text-gray-700"}`}>{lbl}</button>
        ))}
      </div>
      {tab==="wbs"?<WBSTable proj={proj} myActs={myActs} setActs={setActs}/>:<GanttChart proj={proj} myActs={myActs}/>}
    </div>
  );
}

/* ════════════ PROJECTS LIST ════════════ */


export default function Projects({projs,setProjs,acts,setActs}){
  const [filCo,setFilCo]=useState("all"); const [view,setView]=useState("card");
  const [selProj,setSelProj]=useState(null); const [showAdd,setShowAdd]=useState(false);
  if(selProj){ const sc=projSpiCpi[selProj.id]||[1,1]; return <ProjDetail proj={{...selProj,spi:sc[0],cpi:sc[1]}} acts={acts} setActs={setActs} onBack={()=>setSelProj(null)}/>; }
  const COS=[...new Set(projs.map(p=>p.co))];
  const filtered=filCo==="all"?projs:projs.filter(p=>p.co===filCo);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[{l:"Total Proyek",v:projs.length,c:"#DC2626",i:"📋",bg:"#FEF2F2"},{l:"On Track",v:projs.filter(p=>p.st==="on-track").length,c:"#16A34A",i:"✅",bg:"#F0FDF4"},{l:"At Risk",v:projs.filter(p=>p.st==="at-risk").length,c:"#D97706",i:"⚠️",bg:"#FFFBEB"},{l:"Delayed",v:projs.filter(p=>p.st==="delayed").length,c:"#DC2626",i:"🔴",bg:"#FEF2F2"}].map((k,i)=>(
          <div key={i} className="bg-white rounded-2xl p-3.5 border border-gray-100 flex items-center gap-3" style={SH}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{background:k.bg}}>{k.i}</div>
            <div><div className="text-xs text-gray-400">{k.l}</div><div className="font-extrabold text-2xl" style={{color:k.c}}>{k.v}</div></div>
          </div>
        ))}
      </div>
      {/* Toolbar */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <select value={filCo} onChange={e=>setFilCo(e.target.value)} className="text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-600 bg-white">
            <option value="all">Semua Perusahaan ({projs.length})</option>{COS.map(c=><option key={c} value={c}>{c} ({projs.filter(p=>p.co===c).length})</option>)}</select>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={()=>setView("card")} className={`px-3 py-2 text-xs font-medium ${view==="card"?"bg-red-600 text-white":"bg-white text-gray-500"}`}>▦ Kartu</button>
            <button onClick={()=>setView("table")} className={`px-3 py-2 text-xs font-medium ${view==="table"?"bg-red-600 text-white":"bg-white text-gray-500"}`}>☰ Tabel</button>
          </div>
        </div>
        <button onClick={()=>setShowAdd(true)} className="text-xs text-white px-4 py-2 rounded-xl font-medium shadow-sm" style={{background:"#DC2626"}}>+ Tambah Proyek</button>
      </div>

      {view==="card"?(
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(p=>{ const pg=projProg(acts,p.id); const sc=projSpiCpi[p.id]||[1,1];
            return (<div key={p.id} onClick={()=>setSelProj(p)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg cursor-pointer transition-all group" style={SH}>
              <div className="h-1.5" style={{background:p.st==="on-track"?"#16A34A":p.st==="at-risk"?"#F59E0B":"#EF4444"}}></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{background:"#FEF2F2",color:"#B91C1C"}}>{p.code}</span>
                  <Badge st={p.st}/>
                </div>
                <h3 className="font-bold text-sm text-gray-800 mb-0.5 group-hover:text-red-600 transition-colors leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{p.co}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progress Fisik</span><span className="font-bold" style={{color:pg>=80?"#16A34A":pg>=40?"#F59E0B":"#EF4444"}}>{pg}%</span></div>
                  <PBar v={pg} h="h-2"/>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {[["SPI",sc[0].toFixed(2),iCol(sc[0])],["CPI",sc[1].toFixed(2),iCol(sc[1])],["Anggaran",`${(p.bud/1000).toFixed(1)}T`,"#475569"]].map(([l,v,c],j)=>(
                    <div key={j} className="rounded-xl p-1.5" style={{background:"#F8FAFC"}}><div className="font-bold text-xs" style={{color:c}}>{v}</div><div className="text-xs text-gray-400" style={{fontSize:"10px"}}>{l}</div></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs mt-3 pt-2 border-t" style={{borderColor:"#F1F5F9",color:"#9CA3AF"}}>
                  <span>{fmtD(p.start)}</span><span>→</span><span>{fmtD(p.end)}</span>
                </div>
              </div>
            </div>);
          })}
        </div>
      ):(
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={SH}>
          <div className="overflow-x-auto"><table className="w-full text-xs" style={{minWidth:"900px"}}>
            <thead><tr style={{background:"#F1F5F9"}}>{["Kode","Nama Proyek","Perusahaan","Mulai","Selesai","Progress","SPI","CPI","Anggaran","Status","Aksi"].map((h,i)=>(<th key={i} className={`p-3 font-semibold text-gray-500 whitespace-nowrap ${i<2?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
            <tbody>{filtered.map(p=>{ const pg=projProg(acts,p.id); const sc=projSpiCpi[p.id]||[1,1];
              return (<tr key={p.id} className="border-t hover:bg-red-50/40 transition-colors" style={{borderColor:"#F1F5F9"}}>
                <td className="p-3 font-mono font-bold" style={{color:"#B91C1C"}}>{p.code}</td>
                <td className="p-3"><div className="font-semibold text-gray-800">{p.name}</div><div className="text-gray-400">{dif(p.start,p.end)} hari</div></td>
                <td className="p-3 text-center text-gray-600">{p.co}</td>
                <td className="p-3 text-center text-gray-500">{fmtD(p.start)}</td>
                <td className="p-3 text-center text-gray-500">{fmtD(p.end)}</td>
                <td className="p-3"><div className="flex items-center gap-1.5"><PBar v={pg}/><span className="font-bold w-8 text-right" style={{color:pg>=80?"#16A34A":pg>=40?"#F59E0B":"#EF4444"}}>{pg}%</span></div></td>
                <td className="p-3 text-center font-bold" style={{color:iCol(sc[0])}}>{sc[0].toFixed(2)}</td>
                <td className="p-3 text-center font-bold" style={{color:iCol(sc[1])}}>{sc[1].toFixed(2)}</td>
                <td className="p-3 text-center text-gray-600">{rp(p.bud)} M</td>
                <td className="p-3 text-center"><Badge st={p.st}/></td>
                <td className="p-3 text-center"><button onClick={()=>setSelProj(p)} className="text-xs text-white px-3 py-1.5 rounded-xl font-medium" style={{background:"#DC2626"}}>Buka →</button></td>
              </tr>);
            })}</tbody>
          </table></div>
        </div>
      )}
      {showAdd&&<AddProjModal onSave={p=>{setProjs(prev=>[...prev,p]);setShowAdd(false);}} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}

/* ════════════════════════════════════════════════
   DASHBOARD (enhanced)
════════════════════════════════════════════════ */