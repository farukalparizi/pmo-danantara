export const IP = [
  {id:"P1",code:"PTM-001",name:"Kilang Minyak Balikpapan",      co:"Pertamina",    start:"2025-01-02",end:"2025-09-30",bud:8500,st:"on-track"},
  {id:"P2",code:"PTM-002",name:"Ekspansi RFCC Cilacap",          co:"Pertamina",    start:"2025-03-01",end:"2025-12-31",bud:3200,st:"on-track"},
  {id:"P3",code:"PLN-001",name:"Transmisi Sumatera 500kV",       co:"PLN",          start:"2024-10-01",end:"2025-09-30",bud:5800,st:"at-risk"},
  {id:"P4",code:"PLN-002",name:"PLTS Nusa Penida 50MW",          co:"PLN",          start:"2025-02-01",end:"2025-11-30",bud:1200,st:"on-track"},
  {id:"P5",code:"MID-001",name:"Smelter Grade Alumina Mempawah", co:"MIND ID",      start:"2024-07-01",end:"2026-06-30",bud:9800,st:"at-risk"},
  {id:"P6",code:"HK-001", name:"Tol Trans Sumatera Rengat",      co:"Hutama Karya", start:"2024-11-01",end:"2025-10-31",bud:4500,st:"on-track"},
  {id:"P7",code:"WK-001", name:"Waduk Karian",                   co:"Waskita Karya",start:"2023-01-01",end:"2025-09-30",bud:2800,st:"delayed"},
];

/* ════════════ DATA: ACTIVITIES ════════════ */
export const IA = [
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
export const ICOST = [
  {id:"C01",pid:"P1",wbs:"1",  nm:"Engineering & Design",   bac:850, ac:840,  p:100},
  {id:"C02",pid:"P1",wbs:"2",  nm:"Procurement",            bac:3400,ac:3180, p:86},
  {id:"C03",pid:"P1",wbs:"3",  nm:"Construction",           bac:3060,ac:1480, p:45},
  {id:"C04",pid:"P1",wbs:"4",  nm:"Testing & Commissioning",bac:1020,ac:0,    p:0},
  {id:"C05",pid:"P1",wbs:"5",  nm:"Handover & COD",         bac:170, ac:0,    p:0},
];
// Monthly EVM curve (cumulative, in Miliar)
export const IEVM = [
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
export const IRISK = [
  {id:"R01",pid:"P5",co:"MIND ID",     cat:"Pengadaan", desc:"Keterlambatan impor equipment dari Tiongkok",     prob:4,imp:4,owner:"Procurement Mgr",mit:"Sourcing alternatif vendor lokal & buffer stock kritikal",st:"Open",     due:"2025-08-15"},
  {id:"R02",pid:"P3",co:"PLN",         cat:"Lahan",     desc:"Pembebasan lahan Riau terhambat sengketa warga",   prob:4,imp:3,owner:"Land Acq Lead", mit:"Mediasi & percepatan appraisal independen",            st:"Mitigasi", due:"2025-07-31"},
  {id:"R03",pid:"P1",co:"Pertamina",   cat:"Biaya",     desc:"Kenaikan harga material baja global",              prob:3,imp:3,owner:"Cost Control",  mit:"Kontrak harga tetap (lump-sum) untuk material utama", st:"Monitor",  due:"2025-09-30"},
  {id:"R04",pid:"P7",co:"Waskita",     cat:"Cuaca",     desc:"Cuaca ekstrem musim hujan ganggu konstruksi",      prob:3,imp:2,owner:"Site Manager",  mit:"Penyesuaian jadwal & metode kerja basah",              st:"Monitor",  due:"2025-08-01"},
  {id:"R05",pid:"P6",co:"Hutama Karya",cat:"Regulasi",  desc:"Perubahan regulasi kontraktor PUPR",               prob:2,imp:3,owner:"Legal",         mit:"Review kontrak & penyesuaian dokumen administrasi",    st:"Closed",   due:"2025-06-01"},
  {id:"R06",pid:"P5",co:"MIND ID",     cat:"Teknis",    desc:"Kompleksitas integrasi teknologi smelter baru",    prob:3,imp:4,owner:"Tech Lead",     mit:"Pendampingan teknologi & uji coba bertahap",           st:"Open",     due:"2025-10-15"},
  {id:"R07",pid:"P3",co:"PLN",         cat:"Keuangan",  desc:"Fluktuasi nilai tukar pada komponen impor",        prob:3,imp:3,owner:"Finance",       mit:"Hedging valuta & natural hedging kontrak",             st:"Mitigasi", due:"2025-09-30"},
];

/* ════════════ DATA: ISSUES ════════════ */
export const IISSUE = [
  {id:"I01",pid:"P3",co:"PLN",      title:"Akses jalan ke lokasi tower T-45 tertutup longsor", prio:"Tinggi", st:"Open",      assignee:"Site Engineer", due:"2025-07-05",created:"2025-06-22"},
  {id:"I02",pid:"P5",co:"MIND ID",  title:"Dokumen bea cukai equipment tertahan di pelabuhan", prio:"Kritis", st:"In Progress",assignee:"Logistics Mgr", due:"2025-07-02",created:"2025-06-18"},
  {id:"I03",pid:"P1",co:"Pertamina",title:"Revisi spek pompa dari vendor butuh approval ulang",prio:"Sedang", st:"In Progress",assignee:"Eng Manager",   due:"2025-07-10",created:"2025-06-25"},
  {id:"I04",pid:"P7",co:"Waskita",  title:"Keterlambatan pembayaran termin subkontraktor",     prio:"Tinggi", st:"Open",      assignee:"Finance",       due:"2025-07-08",created:"2025-06-26"},
  {id:"I05",pid:"P6",co:"Hutama K.",title:"Quality issue pada hasil pengecoran segmen 3",      prio:"Sedang", st:"Resolved",  assignee:"QC Lead",       due:"2025-06-20",created:"2025-06-10"},
];
export const COS_PF = [
  {n:"Pertamina",   sec:"Energi & Migas",    proj:24,pct:68,target:71,spi:.96, cpi:.98, bud:45.2,sp:32.1,risk:3,col:"#C0392B"},
  {n:"PLN",         sec:"Ketenagalistrikan", proj:31,pct:72,target:71,spi:1.02,cpi:.95, bud:38.7,sp:28.4,risk:5,col:"#E67E22"},
  {n:"MIND ID",     sec:"Pertambangan",      proj:18,pct:45,target:71,spi:.82, cpi:.89, bud:22.3,sp:14.8,risk:6,col:"#8E44AD"},
  {n:"Hutama Karya",sec:"Infrastruktur",     proj:15,pct:83,target:71,spi:1.05,cpi:1.02,bud:18.9,sp:17.2,risk:2,col:"#27AE60"},
  {n:"Waskita Karya",sec:"Konstruksi",       proj:12,pct:38,target:71,spi:.74, cpi:.85, bud:15.6,sp:8.9, risk:4,col:"#D35400"},
  {n:"INALUM",      sec:"Manufaktur",        proj:9, pct:61,target:71,spi:.93, cpi:.97, bud:12.4,sp:7.8, risk:2,col:"#2980B9"},
];

/* ════════════ SHARED COMPONENTS ════════════ */