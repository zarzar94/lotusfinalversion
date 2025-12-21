import{r as g,j as e}from"./vendor-three-OgilUm_S.js";import{u as T,a as j,c as a,d as u,e as p,t as b,b as $,r as l,s as i,f as s}from"./main-C208-Vam.js";import{c as h,b as z,m as E,U as w}from"./FadeIn-CGc19PfJ.js";import"./vendor-react-23TIcR45.js";import"./LoginModal-Od-gO9Fj.js";import"./usePrefersReducedMotion-CDcVfxPT.js";import"./asset-RgTkD8ru.js";const A={school:{titleEn:"Why Schools Trust Us",titleAr:"auto.TrustSignals.k2",bulletPoints:[{en:"Group screening programs for classrooms",ar:"auto.TrustSignals.k12"},{en:"Teacher training workshops included",ar:"auto.TrustSignals.k13"},{en:"Detailed reports for each student",ar:"auto.TrustSignals.k14"},{en:"Flexible scheduling around school calendar",ar:"auto.TrustSignals.k15"}],ctaEn:"Request School Partnership",ctaAr:"auto.TrustSignals.k3",ctaLink:"#contact"},parent:{titleEn:"Why Families Choose Us",titleAr:"auto.TrustSignals.k4",bulletPoints:[{en:"Child-friendly assessment environment",ar:"auto.TrustSignals.k16"},{en:"Clear explanations in simple terms",ar:"auto.TrustSignals.k17"},{en:"Home practice guidance provided",ar:"auto.TrustSignals.k18"},{en:"Ongoing support throughout the program",ar:"auto.TrustSignals.k19"}],ctaEn:"Book Family Consultation",ctaAr:"auto.TrustSignals.k5",ctaLink:"#contact"},clinician:{titleEn:"Clinical Excellence",titleAr:"auto.TrustSignals.k6",bulletPoints:[{en:"Evidence-based Bérard AIT protocol",ar:"auto.TrustSignals.k20"},{en:"Comprehensive audiometric assessments",ar:"auto.TrustSignals.k21"},{en:"Professional referral network",ar:"auto.TrustSignals.k22"},{en:"Detailed clinical documentation",ar:"auto.TrustSignals.k23"}],ctaEn:"Professional Inquiry",ctaAr:"auto.TrustSignals.k7",ctaLink:"#contact"}};function F(){const{t:o,isArabic:c}=T(),{mode:x,config:t,isSchool:I,isParent:C,isClinician:P}=j(),[f,m]=g.useState(null),S=g.useMemo(()=>[{id:"clients",icon:e.jsx(h,{size:24,color:a.success}),value:"500+",label:o("trustSignals.clientsHelped"),color:a.success,relevantModes:["parent","clinician"],detailsEn:"Families and individuals helped through our programs",detailsAr:"auto.TrustSignals.k8"},{id:"certified",icon:e.jsx(z,{size:24,color:u}),value:"100%",label:o("trustSignals.certified"),color:u,relevantModes:["clinician","school"],detailsEn:"All practitioners certified by Bérard AIT International",detailsAr:"auto.TrustSignals.k9"},{id:"rating",icon:e.jsx(E,{size:24,color:"#f59e0b"}),value:"4.9/5",label:o("trustSignals.rating"),color:"#f59e0b",relevantModes:["parent"],detailsEn:"Based on verified family reviews",detailsAr:"auto.TrustSignals.k10"},{id:"schools",icon:e.jsx(w,{size:24,color:p}),value:"25+",label:o("trustSignals.schoolPartners"),color:p,relevantModes:["school"],detailsEn:"Schools in our screening partnership program",detailsAr:"auto.TrustSignals.k11"}],[o]),d=A[x],y=r=>r.relevantModes.includes(x),k=g.useMemo(()=>`
    @keyframes trustPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    @keyframes highlightGlow {
      0%, 100% { box-shadow: 0 0 15px ${t.color}20; }
      50% { box-shadow: 0 0 25px ${t.color}40; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .trust-card {
      transition: ${b.bounce};
    }
    .trust-card:hover {
      transform: translateY(-4px);
      box-shadow: ${$.lg};
    }
    .trust-card.highlighted {
      animation: highlightGlow 2s ease-in-out infinite;
      border-color: ${t.color}50 !important;
    }
    .trust-card.highlighted::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, ${t.color}, transparent);
      border-radius: ${l.xl} ${l.xl} 0 0;
    }
    .trust-value {
      background: linear-gradient(135deg, ${u}, ${p});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .role-proposition {
      background: linear-gradient(135deg, ${t.color}10, ${t.color}05);
      border: 1px solid ${t.color}30;
    }
    .proposition-badge {
      background: linear-gradient(90deg, ${t.color}20, ${t.color}40, ${t.color}20);
      background-size: 200% 100%;
      animation: shimmer 3s ease infinite;
    }
  `,[t.color]);return e.jsxs("section",{style:{padding:`${i[10]}px ${i[4]}px`,background:"linear-gradient(180deg, rgba(11,15,28,0.3) 0%, rgba(5,6,13,0.6) 100%)",borderTop:`1px solid ${a.border.subtle}`,borderBottom:`1px solid ${a.border.subtle}`},children:[e.jsx("style",{children:k}),e.jsxs("div",{style:{maxWidth:1100,margin:"0 auto"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:i[8]},children:[e.jsx("h2",{style:{margin:0,fontSize:s.size["2xl"],fontWeight:s.weight.black,color:a.text.primary,marginBottom:i[2]},children:o("trustSignals.title")}),e.jsx("p",{style:{margin:0,fontSize:s.size.base,color:a.text.secondary},children:o("trustSignals.subtitle")})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:i[4]},children:S.map(r=>{const n=y(r),v=f===r.id;return e.jsxs("div",{className:`trust-card ${n?"highlighted":""}`,onMouseEnter:()=>m(r.id),onMouseLeave:()=>m(null),style:{position:"relative",padding:i[5],background:n?`linear-gradient(135deg, rgba(11,15,28,0.8), ${t.color}10)`:"rgba(11,15,28,0.6)",borderRadius:l.xl,border:`1px solid ${n?t.color+"40":a.border.default}`,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:i[3],overflow:"hidden"},children:[n&&e.jsxs("div",{style:{position:"absolute",top:8,right:c?"auto":8,left:c?8:"auto",padding:"3px 8px",borderRadius:6,background:t.color+"20",border:`1px solid ${t.color}40`,fontSize:10,fontWeight:700,color:t.color},children:[t.icon," ",o("auto.TrustSignals.k1","For you")]}),e.jsx("div",{style:{width:56,height:56,borderRadius:l.lg,background:`${r.color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:n?16:0},children:r.icon}),e.jsx("div",{className:"trust-value",style:{fontSize:s.size["3xl"],fontWeight:s.weight.black,lineHeight:1},children:r.value}),e.jsx("div",{style:{fontSize:s.size.sm,color:a.text.secondary,fontWeight:s.weight.medium},children:r.label}),v&&(r.detailsEn||r.detailsAr)&&e.jsx("div",{style:{marginTop:i[2],padding:"8px 12px",background:"rgba(0,0,0,0.4)",borderRadius:l.md,fontSize:s.size.xs,color:a.text.muted,lineHeight:1.4},children:c?o(r.detailsAr,r.detailsEn):r.detailsEn})]},r.id)})}),e.jsx("div",{style:{marginTop:i[8],textAlign:"center",display:"flex",justifyContent:"center",gap:i[6],flexWrap:"wrap"},children:[o("trustSignals.guarantee1"),o("trustSignals.guarantee2"),o("trustSignals.guarantee3")].map((r,n)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:i[2],fontSize:s.size.sm,color:a.text.muted},children:[e.jsx(h,{size:16,color:a.success}),r]},n))}),e.jsxs("div",{className:"role-proposition",style:{marginTop:i[8],padding:i[6],borderRadius:l.xl,display:"flex",flexDirection:"column",gap:i[4]},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:i[3],flexWrap:"wrap"},children:[e.jsxs("div",{className:"proposition-badge",style:{padding:"6px 12px",borderRadius:l.lg,fontSize:s.size.xs,fontWeight:s.weight.bold,color:t.color,border:`1px solid ${t.color}40`},children:[t.icon," ",c?o(t.labelAr,t.label):t.label]}),e.jsx("h3",{style:{margin:0,fontSize:s.size.xl,fontWeight:s.weight.bold,color:a.text.primary},children:c?o(d.titleAr,d.titleEn):d.titleEn})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:i[3]},children:d.bulletPoints.map((r,n)=>e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:i[2],padding:i[3],background:"rgba(0,0,0,0.2)",borderRadius:l.lg},children:[e.jsx(h,{size:18,color:t.color,style:{flexShrink:0,marginTop:2}}),e.jsx("span",{style:{fontSize:s.size.sm,color:a.text.secondary,lineHeight:1.5},children:c?o(r.ar,r.en):r.en})]},n))}),e.jsxs("a",{href:d.ctaLink,style:{alignSelf:"center",marginTop:i[2],padding:`${i[3]}px ${i[6]}px`,background:`linear-gradient(135deg, ${t.color}, ${t.color}cc)`,borderRadius:l.lg,color:"#fff",fontSize:s.size.sm,fontWeight:s.weight.bold,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:i[2],transition:b.fast,boxShadow:`0 4px 15px ${t.color}30`},children:[c?o(d.ctaAr,d.ctaEn):d.ctaEn,e.jsx("span",{style:{fontSize:16},children:"→"})]})]})]})]})}export{F as default};
