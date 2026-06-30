import React, { useState } from 'react';
import { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';
import { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';
import { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";

export default function CostEVM({projs,acts}){
  const [pid,setPid]=useState("P1");
  const [cost,setCost]=useState(ICOST);
  const [editId,setEditId]=useState(null); const [ed,setEd]=useState({});
  const proj=projs.find(p=>p.id===pid)||projs[0];
  const myCost=cost.filter(c=>c.pid===pid);
  // totals
  const bac=myCost.reduce((s,c)=>s+c.bac,0);
  const ac=myCost.reduce((s,c)=>s+c.ac,0);
  const ev=myCost.reduce((s,c)=>s+c.bac*c.p/100,0);
  const pv=IEVM.find(m=>m.m==="Jun")?.pv||0;
  const sv=ev-pv, cv=ev-ac;
  const spi=pv>0?ev/pv:1;
  const cpiVal=ac>0?ev/ac:1;
  const eac=cpiVal>0?bac/cpiVal:bac;
  const etc=eac-ac, vac=bac-eac;
  const tcpi=(bac-ev)/(bac-ac);

  const e=(k,v)=>setEd(p=>({...p,[k]:v}));
  const saveEdit=()=>{ setCost(p=>p.map(c=>c.id===editId?{...c,bac:+ed.bac,ac:+ed.ac,p:+ed.p}:c)); setEditId(null); };

  const metric=(label,val,sub,col,big)=>(
    <div className="bg-white rounded-2xl p-3.5 border border-gray-100" style={SH}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`font-extrabold ${big?"text-2xl":"text-xl"} mt-0.5`} style={{color:col}}>{val}</p>
      {sub&&<p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{background:"linear-gradient(120deg,#7F1D1D,#B91C1C 60%,#DC2626)",...SH2}}>
        <div className="relative flex justify-between items-center flex-wrap gap-3">
          <div><h2 className="text-xl font-bold">💰 Biaya & Earned Value Management</h2><p className="text-sm mt-0.5" style={{color:"#FECACA"}}>Input biaya oleh perusahaan · Analisis EVM oleh Danantara</p></div>
          <select value={pid} onChange={e=>setPid(e.target.value)} className="text-sm rounded-xl px-3 py-2 font-medium text-gray-800">{projs.map(p=><option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}</select>
        </div>
      </div>

      {/* EVM metric cards */}
      <div className="grid grid-cols-4 gap-3">
        {metric("BAC — Budget at Completion",`${rp(bac)} M`,"Total anggaran proyek","#1E40AF",true)}
        {metric("EV — Earned Value",`${rp(Math.round(ev))} M`,`${Math.round(ev/bac*100)}% nilai diperoleh`,"#16A34A",true)}
        {metric("AC — Actual Cost",`${rp(ac)} M`,"Realisasi biaya aktual","#DC2626",true)}
        {metric("PV — Planned Value",`${rp(pv)} M`,"Anggaran terjadwal","#7C3AED",true)}
      </div>

      {/* Index cards */}
      <div className="grid grid-cols-6 gap-3">
        {metric("SPI",spi.toFixed(2),spi>=1?"Tepat/cepat":"Terlambat",iCol(spi))}
        {metric("CPI",cpiVal.toFixed(2),cpiVal>=1?"Hemat":"Boros",iCol(cpiVal))}
        {metric("SV (Schedule)",`${sv>=0?"+":""}${rp(Math.round(sv))}`,sv>=0?"Lebih cepat":"Tertinggal",sv>=0?"#16A34A":"#EF4444")}
        {metric("CV (Cost)",`${cv>=0?"+":""}${rp(Math.round(cv))}`,cv>=0?"Di bawah budget":"Over budget",cv>=0?"#16A34A":"#EF4444")}
        {metric("EAC — Estimate",`${rp(Math.round(eac))}`,"Prediksi biaya akhir",eac<=bac?"#16A34A":"#EF4444")}
        {metric("VAC — Variance",`${vac>=0?"+":""}${rp(Math.round(vac))}`,vac>=0?"Sisa anggaran":"Defisit",vac>=0?"#16A34A":"#EF4444")}
      </div>

      {/* EVM S-curve */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
          <h3 className="font-bold text-sm text-gray-800 mb-1">Kurva EVM — PV / EV / AC</h3>
          <p className="text-xs text-gray-400 mb-2">Kumulatif Miliar IDR · titik temu menunjukkan posisi kinerja proyek</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={IEVM} margin={{top:5,right:5,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="m" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} unit="M"/>
              <Tooltip formatter={(v,n)=>[v!=null?`${rp(v)} M`:"-",n==="pv"?"Planned Value":n==="ev"?"Earned Value":"Actual Cost"]}/>
              <Legend wrapperStyle={{fontSize:"11px"}} formatter={v=>v==="pv"?"PV (Rencana)":v==="ev"?"EV (Diperoleh)":"AC (Aktual)"}/>
              <Line dataKey="pv" stroke="#7C3AED" strokeWidth={2} dot={false} strokeDasharray="5 3"/>
              <Line dataKey="ev" stroke="#16A34A" strokeWidth={2.5} dot={{r:3}} connectNulls={false}/>
              <Line dataKey="ac" stroke="#DC2626" strokeWidth={2.5} dot={{r:3}} connectNulls={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Interpretation panel for Danantara */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
          <h3 className="font-bold text-sm text-gray-800 mb-2">📌 Interpretasi (Danantara)</h3>
          <div className="space-y-2.5 text-xs">
            <div className="rounded-xl p-2.5" style={{background:spi>=1?"#F0FDF4":"#FEF2F2"}}>
              <div className="font-bold mb-0.5" style={{color:spi>=1?"#15803D":"#991B1B"}}>Jadwal: {spi>=1?"Sesuai/Cepat":"Terlambat"}</div>
              <div className="text-gray-600">SPI {spi.toFixed(2)} — proyek {spi>=1?"berjalan sesuai/lebih cepat dari rencana":`tertinggal ${Math.round((1-spi)*100)}% dari jadwal`}.</div>
            </div>
            <div className="rounded-xl p-2.5" style={{background:cpiVal>=1?"#F0FDF4":"#FEF2F2"}}>
              <div className="font-bold mb-0.5" style={{color:cpiVal>=1?"#15803D":"#991B1B"}}>Biaya: {cpiVal>=1?"Efisien":"Over Budget"}</div>
              <div className="text-gray-600">CPI {cpiVal.toFixed(2)} — setiap Rp1 menghasilkan Rp{cpiVal.toFixed(2)} nilai kerja.</div>
            </div>
            <div className="rounded-xl p-2.5" style={{background:vac>=0?"#F0FDF4":"#FEF2F2"}}>
              <div className="font-bold mb-0.5" style={{color:vac>=0?"#15803D":"#991B1B"}}>Proyeksi Akhir</div>
              <div className="text-gray-600">Estimasi biaya akhir (EAC) <b>{rp(Math.round(eac))} M</b>, {vac>=0?"masih dalam":"melebihi"} anggaran sebesar <b>{rp(Math.abs(Math.round(vac)))} M</b>.</div>
            </div>
            <div className="rounded-xl p-2.5" style={{background:"#FEF2F2"}}>
              <div className="font-bold mb-0.5 text-red-700">TCPI {isFinite(tcpi)?tcpi.toFixed(2):"—"}</div>
              <div className="text-gray-600">Indeks efisiensi yang dibutuhkan untuk menyelesaikan sesuai anggaran.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost input table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={SH}>
        <div className="p-3 border-b border-gray-100 flex justify-between items-center" style={{background:"#FEF9F9"}}>
          <div><h3 className="font-bold text-sm text-gray-800">Input Biaya per WBS</h3><p className="text-xs text-gray-400">Diisi perusahaan · klik ✏️ untuk update BAC & AC</p></div>
          <span className="text-xs px-2 py-1 rounded-full" style={{background:"#FEE2E2",color:"#991B1B"}}>EV dihitung otomatis dari progress</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-xs" style={{minWidth:"880px"}}>
          <thead><tr style={{background:"#F1F5F9"}}>{["WBS","Komponen","BAC (M)","Progress","EV (M)","AC (M)","CV (M)","CPI","EAC (M)","Aksi"].map((h,i)=>(<th key={i} className={`p-2.5 font-semibold text-gray-500 ${i<2?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
          <tbody>{myCost.map(c=>{ const ev2=c.bac*c.p/100; const cv2=ev2-c.ac; const cpi2=c.ac>0?ev2/c.ac:1; const eac2=cpi2>0?c.bac/cpi2:c.bac; const isE=editId===c.id;
            return (<tr key={c.id} className={`border-t transition-colors ${isE?"bg-red-50":""} hover:bg-red-50/30`} style={{borderColor:"#F1F5F9"}}>
              <td className="p-2 font-mono font-bold text-gray-600">{c.wbs}</td>
              <td className="p-2 font-medium text-gray-800">{c.nm}</td>
              <td className="p-2 text-center">{isE?<input type="number" className="border rounded px-1 py-0.5 w-20 text-center" value={ed.bac} onChange={ev=>e("bac",ev.target.value)}/>:<b>{rp(c.bac)}</b>}</td>
              <td className="p-2 text-center">{isE?<input type="number" className="border rounded px-1 py-0.5 w-14 text-center" value={ed.p} min={0} max={100} onChange={ev=>e("p",ev.target.value)}/>:<span className="font-bold" style={{color:c.p>=80?"#16A34A":c.p>=40?"#F59E0B":c.p>0?"#EF4444":"#CBD5E1"}}>{c.p}%</span>}</td>
              <td className="p-2 text-center font-medium text-green-700">{rp(Math.round(ev2))}</td>
              <td className="p-2 text-center">{isE?<input type="number" className="border rounded px-1 py-0.5 w-20 text-center" value={ed.ac} onChange={ev=>e("ac",ev.target.value)}/>:<span className="font-medium text-red-700">{rp(c.ac)}</span>}</td>
              <td className="p-2 text-center font-bold" style={{color:cv2>=0?"#16A34A":"#EF4444"}}>{cv2>=0?"+":""}{rp(Math.round(cv2))}</td>
              <td className="p-2 text-center font-bold" style={{color:iCol(cpi2)}}>{cpi2.toFixed(2)}</td>
              <td className="p-2 text-center text-gray-600">{rp(Math.round(eac2))}</td>
              <td className="p-2 text-center">{isE?<div className="flex gap-0.5 justify-center"><button onClick={saveEdit} className="px-2 py-1 rounded text-white font-bold" style={{background:"#22C55E"}}>💾</button><button onClick={()=>setEditId(null)} className="px-2 py-1 rounded bg-gray-200 font-bold">✕</button></div>:<button onClick={()=>{setEditId(c.id);setEd({bac:c.bac,ac:c.ac,p:c.p});}} className="px-2 py-1 rounded hover:bg-red-100">✏️</button>}</td>
            </tr>);
          })}
          <tr className="border-t-2 font-bold" style={{borderColor:"#E5E7EB",background:"#F8FAFC"}}>
            <td className="p-2" colSpan={2}>TOTAL PROYEK</td>
            <td className="p-2 text-center">{rp(bac)}</td><td className="p-2 text-center">{Math.round(ev/bac*100)}%</td>
            <td className="p-2 text-center text-green-700">{rp(Math.round(ev))}</td><td className="p-2 text-center text-red-700">{rp(ac)}</td>
            <td className="p-2 text-center" style={{color:cv>=0?"#16A34A":"#EF4444"}}>{cv>=0?"+":""}{rp(Math.round(cv))}</td>
            <td className="p-2 text-center" style={{color:iCol(cpiVal)}}>{cpiVal.toFixed(2)}</td><td className="p-2 text-center">{rp(Math.round(eac))}</td><td></td>
          </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   RISK & ISSUES
════════════════════════════════════════════════ */