import{r as n,j as t}from"./vendor-three-BrlK21-_.js";import{c,d as u,e as x}from"./main-BjvDmNYI.js";const j=n.memo(({variant:l="sparse",opacity:p=.15,position:o="both"})=>{const[i,d]=n.useState(!1);n.useEffect(()=>{const r=window.matchMedia("(prefers-reduced-motion: reduce)");d(r.matches);const e=a=>d(a.matches);return r.addEventListener("change",e),()=>r.removeEventListener("change",e)},[]);const m=l==="dense"?12:6,f=l==="dense"?8:4,s=n.useMemo(()=>Array.from({length:m},(r,e)=>({id:`node-${e}`,x:10+Math.random()*80,y:10+Math.random()*80,size:3+Math.random()*4,color:[c,u,x][e%3],delay:e*.3,duration:3+Math.random()*2})),[m]),$=n.useMemo(()=>Array.from({length:f},(r,e)=>{const a=s[e%s.length],h=s[(e+2)%s.length];return{id:`conn-${e}`,x1:a.x,y1:a.y,x2:h.x,y2:h.y,color:a.color,delay:e*.5,duration:4+Math.random()*2}}),[s,f]),g=`
    @keyframes circuitNodePulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    @keyframes circuitLineDash {
      from { stroke-dashoffset: 100; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes circuitFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes particleDrift {
      0% { transform: translate(0, 0); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translate(30px, -50px); opacity: 0; }
    }
  `,y=r=>t.jsxs("svg",{style:{position:"absolute",top:0,[r]:0,width:"20%",height:"100%",pointerEvents:"none",opacity:p,transform:r==="right"?"scaleX(-1)":"none"},viewBox:"0 0 100 100",preserveAspectRatio:"none",children:[t.jsx("defs",{children:t.jsxs("filter",{id:`glow-${r}`,x:"-50%",y:"-50%",width:"200%",height:"200%",children:[t.jsx("feGaussianBlur",{stdDeviation:"2",result:"blur"}),t.jsxs("feMerge",{children:[t.jsx("feMergeNode",{in:"blur"}),t.jsx("feMergeNode",{in:"SourceGraphic"})]})]})}),$.map(e=>t.jsx("line",{x1:`${e.x1}%`,y1:`${e.y1}%`,x2:`${e.x2}%`,y2:`${e.y2}%`,stroke:e.color,strokeWidth:"0.5",strokeDasharray:"4 4",opacity:"0.4",style:{animation:i?"none":`circuitLineDash ${e.duration}s linear infinite`,animationDelay:`${e.delay}s`}},e.id)),s.map(e=>t.jsx("g",{filter:`url(#glow-${r})`,children:t.jsx("circle",{cx:`${e.x}%`,cy:`${e.y}%`,r:e.size,fill:e.color,style:{animation:i?"none":`circuitNodePulse ${e.duration}s ease-in-out infinite, circuitFloat ${e.duration+1}s ease-in-out infinite`,animationDelay:`${e.delay}s`,transformOrigin:`${e.x}% ${e.y}%`}})},e.id)),!i&&Array.from({length:4}).map((e,a)=>t.jsx("circle",{cx:`${20+a*20}%`,cy:`${80+a*5}%`,r:"1.5",fill:[c,u,x,c][a],style:{animation:`particleDrift ${5+a}s linear infinite`,animationDelay:`${a*1.5}s`}},`particle-${r}-${a}`))]},r);return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:g}),(o==="left"||o==="both")&&y("left"),(o==="right"||o==="both")&&y("right")]})});j.displayName="CircuitDecoration";export{j as C};
