import{j as e}from"./vendor-three-BrlK21-_.js";import{k as o,c as i,d as t,e as s,y as l,z as a,r as d}from"./main-BjvDmNYI.js";import"./vendor-react-BNvW8MaY.js";const c=`
  @keyframes hudPulse {
    0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${i}; }
    50% { opacity: 1; box-shadow: 0 0 10px ${i}; }
  }
  @keyframes scanLine {
    0% { left: -20%; opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { left: 120%; opacity: 0; }
  }
  @keyframes neuralPulse {
    0% { transform: scale(0.95); opacity: 0.7; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.7; }
  }
  @keyframes synapseFire {
    0%, 100% { box-shadow: 0 0 5px ${i}40; }
    50% { box-shadow: 0 0 20px ${i}80, 0 0 30px ${t}40; }
  }
  @keyframes dataStream {
    0% { transform: translateY(100%); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes brainWave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.3); }
  }
  .neuro-hud-corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: ${i};
    border-style: solid;
    animation: hudPulse 3s ease-in-out infinite;
  }
  .neuro-scan-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    background: linear-gradient(90deg, transparent, ${i}25, transparent);
    animation: scanLine 4s linear infinite;
    pointer-events: none;
  }
  .neuro-data-particle {
    position: absolute;
    width: 2px;
    height: 6px;
    background: ${i};
    opacity: 0.4;
    animation: dataStream 3s linear infinite;
  }
  .neural-card:hover {
    transform: translateY(-6px) !important;
    border-color: var(--card-color) !important;
    box-shadow: 0 12px 30px var(--card-glow) !important;
  }
  .neural-card:hover .neural-icon {
    animation: neuralPulse 1s ease-in-out infinite;
  }
  @media (max-width: 640px) {
    .brain-facts-grid {
      grid-template-columns: 1fr !important;
    }
  }
`,p=[{icon:"🧠",title:"الدماغ قابل للتغيير",description:"الخلايا العصبية في أدمغتنا قابلة للتعديل وإعادة التشكيل طوال الحياة",color:i},{icon:"🔄",title:"إعادة التوصيل",description:"يمكن للدماغ إنشاء مسارات عصبية جديدة من خلال التدريب المكثف والمتكرر",color:t},{icon:"📈",title:"التعلم مدى الحياة",description:"اللدونة العصبية تمكّن التعلم والتحسن في أي عمر",color:s},{icon:"🎯",title:"الكثافة والتكرار",description:"التغيير يتطلب التعرض للنشاط بكثافة وتكرار ومدة كافية",color:l}];function y(){return e.jsxs("section",{id:"neuroplasticity",style:{...o.sectionCard,position:"relative",overflow:"hidden"},children:[e.jsx("style",{children:c}),e.jsx("div",{className:"neuro-hud-corner",style:{top:8,left:8,borderWidth:"2px 0 0 2px"}}),e.jsx("div",{className:"neuro-hud-corner",style:{top:8,right:8,borderWidth:"2px 2px 0 0"}}),e.jsx("div",{className:"neuro-hud-corner",style:{bottom:8,left:8,borderWidth:"0 0 2px 2px"}}),e.jsx("div",{className:"neuro-hud-corner",style:{bottom:8,right:8,borderWidth:"0 2px 2px 0"}}),e.jsx("div",{className:"neuro-scan-line"}),e.jsx("div",{className:"neuro-data-particle",style:{right:"10%",animationDelay:"0s"}}),e.jsx("div",{className:"neuro-data-particle",style:{right:"30%",animationDelay:"1s"}}),e.jsx("div",{className:"neuro-data-particle",style:{right:"50%",animationDelay:"2s"}}),e.jsx("div",{style:o.sectionHeader,children:e.jsxs("div",{style:o.sectionHeaderRow,children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("div",{style:{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg, ${i}22, ${t}22)`,border:`1px solid ${i}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:`0 0 25px ${i}15`,animation:"synapseFire 3s ease-in-out infinite"},children:"🧠"}),e.jsxs("div",{children:[e.jsx("h2",{style:{...o.h2,margin:0},children:"اللدونة العصبية: أساس التغيير"}),e.jsx("div",{style:{fontSize:10,fontFamily:"monospace",color:"rgba(255,255,255,0.4)",letterSpacing:1,marginTop:4},children:"LOTUS SOUND LAB // NEUROPLASTICITY SCIENCE MODULE"})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("span",{style:{...o.chip,background:`linear-gradient(135deg, ${t}15, ${i}10)`,borderColor:`${t}35`},children:e.jsx("span",{style:{color:t,fontWeight:700},children:"NEUROSCIENCE"})}),e.jsx("span",{style:{padding:"6px 12px",background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:8,fontSize:10,fontWeight:700,color:"#22c55e",fontFamily:"monospace"},children:"EVIDENCE-BASED"})]})]})}),e.jsxs("div",{style:{margin:"20px 0",padding:24,background:"linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))",borderRadius:16,borderRight:`4px solid ${i}`,position:"relative"},children:[e.jsx("div",{style:{position:"absolute",top:10,right:16,fontSize:48,opacity:.15,color:i},children:'"'}),e.jsxs("p",{style:{fontSize:18,lineHeight:1.8,color:"#f7f8fb",margin:0,fontWeight:500},children:["اللدونة العصبية تعني أن الخلايا العصبية في أدمغتنا وأجهزتنا العصبية",e.jsx("span",{style:{color:i,fontWeight:800},children:" قابلة للتغيير"}),"، أو يمكنها تعديل نفسها."]}),e.jsx("div",{style:{marginTop:12,fontSize:14,color:"rgba(255,255,255,0.7)",fontWeight:700},children:'— نورمان دويدج، مؤلف كتاب "الدماغ الذي يُغيّر نفسه"'})]}),e.jsxs("div",{style:{...o.bodyText,marginTop:16},children:[e.jsxs("p",{style:{margin:"0 0 12px"},children:["يعتمد برنامج ",e.jsx("b",{style:{color:i},children:"Berard AIT"})," على مبدأ اللدونة العصبية — قدرة الدماغ الرائعة على إعادة تنظيم نفسه من خلال تكوين روابط عصبية جديدة."]}),e.jsxs("p",{style:{margin:0},children:["لتحفيز هذه التغييرات، يتطلب البرنامج",e.jsx("span",{style:{color:s,fontWeight:700},children:" التعرض لنشاط سمعي بكثافة وتكرار ومدة "}),"كافية لإحداث تغييرات في معالجة الدماغ للصوت."]})]}),e.jsx("div",{className:"brain-facts-grid",style:{marginTop:24,display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))"},children:p.map((r,n)=>e.jsxs("div",{className:"neural-card",style:{"--card-color":r.color,"--card-glow":`${r.color}22`,background:a.backgrounds.card,border:`1px solid ${r.color}33`,borderRadius:16,padding:18,transition:"all 0.3s ease",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg, transparent, ${r.color}66, transparent)`,opacity:.6}}),e.jsx("div",{className:"neural-icon",style:{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg, ${r.color}22, ${r.color}10)`,border:`1px solid ${r.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:14,boxShadow:`0 0 15px ${r.color}20`},children:r.icon}),e.jsxs("div",{style:{fontWeight:800,color:r.color,marginBottom:8,display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:r.color,boxShadow:`0 0 6px ${r.color}`}}),r.title]}),e.jsx("div",{style:{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.7},children:r.description}),e.jsxs("div",{style:{position:"absolute",top:10,right:10,padding:"3px 8px",background:"rgba(0,0,0,0.4)",border:`1px solid ${r.color}30`,borderRadius:4,fontSize:9,fontFamily:"monospace",color:r.color},children:["0",n+1]})]},n))}),e.jsxs("div",{style:{marginTop:24,padding:20,background:"linear-gradient(135deg, rgba(143,211,204,0.1), rgba(175,132,186,0.05))",borderRadius:14,border:`1px solid ${i}33`,position:"relative"},children:[e.jsx("div",{style:{position:"absolute",top:12,right:16,fontSize:40,opacity:.2,color:i},children:'"'}),e.jsx("p",{style:{fontSize:16,lineHeight:1.8,color:"#f7f8fb",margin:0,fontStyle:"italic"},children:"كل شيء يحدث كما لو أن السلوك البشري مشروط إلى حد كبير بالطريقة التي يسمع بها المرء."}),e.jsxs("div",{style:{marginTop:12,display:"flex",alignItems:"center",gap:12},children:[e.jsx("div",{style:{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg, ${i}33, ${t}33)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24},children:"🧠"}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:800,color:i},children:"الدكتور جاي بيرارد"}),e.jsx("div",{style:{fontSize:12,color:"rgba(255,255,255,0.6)"},children:"طبيب أنف وأذن وحنجرة • مخترع Berard AIT • أنيسي، فرنسا"}),e.jsx("div",{style:{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2},children:'مؤلف كتاب "Hearing Equals Behavior" • عالج أكثر من 8,000 مريض'})]})]})]}),e.jsxs("div",{style:{marginTop:20,padding:20,background:"linear-gradient(135deg, rgba(176,18,112,0.1), rgba(143,211,204,0.1))",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)"},children:[e.jsx("h3",{style:{...o.h3,marginTop:0,color:t},children:"كيف يستخدم Berard AIT اللدونة العصبية؟"}),e.jsxs("ul",{style:{margin:0,paddingInlineStart:18,lineHeight:2,opacity:.92},children:[e.jsxs("li",{children:[e.jsx("b",{children:"الكثافة:"})," جلستان يومياً بموسيقى مُعدّلة خصيصاً"]}),e.jsxs("li",{children:[e.jsx("b",{children:"التكرار:"})," 20 جلسة على مدار 10-12 يوماً"]}),e.jsxs("li",{children:[e.jsx("b",{children:"المدة:"})," 30 دقيقة لكل جلسة مع فترات راحة للتكيف"]}),e.jsxs("li",{children:[e.jsx("b",{children:"التحفيز:"})," ترددات صوتية متنوعة تحفز مناطق مختلفة من الدماغ"]})]}),e.jsxs("div",{style:{marginTop:12,padding:"10px 14px",background:"rgba(255,255,255,0.05)",borderRadius:10,fontSize:12,color:"rgba(255,255,255,0.7)"},children:[e.jsx("b",{children:"الأجهزة المعتمدة:"})," AudioKinetron • Earducator • AIM (Auditory Integration Modulator)"]})]}),e.jsxs("div",{style:{marginTop:20,display:"flex",gap:12,flexWrap:"wrap"},children:[e.jsxs("a",{href:"#overview",style:{...o.primaryBtn,textDecoration:"none",display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{children:"📚"})," تعرف على البرنامج"]}),e.jsxs("a",{href:"#results",style:{...o.ghostBtn,textDecoration:"none",display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{children:"📊"})," شاهد النتائج"]})]}),e.jsxs("div",{style:{marginTop:24,padding:"12px 16px",background:"rgba(0,0,0,0.3)",borderRadius:d.lg,border:`1px solid ${a.borders.subtle}`,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[e.jsx("div",{style:{fontSize:9,fontFamily:"monospace",color:"rgba(255,255,255,0.35)",letterSpacing:1},children:"LOTUS SOUND LAB // NEUROPLASTICITY RESEARCH"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("div",{style:{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}),e.jsx("span",{style:{fontSize:9,fontFamily:"monospace",color:"#22c55e",letterSpacing:.5},children:"PEER REVIEWED"})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:9,fontFamily:"monospace",color:"rgba(255,255,255,0.4)",letterSpacing:.5},children:"BRAIN PLASTICITY • SOUND THERAPY"}),e.jsx("div",{style:{display:"flex",gap:3},children:[i,t,s,l].map((r,n)=>e.jsx("div",{style:{width:10,height:4,borderRadius:2,background:r,opacity:.6}},n))})]})]})]})}export{y as default};
