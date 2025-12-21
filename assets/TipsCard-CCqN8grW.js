import{r as y,j as e}from"./vendor-three-OgilUm_S.js";import{u as I,L as P,t as $,f as i,c as s,r as h,s as t,d as b,o as M,e as w,h as B,q as S}from"./main-C208-Vam.js";function L({to:d,label:g,href:o,labelAr:f}){const{isArabic:x,t:c}=I(),r=d||o||"/",a=g||(x?f||"العودة للرئيسية":"Back to Home");return e.jsxs(P,{to:r,style:{display:"inline-flex",alignItems:"center",gap:t[2],padding:`${t[2]}px ${t[3]}px`,marginBottom:t[6],background:"rgba(255,255,255,0.05)",border:`1px solid ${s.border.default}`,borderRadius:h.md,color:s.text.secondary,textDecoration:"none",fontSize:i.size.sm,fontWeight:i.weight.semibold,transition:$.fast},onMouseEnter:p=>{p.currentTarget.style.background="rgba(143,211,204,0.08)",p.currentTarget.style.borderColor=`${b}40`,p.currentTarget.style.color=b},onMouseLeave:p=>{p.currentTarget.style.background="rgba(255,255,255,0.05)",p.currentTarget.style.borderColor=s.border.default,p.currentTarget.style.color=s.text.secondary},children:[e.jsx("span",{style:{transform:x?"rotate(180deg)":"none",display:"inline-block"},children:"←"}),a]})}const de=y.memo(L),E={"/":{label:"Home",labelAr:"auto.Breadcrumb.k2",path:"/",icon:"🏠"},"/assessment":{label:"Assessment",labelAr:"auto.Breadcrumb.k3",path:"/assessment",icon:"🎯"},"/program":{label:"Program",labelAr:"auto.Breadcrumb.k4",path:"/program",icon:"📋"},"/science":{label:"Science",labelAr:"auto.Breadcrumb.k5",path:"/science",icon:"🧠"},"/results":{label:"Results",labelAr:"auto.Breadcrumb.k6",path:"/results",icon:"📊"},"/resources":{label:"Resources",labelAr:"auto.Breadcrumb.k7",path:"/resources",icon:"📚"},"/partners":{label:"Partners",labelAr:"auto.Breadcrumb.k8",path:"/partners",icon:"🤝"},"/contact":{label:"Contact",labelAr:"auto.Breadcrumb.k9",path:"/contact",icon:"✉️"},"/school-dashboard":{label:"School Dashboard",labelAr:"auto.Breadcrumb.k10",path:"/school-dashboard",icon:"🏫"},"/parent-dashboard":{label:"Parent Dashboard",labelAr:"auto.Breadcrumb.k11",path:"/parent-dashboard",icon:"👨‍👩‍👧"},"/clinician-dashboard":{label:"Clinician Dashboard",labelAr:"auto.Breadcrumb.k12",path:"/clinician-dashboard",icon:"🏥"},"/dashboard/parent":{label:"Parent Dashboard",labelAr:"auto.Breadcrumb.k13",path:"/dashboard/parent"},"/dashboard/educator":{label:"Educator Dashboard",labelAr:"auto.Breadcrumb.k14",path:"/dashboard/educator"},"/dashboard/clinician":{label:"Clinician Dashboard",labelAr:"auto.Breadcrumb.k15",path:"/dashboard/clinician"},"/settings":{label:"Settings",labelAr:"auto.Breadcrumb.k16",path:"/settings",icon:"⚙️"}};function F({showHome:d=!0,showIcon:g=!0}){const{isArabic:o,t:f}=I(),x=M(),c=y.useMemo(()=>{const r=[];d&&x.pathname!=="/"&&r.push(E["/"]);const a=E[x.pathname];if(a&&x.pathname!=="/"&&r.push(a),x.pathname.startsWith("/function/")){const p=x.pathname.replace("/function/","");r.push({label:p.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase()),labelAr:p.replace(/-/g," "),path:x.pathname,icon:"🧠"})}return r},[x.pathname,d]);return c.length===0?null:e.jsx("nav",{"aria-label":f("auto.Breadcrumb.k1","Breadcrumb"),style:{display:"flex",alignItems:"center",gap:t[2],padding:`${t[3]}px 0`,fontSize:i.size.sm,flexWrap:"wrap"},children:c.map((r,a)=>{const p=a===c.length-1,l=o?f(r.labelAr,r.label):r.label;return e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:t[2]},children:[a>0&&e.jsx("span",{style:{color:s.text.muted,transform:o?"rotate(180deg)":"none",display:"inline-block"},children:"/"}),p?e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:t[1],color:b,fontWeight:i.weight.semibold,padding:`${t[1]}px ${t[2]}px`,background:`${b}10`,borderRadius:h.sm},children:[g&&r.icon&&e.jsx("span",{style:{fontSize:14},children:r.icon}),l]}):e.jsxs(P,{to:r.path,style:{display:"inline-flex",alignItems:"center",gap:t[1],color:s.text.secondary,textDecoration:"none",padding:`${t[1]}px ${t[2]}px`,borderRadius:h.sm,transition:"all 0.2s ease"},onMouseEnter:m=>{m.currentTarget.style.color=b,m.currentTarget.style.background=`${b}08`},onMouseLeave:m=>{m.currentTarget.style.color=s.text.secondary,m.currentTarget.style.background="transparent"},children:[g&&r.icon&&e.jsx("span",{style:{fontSize:14},children:r.icon}),l]})]},r.path)})})}y.memo(F);const H=[{id:"overview",href:"/#overview",labelEn:"Program",labelAr:"auto.SectionNav.k1",icon:"🎧",color:b,description:"Learn about AIT therapy",descriptionAr:"auto.SectionNav.k2"},{id:"checklist",href:"/#checklist",labelEn:"Neural Scanner",labelAr:"auto.SectionNav.k3",icon:"🧠",color:w,description:"Auditory processing assessment",descriptionAr:"auto.SectionNav.k4"},{id:"games",href:"/#games",labelEn:"Games",labelAr:"auto.SectionNav.k5",icon:"🎮",color:B,description:"Brain training activities",descriptionAr:"auto.SectionNav.k6"},{id:"faq",href:"/#faq",labelEn:"FAQ",labelAr:"auto.SectionNav.k7",icon:"❓",color:"#f59e0b",description:"Frequently asked questions",descriptionAr:"auto.SectionNav.k8"},{id:"contact",href:"/#contact",labelEn:"Contact",labelAr:"auto.SectionNav.k9",icon:"📞",color:"#22c55e",description:"Get in touch with us",descriptionAr:"auto.SectionNav.k10"}];function O({include:d,exclude:g,variant:o="pills",showDescriptions:f=!0,title:x,titleAr:c}){const{isArabic:r,direction:a,t:p}=I(),[l,m]=y.useState(!1);y.useEffect(()=>{const u=()=>m(window.innerWidth<S.md);return u(),window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]);const n=y.useMemo(()=>{let u=H;return d?.length&&(u=u.filter(v=>d.includes(v.id))),g?.length&&(u=u.filter(v=>!g.includes(v.id))),u},[d,g]),j=r?c||"استكشف المنصة":x||"Explore Platform",z=`
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
      justify-content: ${r?"flex-end":"flex-start"};
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
  `;return o==="grid"?e.jsxs("div",{style:{direction:a},children:[e.jsx("style",{children:z}),(x||c)&&e.jsx("h3",{style:{margin:`0 0 ${t[4]}px`,fontSize:i.size.lg,fontWeight:i.weight.bold,color:s.text.primary},children:j}),e.jsx("div",{className:"section-nav-grid",children:n.map(u=>e.jsxs("a",{href:u.href,className:"section-card",style:{"--hover-color":u.color,textDecoration:"none",padding:t[4],background:`linear-gradient(135deg, ${u.color}08, transparent)`,border:`1px solid ${s.border.default}`,borderRadius:h.xl,transition:$.bounce,display:"flex",flexDirection:"column",gap:t[2]},children:[e.jsx("div",{style:{width:48,height:48,borderRadius:h.lg,background:`${u.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24},children:u.icon}),e.jsx("div",{style:{fontSize:i.size.md,fontWeight:i.weight.bold,color:s.text.primary},children:r?p(u.labelAr,u.labelEn):u.labelEn}),f&&e.jsx("div",{style:{fontSize:i.size.xs,color:s.text.muted,lineHeight:i.lineHeight.relaxed},children:r?p(u.descriptionAr,u.description):u.description})]},u.id))})]}):e.jsxs("div",{style:{direction:a},children:[e.jsx("style",{children:z}),(x||c)&&e.jsx("h3",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.muted,textTransform:"uppercase",letterSpacing:.5},children:j}),e.jsx("div",{className:"section-nav-pills",children:n.map(u=>e.jsxs("a",{href:u.href,className:"section-pill",style:{"--hover-color":`${u.color}60`,"--hover-bg":`${u.color}15`,display:"inline-flex",alignItems:"center",gap:t[2],padding:`${t[2]}px ${t[3]}px`,background:"rgba(255,255,255,0.04)",border:`1px solid ${s.border.default}`,borderRadius:h.full,textDecoration:"none",color:s.text.primary,fontSize:i.size.sm,fontWeight:i.weight.semibold,transition:$.fast,whiteSpace:"nowrap"},children:[e.jsx("span",{style:{width:28,height:28,borderRadius:h.md,background:`${u.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14},children:u.icon}),r?p(u.labelAr,u.labelEn):u.labelEn]},u.id))})]})}const ce=y.memo(O),U=`
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
`;function G(){return e.jsx("style",{children:U})}const ge=y.memo(G);function Y({icon:d,value:g,label:o,labelAr:f,subtitle:x,subtitleAr:c,color:r=b,trend:a,variant:p="default",onClick:l}){const{isArabic:m,t:n}=I(),j=m&&f||o,z=x?m&&c||x:void 0,u=y.useMemo(()=>l?`
    .stat-card-${r.replace("#","")}:hover {
      transform: translateY(-2px);
      border-color: ${r}40;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
  `:"",[r,l]);return p==="centered"?e.jsxs(e.Fragment,{children:[u&&e.jsx("style",{children:u}),e.jsxs("div",{className:l?`stat-card-${r.replace("#","")}`:void 0,onClick:l,style:{padding:t[4],background:`linear-gradient(135deg, ${r}10, transparent)`,border:`1px solid ${r}25`,borderRadius:h.lg,textAlign:"center",cursor:l?"pointer":"default",transition:$.fast},children:[e.jsx("div",{style:{fontSize:24,marginBottom:t[2]},children:d}),e.jsx("div",{style:{fontSize:i.size["2xl"],fontWeight:i.weight.black,color:s.text.primary},children:g}),e.jsx("div",{style:{fontSize:i.size.xs,color:s.text.muted,marginTop:t[1]},children:j}),a&&e.jsxs("div",{style:{marginTop:t[2],fontSize:i.size.xs,fontWeight:i.weight.bold,color:a.isPositive?"#22c55e":"#ef4444"},children:[a.isPositive?"↑":"↓"," ",Math.abs(a.value),"%"]})]})]}):p==="horizontal"?e.jsxs(e.Fragment,{children:[u&&e.jsx("style",{children:u}),e.jsx("div",{className:l?`stat-card-${r.replace("#","")}`:void 0,onClick:l,style:{padding:t[4],background:`linear-gradient(135deg, ${r}10, transparent)`,border:`1px solid ${r}25`,borderRadius:h.lg,cursor:l?"pointer":"default",transition:$.fast},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[3]},children:[e.jsx("div",{style:{width:44,height:44,borderRadius:h.md,background:`${r}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0},children:d}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:i.size["2xl"],fontWeight:i.weight.black,color:s.text.primary,lineHeight:1},children:g}),e.jsx("div",{style:{fontSize:i.size.xs,color:s.text.muted,marginTop:2},children:j})]}),a&&e.jsxs("div",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:a.isPositive?"#22c55e":"#ef4444",flexShrink:0},children:[a.isPositive?"↑":"↓"," ",Math.abs(a.value),"%"]})]})})]}):p==="compact"?e.jsxs(e.Fragment,{children:[u&&e.jsx("style",{children:u}),e.jsxs("div",{className:l?`stat-card-${r.replace("#","")}`:void 0,onClick:l,style:{padding:t[3],background:`${r}08`,border:`1px solid ${r}20`,borderRadius:h.lg,cursor:l?"pointer":"default",transition:$.fast},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("span",{style:{fontSize:18},children:d}),e.jsx("span",{style:{fontSize:i.size.lg,fontWeight:i.weight.black,color:s.text.primary},children:g})]}),e.jsx("div",{style:{fontSize:i.size.xs,color:s.text.muted,marginTop:t[1]},children:j})]})]}):e.jsxs(e.Fragment,{children:[u&&e.jsx("style",{children:u}),e.jsxs("div",{className:l?`stat-card-${r.replace("#","")}`:void 0,onClick:l,style:{padding:t[5],background:`linear-gradient(135deg, ${r}08, transparent)`,border:`1px solid ${r}25`,borderRadius:h.xl,position:"relative",overflow:"hidden",cursor:l?"pointer":"default",transition:$.fast},children:[e.jsx("div",{style:{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:`radial-gradient(circle, ${r}15, transparent 70%)`,pointerEvents:"none"}}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:s.text.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:t[2]},children:j}),e.jsx("div",{style:{fontSize:i.size["3xl"],fontWeight:i.weight.black,color:s.text.primary,lineHeight:1},children:g}),z&&e.jsx("div",{style:{fontSize:i.size.sm,color:s.text.secondary,marginTop:t[1]},children:z}),a&&e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:t[1],marginTop:t[2],padding:`${t[1]}px ${t[2]}px`,background:a.isPositive?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",borderRadius:h.full,fontSize:i.size.xs,fontWeight:i.weight.bold,color:a.isPositive?"#22c55e":"#ef4444"},children:[a.isPositive?"↑":"↓"," ",Math.abs(a.value),"%"]})]}),e.jsx("div",{style:{width:48,height:48,borderRadius:h.lg,background:`${r}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0},children:d})]})]})]})}const pe=y.memo(Y);function V({size:d="md",message:g,messageAr:o}){const{isArabic:f,t:x}=I(),c=y.useMemo(()=>({sm:{s:24,b:3},md:{s:40,b:4},lg:{s:56,b:5}}),[]),{s:r,b:a}=c[d];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:t[8],gap:t[4]},children:[e.jsx("style",{children:"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"}),e.jsx("div",{style:{width:r,height:r,borderRadius:"50%",border:`${a}px solid ${s.border.default}`,borderTopColor:b,borderRightColor:w,animation:"spin 1s linear infinite"}}),g&&e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:s.text.secondary},children:f&&o||g})]})}y.memo(V);const T=`
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
`,k=y.memo(({width:d="100%",height:g=20,borderRadius:o=h.md,style:f})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("div",{className:"skeleton-shimmer",style:{width:d,height:g,borderRadius:o,background:`linear-gradient(90deg, ${s.border.subtle} 0%, rgba(255,255,255,0.08) 50%, ${s.border.subtle} 100%)`,backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite ease-in-out",...f}})]}));k.displayName="Skeleton";const N=y.memo(({variant:d="default"})=>d==="centered"?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:t[4],background:s.surface.card,border:`1px solid ${s.border.default}`,borderRadius:h.lg,textAlign:"center"},children:[e.jsx(k,{width:40,height:40,borderRadius:h.md,style:{margin:"0 auto",marginBottom:t[2]}}),e.jsx(k,{width:60,height:28,style:{margin:"0 auto",marginBottom:t[2]}}),e.jsx(k,{width:80,height:14,style:{margin:"0 auto"}})]})]}):d==="horizontal"?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:t[4],background:s.surface.card,border:`1px solid ${s.border.default}`,borderRadius:h.lg,display:"flex",alignItems:"center",gap:t[3]},children:[e.jsx(k,{width:44,height:44,borderRadius:h.md}),e.jsxs("div",{style:{flex:1},children:[e.jsx(k,{width:60,height:24,style:{marginBottom:t[1]}}),e.jsx(k,{width:100,height:14})]})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("div",{style:{padding:t[5],background:s.surface.card,border:`1px solid ${s.border.default}`,borderRadius:h.xl},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx(k,{width:80,height:12,style:{marginBottom:t[2]}}),e.jsx(k,{width:100,height:32,style:{marginBottom:t[1]}}),e.jsx(k,{width:120,height:14})]}),e.jsx(k,{width:48,height:48,borderRadius:h.lg})]})})]}));N.displayName="StatCardSkeleton";const _=y.memo(({columns:d=4})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("tr",{children:Array.from({length:d}).map((g,o)=>e.jsx("td",{style:{padding:t[3]},children:e.jsx(k,{width:o===0?"80%":"60%",height:16})},o))})]}));_.displayName="TableRowSkeleton";const A=y.memo(({height:d=200})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:t[5],background:s.surface.card,border:`1px solid ${s.border.default}`,borderRadius:h.xl},children:[e.jsx(k,{width:150,height:20,style:{marginBottom:t[4]}}),e.jsx("div",{style:{height:d,display:"flex",alignItems:"flex-end",gap:t[2],paddingTop:t[4]},children:Array.from({length:7}).map((g,o)=>e.jsx(k,{width:"100%",height:`${30+Math.random()*60}%`,borderRadius:h.sm},o))})]})]}));A.displayName="ChartSkeleton";const q=y.memo(({count:d=5})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:t[2]},children:Array.from({length:d}).map((g,o)=>e.jsx(k,{width:100+Math.random()*40,height:36,borderRadius:h.full},o))})]}));q.displayName="NavPillsSkeleton";const X=y.memo(()=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:T}),e.jsxs("div",{style:{padding:`${t[10]}px ${t[4]}px`,maxWidth:1200,margin:"0 auto"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[3],marginBottom:t[8]},children:[e.jsx(k,{width:48,height:48,borderRadius:h.lg}),e.jsxs("div",{children:[e.jsx(k,{width:200,height:28,style:{marginBottom:t[2]}}),e.jsx(k,{width:150,height:16})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:t[4],marginBottom:t[8]},children:[e.jsx(N,{}),e.jsx(N,{}),e.jsx(N,{}),e.jsx(N,{})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:t[6]},children:[e.jsx(A,{}),e.jsx(A,{})]})]})]}));X.displayName="PageSkeleton";const W=`
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
`,Q=y.memo(({children:d,animation:g="fade-in-up",delay:o=0,duration:f=400,once:x=!0,className:c="",style:r={}})=>{const[a,p]=y.useState(!1),l=y.useRef(null),m=y.useRef(!1);y.useEffect(()=>{const j=setTimeout(()=>{p(!0),m.current=!0},o);return()=>clearTimeout(j)},[o]);const n=a?`animate-${g}`:"";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:W}),e.jsx("div",{ref:l,className:`${n} ${c}`,style:{opacity:a?void 0:0,animationDuration:`${f}ms`,...r},children:d})]})});Q.displayName="PageTransition";const J=y.memo(({children:d,animation:g="fade-in-up",staggerDelay:o=50,initialDelay:f=0,duration:x=300,className:c="",style:r={}})=>{const[a,p]=y.useState(0),l=Array.isArray(d)?d:[d];return y.useEffect(()=>{const m=setTimeout(()=>{const n=setInterval(()=>{p(j=>j>=l.length?(clearInterval(n),j):j+1)},o);return()=>clearInterval(n)},f);return()=>clearTimeout(m)},[l.length,o,f]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:W}),e.jsx("div",{className:c,style:r,children:l.map((m,n)=>e.jsx("div",{className:n<a?`animate-${g}`:"",style:{opacity:n<a?void 0:0,animationDuration:`${x}ms`},children:m},n))})]})});J.displayName="StaggerChildren";const K=y.memo(({children:d,animation:g="fade-in-up",threshold:o=.1,rootMargin:f="0px",className:x="",style:c={}})=>{const[r,a]=y.useState(!1),p=y.useRef(null);return y.useEffect(()=>{const l=new IntersectionObserver(([m])=>{m.isIntersecting&&(a(!0),l.disconnect())},{threshold:o,rootMargin:f});return p.current&&l.observe(p.current),()=>l.disconnect()},[o,f]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:W}),e.jsx("div",{ref:p,className:`${r?`animate-${g}`:""} ${x}`,style:{opacity:r?void 0:0,...c},children:d})]})});K.displayName="FadeOnScroll";const Z=y.memo(({milestones:d,currentMilestone:g,isArabic:o=!1,variant:f="horizontal",showDescriptions:x=!1,title:c,titleAr:r})=>{const{t:a}=I(),p=`
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
  `,m=d.filter(n=>n.achieved).length/d.length*100;return f==="compact"?e.jsxs("div",{children:[e.jsx("style",{children:p}),(c||r)&&e.jsx("h4",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary},children:o?a(r,c):c}),e.jsx("div",{style:{display:"flex",gap:t[2],flexWrap:"wrap"},children:d.map((n,j)=>e.jsxs("div",{className:n.achieved?"milestone-achieved":"",style:{padding:`${t[2]}px ${t[3]}px`,background:n.achieved?`${b}15`:"rgba(255,255,255,0.03)",border:`1px solid ${n.achieved?b:s.border.subtle}30`,borderRadius:h.full,display:"flex",alignItems:"center",gap:t[1.5],opacity:n.achieved?1:.5,transition:$.fast},title:o&&n.titleAr||n.title,children:[e.jsx("span",{style:{fontSize:14},children:n.icon}),e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:n.achieved?b:s.text.muted},children:o&&n.titleAr||n.title})]},n.id))})]}):f==="vertical"?e.jsxs("div",{children:[e.jsx("style",{children:p}),(c||r)&&e.jsx("h4",{style:{margin:`0 0 ${t[4]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary},children:o?a(r,c):c}),e.jsxs("div",{style:{position:"relative",paddingLeft:o?0:t[8],paddingRight:o?t[8]:0},children:[e.jsx("div",{style:{position:"absolute",[o?"right":"left"]:19,top:0,bottom:0,width:2,background:s.border.default},children:e.jsx("div",{style:{width:"100%",height:`${m}%`,background:`linear-gradient(180deg, ${b}, ${w})`,transition:$.slow}})}),d.map((n,j)=>{const z=g===j;return e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:t[3],marginBottom:j<d.length-1?t[5]:0,flexDirection:o?"row-reverse":"row"},children:[e.jsx("div",{className:`${n.achieved?"milestone-achieved":""} ${z?"milestone-current":""}`,style:{position:"absolute",[o?"right":"left"]:0,width:40,height:40,borderRadius:h.lg,background:n.achieved?`linear-gradient(135deg, ${b}30, ${w}30)`:s.surface.card,border:`2px solid ${n.achieved?b:s.border.default}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,opacity:n.achieved?1:.5,transition:$.normal},children:n.icon}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:i.size.sm,fontWeight:i.weight.bold,color:n.achieved?s.text.primary:s.text.muted,marginBottom:t[1]},children:o&&n.titleAr||n.title}),x&&n.description&&e.jsx("div",{style:{fontSize:i.size.xs,color:s.text.secondary,lineHeight:i.lineHeight.relaxed},children:o&&n.descriptionAr||n.description}),n.achieved&&n.achievedAt&&e.jsx("div",{style:{fontSize:i.size.xs,color:b,marginTop:t[1]},children:new Date(n.achievedAt).toLocaleDateString(o?"ar-SA":"en-US")})]})]},n.id)})]})]}):e.jsxs("div",{children:[e.jsx("style",{children:p}),(c||r)&&e.jsx("h4",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary},children:o?a(r,c):c}),e.jsx("div",{style:{height:4,background:s.border.default,borderRadius:h.full,marginBottom:t[4],overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${m}%`,background:`linear-gradient(90deg, ${b}, ${w})`,borderRadius:h.full,transition:$.slow}})}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",position:"relative"},children:d.map((n,j)=>{const z=g===j;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:t[2],flex:1},children:[e.jsx("div",{className:`${n.achieved?"milestone-achieved":""} ${z?"milestone-current":""}`,style:{width:44,height:44,borderRadius:h.lg,background:n.achieved?`linear-gradient(135deg, ${b}25, ${w}25)`:s.surface.card,border:`2px solid ${n.achieved?b:s.border.default}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,opacity:n.achieved?1:.4,filter:n.achieved?"none":"grayscale(0.8)",transition:$.normal},children:n.icon}),e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:n.achieved?s.text.primary:s.text.muted,textAlign:"center",maxWidth:80},children:o&&n.titleAr||n.title})]},n.id)})})]})});Z.displayName="MilestoneTracker";const D=y.memo(({icon:d,title:g,titleAr:o,description:f,descriptionAr:x,points:c,unlocked:r,unlockedAt:a,category:p,isArabic:l=!1,size:m="md",showDetails:n=!1,onClick:j})=>{const{t:z}=I(),u={sm:{badge:36,icon:18,font:i.size.xs},md:{badge:48,icon:24,font:i.size.sm},lg:{badge:64,icon:32,font:i.size.base}},C=p?{clinical:B,engagement:"#f59e0b",mastery:w,exploration:b}[p]||b:b,R=u[m];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
    @keyframes badgeUnlock {
      0% { transform: scale(0) rotate(-180deg); }
      50% { transform: scale(1.3) rotate(0deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes badgeShine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `}),e.jsxs("div",{onClick:j,style:{display:"flex",flexDirection:n?"row":"column",alignItems:"center",gap:n?t[3]:t[1],padding:n?t[3]:t[2],background:r?`linear-gradient(135deg, ${C}10, ${C}05)`:"rgba(255,255,255,0.02)",border:`1px solid ${r?C:s.border.subtle}30`,borderRadius:h.lg,cursor:j?"pointer":"default",transition:$.fast,opacity:r?1:.5},children:[e.jsxs("div",{style:{width:R.badge,height:R.badge,borderRadius:h.lg,background:r?`linear-gradient(135deg, ${C}30, ${C}15)`:s.surface.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize:R.icon,filter:r?"none":"grayscale(1)",position:"relative",overflow:"hidden"},children:[r&&e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",backgroundSize:"200% 100%",animation:"badgeShine 3s ease-in-out infinite"}}),e.jsx("span",{style:{position:"relative",zIndex:1},children:d})]}),n&&e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:R.font,fontWeight:i.weight.bold,color:r?s.text.primary:s.text.muted,marginBottom:2},children:l&&o||g}),f&&e.jsx("div",{style:{fontSize:i.size.xs,color:s.text.secondary,marginBottom:t[1]},children:l&&x||f}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[c&&e.jsxs("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:C},children:["+",c," ",z("auto.MilestoneTracker.k1","pts")]}),a&&e.jsx("span",{style:{fontSize:i.size.xs,color:s.text.muted},children:new Date(a).toLocaleDateString(l?"ar-SA":"en-US")})]})]}),!n&&e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:r?s.text.primary:s.text.muted,textAlign:"center",maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:l&&o||g})]})]})});D.displayName="AchievementBadge";const ee=y.memo(({achievements:d,isArabic:g=!1,columns:o=4,showLocked:f=!0,title:x,titleAr:c})=>{const{t:r}=I(),a=y.useMemo(()=>f?d:d.filter(l=>l.achieved),[d,f]),p=d.filter(l=>l.achieved).length;return e.jsxs("div",{children:[(x||c)&&e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:t[4]},children:[e.jsx("h4",{style:{margin:0,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary},children:g?r(c,x):x}),e.jsxs("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.bold,color:b},children:[p,"/",d.length]})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${o}, 1fr)`,gap:t[2]},children:a.map(l=>e.jsx(D,{icon:l.icon,title:l.title,titleAr:l.titleAr,description:l.description,descriptionAr:l.descriptionAr,points:l.points,unlocked:l.achieved,unlockedAt:l.achievedAt,category:l.category,isArabic:g,size:"sm"},l.id))})]})});ee.displayName="AchievementGrid";const te=y.memo(({phase:d,sessionsCompleted:g,totalSessions:o=20,isArabic:f=!1})=>{const{t:x}=I(),c=[{key:"assessment",label:"Assessment",labelAr:"auto.MilestoneTracker.k3",icon:"📋",range:[0,0]},{key:"active",label:"Active",labelAr:"auto.MilestoneTracker.k4",icon:"🎯",range:[1,14]},{key:"maintenance",label:"Maintenance",labelAr:"auto.MilestoneTracker.k5",icon:"🔄",range:[15,19]},{key:"completed",label:"Completed",labelAr:"auto.MilestoneTracker.k6",icon:"🎓",range:[20,20]}],r=c.findIndex(a=>a.key===d);return e.jsxs("div",{style:{padding:t[4],background:`linear-gradient(135deg, ${b}08, ${w}05)`,border:`1px solid ${s.border.default}`,borderRadius:h.xl},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:t[1],marginBottom:t[4]},children:c.map((a,p)=>{const l=p===r,m=p<r;return e.jsx("div",{style:{flex:1,height:6,borderRadius:h.full,background:m?`linear-gradient(90deg, ${b}, ${w})`:l?b:s.border.default,opacity:l?1:m?.8:.3,transition:$.normal}},a.key)})}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",gap:t[2]},children:c.map((a,p)=>{const l=p===r,m=p<r;return e.jsxs("div",{style:{flex:1,padding:t[2],background:l?`${b}15`:m?`${w}10`:"transparent",border:`1px solid ${l?b:m?w:s.border.subtle}30`,borderRadius:h.lg,textAlign:"center",opacity:l||m?1:.4,transition:$.fast},children:[e.jsx("div",{style:{fontSize:20,marginBottom:t[1]},children:a.icon}),e.jsx("div",{style:{fontSize:i.size.xs,fontWeight:l?i.weight.bold:i.weight.medium,color:l?b:m?w:s.text.muted},children:f?x(a.labelAr,a.label):a.label})]},a.key)})}),e.jsxs("div",{style:{marginTop:t[4],textAlign:"center"},children:[e.jsx("span",{style:{fontSize:i.size["2xl"],fontWeight:i.weight.black,color:b},children:g}),e.jsxs("span",{style:{fontSize:i.size.sm,color:s.text.secondary},children:["/",o," ",x("auto.MilestoneTracker.k2","sessions")]})]})]})});te.displayName="TreatmentPhaseIndicator";const ie=y.memo(({tips:d,title:g,titleAr:o,icon:f="💡",variant:x="default",color:c=b,isArabic:r=!1,maxDisplay:a=5,showBullets:p=!0})=>{const{t:l}=I(),[m,n]=y.useState(0),j=d.slice(0,a),z=y.useCallback(()=>{n(v=>(v+1)%j.length)},[j.length]),u=y.useCallback(()=>{n(v=>(v-1+j.length)%j.length)},[j.length]);if(x==="carousel"){const v=j[m];return e.jsxs("div",{style:{padding:t[5],background:`linear-gradient(135deg, ${c}08, ${c}03)`,border:`1px solid ${c}20`,borderRadius:h.xl},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:t[3]},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("span",{style:{fontSize:20},children:f}),e.jsx("h3",{style:{margin:0,fontSize:i.size.lg,fontWeight:i.weight.bold,color:c},children:r&&o||g})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("button",{onClick:u,style:{width:28,height:28,borderRadius:h.full,background:"rgba(255,255,255,0.05)",border:`1px solid ${s.border.subtle}`,color:s.text.secondary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:$.fast},children:r?"→":"←"}),e.jsxs("span",{style:{fontSize:i.size.xs,color:s.text.muted},children:[m+1,"/",j.length]}),e.jsx("button",{onClick:z,style:{width:28,height:28,borderRadius:h.full,background:"rgba(255,255,255,0.05)",border:`1px solid ${s.border.subtle}`,color:s.text.secondary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:$.fast},children:r?"←":"→"})]})]}),v&&e.jsxs("div",{style:{padding:t[4],background:"rgba(255,255,255,0.03)",borderRadius:h.lg},children:[v.title&&e.jsxs("h4",{style:{margin:`0 0 ${t[2]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary,display:"flex",alignItems:"center",gap:t[2]},children:[v.icon&&e.jsx("span",{children:v.icon}),r&&v.titleAr||v.title]}),e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:s.text.secondary,lineHeight:i.lineHeight.relaxed},children:r&&v.contentAr||v.content})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",gap:t[1],marginTop:t[3]},children:j.map((C,R)=>e.jsx("button",{onClick:()=>n(R),style:{width:8,height:8,borderRadius:h.full,background:R===m?c:s.border.default,border:"none",cursor:"pointer",transition:$.fast}},R))})]})}return x==="compact"?e.jsxs("div",{style:{padding:t[3],background:`${c}10`,border:`1px solid ${c}20`,borderRadius:h.lg,display:"flex",alignItems:"flex-start",gap:t[2]},children:[e.jsx("span",{style:{fontSize:18,flexShrink:0},children:f}),e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:s.text.secondary,lineHeight:i.lineHeight.relaxed},children:r&&j[0]?.contentAr||j[0]?.content})]}):e.jsxs("div",{style:{padding:t[5],background:`linear-gradient(135deg, ${c}08, ${c}03)`,border:`1px solid ${c}20`,borderRadius:h.xl},children:[e.jsxs("h3",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.lg,fontWeight:i.weight.bold,color:c,display:"flex",alignItems:"center",gap:t[2]},children:[e.jsx("span",{children:f}),r&&o||g]}),e.jsx("ul",{style:{margin:0,padding:p?`0 ${t[5]}px`:0,listStyle:p?"disc":"none"},children:j.map(v=>e.jsxs("li",{style:{marginBottom:t[2],fontSize:i.size.sm,color:s.text.secondary,lineHeight:i.lineHeight.relaxed},children:[v.icon&&!p&&e.jsx("span",{style:{marginRight:t[2]},children:v.icon}),r&&v.contentAr||v.content]},v.id))})]})});ie.displayName="TipsCard";const re=y.memo(({title:d,titleAr:g,content:o,contentAr:f,icon:x,variant:c="info",isArabic:r=!1,actions:a})=>{const{t:p}=I(),m={info:{color:b,icon:x||"ℹ️",bgOpacity:"08"},warning:{color:"#f59e0b",icon:x||"⚠️",bgOpacity:"10"},success:{color:"#22c55e",icon:x||"✓",bgOpacity:"08"},tip:{color:w,icon:x||"💡",bgOpacity:"08"},clinical:{color:B,icon:x||"🏥",bgOpacity:"08"}}[c];return e.jsx("div",{style:{padding:t[4],background:`${m.color}${m.bgOpacity}`,border:`1px solid ${m.color}30`,borderRadius:h.lg},children:e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:t[3]},children:[e.jsx("div",{style:{width:36,height:36,borderRadius:h.md,background:`${m.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0},children:m.icon}),e.jsxs("div",{style:{flex:1},children:[e.jsx("h4",{style:{margin:`0 0 ${t[1]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary},children:r&&g||d}),e.jsx("p",{style:{margin:0,fontSize:i.size.sm,color:s.text.secondary,lineHeight:i.lineHeight.relaxed},children:r&&f||o}),a&&a.length>0&&e.jsx("div",{style:{display:"flex",gap:t[2],marginTop:t[3]},children:a.map((n,j)=>e.jsx("button",{onClick:n.onClick,style:{padding:`${t[2]}px ${t[3]}px`,background:j===0?m.color:"transparent",border:`1px solid ${m.color}`,borderRadius:h.md,color:j===0?s.surface.base:m.color,fontSize:i.size.xs,fontWeight:i.weight.bold,cursor:"pointer",transition:$.fast},children:r&&n.labelAr||n.label},j))})]})]})})});re.displayName="InfoCard";const se=y.memo(({steps:d,title:g,titleAr:o,currentStep:f=0,isArabic:x=!1,variant:c="numbered"})=>{const{t:r}=I();return e.jsxs("div",{style:{padding:t[5],background:s.surface.card,border:`1px solid ${s.border.default}`,borderRadius:h.xl},children:[(g||o)&&e.jsx("h3",{style:{margin:`0 0 ${t[4]}px`,fontSize:i.size.lg,fontWeight:i.weight.bold,color:s.text.primary},children:x?r(o,g):g}),c==="progress"&&e.jsx("div",{style:{display:"flex",alignItems:"center",gap:t[2],marginBottom:t[4]},children:d.map((a,p)=>e.jsx("div",{style:{flex:1,height:4,borderRadius:h.full,background:p<=f?`linear-gradient(90deg, ${b}, ${w})`:s.border.default,transition:$.normal}},p))}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:t[3]},children:d.map((a,p)=>{const l=p===f,m=a.completed||p<f;return e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:t[3],padding:t[3],background:l?`${b}10`:"transparent",borderRadius:h.lg,opacity:m||l?1:.5,transition:$.fast},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:c==="numbered"?h.md:h.full,background:m?`linear-gradient(135deg, ${b}, ${w})`:l?`${b}20`:s.border.default,display:"flex",alignItems:"center",justifyContent:"center",fontSize:c==="numbered"?i.size.sm:16,fontWeight:i.weight.bold,color:m?s.surface.base:l?b:s.text.muted,flexShrink:0},children:m?"✓":c==="numbered"?p+1:a.icon||"○"}),e.jsxs("div",{children:[e.jsx("h4",{style:{margin:`0 0 ${t[1]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:l?b:m?s.text.primary:s.text.muted},children:x&&a.titleAr||a.title}),e.jsx("p",{style:{margin:0,fontSize:i.size.xs,color:s.text.secondary,lineHeight:i.lineHeight.relaxed},children:x&&a.descriptionAr||a.description})]})]},p)})})]})});se.displayName="GuidanceSteps";const ne=y.memo(({actions:d,title:g,titleAr:o,isArabic:f=!1,columns:x=2})=>{const{t:c}=I();return e.jsxs("div",{style:{padding:t[4],background:s.surface.card,border:`1px solid ${s.border.default}`,borderRadius:h.xl},children:[(g||o)&&e.jsx("h3",{style:{margin:`0 0 ${t[3]}px`,fontSize:i.size.sm,fontWeight:i.weight.bold,color:s.text.primary},children:f?c(o,g):g}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${x}, 1fr)`,gap:t[2]},children:d.map(r=>e.jsxs("button",{onClick:r.onClick,style:{padding:t[3],background:`${r.color||b}10`,border:`1px solid ${r.color||b}20`,borderRadius:h.lg,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:t[2],transition:$.fast},children:[e.jsx("span",{style:{fontSize:24},children:r.icon}),e.jsx("span",{style:{fontSize:i.size.xs,fontWeight:i.weight.semibold,color:r.color||b,textAlign:"center"},children:f&&r.labelAr||r.label})]},r.id))})]})});ne.displayName="QuickActionsCard";export{de as B,re as I,Z as M,Q as P,ge as R,pe as S,ie as T,ce as a,te as b};
