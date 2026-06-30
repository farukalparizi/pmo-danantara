import React, { useState } from 'react';
import { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';
import { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';
import { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';
import { exportToPDF, exportToExcel } from '../utils/exportData';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";

const SCURVE=[{m:"Jan",plan:5,act:4.8},{m:"Feb",plan:12,act:11.2},{m:"Mar",plan:20,act:18.5},{m:"Apr",plan:30,act:27.3},{m:"Mei",plan:42,act:38.1},{m:"Jun",plan:55,act:50.2},{m:"Jul",plan:63,act:null},{m:"Agu",plan:72,act:null},{m:"Sep",plan:80,act:null},{m:"Okt",plan:87,act:null},{m:"Nov",plan:94,act:null},{m:"Des",plan:100,act:null}];
const PIE_ST=[{name:"On Track",value:74,color:"#16A34A"},{name:"At Risk",value:18,color:"#F59E0B"},{name:"Delayed",value:8,color:"#EF4444"}];

export default function Dashboard({setView}){
  const totalProj=COS_PF.reduce((a,c)=>a+c.proj,0);
  const totalBud=COS_PF.reduce((a,c)=>a+c.bud,0).toFixed(1);
  const totalSp=COS_PF.reduce((a,c)=>a+c.sp,0).toFixed(1);
  const avgPct=Math.round(COS_PF.reduce((a,c)=>a+c.pct*c.proj,0)/totalProj);
  const KPI=[
    {l:"Total Proyek Aktif",v:totalProj,s:"6 Perusahaan BUMN",i:"📋",g:"linear-gradient(135deg,#EF4444,#DC2626)"},
    {l:"Total Anggaran 2025",v:`${totalBud} T`,s:"RKAP 2025",i:"💰",g:"linear-gradient(135deg,#22C55E,#16A34A)"},
    {l:"Realisasi Anggaran",v:`${totalSp} T`,s:`${Math.round(totalSp/totalBud*100)}% terserap`,i:"📊",g:"linear-gradient(135deg,#F59E0B,#D97706)"},
    {l:"Progress Rata-rata",v:`${avgPct}%`,s:"Target periode: 71%",i:"🎯",g:"linear-gradient(135deg,#8B5CF6,#7C3AED)"},
  ];
  return (
    <div className="space-y-4">
      {/* Gradient hero banner */}
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{background:"linear-gradient(120deg,#1C1917,#991B1B 70%,#DC2626)",...SH2}}>
        <div className="absolute -right-6 -top-6 w-40 h-40 rounded-full opacity-10" style={{background:"#F5A623"}}></div>
        <div className="relative flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold">Executive Dashboard</h2>
            <p className="text-sm mt-0.5" style={{color:"#BFDBFE"}}>Monitoring portofolio proyek strategis seluruh BUMN di bawah Danantara · {fmtD(TODAY)}</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-2 rounded-xl font-medium" style={{background:"rgba(255,255,255,.15)"}}>📅 Periode 2025</button>
            <button onClick={() => exportToPDF(IP, rp, fmtD)} className="text-xs px-3 py-2 rounded-xl font-medium text-gray-900 hover:opacity-90" style={{background:"#F5A623"}}>↓ PDF</button>
            <button onClick={() => exportToExcel(IP, rp, fmtD)} className="text-xs px-3 py-2 rounded-xl font-medium text-gray-900 hover:opacity-90" style={{background:"#22C55E", color: "white"}}>↓ Excel</button>
          </div>
        </div>
      </div>
      {/* KPI gradient cards */}
      <div className="grid grid-cols-4 gap-3">
        {KPI.map((k,i)=>(
          <div key={i} className="rounded-2xl p-4 text-white relative overflow-hidden" style={{...SH, background:k.g}}>
            <div className="absolute right-2 top-2 text-3xl opacity-30">{k.i}</div>
            <p className="text-xs font-medium opacity-90">{k.l}</p>
            <p className="text-3xl font-extrabold mt-1">{k.v}</p>
            <p className="text-xs opacity-80 mt-1">{k.s}</p>
          </div>
        ))}
      </div>
      {/* Alert */}
      <div className="flex items-center gap-3 rounded-2xl p-3 border" style={{background:"#FFFBEB",borderColor:"#FDE68A"}}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#FEF3C7"}}>⚠️</div>
        <p className="text-sm flex-1"><b style={{color:"#92400E"}}>3 Proyek perlu perhatian segera: </b><span style={{color:"#B45309"}}>Transmisi 500kV (PLN) · Waduk Karian (Waskita) · Smelter Alumina (MIND ID)</span></p>
        <button onClick={()=>setView("risk")} className="text-xs font-bold text-white px-3 py-1.5 rounded-xl" style={{background:"#D97706"}}>Lihat Risiko →</button>
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
          <div className="flex justify-between items-start mb-2">
            <div><h3 className="font-bold text-sm text-gray-800">Kurva-S Portofolio 2025</h3><p className="text-xs text-gray-400">Kumulatif Progress Rencana vs Realisasi (%)</p></div>
            <div className="flex gap-3 text-xs text-gray-500"><span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 rounded bg-red-500"></span>Rencana</span><span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 rounded bg-green-500"></span>Realisasi</span></div>
          </div>
          <ResponsiveContainer width="100%" height={195}>
            <AreaChart data={SCURVE} margin={{top:5,right:5,left:-20,bottom:0}}>
              <defs><linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.25}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0}/></linearGradient><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/><stop offset="95%" stopColor="#22C55E" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/><XAxis dataKey="m" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} unit="%" domain={[0,100]}/>
              <Tooltip formatter={(v,n)=>[v!=null?`${v}%`:"-",n==="plan"?"Rencana":"Realisasi"]}/>
              <Area type="monotone" dataKey="plan" stroke="#EF4444" strokeWidth={2} fill="url(#gP)" dot={false} connectNulls/>
              <Area type="monotone" dataKey="act" stroke="#22C55E" strokeWidth={2.5} fill="url(#gA)" dot={{r:3,fill:"#22C55E"}} connectNulls={false}/>
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-1">{[["Rencana Jun","55.0%","#EF4444"],["Realisasi Jun","50.2%","#22C55E"],["Deviasi","-4.8%","#EF4444"]].map(([l,v,c],i)=>(<div key={i} className="rounded-xl p-2 text-center" style={{background:"#F8FAFC"}}><div className="text-xs text-gray-400">{l}</div><div className="font-bold text-sm" style={{color:c}}>{v}</div></div>))}</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex-1" style={SH}>
            <h3 className="font-bold text-sm text-gray-800 mb-1">Status Proyek</h3>
            <div className="flex items-center gap-2">
              <ResponsiveContainer width={92} height={92}><PieChart><Pie data={PIE_ST} cx="50%" cy="50%" innerRadius={26} outerRadius={42} dataKey="value" startAngle={90} endAngle={-270} paddingAngle={2}>{PIE_ST.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart></ResponsiveContainer>
              <div className="flex-1 space-y-2">{PIE_ST.map((s,i)=>(<div key={i} className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-xs text-gray-600"><div className="w-2 h-2 rounded-full" style={{background:s.color}}></div>{s.name}</span><span className="text-xs font-bold" style={{color:s.color}}>{s.value}%</span></div>))}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex-1" style={SH}>
            <h3 className="font-bold text-sm text-gray-800 mb-3">EVM Portofolio</h3>
            {[{l:"SPI (Jadwal)",v:.91},{l:"CPI (Biaya)",v:.96}].map((e,i)=>(<div key={i} className="mb-2.5"><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{e.l}</span><span className="font-bold" style={{color:iCol(e.v)}}>{e.v.toFixed(2)}</span></div><PBar v={e.v*100} h="h-2" col={iCol(e.v)}/></div>))}
            <p className="text-xs text-gray-400 mt-1">Target indeks ≥ 0.95</p>
          </div>
        </div>
      </div>
      {/* Company performance table */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
        <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-sm text-gray-800">Rekap Kinerja per Perusahaan</h3><button onClick={()=>setView("portfolio")} className="text-xs font-medium text-red-600 hover:underline">Lihat Portfolio →</button></div>
        <table className="w-full text-xs"><thead><tr style={{background:"#F1F5F9"}}>{["Perusahaan","Sektor","Proyek","Progress","SPI","CPI","Anggaran","Status"].map((h,i)=>(<th key={i} className={`p-2 font-semibold text-gray-500 ${i===0?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
          <tbody>{COS_PF.map((c,i)=>(<tr key={i} className="border-t hover:bg-red-50/30 transition-colors" style={{borderColor:"#F1F5F9"}}>
            <td className="p-2"><div className="flex items-center gap-2"><div className="w-1 h-6 rounded-full" style={{background:c.col}}></div><span className="font-semibold text-gray-800">{c.n}</span></div></td>
            <td className="p-2 text-center text-gray-500">{c.sec}</td><td className="p-2 text-center font-bold text-red-600">{c.proj}</td>
            <td className="p-2"><div className="flex items-center gap-1.5 justify-center"><div className="w-16"><PBar v={c.pct} col={c.col}/></div><span className="font-bold text-gray-700 w-7 text-right">{c.pct}%</span></div></td>
            <td className="p-2 text-center font-bold" style={{color:iCol(c.spi)}}>{c.spi.toFixed(2)}</td><td className="p-2 text-center font-bold" style={{color:iCol(c.cpi)}}>{c.cpi.toFixed(2)}</td>
            <td className="p-2 text-center text-gray-600">{c.bud}T</td><td className="p-2 text-center"><Badge st={c.spi>=.9&&c.cpi>=.9?"on-track":c.spi>=.8?"at-risk":"delayed"}/></td>
          </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PORTFOLIO
════════════════════════════════════════════════ */