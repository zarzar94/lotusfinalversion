import{r as h,j as e}from"./vendor-three-BrlK21-_.js";import{p as y}from"./pptxSlides-CQAOSzOr.js";import{k as s,e as t,d as a,z as c,c as l,l as x,y as b,r as m}from"./main-BjvDmNYI.js";import"./vendor-react-BNvW8MaY.js";const g=[{slideId:42,label:"نورة (15)",focus:"فرط حساسية السمع / Distortion"},{slideId:43,label:"سفانة (5)",focus:"APD / CAPD"},{slideId:44,label:"هشام (11)",focus:"صعوبات تعلم"},{slideId:45,label:"فاطمة (72)",focus:"طنين الأذن"},{slideId:46,label:"مازن (11)",focus:"صعوبات تعلم"}],f=`
  @keyframes hudPulse {
    0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${t}; }
    50% { opacity: 1; box-shadow: 0 0 10px ${t}; }
  }
  @keyframes scanLine {
    0% { left: -20%; opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { left: 120%; opacity: 0; }
  }
  @keyframes dataStream {
    0% { transform: translateY(100%); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes cardGlow {
    0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    50% { box-shadow: 0 8px 32px rgba(176,18,112,0.2); }
  }
  .results-hud-corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: ${t};
    border-style: solid;
    animation: hudPulse 3s ease-in-out infinite;
  }
  .results-scan-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    background: linear-gradient(90deg, transparent, ${t}25, transparent);
    animation: scanLine 4s linear infinite;
    pointer-events: none;
  }
  .results-data-particle {
    position: absolute;
    width: 2px;
    height: 6px;
    background: ${t};
    opacity: 0.4;
    animation: dataStream 3s linear infinite;
  }
  .case-study-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(176,18,112,0.25) !important;
    border-color: ${t} !important;
  }
  @media (max-width: 640px) {
    .case-studies-grid {
      grid-template-columns: 1fr !important;
    }
  }
`,w=()=>{const[d,n]=h.useState(null),r=h.useMemo(()=>d?y.find(i=>i.id===d)??null:null,[d]);return e.jsxs("section",{id:"results",style:{...s.sectionCard,position:"relative",overflow:"hidden"},children:[e.jsx("style",{children:f}),e.jsx("div",{className:"results-hud-corner",style:{top:8,left:8,borderWidth:"2px 0 0 2px"}}),e.jsx("div",{className:"results-hud-corner",style:{top:8,right:8,borderWidth:"2px 2px 0 0"}}),e.jsx("div",{className:"results-hud-corner",style:{bottom:8,left:8,borderWidth:"0 0 2px 2px"}}),e.jsx("div",{className:"results-hud-corner",style:{bottom:8,right:8,borderWidth:"0 2px 2px 0"}}),e.jsx("div",{className:"results-scan-line"}),e.jsx("div",{className:"results-data-particle",style:{right:"12%",animationDelay:"0s"}}),e.jsx("div",{className:"results-data-particle",style:{right:"32%",animationDelay:"1s"}}),e.jsx("div",{className:"results-data-particle",style:{right:"52%",animationDelay:"2s"}}),e.jsxs("div",{style:s.sectionHeader,children:[e.jsxs("div",{style:s.sectionHeaderRow,children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("div",{style:{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg, ${t}22, ${a}22)`,border:`1px solid ${t}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:`0 0 20px ${t}15`},children:"📊"}),e.jsxs("div",{children:[e.jsx("h2",{style:{...s.h2,margin:0},children:"نتائج ودراسات حالة (قبل / بعد)"}),e.jsx("div",{style:{fontSize:10,fontFamily:"monospace",color:"rgba(255,255,255,0.4)",letterSpacing:1,marginTop:4},children:"LOTUS SOUND LAB // CLINICAL OUTCOMES DATA"})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("span",{style:{...s.chip,background:`linear-gradient(135deg, ${t}15, ${a}10)`,borderColor:`${t}35`},children:e.jsx("span",{style:{color:t,fontWeight:700},children:"CASE STUDIES"})}),e.jsxs("span",{style:{padding:"6px 12px",background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:8,fontSize:10,fontWeight:700,color:"#22c55e",fontFamily:"monospace"},children:[g.length," RECORDS"]})]})]}),e.jsx("p",{style:{...s.bodyText,marginTop:8},children:"أمثلة توضيحية من الشرائح تعرض تغيّرات قبل/بعد في بعض القياسات أو المؤشرات السمعية. تُعرض هنا لأغراض تعليمية/توعوية ولا تُعد ضماناً أو نتيجة متوقعة لكل حالة."}),e.jsxs("div",{style:{marginTop:8,padding:"8px 14px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:14},children:"⚠️"}),e.jsx("p",{style:{...s.muted,margin:0,fontSize:12},children:"لا تشكّل هذه الأمثلة تشخيصاً طبياً. أي قرار علاجي يجب أن يكون عبر مختص."})]})]}),e.jsx("div",{className:"case-studies-grid",style:{marginTop:20,display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"},children:g.map((i,p)=>{const o=y.find(u=>u.id===i.slideId);return o?e.jsxs("button",{type:"button",className:"case-study-card",style:{...s.gameCard,textAlign:"start",cursor:"pointer",position:"relative",overflow:"hidden",border:`1px solid ${c.borders.default}`,transition:"all 0.3s ease"},onClick:()=>n(i.slideId),children:[e.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg, transparent, ${t}66, ${l}66, transparent)`,opacity:.6}}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx("img",{src:x(o.thumb),alt:o.title,style:{width:"100%",borderRadius:10,border:`1px solid ${c.borders.subtle}`},loading:"lazy"}),e.jsxs("div",{style:{position:"absolute",top:8,right:8,padding:"4px 10px",background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",border:`1px solid ${t}40`,borderRadius:6,fontSize:10,fontWeight:700,color:t,fontFamily:"monospace"},children:["CASE #",p+1]})]}),e.jsxs("div",{style:{marginTop:12,display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"},children:[e.jsxs("div",{style:{fontWeight:900,color:l,display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:l,boxShadow:`0 0 6px ${l}`}}),i.label]}),e.jsxs("span",{style:{...s.chip,background:"rgba(0,0,0,0.3)",borderColor:`${t}30`,fontSize:9,fontFamily:"monospace"},children:["SLIDE ",i.slideId]})]}),e.jsx("div",{style:{marginTop:8,fontWeight:900,color:b,lineHeight:1.35},children:o.title}),e.jsxs("div",{style:{marginTop:6,...s.muted,display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{style:{width:4,height:4,borderRadius:"50%",background:"#f59e0b"}}),i.focus]}),e.jsxs("div",{style:{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"},children:[e.jsxs("span",{style:{...s.chip,background:`${l}12`,borderColor:`${l}30`,fontSize:10},children:[e.jsx("span",{style:{color:l},children:"◀"})," قبل"]}),e.jsxs("span",{style:{...s.chip,background:`${a}12`,borderColor:`${a}30`,fontSize:10},children:[e.jsx("span",{style:{color:a},children:"▶"})," بعد"]}),e.jsxs("span",{style:{...s.chip,background:`${t}12`,borderColor:`${t}30`,fontSize:10},children:[e.jsx("span",{style:{color:t},children:"⇄"})," مقارنة"]})]})]},i.slideId):null})}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:12,flexWrap:"wrap"},children:[e.jsxs("a",{href:"#pptx",style:{...s.primaryBtn,textDecoration:"none",display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{children:"📑"})," عرض جميع الشرائح"]}),e.jsxs("a",{href:"#contact",style:{...s.ghostBtn,textDecoration:"none",display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{children:"📋"})," اطلب تقييم / عرض للمدرسة"]})]}),e.jsxs("div",{style:{marginTop:24,padding:"12px 16px",background:"rgba(0,0,0,0.3)",borderRadius:m.lg,border:`1px solid ${c.borders.subtle}`,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[e.jsx("div",{style:{fontSize:9,fontFamily:"monospace",color:"rgba(255,255,255,0.35)",letterSpacing:1},children:"LOTUS SOUND LAB // CASE STUDY DATABASE"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("div",{style:{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}),e.jsx("span",{style:{fontSize:9,fontFamily:"monospace",color:"#22c55e",letterSpacing:.5},children:"DATA VERIFIED"})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsxs("span",{style:{fontSize:9,fontFamily:"monospace",color:"rgba(255,255,255,0.4)",letterSpacing:.5},children:[g.length," CASES • EDUCATIONAL USE"]}),e.jsx("div",{style:{display:"flex",gap:3},children:[l,a,t].map((i,p)=>e.jsx("div",{style:{width:12,height:4,borderRadius:2,background:i,opacity:.6}},p))})]})]}),r?e.jsx("div",{style:s.modalBackdrop,onClick:()=>n(null),role:"dialog","aria-modal":"true",children:e.jsxs("div",{style:{...s.modal,padding:18},onClick:i=>i.stopPropagation(),children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"},children:[e.jsxs("span",{style:{...s.chip,background:"rgba(176,18,112,0.14)",borderColor:"rgba(176,18,112,0.25)"},children:["📊 شريحة ",r.id]}),e.jsx("div",{style:{fontWeight:900,fontSize:18,color:b},children:r.title})]}),e.jsx("button",{type:"button",style:s.ghostBtn,onClick:()=>n(null),children:"إغلاق"})]}),e.jsx("div",{style:{marginTop:14,borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,0.10)"},children:e.jsx("img",{src:x(r.image),alt:r.title,style:{width:"100%",display:"block",background:"#0f1629"}})}),r.body?e.jsxs("div",{style:{marginTop:12},children:[e.jsx("div",{style:{fontWeight:900,color:t},children:"ملاحظات مختصرة"}),e.jsx("div",{style:{...s.muted,marginTop:6},children:r.body.split(`
`).filter(Boolean).slice(0,3).join(" • ")})]}):null,e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginTop:14},children:[e.jsx("a",{href:x(r.image),download:!0,style:{...s.primaryBtn,textDecoration:"none"},children:"تحميل الصورة"}),e.jsx("a",{href:"#pptx",style:{...s.ghostBtn,textDecoration:"none"},onClick:()=>n(null),children:"فتح في عارض الشرائح"})]})]})}):null]})};export{w as default};
