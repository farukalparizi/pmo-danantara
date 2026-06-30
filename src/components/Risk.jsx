import React, { useState } from 'react';
import { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';
import { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';
import { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";

const rCol=s=>s>=16?"#DC2626":s>=10?"#F97316":s>=5?"#EAB308":"#22C55E";
const rLbl=s=>s>=16?"Kritis":s>=10?"Tinggi":s>=5?"Sedang":"Rendah";
const stCls=s=>({"Open":"bg-red-100 text-red-700","Mitigasi":"bg-orange-100 text-orange-700","Monitor":"bg-red-100 text-red-700","Closed":"bg-gray-100 text-gray-500","In Progress":"bg-red-100 text-red-700","Resolved":"bg-green-100 text-green-700"}[s]||"bg-gray-100 text-gray-500");
const prioCls=p=>({"Kritis":"bg-red-100 text-red-700","Tinggi":"bg-orange-100 text-orange-700","Sedang":"bg-yellow-100 text-yellow-700","Rendah":"bg-gray-100 text-gray-500"}[p]||"bg-gray-100 text-gray-500");

function AddRiskModal({projs,onSave,onClose}){
  const cats=["Pengadaan","Lahan","Biaya","Cuaca","Regulasi","Teknis","Keuangan","SDM","Lingkungan"];
  const [f,setF]=useState({pid:projs[0].id,cat:cats[0],desc:"",prob:3,imp:3,owner:"",mit:"",st:"Open",due:addD(TODAY,30)});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const sc=f.prob*f.imp;
  return (
    <Modal title="⚠️ Tambah Risiko Baru" sub="Input oleh perusahaan untuk analisis Danantara" onClose={onClose} w="560px" accent="#F59E0B">
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Sel label="Proyek" value={f.pid} onChange={e=>s("pid",e.target.value)}>{projs.map(p=><option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}</Sel>
          <Sel label="Kategori" value={f.cat} onChange={e=>s("cat",e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</Sel>
        </div>
        <div><label className="text-xs font-semibold text-gray-500 block mb-1">Deskripsi Risiko *</label><textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:border-red-400 focus:outline-none" placeholder="Jelaskan risiko..." value={f.desc} onChange={e=>s("desc",e.target.value)}/></div>
        <div className="grid grid-cols-3 gap-3">
          <Sel label="Probabilitas (1-5)" value={f.prob} onChange={e=>s("prob",+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} - {["Sangat Rendah","Rendah","Sedang","Tinggi","Sangat Tinggi"][n-1]}</option>)}</Sel>
          <Sel label="Dampak (1-5)" value={f.imp} onChange={e=>s("imp",+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} - {["Sangat Rendah","Rendah","Sedang","Tinggi","Sangat Tinggi"][n-1]}</option>)}</Sel>
          <div><label className="text-xs font-semibold text-gray-500 block mb-1">Skor Risiko</label><div className="rounded-xl px-3 py-2 text-sm font-bold text-center text-white" style={{background:rCol(sc)}}>{sc} · {rLbl(sc)}</div></div>
        </div>
        <div className="grid grid-cols-2 gap-3"><Inp label="Pemilik Risiko" placeholder="Role/Nama PIC" value={f.owner} onChange={e=>s("owner",e.target.value)}/><Inp label="Target Mitigasi" type="date" value={f.due} onChange={e=>s("due",e.target.value)}/></div>
        <div><label className="text-xs font-semibold text-gray-500 block mb-1">Rencana Mitigasi</label><textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:border-red-400 focus:outline-none" placeholder="Langkah mitigasi..." value={f.mit} onChange={e=>s("mit",e.target.value)}/></div>
        <Sel label="Status" value={f.st} onChange={e=>s("st",e.target.value)}><option>Open</option><option>Mitigasi</option><option>Monitor</option><option>Closed</option></Sel>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
        <button onClick={()=>{if(!f.desc)return alert("Deskripsi wajib diisi");const p=projs.find(x=>x.id===f.pid);onSave({...f,id:uid(),co:p.co});}} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{background:"#F59E0B"}}>Simpan Risiko</button>
      </div>
    </Modal>
  );
}

export default function Risk({projs}){
  const [tab,setTab]=useState("risk");
  const [risks,setRisks]=useState(IRISK);
  const [issues]=useState(IISSUE);
  const [showAdd,setShowAdd]=useState(false);
  const [filCo,setFilCo]=useState("all");

  const fRisks=filCo==="all"?risks:risks.filter(r=>r.co===filCo);
  const COS=[...new Set(risks.map(r=>r.co))];

  // matrix
  const matrix=[]; for(let p=5;p>=1;p--){ const row=[]; for(let im=1;im<=5;im++){ const sc=p*im; row.push({p,im,sc,hits:fRisks.filter(r=>r.prob===p&&r.imp===im&&r.st!=="Closed")}); } matrix.push(row); }
  const cellBg=sc=>sc>=16?"#FEE2E2":sc>=10?"#FFEDD5":sc>=5?"#FEF9C3":"#DCFCE7";
  const cellBr=sc=>sc>=16?"#FCA5A5":sc>=10?"#FDBA74":sc>=5?"#FDE047":"#86EFAC";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{background:"linear-gradient(120deg,#78350F,#B45309 60%,#F59E0B)",...SH2}}>
        <div className="relative flex justify-between items-center flex-wrap gap-3">
          <div><h2 className="text-xl font-bold">⚠️ Manajemen Risiko & Isu</h2><p className="text-sm mt-0.5" style={{color:"#FDE68A"}}>Input risiko oleh perusahaan · Analisis & mitigasi oleh Danantara</p></div>
          <div className="flex gap-4 text-center">
            <div><div className="text-2xl font-extrabold">{risks.filter(r=>r.st!=="Closed").length}</div><div className="text-xs" style={{color:"#FDE68A"}}>Risiko Aktif</div></div>
            <div><div className="text-2xl font-extrabold">{risks.filter(r=>r.prob*r.imp>=16&&r.st!=="Closed").length}</div><div className="text-xs" style={{color:"#FDE68A"}}>Kritis</div></div>
            <div><div className="text-2xl font-extrabold">{issues.filter(i=>i.st!=="Resolved").length}</div><div className="text-xs" style={{color:"#FDE68A"}}>Isu Terbuka</div></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 items-center">
        {[["risk","🎯 Risk Register"],["issue","🔧 Issue Tracker"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab===id?"border-amber-500 text-amber-600":"border-transparent text-gray-500 hover:text-gray-700"}`}>{lbl}</button>
        ))}
        <div className="flex-1"></div>
        {tab==="risk"&&<button onClick={()=>setShowAdd(true)} className="text-xs text-white px-3 py-1.5 rounded-xl font-medium mb-1" style={{background:"#F59E0B"}}>+ Tambah Risiko</button>}
      </div>

      {tab==="risk"?(
        <>
          {/* Summary + Matrix */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100" style={SH}>
              <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-sm text-gray-800">Risk Matrix 5×5</h3>
                <select value={filCo} onChange={e=>setFilCo(e.target.value)} className="text-xs border border-gray-200 rounded-xl px-2 py-1 bg-white"><option value="all">Semua BUMN</option>{COS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="flex gap-2 items-stretch">
                <div className="flex items-center"><span className="text-xs text-gray-400 font-semibold" style={{writingMode:"vertical-rl",transform:"rotate(180deg)"}}>Probabilitas →</span></div>
                <div className="flex-1">
                  {matrix.map((row,ri)=>(<div key={ri} className="flex items-center gap-1 mb-1">
                    <div className="w-3 text-xs text-gray-400 text-right">{5-ri}</div>
                    {row.map((cell,ci)=>(<div key={ci} className="flex-1 flex items-center justify-center rounded cursor-pointer hover:ring-2 hover:ring-red-300 transition-all" style={{background:cellBg(cell.sc),border:`1px solid ${cellBr(cell.sc)}`,minHeight:"36px"}} title={cell.hits.map(r=>r.desc).join("\n")||`Skor ${cell.sc}`}>
                      {cell.hits.length>0?<div className="text-center"><div className="text-xs font-extrabold" style={{color:rCol(cell.sc)}}>{cell.hits.length}</div><div className="text-xs" style={{color:rCol(cell.sc),fontSize:"8px"}}>risiko</div></div>:<span className="text-xs" style={{color:rCol(cell.sc),opacity:.35}}>{cell.sc}</span>}
                    </div>))}
                  </div>))}
                  <div className="flex gap-1 ml-3 mt-1">{[1,2,3,4,5].map(n=><div key={n} className="flex-1 text-center text-xs text-gray-400">{n}</div>)}</div>
                  <div className="text-center text-xs text-gray-400 font-semibold ml-3 mt-0.5">Dampak →</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">{[["Rendah","#DCFCE7","#14532D"],["Sedang","#FEF9C3","#713F12"],["Tinggi","#FFEDD5","#9A3412"],["Kritis","#FEE2E2","#991B1B"]].map(([l,bg,c],i)=>(<div key={i} className="flex items-center gap-1 text-xs"><div className="w-3 h-3 rounded" style={{background:bg,border:"1px solid rgba(0,0,0,.1)"}}></div><span style={{color:c}}>{l}</span></div>))}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100" style={SH}>
              <h3 className="font-bold text-sm text-gray-800 mb-3">Ringkasan & Distribusi</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[{l:"Total Risiko",v:risks.length,c:"#EF4444"},{l:"Open",v:risks.filter(r=>r.st==="Open").length,c:"#EF4444"},{l:"In Mitigasi",v:risks.filter(r=>r.st==="Mitigasi").length,c:"#F97316"},{l:"Closed",v:risks.filter(r=>r.st==="Closed").length,c:"#22C55E"}].map((s,i)=>(<div key={i} className="rounded-xl p-2.5 text-center" style={{background:"#F8FAFC"}}><div className="font-extrabold text-2xl" style={{color:s.c}}>{s.v}</div><div className="text-xs text-gray-400">{s.l}</div></div>))}
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Top 3 Risiko Tertinggi</p>
              <div className="space-y-2">{[...risks].filter(r=>r.st!=="Closed").sort((a,b)=>b.prob*b.imp-a.prob*a.imp).slice(0,3).map((r,i)=>{const sc=r.prob*r.imp;return (<div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{background:"#F8FAFC"}}><div className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 text-white" style={{background:rCol(sc)}}>{sc}</div><div className="flex-1 min-w-0"><div className="text-xs font-medium text-gray-800 truncate">{r.desc}</div><div className="text-xs text-gray-400">{r.co} · {r.cat}</div></div></div>);})}</div>
            </div>
          </div>

          {/* Risk register table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={SH}>
            <div className="p-3 border-b border-gray-100" style={{background:"#FFFBEB"}}><h3 className="font-bold text-sm text-gray-800">Risk Register</h3><p className="text-xs text-gray-400">{fRisks.length} risiko · diisi dan diperbarui oleh perusahaan</p></div>
            <div className="overflow-x-auto"><table className="w-full text-xs" style={{minWidth:"1000px"}}>
              <thead><tr style={{background:"#F1F5F9"}}>{["ID","Deskripsi","Perusahaan","Kategori","P","D","Skor","Level","Mitigasi","PIC","Target","Status"].map((h,i)=>(<th key={i} className={`p-2.5 font-semibold text-gray-500 ${i===1||i===8?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
              <tbody>{fRisks.map(r=>{const sc=r.prob*r.imp;return (<tr key={r.id} className="border-t hover:bg-amber-50/30 transition-colors" style={{borderColor:"#F1F5F9"}}>
                <td className="p-2 font-mono text-gray-400 text-center">{r.id}</td>
                <td className="p-2 font-medium text-gray-800 max-w-[180px]">{r.desc}</td>
                <td className="p-2 text-center text-gray-600">{r.co}</td>
                <td className="p-2 text-center"><span className="px-1.5 py-0.5 rounded text-xs" style={{background:"#FEF2F2",color:"#B91C1C"}}>{r.cat}</span></td>
                <td className="p-2 text-center font-bold text-gray-700">{r.prob}</td><td className="p-2 text-center font-bold text-gray-700">{r.imp}</td>
                <td className="p-2 text-center"><span className="font-extrabold" style={{color:rCol(sc)}}>{sc}</span></td>
                <td className="p-2 text-center"><span className="px-1.5 py-0.5 rounded text-xs font-bold text-white" style={{background:rCol(sc)}}>{rLbl(sc)}</span></td>
                <td className="p-2 text-gray-600 max-w-[160px] text-xs">{r.mit}</td>
                <td className="p-2 text-center text-gray-500">{r.owner}</td>
                <td className="p-2 text-center text-gray-500 whitespace-nowrap">{fmtD(r.due)}</td>
                <td className="p-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stCls(r.st)}`}>{r.st}</span></td>
              </tr>);})}</tbody>
            </table></div>
          </div>
        </>
      ):(
        /* Issue Tracker */
        <>
          <div className="grid grid-cols-4 gap-3">
            {[{l:"Total Isu",v:issues.length,c:"#EF4444",i:"📋"},{l:"Kritis",v:issues.filter(i=>i.prio==="Kritis").length,c:"#DC2626",i:"🔴"},{l:"In Progress",v:issues.filter(i=>i.st==="In Progress").length,c:"#F59E0B",i:"⏳"},{l:"Resolved",v:issues.filter(i=>i.st==="Resolved").length,c:"#16A34A",i:"✅"}].map((k,i)=>(
              <div key={i} className="bg-white rounded-2xl p-3.5 border border-gray-100 flex items-center gap-3" style={SH}><span className="text-2xl">{k.i}</span><div><div className="text-xs text-gray-400">{k.l}</div><div className="font-extrabold text-2xl" style={{color:k.c}}>{k.v}</div></div></div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={SH}>
            <div className="p-3 border-b border-gray-100" style={{background:"#FFFBEB"}}><h3 className="font-bold text-sm text-gray-800">Issue Tracker</h3><p className="text-xs text-gray-400">Isu/masalah aktual yang terjadi di lapangan — diinput perusahaan</p></div>
            <div className="overflow-x-auto"><table className="w-full text-xs" style={{minWidth:"880px"}}>
              <thead><tr style={{background:"#F1F5F9"}}>{["ID","Judul Isu","Perusahaan","Prioritas","PIC","Dibuat","Target","Status"].map((h,i)=>(<th key={i} className={`p-2.5 font-semibold text-gray-500 ${i===1?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
              <tbody>{issues.map(it=>{ const overdue=it.st!=="Resolved"&&dif(TODAY,it.due)<0;
                return (<tr key={it.id} className="border-t hover:bg-amber-50/30 transition-colors" style={{borderColor:"#F1F5F9"}}>
                  <td className="p-2 font-mono text-gray-400 text-center">{it.id}</td>
                  <td className="p-2 font-medium text-gray-800">{it.title}</td>
                  <td className="p-2 text-center text-gray-600">{it.co}</td>
                  <td className="p-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${prioCls(it.prio)}`}>{it.prio}</span></td>
                  <td className="p-2 text-center text-gray-500">{it.assignee}</td>
                  <td className="p-2 text-center text-gray-400 whitespace-nowrap">{fmtD(it.created)}</td>
                  <td className="p-2 text-center whitespace-nowrap"><span className={overdue?"text-red-600 font-bold":"text-gray-500"}>{fmtD(it.due)}{overdue&&" ⚠"}</span></td>
                  <td className="p-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stCls(it.st)}`}>{it.st}</span></td>
                </tr>);})}</tbody>
            </table></div>
          </div>
        </>
      )}

      {showAdd&&<AddRiskModal projs={projs} onSave={r=>{setRisks(p=>[...p,r]);setShowAdd(false);}} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════ */