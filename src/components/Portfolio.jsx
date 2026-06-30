import React, { useState } from 'react';
import { fmtD, dif, addD, TODAY, MO, SH, SH2, iCol, rp, projProg, projSpiCpi, uid } from '../utils/helpers';
import { IP, IA, ICOST, IEVM, IRISK, IISSUE, COS_PF } from '../data/mockData';
import { Modal, Inp, Sel, Badge, PBar, TIC, TCL, evmCalc, calcProg } from './SharedUI';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";

export default function Portfolio(){
  const ranked=[...COS_PF].sort((a,b)=>(b.spi+b.cpi)-(a.spi+a.cpi));
  const totBud=COS_PF.reduce((a,c)=>a+c.bud,0);
  const totSp=COS_PF.reduce((a,c)=>a+c.sp,0);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{background:"linear-gradient(120deg,#1C1917,#991B1B 70%,#7C3AED)",...SH2}}>
        <div className="relative flex justify-between items-center flex-wrap gap-3">
          <div><h2 className="text-xl font-bold">Portfolio Management</h2><p className="text-sm mt-0.5" style={{color:"#C4B5FD"}}>Analisis perbandingan kinerja lintas perusahaan untuk Danantara</p></div>
          <div className="flex gap-4 text-center">
            <div><div className="text-2xl font-extrabold">{COS_PF.length}</div><div className="text-xs" style={{color:"#C4B5FD"}}>BUMN</div></div>
            <div><div className="text-2xl font-extrabold">{totBud.toFixed(0)}T</div><div className="text-xs" style={{color:"#C4B5FD"}}>Anggaran</div></div>
            <div><div className="text-2xl font-extrabold">{Math.round(totSp/totBud*100)}%</div><div className="text-xs" style={{color:"#C4B5FD"}}>Serapan</div></div>
          </div>
        </div>
      </div>

      {/* Progress vs Target chart */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
        <h3 className="font-bold text-sm text-gray-800 mb-1">Perbandingan Progress vs Target per Perusahaan</h3>
        <p className="text-xs text-gray-400 mb-3">Garis target periode = 71% · bar di bawah garis menandakan keterlambatan</p>
        <ResponsiveContainer width="100%" height={230}>
          <ComposedChart data={COS_PF} margin={{top:10,right:10,left:-15,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
            <XAxis dataKey="n" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} unit="%" domain={[0,100]}/>
            <Tooltip formatter={(v,n)=>[`${v}%`,n==="pct"?"Realisasi":"Target"]}/>
            <Bar dataKey="pct" name="Realisasi" radius={[6,6,0,0]} barSize={42}>{COS_PF.map((c,i)=><Cell key={i} fill={c.pct>=c.target?"#16A34A":c.pct>=c.target*0.8?"#F59E0B":"#EF4444"}/>)}</Bar>
            <Line dataKey="target" name="Target" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 4" dot={{r:3,fill:"#7C3AED"}}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* SPI vs CPI scatter (bubble = budget) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
          <h3 className="font-bold text-sm text-gray-800 mb-1">Matriks Kinerja SPI × CPI</h3>
          <p className="text-xs text-gray-400 mb-2">Ukuran bubble = anggaran · zona hijau = sehat (≥1.0)</p>
          <ResponsiveContainer width="100%" height={230}>
            <ScatterChart margin={{top:10,right:10,left:-10,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis type="number" dataKey="spi" name="SPI" domain={[0.6,1.2]} tick={{fontSize:10}} label={{value:"SPI →",position:"insideBottomRight",fontSize:10,offset:-2}}/>
              <YAxis type="number" dataKey="cpi" name="CPI" domain={[0.6,1.2]} tick={{fontSize:10}} label={{value:"CPI",angle:-90,position:"insideLeft",fontSize:10}}/>
              <ZAxis type="number" dataKey="bud" range={[100,800]}/>
              <Tooltip cursor={{strokeDasharray:"3 3"}} formatter={(v,n)=>[typeof v==="number"?v.toFixed?v.toFixed(2):v:v,n]} content={({payload})=>{ if(!payload||!payload.length)return null; const d=payload[0].payload; return <div className="bg-white border border-gray-200 rounded-xl p-2 text-xs shadow"><b>{d.n}</b><br/>SPI: {d.spi.toFixed(2)} · CPI: {d.cpi.toFixed(2)}<br/>Anggaran: {d.bud}T</div>; }}/>
              <Scatter data={COS_PF}>{COS_PF.map((c,i)=><Cell key={i} fill={c.col} fillOpacity={0.75}/>)}</Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* Budget utilization */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
          <h3 className="font-bold text-sm text-gray-800 mb-1">Serapan Anggaran per Perusahaan</h3>
          <p className="text-xs text-gray-400 mb-2">Anggaran (abu) vs Realisasi (biru), Triliun IDR</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={COS_PF} layout="vertical" margin={{right:10,left:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:9}}/><YAxis dataKey="n" type="category" tick={{fontSize:9}} width={72}/>
              <Tooltip formatter={v=>`${v} T`}/>
              <Bar dataKey="bud" name="Anggaran" fill="#E2E8F0" radius={[0,4,4,0]} barSize={9}/>
              <Bar dataKey="sp" name="Realisasi" fill="#EF4444" radius={[0,4,4,0]} barSize={9}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking table */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100" style={SH}>
        <h3 className="font-bold text-sm text-gray-800 mb-3">🏆 Peringkat Kinerja Perusahaan</h3>
        <table className="w-full text-xs"><thead><tr style={{background:"#F1F5F9"}}>{["#","Perusahaan","Proyek","Progress","Target","SPI","CPI","Serapan","Risiko","Skor"].map((h,i)=>(<th key={i} className={`p-2 font-semibold text-gray-500 ${i===1?"text-left":"text-center"}`}>{h}</th>))}</tr></thead>
          <tbody>{ranked.map((c,i)=>{ const skor=Math.round((c.spi+c.cpi)/2*100); const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1;
            return (<tr key={i} className="border-t hover:bg-red-50/30 transition-colors" style={{borderColor:"#F1F5F9"}}>
              <td className="p-2 text-center font-bold text-base">{medal}</td>
              <td className="p-2"><div className="flex items-center gap-2"><div className="w-1 h-6 rounded-full" style={{background:c.col}}></div><div><div className="font-semibold text-gray-800">{c.n}</div><div className="text-gray-400" style={{fontSize:"10px"}}>{c.sec}</div></div></div></td>
              <td className="p-2 text-center font-bold text-red-600">{c.proj}</td>
              <td className="p-2"><div className="flex items-center gap-1.5 justify-center"><div className="w-14"><PBar v={c.pct} col={c.col}/></div><span className="font-bold w-7 text-right text-gray-700">{c.pct}%</span></div></td>
              <td className="p-2 text-center"><span className={c.pct>=c.target?"text-green-600":"text-red-500"}>{c.pct>=c.target?"✓":"✗"} {c.target}%</span></td>
              <td className="p-2 text-center font-bold" style={{color:iCol(c.spi)}}>{c.spi.toFixed(2)}</td>
              <td className="p-2 text-center font-bold" style={{color:iCol(c.cpi)}}>{c.cpi.toFixed(2)}</td>
              <td className="p-2 text-center text-gray-600">{Math.round(c.sp/c.bud*100)}%</td>
              <td className="p-2 text-center"><span className="px-2 py-0.5 rounded-full font-bold" style={{background:c.risk>=5?"#FEE2E2":c.risk>=3?"#FEF3C7":"#DCFCE7",color:c.risk>=5?"#991B1B":c.risk>=3?"#92400E":"#15803D"}}>{c.risk}</span></td>
              <td className="p-2 text-center"><span className="font-extrabold" style={{color:iCol(skor/100)}}>{skor}</span></td>
            </tr>);
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   COST & EVM
════════════════════════════════════════════════ */