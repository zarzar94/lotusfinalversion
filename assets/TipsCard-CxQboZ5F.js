import{r as y,j as e}from"./vendor-three-BrlK21-_.js";import{u as I,L as P,g as $,t as i,f as r,r as h,s as t,c as b,p as L,d as z,e as W,w as S}from"./main-BjvDmNYI.js";function D({to:c,label:g,href:d,labelAr:x}){const{isArabic:m,t:a}=I(),s=c||d||"/",o=g||(m?x||"العودة للرئيسية":"Back to Home");return e.jsxs(P,{to:s,style:{display:"inline-flex",alignItems:"center",gap:t[2],padding:`${t[2]}px ${t[3]}px`,marginBottom:t[6],background:"rgba(255,255,255,0.05)",border:`1px solid ${r.border.default}`,borderRadius:h.md,color:r.text.secondary,textDecoration:"none",fontSize:i.size.sm,fontWeight:i.weight.semibold,transition:$.fast},onMouseEnter:p=>{p.currentTarget.style.background="rgba(143,211,204,0.08)",p.currentTarget.style.borderColor=`${b}40`,p.currentTarget.style.color=b},onMouseLeave:p=>{p.currentTarget.style.background="rgba(255,255,255,0.05)",p.currentTarget.style.borderColor=r.border.default,p.currentTarget.style.color=r.text.secondary},children:[e.jsx("span",{style:{transform:m?"rotate(180deg)":"none",display:"inline-block"},children:"←"}),o]})}const de=y.memo(D),B={"/":{label:"Home",labelAr:"الرئيسية",path:"/",icon:"🏠"},"/assessment":{label:"Assessment",labelAr:"التقييم",path:"/assessment",icon:"🎯"},"/program":{label:"Program",labelAr:"البرنامج",path:"/program",icon:"📋"},"/science":{label:"Science",labelAr:"العلوم",path:"/science",icon:"🧠"},"/results":{label:"Results",labelAr:"النتائج",path:"/results",icon:"📊"},"/resources":{label:"Resources",labelAr:"الموارد",path:"/resources",icon:"📚"},"/contact":{label:"Contact",labelAr:"تواصل",path:"/contact",icon:"✉️"},"/school-dashboard":{label:"School Dashboard",labelAr:"لوحة المدرسة",path:"/school-dashboard",icon:"🏫"},"/parent-dashboard":{label:"Parent Dashboard",labelAr:"لوحة الأولياء",path:"/parent-dashboard",icon:"👨‍👩‍👧"},"/clinician-dashboard":{label:"Clinician Dashboard",labelAr:"لوحة الأخصائي",path:"/clinician-dashboard",icon:"🏥"},"/settings":{label:"Settings",labelAr:"الإعدادات",path:"/settings",icon:"⚙️"}};function F({showHome:c=!0,showIcon:g=!0}){const{isArabic:d}=I(),x=L(),m=y.useMemo(()=>{const a=[];c&&x.pathname!=="/"&&a.push(B["/"]);const s=B[x.pathname];if(s&&x.pathname!=="/"&&a.push(s),x.pathname.startsWith("/function/")){const o=x.pathname.replace("/function/","");a.push({label:o.replace(/-/g," ").replace(/\b\w/g,p=>p.toUpperCase()),labelAr:o.replace(/-/g," "),path:x.pathname,icon:"🧠"})}return a},[x.pathname,c]);return m.length===0?null:e.jsx("nav",{"aria-label":d?"مسار التنقل":"Breadcrumb",style:{display:"flex",alignItems:"center",gap:t[2],padding:`${t[3]}px 0`,fontSize:i.size.sm,flexWrap:"wrap"},children:m.map((a,s)=>{const o=s===m.length-1,p=d?a.labelAr:a.label;return e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:t[2]},children:[s>0&&e.jsx("span",{style:{color:r.text.muted,transform:d?"rotate(180deg)":"none",display:"inline-block"},children:"/"}),o?e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:t[1],color:b,fontWeight:i.weight.semibold,padding:`${t[1]}px ${t[2]}px`,background:`${b}10`,borderRadius:h.sm},children:[g&&a.icon&&e.jsx("span",{style:{fontSize:14},children:a.icon}),p]}):e.jsxs(P,{to:a.path,style:{display:"inline-flex",alignItems:"center",gap:t[1],color:r.text.secondary,textDecoration:"none",padding:`${t[1]}px ${t[2]}px`,borderRadius:h.sm,transition:"all 0.2s ease"},onMouseEnter:l=>{l.currentTarget.style.color=b,l.currentTarget.style.background=`${b}08`},onMouseLeave:l=>{l.currentTarget.style.color=r.text.secondary,l.currentTarget.style.background="transparent"},children:[g&&a.icon&&e.jsx("span",{style:{fontSize:14},children:a.icon}),p]})]},a.path)})})}y.memo(F);const H=[{id:"overview",href:"/#overview",labelEn:"Program",labelAr:"auto.SectionNav.k1",icon:"🎧",color:b,description:"Learn about AIT therapy",descriptionAr:"auto.SectionNav.k2"},{id:"checklist",href:"/#checklist",labelEn:"Neural Scanner",labelAr:"auto.SectionNav.k3",icon:"🧠",color:z,description:"Auditory processing assessment",descriptionAr:"auto.SectionNav.k4"},{id:"games",href:"/#games",labelEn:"Games",labelAr:"auto.SectionNav.k5",icon:"🎮",color:W,description:"Brain training activities",descriptionAr:"auto.SectionNav.k6"},{id:"faq",href:"/#faq",labelEn:"FAQ",labelAr:"auto.SectionNav.k7",icon:"❓",color:"#f59e0b",description:"Frequently asked questions",descriptionAr:"auto.SectionNav.k8"},{id:"contact",href:"/#contact",labelEn:"Contact",labelAr:"auto.SectionNav.k9",icon:"📞",color:"#22c55e",description:"Get in touch with us",descriptionAr:"auto.SectionNav.k10"}];function O({include:c,exclude:g,variant:d="pills",showDescriptions:x=!0,title:m,titleAr:a}){const{isArabic:s,direction:o,t:p}=I(),[l,u]=y.useState(!1);y.useEffect(()=>{const f=()=>u(window.innerWidth<S.md);return f(),window.addEventListener("resize",f),()=>window.removeEventListener("resize",f)},[]);const n=y.useMemo(()=>{let f=H;return c?.length&&(f=f.filter(v=>c.includes(v.id))),g?.length&&(f=f.filter(v=>!g.includes(v.id))),f},[c,g]),j=s?a||"استكشف المنصة":m||"Explore Platform",k=`
    .section-nav-grid {
      display: grid;
      gap: ${t[3]}px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    @media (max-width: ${S.sm}px) {
      .section-nav-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (min-width: ${S.sm}px) and (max-width: ${S.md}px) {
      .section-nav-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .section-nav-pills {
      display: flex;
      flex-wrap: wrap;
      gap: ${t[2]}px;
      justify-content: ${s?"flex-end":"flex-start"};
    }
    @media (max-width: ${S.sm}px) {
      .section-nav-pills {
        flex-direction: column;
      }
      .section-nav-pills a {
        width: 100%;
        justify-content: center;
      }
    }
    .section-card:hover {
      transform: translateY(-4px);
      border-color: var(--hover-color);
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
    }
    .section-pill:hover {
      border-color: var(--hover-color);
      background: var(--hover-bg);
    }
  `;return d==="grid"?e.jsxs("div",{style:{direction:o},children:[e.jsx("style",{children:k}),(m||a)&&e.jsx("h3",{style:{margin:`0 0 ${t[4]}px`,fontSize:i.size.lg,fontWeight:i.weight.bold,color:r.text.primary},children:j}),e.jsx("div",{className:"section-nav-grid",children:n.map(f=>e.jsxs("a",{href:f.href,className:"section-card",style:{"--hover-color":f.color,textDecoration:"none",padding:t[4],background:`linear-gradient(135deg, ${f.color}08, transparent)`,border:`1px solid ${r.border.default}`,borderRadius:h.xl,transition:$.bounce,display:"flex",flexDirection:"column",gap:t[2]},children:[e.jsx("div",{style:{width:48,height:48,borderRadius:h.lg,background:`${f.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24},children:f.icon}),e.jsx("div",{style:{fontSize:i.size.md,fontWeight:i.weight.bold,color:r.text.primary},children:s?p(f.labelAr,f.labelEn):f.labelEn}),x&&e.jsx("div",{style:{fontSize:i.size.xs,color:r.text.muted,lineHeight:i.lineHeight.relaxed},children:s?p(f.descriptionAr,f.description):f.description})]},f.id))})]}):e.jsxs("div",{style:{direction:o},children:[e.jsx("style",{children:k}),(m||a)&&e.jsx("h3",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.muted,textTransform:"uppercase",letterSpacing:.5},children:j}),e.jsx("div",{className:"section-nav-pills",children:n.map(f=>e.jsxs("a",{href:f.href,className:"section-pill",style:{"--hover-color":`${f.color}60`,"--hover-bg":`${f.color}15`,display:"inline-flex",alignItems:"center",gap:t[2],padding:`${t[2]}px ${t[3]}px`,background:"rgba(255,255,255,0.04)",border:`1px solid ${r.border.default}`,borderRadius:h.full,textDecoration:"none",color:r.text.primary,fontSize:i.size.sm,fontWeight:i.weight.semibold,transition:$.fast,whiteSpace:"nowrap"},children:[e.jsx("span",{style:{width:28,height:28,borderRadius:h.md,background:`${f.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14},children:f.icon}),s?p(f.labelAr,f.labelEn):f.labelEn]},f.id))})]})}const ce=y.memo(O),U=`
  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE GRID UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  /* Dashboard stats grid */
  .stats-grid {
    display: grid;
    gap: ${t[4]}px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: ${S.sm}px) {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: ${t[3]}px;
    }
  }

  @media (min-width: ${S.sm}px) and (max-width: ${S.md}px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Charts/Panels grid */
  .panels-grid {
    display: grid;
    gap: ${t[6]}px;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  @media (max-width: ${S.md}px) {
    .panels-grid {
      grid-template-columns: 1fr;
      gap: ${t[4]}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE TYPOGRAPHY
     ═══════════════════════════════════════════════════════════════════════════ */

  .page-title {
    font-size: ${i.size["3xl"]}px;
    font-weight: ${i.weight.black};
    line-height: ${i.lineHeight.tight};
  }

  @media (max-width: ${S.sm}px) {
    .page-title {
      font-size: ${i.size["2xl"]}px;
    }
  }

  .section-title {
    font-size: ${i.size.xl}px;
    font-weight: ${i.weight.bold};
  }

  @media (max-width: ${S.sm}px) {
    .section-title {
      font-size: ${i.size.lg}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE SPACING & PADDING
     ═══════════════════════════════════════════════════════════════════════════ */

  .page-container {
    padding: ${t[10]}px ${t[4]}px;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: ${S.sm}px) {
    .page-container {
      padding: ${t[6]}px ${t[3]}px;
    }
  }

  @media (min-width: ${S.sm}px) and (max-width: ${S.md}px) {
    .page-container {
      padding: ${t[8]}px ${t[4]}px;
    }
  }

  /* Card padding adjustments */
  .card {
    padding: ${t[5]}px;
  }

  @media (max-width: ${S.sm}px) {
    .card {
      padding: ${t[4]}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE TABLE UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .responsive-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: ${S.md}px) {
    .responsive-table {
      min-width: 600px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE FLEX UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .flex-responsive {
    display: flex;
    flex-wrap: wrap;
    gap: ${t[4]}px;
  }

  @media (max-width: ${S.sm}px) {
    .flex-responsive {
      flex-direction: column;
      gap: ${t[3]}px;
    }
  }

  .header-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${t[4]}px;
  }

  @media (max-width: ${S.sm}px) {
    .header-flex {
      flex-direction: column;
      align-items: flex-start;
      gap: ${t[3]}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     HIDE/SHOW UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .hide-on-phone {
    display: block;
  }

  .show-on-phone {
    display: none;
  }

  @media (max-width: ${S.sm}px) {
    .hide-on-phone {
      display: none !important;
    }
    .show-on-phone {
      display: block !important;
    }
  }

  .hide-on-tablet {
    display: block;
  }

  @media (min-width: ${S.sm}px) and (max-width: ${S.lg}px) {
    .hide-on-tablet {
      display: none !important;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TOUCH-FRIENDLY UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  @media (hover: none) {
    .hover-effect:hover {
      transform: none;
    }
  }
`;function G(){return e.jsx("style",{children:U})}const ge=y.memo(G);function Y({icon:c,value:g,label:d,labelAr:x,subtitle:m,subtitleAr:a,color:s=b,trend:o,variant:p="default",onClick:l}){const{isArabic:u,t:n}=I(),j=u&&x||d,k=m?u&&a||m:void 0,f=y.useMemo(()=>l?`
    .stat-card-${s.replace("#","")}:hover {
      transform: translateY(-2px);
      border-color: ${s}40;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
  `:"",[s,l]);return p==="centered"?e.jsxs(e.Fragment,{children:[f&&e.jsx("style",{children:f}),e.jsxs("div",{className:l?`stat-card-${s.replace("#","")}`:void 0,onClick:l,style:{padding:t[4],background:`linear-gradient(135deg, ${s}10, transparent)`,border:`1px solid ${s}25`,borderRadius:h.lg,textAlign:"center",cursor:l?"pointer":"default",transition:$.fast},children:[e.jsx("div",{style:{fontSize:24,marginBottom:t[2]},children:c}),e.jsx("div",{style:{fontSize:i.size["2xl"],fontWeight:i.weight.black,color:r.text.primary},children:g}),e.jsx("div",{style:{fontSize:i.size.xs,color:r.text.muted,marginTop:t[1]},children:j}),o&&e.jsxs("div",{style:{marginTop:t[2],fontSize:i.size.xs,fontWeight:i.weight.bold,color:o.isPositive?"#22c55e":"#ef4444"},children:[o.isPositive?"↑":"↓"," ",Math.abs(o.value),"%"]})]})]}):p==="horizontal"?e.jsxs(e.Fragment,{children:[f&&e.jsx("style",{children:f}),e.jsx("div",{className:l?`stat-card-${s.replace("#","")}`:void 0,onClick:l,style:{padding:t[4],background:`linear-gradient(135deg, ${s}10, transparent)`,border:`1px solid ${s}25`,borderRadius:h.lg,cursor:l?"pointer":"default",transition:$.fast},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[3]},children:[e.jsx("div",{style:{width:44,height:44,borderRadius:h.md,background:`${s}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0},children:c}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:i.size["2xl"],fontWeight:i.weight.black,color:r.text.primary,lineHeight:1},children:g}),e.jsx("div",{style:{fontSize:i.size.xs,color:r.text.muted,marginTop:2},children:j})]}),o&&e.jsxs("div",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:o.isPositive?"#22c55e":"#ef4444",flexShrink:0},children:[o.isPositive?"↑":"↓"," ",Math.abs(o.value),"%"]})]})})]}):p==="compact"?e.jsxs(e.Fragment,{children:[f&&e.jsx("style",{children:f}),e.jsxs("div",{className:l?`stat-card-${s.replace("#","")}`:void 0,onClick:l,style:{padding:t[3],background:`${s}08`,border:`1px solid ${s}20`,borderRadius:h.lg,cursor:l?"pointer":"default",transition:$.fast},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("span",{style:{fontSize:18},children:c}),e.jsx("span",{style:{fontSize:i.size.lg,fontWeight:i.weight.black,color:r.text.primary},children:g})]}),e.jsx("div",{style:{fontSize:i.size.xs,color:r.text.muted,marginTop:t[1]},children:j})]})]}):e.jsxs(e.Fragment,{children:[f&&e.jsx("style",{children:f}),e.jsxs("div",{className:l?`stat-card-${s.replace("#","")}`:void 0,onClick:l,style:{padding:t[5],background:`linear-gradient(135deg, ${s}08, transparent)`,border:`1px solid ${s}25`,borderRadius:h.xl,position:"relative",overflow:"hidden",cursor:l?"pointer":"default",transition:$.fast},children:[e.jsx("div",{style:{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:`radial-gradient(circle, ${s}15, transparent 70%)`,pointerEvents:"none"}}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:r.text.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:t[2]},children:j}),e.jsx("div",{style:{fontSize:i.size["3xl"],fontWeight:i.weight.black,color:r.text.primary,lineHeight:1},children:g}),k&&e.jsx("div",{style:{fontSize:i.size.sm,color:r.text.secondary,marginTop:t[1]},children:k}),o&&e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:t[1],marginTop:t[2],padding:`${t[1]}px ${t[2]}px`,background:o.isPositive?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",borderRadius:h.full,fontSize:i.size.xs,fontWeight:i.weight.bold,color:o.isPositive?"#22c55e":"#ef4444"},children:[o.isPositive?"↑":"↓"," ",Math.abs(o.value),"%"]})]}),e.jsx("div",{style:{width:48,height:48,borderRadius:h.lg,background:`${s}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0},children:c})]})]})]})}const pe=y.memo(Y);function V({size:c="md",message:g,messageAr:d}){const{isArabic:x,t:m}=I(),a=y.useMemo(()=>({sm:{s:24,b:3},md:{s:40,b:4},lg:{s:56,b:5}}),[]),{s,b:o}=a[c];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:t[8],gap:t[4]},children:[e.jsx("style",{children:"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"}),e.jsx("div",{style:{width:s,height:s,borderRadius:"50%",border:`${o}px solid ${r.border.default}`,borderTopColor:b,borderRightColor:z,animation:"spin 1s linear infinite"}}),g&&e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:r.text.secondary},children:x&&d||g})]})}y.memo(V);const T=`
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite ease-in-out;
  }
`,w=y.memo(({width:c="100%",height:g=20,borderRadius:d=h.md,style:x})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("div",{className:"skeleton-shimmer",style:{width:c,height:g,borderRadius:d,background:`linear-gradient(90deg, ${r.border.subtle} 0%, rgba(255,255,255,0.08) 50%, ${r.border.subtle} 100%)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite ease-in-out",...x}})]}));w.displayName="Skeleton";const N=y.memo(({variant:c="default"})=>c==="centered"?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:t[4],background:r.surface.card,border:`1px solid ${r.border.default}`,borderRadius:h.lg,textAlign:"center"},children:[e.jsx(w,{width:40,height:40,borderRadius:h.md,style:{margin:"0 auto",marginBottom:t[2]}}),e.jsx(w,{width:60,height:28,style:{margin:"0 auto",marginBottom:t[2]}}),e.jsx(w,{width:80,height:14,style:{margin:"0 auto"}})]})]}):c==="horizontal"?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:t[4],background:r.surface.card,border:`1px solid ${r.border.default}`,borderRadius:h.lg,display:"flex",alignItems:"center",gap:t[3]},children:[e.jsx(w,{width:44,height:44,borderRadius:h.md}),e.jsxs("div",{style:{flex:1},children:[e.jsx(w,{width:60,height:24,style:{marginBottom:t[1]}}),e.jsx(w,{width:100,height:14})]})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("div",{style:{padding:t[5],background:r.surface.card,border:`1px solid ${r.border.default}`,borderRadius:h.xl},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx(w,{width:80,height:12,style:{marginBottom:t[2]}}),e.jsx(w,{width:100,height:32,style:{marginBottom:t[1]}}),e.jsx(w,{width:120,height:14})]}),e.jsx(w,{width:48,height:48,borderRadius:h.lg})]})})]}));N.displayName="StatCardSkeleton";const _=y.memo(({columns:c=4})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("tr",{children:Array.from({length:c}).map((g,d)=>e.jsx("td",{style:{padding:t[3]},children:e.jsx(w,{width:d===0?"80%":"60%",height:16})},d))})]}));_.displayName="TableRowSkeleton";const A=y.memo(({height:c=200})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:t[5],background:r.surface.card,border:`1px solid ${r.border.default}`,borderRadius:h.xl},children:[e.jsx(w,{width:150,height:20,style:{marginBottom:t[4]}}),e.jsx("div",{style:{height:c,display:"flex",alignItems:"flex-end",gap:t[2],paddingTop:t[4]},children:Array.from({length:7}).map((g,d)=>e.jsx(w,{width:"100%",height:`${30+Math.random()*60}%`,borderRadius:h.sm},d))})]})]}));A.displayName="ChartSkeleton";const X=y.memo(({count:c=5})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:t[2]},children:Array.from({length:c}).map((g,d)=>e.jsx(w,{width:100+Math.random()*40,height:36,borderRadius:h.full},d))})]}));X.displayName="NavPillsSkeleton";const q=y.memo(()=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:`${t[10]}px ${t[4]}px`,maxWidth:1200,margin:"0 auto"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[3],marginBottom:t[8]},children:[e.jsx(w,{width:48,height:48,borderRadius:h.lg}),e.jsxs("div",{children:[e.jsx(w,{width:200,height:28,style:{marginBottom:t[2]}}),e.jsx(w,{width:150,height:16})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:t[4],marginBottom:t[8]},children:[e.jsx(N,{}),e.jsx(N,{}),e.jsx(N,{}),e.jsx(N,{})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:t[6]},children:[e.jsx(A,{}),e.jsx(A,{})]})]})]}));q.displayName="PageSkeleton";const E=`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
  .animate-fade-in-down { animation: fadeInDown 0.4s ease-out forwards; }
  .animate-fade-in-left { animation: fadeInLeft 0.4s ease-out forwards; }
  .animate-fade-in-right { animation: fadeInRight 0.4s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
  .animate-slide-in-up { animation: slideInUp 0.4s ease-out forwards; }
`,Q=y.memo(({children:c,animation:g="fade-in-up",delay:d=0,duration:x=400,once:m=!0,className:a="",style:s={}})=>{const[o,p]=y.useState(!1),l=y.useRef(null),u=y.useRef(!1);y.useEffect(()=>{const j=setTimeout(()=>{p(!0),u.current=!0},d);return()=>clearTimeout(j)},[d]);const n=o?`animate-${g}`:"";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:E}),e.jsx("div",{ref:l,className:`${n} ${a}`,style:{opacity:o?void 0:0,animationDuration:`${x}ms`,...s},children:c})]})});Q.displayName="PageTransition";const J=y.memo(({children:c,animation:g="fade-in-up",staggerDelay:d=50,initialDelay:x=0,duration:m=300,className:a="",style:s={}})=>{const[o,p]=y.useState(0),l=Array.isArray(c)?c:[c];return y.useEffect(()=>{const u=setTimeout(()=>{const n=setInterval(()=>{p(j=>j>=l.length?(clearInterval(n),j):j+1)},d);return()=>clearInterval(n)},x);return()=>clearTimeout(u)},[l.length,d,x]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:E}),e.jsx("div",{className:a,style:s,children:l.map((u,n)=>e.jsx("div",{className:n<o?`animate-${g}`:"",style:{opacity:n<o?void 0:0,animationDuration:`${m}ms`},children:u},n))})]})});J.displayName="StaggerChildren";const K=y.memo(({children:c,animation:g="fade-in-up",threshold:d=.1,rootMargin:x="0px",className:m="",style:a={}})=>{const[s,o]=y.useState(!1),p=y.useRef(null);return y.useEffect(()=>{const l=new IntersectionObserver(([u])=>{u.isIntersecting&&(o(!0),l.disconnect())},{threshold:d,rootMargin:x});return p.current&&l.observe(p.current),()=>l.disconnect()},[d,x]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:E}),e.jsx("div",{ref:p,className:`${s?`animate-${g}`:""} ${m}`,style:{opacity:s?void 0:0,...a},children:c})]})});K.displayName="FadeOnScroll";const Z=y.memo(({milestones:c,currentMilestone:g,isArabic:d=!1,variant:x="horizontal",showDescriptions:m=!1,title:a,titleAr:s})=>{const{t:o}=I(),p=`
    @keyframes milestoneUnlock {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes milestoneGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(143,211,204,0.4); }
      50% { box-shadow: 0 0 20px 5px rgba(143,211,204,0.3); }
    }
    .milestone-achieved {
      animation: milestoneUnlock 0.5s ease-out;
    }
    .milestone-current {
      animation: milestoneGlow 2s ease-in-out infinite;
    }
  `,u=c.filter(n=>n.achieved).length/c.length*100;return x==="compact"?e.jsxs("div",{children:[e.jsx("style",{children:p}),(a||s)&&e.jsx("h4",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary},children:d?o(s,a):a}),e.jsx("div",{style:{display:"flex",gap:t[2],flexWrap:"wrap"},children:c.map((n,j)=>e.jsxs("div",{className:n.achieved?"milestone-achieved":"",style:{padding:`${t[2]}px ${t[3]}px`,background:n.achieved?`${b}15`:"rgba(255,255,255,0.03)",border:`1px solid ${n.achieved?b:r.border.subtle}30`,borderRadius:h.full,display:"flex",alignItems:"center",gap:t[1.5],opacity:n.achieved?1:.5,transition:$.fast},title:d&&n.titleAr||n.title,children:[e.jsx("span",{style:{fontSize:14},children:n.icon}),e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:n.achieved?b:r.text.muted},children:d&&n.titleAr||n.title})]},n.id))})]}):x==="vertical"?e.jsxs("div",{children:[e.jsx("style",{children:p}),(a||s)&&e.jsx("h4",{style:{margin:`0 0 ${t[4]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary},children:d?o(s,a):a}),e.jsxs("div",{style:{position:"relative",paddingLeft:d?0:t[8],paddingRight:d?t[8]:0},children:[e.jsx("div",{style:{position:"absolute",[d?"right":"left"]:19,top:0,bottom:0,width:2,background:r.border.default},children:e.jsx("div",{style:{width:"100%",height:`${u}%`,background:`linear-gradient(180deg, ${b}, ${z})`,transition:$.slow}})}),c.map((n,j)=>{const k=g===j;return e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:t[3],marginBottom:j<c.length-1?t[5]:0,flexDirection:d?"row-reverse":"row"},children:[e.jsx("div",{className:`${n.achieved?"milestone-achieved":""} ${k?"milestone-current":""}`,style:{position:"absolute",[d?"right":"left"]:0,width:40,height:40,borderRadius:h.lg,background:n.achieved?`linear-gradient(135deg, ${b}30, ${z}30)`:r.surface.card,border:`2px solid ${n.achieved?b:r.border.default}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,opacity:n.achieved?1:.5,transition:$.normal},children:n.icon}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:i.size.sm,fontWeight:i.weight.bold,color:n.achieved?r.text.primary:r.text.muted,marginBottom:t[1]},children:d&&n.titleAr||n.title}),m&&n.description&&e.jsx("div",{style:{fontSize:i.size.xs,color:r.text.secondary,lineHeight:i.lineHeight.relaxed},children:d&&n.descriptionAr||n.description}),n.achieved&&n.achievedAt&&e.jsx("div",{style:{fontSize:i.size.xs,color:b,marginTop:t[1]},children:new Date(n.achievedAt).toLocaleDateString(d?"ar-SA":"en-US")})]})]},n.id)})]})]}):e.jsxs("div",{children:[e.jsx("style",{children:p}),(a||s)&&e.jsx("h4",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary},children:d?o(s,a):a}),e.jsx("div",{style:{height:4,background:r.border.default,borderRadius:h.full,marginBottom:t[4],overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${u}%`,background:`linear-gradient(90deg, ${b}, ${z})`,borderRadius:h.full,transition:$.slow}})}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",position:"relative"},children:c.map((n,j)=>{const k=g===j;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:t[2],flex:1},children:[e.jsx("div",{className:`${n.achieved?"milestone-achieved":""} ${k?"milestone-current":""}`,style:{width:44,height:44,borderRadius:h.lg,background:n.achieved?`linear-gradient(135deg, ${b}25, ${z}25)`:r.surface.card,border:`2px solid ${n.achieved?b:r.border.default}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,opacity:n.achieved?1:.4,filter:n.achieved?"none":"grayscale(0.8)",transition:$.normal},children:n.icon}),e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:n.achieved?r.text.primary:r.text.muted,textAlign:"center",maxWidth:80},children:d&&n.titleAr||n.title})]},n.id)})})]})});Z.displayName="MilestoneTracker";const M=y.memo(({icon:c,title:g,titleAr:d,description:x,descriptionAr:m,points:a,unlocked:s,unlockedAt:o,category:p,isArabic:l=!1,size:u="md",showDetails:n=!1,onClick:j})=>{const{t:k}=I(),f={sm:{badge:36,icon:18,font:i.size.xs},md:{badge:48,icon:24,font:i.size.sm},lg:{badge:64,icon:32,font:i.size.base}},C=p?{clinical:W,engagement:"#f59e0b",mastery:z,exploration:b}[p]||b:b,R=f[u];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
    @keyframes badgeUnlock {
      0% { transform: scale(0) rotate(-180deg); }
      50% { transform: scale(1.3) rotate(0deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes badgeShine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `}),e.jsxs("div",{onClick:j,style:{display:"flex",flexDirection:n?"row":"column",alignItems:"center",gap:n?t[3]:t[1],padding:n?t[3]:t[2],background:s?`linear-gradient(135deg, ${C}10, ${C}05)`:"rgba(255,255,255,0.02)",border:`1px solid ${s?C:r.border.subtle}30`,borderRadius:h.lg,cursor:j?"pointer":"default",transition:$.fast,opacity:s?1:.5},children:[e.jsxs("div",{style:{width:R.badge,height:R.badge,borderRadius:h.lg,background:s?`linear-gradient(135deg, ${C}30, ${C}15)`:r.surface.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:R.icon,filter:s?"none":"grayscale(1)",position:"relative",overflow:"hidden"},children:[s&&e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",backgroundSize:"200% 100%",animation:"badgeShine 3s ease-in-out infinite"}}),e.jsx("span",{style:{position:"relative",zIndex:1},children:c})]}),n&&e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:R.font,fontWeight:i.weight.bold,color:s?r.text.primary:r.text.muted,marginBottom:2},children:l&&d||g}),x&&e.jsx("div",{style:{fontSize:i.size.xs,color:r.text.secondary,marginBottom:t[1]},children:l&&m||x}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[a&&e.jsxs("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:C},children:["+",a," ",k("auto.MilestoneTracker.k1","pts")]}),o&&e.jsx("span",{style:{fontSize:i.size.xs,color:r.text.muted},children:new Date(o).toLocaleDateString(l?"ar-SA":"en-US")})]})]}),!n&&e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:s?r.text.primary:r.text.muted,textAlign:"center",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l&&d||g})]})]})});M.displayName="AchievementBadge";const ee=y.memo(({achievements:c,isArabic:g=!1,columns:d=4,showLocked:x=!0,title:m,titleAr:a})=>{const{t:s}=I(),o=y.useMemo(()=>x?c:c.filter(l=>l.achieved),[c,x]),p=c.filter(l=>l.achieved).length;return e.jsxs("div",{children:[(m||a)&&e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:t[4]},children:[e.jsx("h4",{style:{margin:0,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary},children:g?s(a,m):m}),e.jsxs("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:b},children:[p,"/",c.length]})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${d}, 1fr)`,gap:t[2]},children:o.map(l=>e.jsx(M,{icon:l.icon,title:l.title,titleAr:l.titleAr,description:l.description,descriptionAr:l.descriptionAr,points:l.points,unlocked:l.achieved,unlockedAt:l.achievedAt,category:l.category,isArabic:g,size:"sm"},l.id))})]})});ee.displayName="AchievementGrid";const te=y.memo(({phase:c,sessionsCompleted:g,totalSessions:d=20,isArabic:x=!1})=>{const{t:m}=I(),a=[{key:"assessment",label:"Assessment",labelAr:"auto.MilestoneTracker.k3",icon:"📋",range:[0,0]},{key:"active",label:"Active",labelAr:"auto.MilestoneTracker.k4",icon:"🎯",range:[1,14]},{key:"maintenance",label:"Maintenance",labelAr:"auto.MilestoneTracker.k5",icon:"🔄",range:[15,19]},{key:"completed",label:"Completed",labelAr:"auto.MilestoneTracker.k6",icon:"🎓",range:[20,20]}],s=a.findIndex(o=>o.key===c);return e.jsxs("div",{style:{padding:t[4],background:`linear-gradient(135deg, ${b}08, ${z}05)`,border:`1px solid ${r.border.default}`,borderRadius:h.xl},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:t[1],marginBottom:t[4]},children:a.map((o,p)=>{const l=p===s,u=p<s;return e.jsx("div",{style:{flex:1,height:6,borderRadius:h.full,background:u?`linear-gradient(90deg, ${b}, ${z})`:l?b:r.border.default,opacity:l?1:u?.8:.3,transition:$.normal}},o.key)})}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",gap:t[2]},children:a.map((o,p)=>{const l=p===s,u=p<s;return e.jsxs("div",{style:{flex:1,padding:t[2],background:l?`${b}15`:u?`${z}10`:"transparent",border:`1px solid ${l?b:u?z:r.border.subtle}30`,borderRadius:h.lg,textAlign:"center",opacity:l||u?1:.4,transition:$.fast},children:[e.jsx("div",{style:{fontSize:20,marginBottom:t[1]},children:o.icon}),e.jsx("div",{style:{fontSize:i.size.xs,fontWeight:l?i.weight.bold:i.weight.medium,color:l?b:u?z:r.text.muted},children:x?m(o.labelAr,o.label):o.label})]},o.key)})}),e.jsxs("div",{style:{marginTop:t[4],textAlign:"center"},children:[e.jsx("span",{style:{fontSize:i.size["2xl"],fontWeight:i.weight.black,color:b},children:g}),e.jsxs("span",{style:{fontSize:i.size.sm,color:r.text.secondary},children:["/",d," ",m("auto.MilestoneTracker.k2","sessions")]})]})]})});te.displayName="TreatmentPhaseIndicator";const ie=y.memo(({tips:c,title:g,titleAr:d,icon:x="💡",variant:m="default",color:a=b,isArabic:s=!1,maxDisplay:o=5,showBullets:p=!0})=>{const{t:l}=I(),[u,n]=y.useState(0),j=c.slice(0,o),k=y.useCallback(()=>{n(v=>(v+1)%j.length)},[j.length]),f=y.useCallback(()=>{n(v=>(v-1+j.length)%j.length)},[j.length]);if(m==="carousel"){const v=j[u];return e.jsxs("div",{style:{padding:t[5],background:`linear-gradient(135deg, ${a}08, ${a}03)`,border:`1px solid ${a}20`,borderRadius:h.xl},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:t[3]},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("span",{style:{fontSize:20},children:x}),e.jsx("h3",{style:{margin:0,fontSize:i.size.lg,fontWeight:i.weight.bold,color:a},children:s&&d||g})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("button",{onClick:f,style:{width:28,height:28,borderRadius:h.full,background:"rgba(255,255,255,0.05)",border:`1px solid ${r.border.subtle}`,color:r.text.secondary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:$.fast},children:s?"→":"←"}),e.jsxs("span",{style:{fontSize:i.size.xs,color:r.text.muted},children:[u+1,"/",j.length]}),e.jsx("button",{onClick:k,style:{width:28,height:28,borderRadius:h.full,background:"rgba(255,255,255,0.05)",border:`1px solid ${r.border.subtle}`,color:r.text.secondary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:$.fast},children:s?"←":"→"})]})]}),v&&e.jsxs("div",{style:{padding:t[4],background:"rgba(255,255,255,0.03)",borderRadius:h.lg},children:[v.title&&e.jsxs("h4",{style:{margin:`0 0 ${t[2]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary,display:"flex",alignItems:"center",gap:t[2]},children:[v.icon&&e.jsx("span",{children:v.icon}),s&&v.titleAr||v.title]}),e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:r.text.secondary,lineHeight:i.lineHeight.relaxed},children:s&&v.contentAr||v.content})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",gap:t[1],marginTop:t[3]},children:j.map((C,R)=>e.jsx("button",{onClick:()=>n(R),style:{width:8,height:8,borderRadius:h.full,background:R===u?a:r.border.default,border:"none",cursor:"pointer",transition:$.fast}},R))})]})}return m==="compact"?e.jsxs("div",{style:{padding:t[3],background:`${a}10`,border:`1px solid ${a}20`,borderRadius:h.lg,display:"flex",alignItems:"flex-start",gap:t[2]},children:[e.jsx("span",{style:{fontSize:18,flexShrink:0},children:x}),e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:r.text.secondary,lineHeight:i.lineHeight.relaxed},children:s&&j[0]?.contentAr||j[0]?.content})]}):e.jsxs("div",{style:{padding:t[5],background:`linear-gradient(135deg, ${a}08, ${a}03)`,border:`1px solid ${a}20`,borderRadius:h.xl},children:[e.jsxs("h3",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.lg,fontWeight:i.weight.bold,color:a,display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("span",{children:x}),s&&d||g]}),e.jsx("ul",{style:{margin:0,padding:p?`0 ${t[5]}px`:0,listStyle:p?"disc":"none"},children:j.map(v=>e.jsxs("li",{style:{marginBottom:t[2],fontSize:i.size.sm,color:r.text.secondary,lineHeight:i.lineHeight.relaxed},children:[v.icon&&!p&&e.jsx("span",{style:{marginRight:t[2]},children:v.icon}),s&&v.contentAr||v.content]},v.id))})]})});ie.displayName="TipsCard";const re=y.memo(({title:c,titleAr:g,content:d,contentAr:x,icon:m,variant:a="info",isArabic:s=!1,actions:o})=>{const{t:p}=I(),u={info:{color:b,icon:m||"ℹ️",bgOpacity:"08"},warning:{color:"#f59e0b",icon:m||"⚠️",bgOpacity:"10"},success:{color:"#22c55e",icon:m||"✓",bgOpacity:"08"},tip:{color:z,icon:m||"💡",bgOpacity:"08"},clinical:{color:W,icon:m||"🏥",bgOpacity:"08"}}[a];return e.jsx("div",{style:{padding:t[4],background:`${u.color}${u.bgOpacity}`,border:`1px solid ${u.color}30`,borderRadius:h.lg},children:e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:t[3]},children:[e.jsx("div",{style:{width:36,height:36,borderRadius:h.md,background:`${u.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:u.icon}),e.jsxs("div",{style:{flex:1},children:[e.jsx("h4",{style:{margin:`0 0 ${t[1]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary},children:s&&g||c}),e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:r.text.secondary,lineHeight:i.lineHeight.relaxed},children:s&&x||d}),o&&o.length>0&&e.jsx("div",{style:{display:"flex",gap:t[2],marginTop:t[3]},children:o.map((n,j)=>e.jsx("button",{onClick:n.onClick,style:{padding:`${t[2]}px ${t[3]}px`,background:j===0?u.color:"transparent",border:`1px solid ${u.color}`,borderRadius:h.md,color:j===0?r.surface.base:u.color,fontSize:i.size.xs,fontWeight:i.weight.bold,cursor:"pointer",transition:$.fast},children:s&&n.labelAr||n.label},j))})]})]})})});re.displayName="InfoCard";const se=y.memo(({steps:c,title:g,titleAr:d,currentStep:x=0,isArabic:m=!1,variant:a="numbered"})=>{const{t:s}=I();return e.jsxs("div",{style:{padding:t[5],background:r.surface.card,border:`1px solid ${r.border.default}`,borderRadius:h.xl},children:[(g||d)&&e.jsx("h3",{style:{margin:`0 0 ${t[4]}px`,fontSize:i.size.lg,fontWeight:i.weight.bold,color:r.text.primary},children:m?s(d,g):g}),a==="progress"&&e.jsx("div",{style:{display:"flex",alignItems:"center",gap:t[2],marginBottom:t[4]},children:c.map((o,p)=>e.jsx("div",{style:{flex:1,height:4,borderRadius:h.full,background:p<=x?`linear-gradient(90deg, ${b}, ${z})`:r.border.default,transition:$.normal}},p))}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:t[3]},children:c.map((o,p)=>{const l=p===x,u=o.completed||p<x;return e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:t[3],padding:t[3],background:l?`${b}10`:"transparent",borderRadius:h.lg,opacity:u||l?1:.5,transition:$.fast},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:a==="numbered"?h.md:h.full,background:u?`linear-gradient(135deg, ${b}, ${z})`:l?`${b}20`:r.border.default,display:"flex",alignItems:"center",justifyContent:"center",fontSize:a==="numbered"?i.size.sm:16,fontWeight:i.weight.bold,color:u?r.surface.base:l?b:r.text.muted,flexShrink:0},children:u?"✓":a==="numbered"?p+1:o.icon||"○"}),e.jsxs("div",{children:[e.jsx("h4",{style:{margin:`0 0 ${t[1]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:l?b:u?r.text.primary:r.text.muted},children:m&&o.titleAr||o.title}),e.jsx("p",{style:{margin:0,fontSize:i.size.xs,color:r.text.secondary,lineHeight:i.lineHeight.relaxed},children:m&&o.descriptionAr||o.description})]})]},p)})})]})});se.displayName="GuidanceSteps";const ne=y.memo(({actions:c,title:g,titleAr:d,isArabic:x=!1,columns:m=2})=>{const{t:a}=I();return e.jsxs("div",{style:{padding:t[4],background:r.surface.card,border:`1px solid ${r.border.default}`,borderRadius:h.xl},children:[(g||d)&&e.jsx("h3",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:r.text.primary},children:x?a(d,g):g}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${m}, 1fr)`,gap:t[2]},children:c.map(s=>e.jsxs("button",{onClick:s.onClick,style:{padding:t[3],background:`${s.color||b}10`,border:`1px solid ${s.color||b}20`,borderRadius:h.lg,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:t[2],transition:$.fast},children:[e.jsx("span",{style:{fontSize:24},children:s.icon}),e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:s.color||b,textAlign:"center"},children:x&&s.labelAr||s.label})]},s.id))})]})});ne.displayName="QuickActionsCard";export{de as B,re as I,Z as M,Q as P,ge as R,pe as S,ie as T,ce as a,te as b};
