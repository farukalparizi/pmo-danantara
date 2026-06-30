import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from "recharts";
import { exportToPDF, exportToExcel } from "./utils/exportData";

/* ════════════ UTILS ════════════ */
const TODAY = "2025-06-29";
const pd   = s => new Date(s + "T00:00:00");
const dif  = (a,b) => Math.round((pd(b)-pd(a))/86400000);
const addD = (s,n) => { const d=pd(s); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
const MO   = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const fmtD = s => { if(!s) return "-"; const d=pd(s); return `${d.getDate()} ${MO[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`; };
const uid  = () => "x"+Math.random().toString(36).slice(2,7);
const rp   = n => "Rp " + (n||0).toLocaleString("id-ID");
const SH = {boxShadow:"0 4px 20px rgba(0,0,0,.04)", borderRadius:"20px", border:"1px solid rgba(0,0,0,.03)", background:"#FFFFFF"};
const SH2 = {boxShadow:"0 12px 40px -8px rgba(220,38,38,.20)", borderRadius:"24px", border:"1px solid rgba(255,255,255,.4)"};
const iCol = v => v>=1?"#16A34A":v>=.9?"#F59E0B":"#EF4444";

/* ════════════ DATA: PROJECTS ════════════ */
const IP = [
  {id:"P1",code:"PTM-001",name:"Kilang Minyak Balikpapan",      co:"Pertamina",    start:"2025-01-02",end:"2025-09-30",bud:8500,st:"on-track"},
  {id:"P2",code:"PTM-002",name:"Ekspansi RFCC Cilacap",          co:"Pertamina",    start:"2025-03-01",end:"2025-12-31",bud:3200,st:"on-track"},
  {id:"P3",code:"PLN-001",name:"Transmisi Sumatera 500kV",       co:"PLN",          start:"2024-10-01",end:"2025-09-30",bud:5800,st:"at-risk"},
  {id:"P4",code:"PLN-002",name:"PLTS Nusa Penida 50MW",          co:"PLN",          start:"2025-02-01",end:"2025-11-30",bud:1200,st:"on-track"},
  {id:"P5",code:"MID-001",name:"Smelter Grade Alumina Mempawah", co:"MIND ID",      start:"2024-07-01",end:"2026-06-30",bud:9800,st:"at-risk"},
  {id:"P6",code:"HK-001", name:"Tol Trans Sumatera Rengat",      co:"Hutama Karya", start:"2024-11-01",end:"2025-10-31",bud:4500,st:"on-track"},
  {id:"P7",code:"WK-001", name:"Waduk Karian",                   co:"Waskita Karya",start:"2023-01-01",end:"2025-09-30",bud:2800,st:"delayed"},
];

/* ════════════ DATA: ACTIVITIES ════════════ */
const IA = [
  {id:"A01",pid:"P1",wbs:"1",  nm:"Engineering & Design",    lv:1,tp:"summary",  s:"2025-01-02",e:"2025-02-21",d:50, p:100,pr:"",   cr:false,res:"Tim Engineering"},
  {id:"A02",pid:"P1",wbs:"1.1",nm:"Process Engineering",     lv:2,tp:"task",     s:"2025-01-02",e:"2025-02-01",d:30, p:100,pr:"",   cr:false,res:"PE Lead"},
  {id:"A03",pid:"P1",wbs:"1.2",nm:"Civil Engineering",       lv:2,tp:"task",     s:"2025-01-08",e:"2025-02-07",d:30, p:100,pr:"",   cr:false,res:"CE Lead"},
  {id:"A04",pid:"P1",wbs:"1.3",nm:"Mechanical Engineering",  lv:2,tp:"task",     s:"2025-02-01",e:"2025-02-21",d:20, p:100,pr:"A02",cr:false,res:"ME Lead"},
  {id:"A05",pid:"P1",wbs:"2",  nm:"Procurement",             lv:1,tp:"summary",  s:"2025-02-03",e:"2025-05-16",d:103,p:86, pr:"",   cr:true, res:"Procurement"},
  {id:"A06",pid:"P1",wbs:"2.1",nm:"Main Equipment",          lv:2,tp:"task",     s:"2025-02-03",e:"2025-04-18",d:74, p:85, pr:"A02",cr:true, res:"Proc. Mgr"},
  {id:"A07",pid:"P1",wbs:"2.2",nm:"Bulk Material",           lv:2,tp:"task",     s:"2025-02-08",e:"2025-03-29",d:49, p:90, pr:"A03",cr:false,res:"Proc. Staff"},
  {id:"A08",pid:"P1",wbs:"2.3",nm:"Sparepart & Consumable",  lv:2,tp:"task",     s:"2025-03-01",e:"2025-04-05",d:35, p:80, pr:"A06",cr:false,res:"Proc. Staff"},
  {id:"A09",pid:"P1",wbs:"3",  nm:"Construction",            lv:1,tp:"summary",  s:"2025-03-15",e:"2025-08-15",d:153,p:45, pr:"",   cr:true, res:"Konstruksi"},
  {id:"A10",pid:"P1",wbs:"3.1",nm:"Civil Works",             lv:2,tp:"task",     s:"2025-03-15",e:"2025-06-27",d:104,p:72, pr:"A07",cr:false,res:"Site Mgr"},
  {id:"A11",pid:"P1",wbs:"3.2",nm:"Mechanical Installation", lv:2,tp:"task",     s:"2025-04-19",e:"2025-08-01",d:104,p:40, pr:"A06",cr:true, res:"Mech Sup"},
  {id:"A12",pid:"P1",wbs:"3.3",nm:"Electrical & Instrument", lv:2,tp:"task",     s:"2025-07-01",e:"2025-08-15",d:45, p:10, pr:"A11",cr:false,res:"E&I Sup"},
  {id:"A13",pid:"P1",wbs:"4",  nm:"Testing & Commissioning", lv:1,tp:"summary",  s:"2025-08-01",e:"2025-09-15",d:45, p:0,  pr:"",   cr:true, res:"Commissioning"},
  {id:"A14",pid:"P1",wbs:"4.1",nm:"Pre-Commissioning",       lv:2,tp:"task",     s:"2025-08-01",e:"2025-08-21",d:20, p:0,  pr:"A12",cr:true, res:"Comm Team"},
  {id:"A15",pid:"P1",wbs:"4.2",nm:"Commissioning & Testing", lv:2,tp:"task",     s:"2025-08-22",e:"2025-09-05",d:14, p:0,  pr:"A14",cr:true, res:"Comm Team"},
  {id:"A16",pid:"P1",wbs:"5",  nm:"Handover & COD",          lv:1,tp:"milestone",s:"2025-09-15",e:"2025-09-15",d:0,  p:0,  pr:"A15",cr:true, res:"PM"},
  {id:"B01",pid:"P3",wbs:"1",  nm:"Survey & Desain",         lv:1,tp:"summary",  s:"2024-10-01",e:"2025-01-31",d:123,p:100,pr:"",   cr:false,res:"Survey"},
  {id:"B02",pid:"P3",wbs:"2",  nm:"Pembebasan Lahan",        lv:1,tp:"task",     s:"2024-11-01",e:"2025-05-31",d:211,p:65, pr:"",   cr:true, res:"Land Acq"},
  {id:"B03",pid:"P3",wbs:"3",  nm:"Konstruksi Tower",        lv:1,tp:"task",     s:"2025-03-01",e:"2025-08-31",d:183,p:38, pr:"B02",cr:true, res:"Konstruksi"},
  {id:"B04",pid:"P3",wbs:"4",  nm:"Pemasangan Konduktor",    lv:1,tp:"task",     s:"2025-06-01",e:"2025-08-31",d:91, p:10, pr:"B03",cr:true, res:"Stringing"},
  {id:"B05",pid:"P3",wbs:"5",  nm:"Testing & Energize",      lv:1,tp:"milestone",s:"2025-09-30",e:"2025-09-30",d:0,  p:0,  pr:"B04",cr:true, res:"Comm"},
];

/* ════════════ DATA: COST/EVM ════════════ */
// Per-WBS budget (BAC) & actual cost (AC) input by company; EV computed from progress
const ICOST = [
  {id:"C01",pid:"P1",wbs:"1",  nm:"Engineering & Design",   bac:850, ac:840,  p:100},
  {id:"C02",pid:"P1",wbs:"2",  nm:"Procurement",            bac:3400,ac:3180, p:86},
  {id:"C03",pid:"P1",wbs:"3",  nm:"Construction",           bac:3060,ac:1480, p:45},
  {id:"C04",pid:"P1",wbs:"4",  nm:"Testing & Commissioning",bac:1020,ac:0,    p:0},
  {id:"C05",pid:"P1",wbs:"5",  nm:"Handover & COD",         bac:170, ac:0,    p:0},
];
// Monthly EVM curve (cumulative, in Miliar)
const IEVM = [
  {m:"Jan",pv:280, ev:270, ac:265},
  {m:"Feb",pv:680, ev:660, ac:650},
  {m:"Mar",pv:1450,ev:1380,ac:1360},
  {m:"Apr",pv:2900,ev:2720,ac:2780},
  {m:"Mei",pv:4200,ev:3850,ac:3980},
  {m:"Jun",pv:5400,ev:4880,ac:5100},
  {m:"Jul",pv:6500,ev:null,ac:null},
  {m:"Agu",pv:7600,ev:null,ac:null},
  {m:"Sep",pv:8500,ev:null,ac:null},
];

/* ════════════ DATA: RISK ════════════ */
const IRISK = [
  {id:"R01",pid:"P5",co:"MIND ID",     cat:"Pengadaan", desc:"Keterlambatan impor equipment dari Tiongkok",     prob:4,imp:4,owner:"Procurement Mgr",mit:"Sourcing alternatif vendor lokal & buffer stock kritikal",st:"Open",     due:"2025-08-15"},
  {id:"R02",pid:"P3",co:"PLN",         cat:"Lahan",     desc:"Pembebasan lahan Riau terhambat sengketa warga",   prob:4,imp:3,owner:"Land Acq Lead", mit:"Mediasi & percepatan appraisal independen",            st:"Mitigasi", due:"2025-07-31"},
  {id:"R03",pid:"P1",co:"Pertamina",   cat:"Biaya",     desc:"Kenaikan harga material baja global",              prob:3,imp:3,owner:"Cost Control",  mit:"Kontrak harga tetap (lump-sum) untuk material utama", st:"Monitor",  due:"2025-09-30"},
  {id:"R04",pid:"P7",co:"Waskita",     cat:"Cuaca",     desc:"Cuaca ekstrem musim hujan ganggu konstruksi",      prob:3,imp:2,owner:"Site Manager",  mit:"Penyesuaian jadwal & metode kerja basah",              st:"Monitor",  due:"2025-08-01"},
  {id:"R05",pid:"P6",co:"Hutama Karya",cat:"Regulasi",  desc:"Perubahan regulasi kontraktor PUPR",               prob:2,imp:3,owner:"Legal",         mit:"Review kontrak & penyesuaian dokumen administrasi",    st:"Closed",   due:"2025-06-01"},
  {id:"R06",pid:"P5",co:"MIND ID",     cat:"Teknis",    desc:"Kompleksitas integrasi teknologi smelter baru",    prob:3,imp:4,owner:"Tech Lead",     mit:"Pendampingan teknologi & uji coba bertahap",           st:"Open",     due:"2025-10-15"},
  {id:"R07",pid:"P3",co:"PLN",         cat:"Keuangan",  desc:"Fluktuasi nilai tukar pada komponen impor",        prob:3,imp:3,owner:"Finance",       mit:"Hedging valuta & natural hedging kontrak",             st:"Mitigasi", due:"2025-09-30"},
];

/* ════════════ DATA: ISSUES ════════════ */
const IISSUE = [
  {id:"I01",pid:"P3",co:"PLN",      title:"Akses jalan ke lokasi tower T-45 tertutup longsor", prio:"Tinggi", st:"Open",      assignee:"Site Engineer", due:"2025-07-05",created:"2025-06-22"},
  {id:"I02",pid:"P5",co:"MIND ID",  title:"Dokumen bea cukai equipment tertahan di pelabuhan", prio:"Kritis", st:"In Progress",assignee:"Logistics Mgr", due:"2025-07-02",created:"2025-06-18"},
  {id:"I03",pid:"P1",co:"Pertamina",title:"Revisi spek pompa dari vendor butuh approval ulang",prio:"Sedang", st:"In Progress",assignee:"Eng Manager",   due:"2025-07-10",created:"2025-06-25"},
  {id:"I04",pid:"P7",co:"Waskita",  title:"Keterlambatan pembayaran termin subkontraktor",     prio:"Tinggi", st:"Open",      assignee:"Finance",       due:"2025-07-08",created:"2025-06-26"},
  {id:"I05",pid:"P6",co:"Hutama K.",title:"Quality issue pada hasil pengecoran segmen 3",      prio:"Sedang", st:"Resolved",  assignee:"QC Lead",       due:"2025-06-20",created:"2025-06-10"},
];

/* ════════════ COMPANY PORTFOLIO ════════════ */
const COS_PF = [
  {n:"Pertamina",   sec:"Energi & Migas",    proj:24,pct:68,target:71,spi:.96, cpi:.98, bud:45.2,sp:32.1,risk:3,col:"#C0392B"},
  {n:"PLN",         sec:"Ketenagalistrikan", proj:31,pct:72,target:71,spi:1.02,cpi:.95, bud:38.7,sp:28.4,risk:5,col:"#E67E22"},
  {n:"MIND ID",     sec:"Pertambangan",      proj:18,pct:45,target:71,spi:.82, cpi:.89, bud:22.3,sp:14.8,risk:6,col:"#8E44AD"},
  {n:"Hutama Karya",sec:"Infrastruktur",     proj:15,pct:83,target:71,spi:1.05,cpi:1.02,bud:18.9,sp:17.2,risk:2,col:"#27AE60"},
  {n:"Waskita Karya",sec:"Konstruksi",       proj:12,pct:38,target:71,spi:.74, cpi:.85, bud:15.6,sp:8.9, risk:4,col:"#D35400"},
  {n:"INALUM",      sec:"Manufaktur",        proj:9, pct:61,target:71,spi:.93, cpi:.97, bud:12.4,sp:7.8, risk:2,col:"#2980B9"},
];

/* ════════════ SHARED COMPONENTS ════════════ */
const BCF = {"on-track":["#DCFCE7","#15803D","On Track"],"at-risk":["#FEF3C7","#92400E","At Risk"],"delayed":["#FEE2E2","#991B1B","Delayed"]};
function Badge({st}){ const [bg,c,lb]=BCF[st]||BCF["on-track"]; return <span className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{background:bg,color:c}}>{lb}</span>; }
function PBar({v,h="h-1.5",col}){ const c=col||(v>=80?"#16A34A":v>=40?"#F59E0B":"#EF4444"); return <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${h}`}><div className="h-full rounded-full transition-all" style={{width:`${Math.min(100,v)}%`,background:c}}></div></div>; }
const TIC={summary:"📁",task:"📌",milestone:"🔷"};
const TCL={summary:"#7F1D1D",task:"#EF4444",milestone:"#7C3AED"};
const calcProg = acts => { const t=acts.filter(a=>a.tp==="task"); return t.length?Math.round(t.reduce((s,a)=>s+a.p,0)/t.length):0; };

/* EVM calc helper */
function evmCalc(bac, ac, pct){
  const ev = bac * pct/100;
  const cv = ev - ac;
  const cpi = ac>0 ? ev/ac : 1;
  const eac = cpi>0 ? bac/cpi : bac;
  const vac = bac - eac;
  return {ev, cv, cpi, eac, vac};
}

/* ════════════ MODALS ════════════ */
function Modal({title,sub,children,onClose,w="480px",accent="#DC2626"}){
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
const Inp = ({label,...p}) => (
  <div><label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-red-400 focus:outline-none" {...p}/></div>
);
const Sel = ({label,children,...p}) => (
  <div><label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
    <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-red-400 focus:outline-none bg-white" {...p}>{children}</select></div>
);

/* ─── Add Project ─── */
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
const projProg = (acts,pid) => { const pa=acts.filter(a=>a.pid===pid&&a.tp==="task"); return pa.length?Math.round(pa.reduce((s,a)=>s+a.p,0)/pa.length):0; };
const projSpiCpi = {P1:[.96,.98],P2:[1.01,.99],P3:[.79,.88],P4:[1.03,.97],P5:[.82,.89],P6:[1.05,1.02],P7:[.74,.85]};

function Projects({projs,setProjs,acts,setActs}){
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
const SCURVE=[{m:"Jan",plan:5,act:4.8},{m:"Feb",plan:12,act:11.2},{m:"Mar",plan:20,act:18.5},{m:"Apr",plan:30,act:27.3},{m:"Mei",plan:42,act:38.1},{m:"Jun",plan:55,act:50.2},{m:"Jul",plan:63,act:null},{m:"Agu",plan:72,act:null},{m:"Sep",plan:80,act:null},{m:"Okt",plan:87,act:null},{m:"Nov",plan:94,act:null},{m:"Des",plan:100,act:null}];
const PIE_ST=[{name:"On Track",value:74,color:"#16A34A"},{name:"At Risk",value:18,color:"#F59E0B"},{name:"Delayed",value:8,color:"#EF4444"}];

function Dashboard({setView}){
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
function Portfolio(){
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
function CostEVM({projs,acts}){
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

function Risk({projs}){
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
