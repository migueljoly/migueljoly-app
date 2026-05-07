import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const C = {
  bg:"#0f0f13",card:"#1a1a24",card2:"#22222f",border:"#2e2e40",
  accent:"#00e5a0",accent2:"#7c6fff",accent3:"#ff6b6b",
  text:"#f0f0f5",muted:"#8888aa",
  push:"#ff6b6b",pull:"#7c6fff",legs:"#00e5a0",gold:"#c9a84c",
};
const TC = {PUSH:C.push,PULL:C.pull,LEGS:C.legs,UPPER:"#f59e0b",LOWER:"#06b6d4",FULL:"#a78bfa",DESCANSO:C.muted,OMBRO:"#f97316",BRACOS:"#ec4899",ABS:"#84cc16"};
const N_SERIES = 5;
const getMuscles = n => {
  const k = n.toUpperCase();
  const map = {PUSH:"Peito / Ombro / Triceps",PULL:"Costas / Biceps",LEGS:"Quadriceps / Posterior / Panturrilha",UPPER:"Peito / Costas / Ombro / Bracos",LOWER:"Posterior / Gluteo / Panturrilha",FULL:"Corpo Todo",OMBRO:"Deltoide / Trapezio",ABS:"Abdominais / Core",BRACOS:"Biceps / Triceps"};
  if (map[k]) return map[k];
  for (const [mk,mv] of Object.entries(map)) if (k.includes(mk)) return mv;
  return k;
};

const uid = () => "id_" + Math.random().toString(36).slice(2,9);
const clone = x => JSON.parse(JSON.stringify(x));

const INIT = {
  users:[
    {id:1,name:"Miguel Joly",email:"miguel@trainer.com",password:"admin123",role:"admin",avatar:"MJ"},
    {id:2,name:"Erick",email:"erick@aluno.com",password:"erick123",role:"aluno",avatar:"ER",objetivo:"Ganho de Massa",modalidade:"Musculacao",treinos_semana:4},
    {id:3,name:"Carla Souza",email:"carla@aluno.com",password:"carla123",role:"aluno",avatar:"CS",objetivo:"Emagrecimento",modalidade:"Musculacao",treinos_semana:3},
    {id:4,name:"Rafael Lima",email:"rafael@aluno.com",password:"rafael123",role:"aluno",avatar:"RL",objetivo:"Definicao",modalidade:"Musculacao",treinos_semana:4},
    {id:5,name:"Juliana Matos",email:"juliana@aluno.com",password:"juliana123",role:"aluno",avatar:"JM",objetivo:"Ganho de Massa",modalidade:"Musculacao",treinos_semana:5},
  ],
  treinos:{
    2:{
      semanaAtual:1,
      periodizacao:[{semana:1,tipo:"BASE",rir:"2-3 RIR"},{semana:2,tipo:"BASE",rir:"2-3 RIR"},{semana:3,tipo:"CHOQUE",rir:"0-1 RIR"},{semana:4,tipo:"CHOQUE",rir:"0-1 RIR"}],
      divisao:[{dia:"SEG",tipo:"PUSH"},{dia:"TER",tipo:"PULL"},{dia:"QUA",tipo:"LEGS"},{dia:"QUI",tipo:"DESCANSO"},{dia:"SEX",tipo:"PUSH"},{dia:"SAB",tipo:"DESCANSO"},{dia:"DOM",tipo:"DESCANSO"}],
      exercicios:{
        PUSH:[
          {id:"p1",nome:"Voador",series:"2x20 WarmUp + 3x10",descanso:"90-180s",obs:""},
          {id:"p2",nome:"Supino Declinado Maquina",series:"3x10",descanso:"90-180s",obs:""},
          {id:"p3",nome:"Desenvolvimento Halter",series:"3x10",descanso:"90-180s",obs:""},
          {id:"p4",nome:"Elevacao Lateral",series:"3x10",descanso:"90-180s",obs:""},
          {id:"p5",nome:"Triceps Maquina",series:"3x10",descanso:"90-180s",obs:""},
          {id:"p6",nome:"Triceps Frances na Polia",series:"3x10",descanso:"90-180s",obs:""},
        ],
        PULL:[
          {id:"pu1",nome:"Puxada Aberta",series:"2x20 WarmUp + 3x10",descanso:"120-200s",obs:""},
          {id:"pu2",nome:"Puxada Neutra Unilateral",series:"3x10",descanso:"90-180s",obs:""},
          {id:"pu3",nome:"Remada Curvada Maquina",series:"3x10",descanso:"90-180s",obs:""},
          {id:"pu4",nome:"Remada Aberta Maquina",series:"3x10",descanso:"90-180s",obs:""},
          {id:"pu5",nome:"Rosca Martelo Alternada",series:"3x10",descanso:"90-120s",obs:""},
          {id:"pu6",nome:"Rosca Scott Maquina",series:"3x10",descanso:"90-120s",obs:""},
        ],
        LEGS:[
          {id:"l1",nome:"Agachamento Livre",series:"2x20 WarmUp + 3x10-8-6",descanso:"120-200s",obs:""},
          {id:"l2",nome:"Bulgaro",series:"3x10",descanso:"120-200s",obs:""},
          {id:"l3",nome:"Stiff com Barra",series:"3x10",descanso:"120-200s",obs:""},
          {id:"l4",nome:"Extensora",series:"3x10",descanso:"90-180s",obs:""},
          {id:"l5",nome:"Panturrilha Maquina",series:"3x10",descanso:"90s",obs:""},
        ],
      },
      alongamentos:{
        PUSH:[{id:"ap1",nome:"Rotacao Externa com Band",series:"2x20",descanso:"30s"}],
        PULL:[{id:"apu1",nome:"Rotacao Externa com Band",series:"2x20",descanso:"30s"},{id:"apu2",nome:"Barra Fixa",series:"2xMax",descanso:"60s"}],
        LEGS:[{id:"al1",nome:"Mobilidade de Quadril e Tornozelo",series:"1x45s c/lado",descanso:"N/D"},{id:"al2",nome:"Alongamento Pigeon",series:"1x45s c/lado",descanso:"N/D"}],
      },
    },
    3:{
      semanaAtual:2,
      periodizacao:[{semana:1,tipo:"BASE",rir:"2-3 RIR"},{semana:2,tipo:"BASE",rir:"2-3 RIR"},{semana:3,tipo:"CHOQUE",rir:"0-1 RIR"},{semana:4,tipo:"CHOQUE",rir:"0-1 RIR"}],
      divisao:[{dia:"SEG",tipo:"UPPER"},{dia:"TER",tipo:"LOWER"},{dia:"QUA",tipo:"DESCANSO"},{dia:"QUI",tipo:"UPPER"},{dia:"SEX",tipo:"DESCANSO"},{dia:"SAB",tipo:"LOWER"},{dia:"DOM",tipo:"DESCANSO"}],
      exercicios:{
        UPPER:[
          {id:"u1",nome:"Supino Reto Maquina",series:"3x12",descanso:"90s",obs:""},
          {id:"u2",nome:"Voador",series:"3x12",descanso:"90s",obs:""},
          {id:"u3",nome:"Puxada Aberta",series:"3x12",descanso:"90-120s",obs:""},
          {id:"u4",nome:"Remada Curvada",series:"3x12",descanso:"90s",obs:""},
          {id:"u5",nome:"Elevacao Lateral",series:"3x15",descanso:"60s",obs:""},
        ],
        LOWER:[
          {id:"lo1",nome:"Leg Press 45",series:"3x15",descanso:"90s",obs:""},
          {id:"lo2",nome:"Extensora",series:"3x15",descanso:"90s",obs:""},
          {id:"lo3",nome:"Flexora",series:"3x15",descanso:"90s",obs:""},
          {id:"lo4",nome:"Panturrilha Maquina",series:"4x20",descanso:"60s",obs:""},
        ],
      },
      alongamentos:{
        UPPER:[{id:"au1",nome:"Rotacao Externa com Band",series:"2x20",descanso:"30s"},{id:"au2",nome:"Alongamento de Peitoral",series:"1x45s",descanso:"N/D"}],
        LOWER:[{id:"alo1",nome:"Mobilidade de Quadril",series:"1x45s c/lado",descanso:"N/D"},{id:"alo2",nome:"Alongamento Pigeon",series:"1x45s c/lado",descanso:"N/D"}],
      },
    },
    4:{
      semanaAtual:3,
      periodizacao:[{semana:1,tipo:"BASE",rir:"2-3 RIR"},{semana:2,tipo:"BASE",rir:"2-3 RIR"},{semana:3,tipo:"CHOQUE",rir:"0-1 RIR"},{semana:4,tipo:"CHOQUE",rir:"0-1 RIR"}],
      divisao:[{dia:"SEG",tipo:"PUSH"},{dia:"TER",tipo:"PULL"},{dia:"QUA",tipo:"LEGS"},{dia:"QUI",tipo:"DESCANSO"},{dia:"SEX",tipo:"PUSH"},{dia:"SAB",tipo:"PULL"},{dia:"DOM",tipo:"DESCANSO"}],
      exercicios:{
        PUSH:[
          {id:"rp1",nome:"Supino Inclinado",series:"4x8",descanso:"120s",obs:""},
          {id:"rp2",nome:"Crossover Polia Alta",series:"4x10",descanso:"90s",obs:""},
          {id:"rp3",nome:"Desenvolvimento Halter",series:"4x10",descanso:"90s",obs:""},
          {id:"rp4",nome:"Triceps Corda",series:"4x12",descanso:"90s",obs:""},
        ],
        PULL:[
          {id:"rpu1",nome:"Barra Fixa",series:"4xMax",descanso:"120s",obs:""},
          {id:"rpu2",nome:"Remada Unilateral Halter",series:"4x10",descanso:"90s",obs:""},
          {id:"rpu3",nome:"Rosca Direta",series:"3x10",descanso:"90s",obs:""},
          {id:"rpu4",nome:"Rosca Martelo",series:"3x10",descanso:"90s",obs:""},
        ],
        LEGS:[
          {id:"rl1",nome:"Agachamento Livre",series:"4x8",descanso:"150s",obs:""},
          {id:"rl2",nome:"Leg Press 45",series:"4x10",descanso:"120s",obs:""},
          {id:"rl3",nome:"Cadeira Extensora",series:"3x12",descanso:"90s",obs:""},
          {id:"rl4",nome:"Stiff",series:"3x10",descanso:"90s",obs:""},
        ],
      },
      alongamentos:{
        PUSH:[{id:"rap1",nome:"Rotacao Externa com Band",series:"2x20",descanso:"30s"}],
        PULL:[{id:"rapu1",nome:"Barra Fixa Suspensa",series:"2xMax",descanso:"60s"}],
        LEGS:[{id:"ral1",nome:"Mobilidade de Quadril",series:"1x45s c/lado",descanso:"N/D"},{id:"ral2",nome:"Alongamento Pigeon",series:"1x45s c/lado",descanso:"N/D"}],
      },
    },
    5:{
      semanaAtual:1,
      periodizacao:[{semana:1,tipo:"BASE",rir:"2-3 RIR"},{semana:2,tipo:"BASE",rir:"2-3 RIR"},{semana:3,tipo:"CHOQUE",rir:"0-1 RIR"},{semana:4,tipo:"CHOQUE",rir:"0-1 RIR"}],
      divisao:[{dia:"SEG",tipo:"PUSH"},{dia:"TER",tipo:"PULL"},{dia:"QUA",tipo:"LEGS"},{dia:"QUI",tipo:"OMBRO"},{dia:"SEX",tipo:"PUSH"},{dia:"SAB",tipo:"DESCANSO"},{dia:"DOM",tipo:"DESCANSO"}],
      exercicios:{
        PUSH:[
          {id:"jp1",nome:"Supino Declinado Maquina",series:"3x10",descanso:"90-180s",obs:""},
          {id:"jp2",nome:"Voador",series:"3x10",descanso:"90s",obs:""},
          {id:"jp3",nome:"Triceps Frances na Polia",series:"3x12",descanso:"90s",obs:""},
        ],
        PULL:[
          {id:"jpu1",nome:"Puxada Neutra",series:"3x10",descanso:"120s",obs:""},
          {id:"jpu2",nome:"Remada Aberta Maquina",series:"3x10",descanso:"90s",obs:""},
          {id:"jpu3",nome:"Rosca Scott Maquina",series:"3x12",descanso:"90s",obs:""},
        ],
        LEGS:[
          {id:"jl1",nome:"Agachamento Hack",series:"3x10",descanso:"120s",obs:""},
          {id:"jl2",nome:"Extensora",series:"3x12",descanso:"90s",obs:""},
          {id:"jl3",nome:"Flexora",series:"3x12",descanso:"90s",obs:""},
          {id:"jl4",nome:"Panturrilha Maquina",series:"4x20",descanso:"60s",obs:""},
        ],
        OMBRO:[
          {id:"jo1",nome:"Desenvolvimento Maquina",series:"3x10",descanso:"90s",obs:""},
          {id:"jo2",nome:"Elevacao Lateral",series:"4x15",descanso:"60s",obs:""},
          {id:"jo3",nome:"Voador Inverso",series:"3x12",descanso:"90s",obs:""},
        ],
      },
      alongamentos:{
        PUSH:[{id:"jap1",nome:"Rotacao Externa com Band",series:"2x20",descanso:"30s"}],
        PULL:[{id:"japu1",nome:"Barra Fixa Suspensa",series:"2xMax",descanso:"60s"}],
        LEGS:[{id:"jal1",nome:"Mobilidade de Quadril",series:"1x45s c/lado",descanso:"N/D"}],
        OMBRO:[{id:"jao1",nome:"Mobilidade de Ombro",series:"1x20",descanso:"N/D"}],
      },
    },
  },
  registros:{
    3:{
      "2025-04-01_UPPER":{tipo:"UPPER",data:"2025-04-01",semana:1,cargas:{u1:{0:{carga:"30",reps:"12"},1:{carga:"30",reps:"12"},2:{carga:"32",reps:"10"}},u2:{0:{carga:"20",reps:"12"},1:{carga:"20",reps:"12"},2:{carga:"22",reps:"10"}},u3:{0:{carga:"35",reps:"12"},1:{carga:"35",reps:"11"},2:{carga:"37",reps:"10"}}}},
      "2025-04-03_LOWER":{tipo:"LOWER",data:"2025-04-03",semana:1,cargas:{lo1:{0:{carga:"80",reps:"15"},1:{carga:"80",reps:"14"},2:{carga:"85",reps:"12"}},lo2:{0:{carga:"25",reps:"15"},1:{carga:"25",reps:"15"},2:{carga:"27",reps:"13"}}}},
      "2025-04-08_UPPER":{tipo:"UPPER",data:"2025-04-08",semana:2,cargas:{u1:{0:{carga:"32",reps:"12"},1:{carga:"32",reps:"12"},2:{carga:"34",reps:"10"}},u2:{0:{carga:"22",reps:"12"},1:{carga:"22",reps:"12"},2:{carga:"24",reps:"10"}},u3:{0:{carga:"37",reps:"12"},1:{carga:"37",reps:"12"},2:{carga:"40",reps:"10"}}}},
      "2025-04-10_LOWER":{tipo:"LOWER",data:"2025-04-10",semana:2,cargas:{lo1:{0:{carga:"85",reps:"15"},1:{carga:"85",reps:"15"},2:{carga:"90",reps:"12"}},lo2:{0:{carga:"27",reps:"15"},1:{carga:"27",reps:"15"},2:{carga:"30",reps:"13"}}}},
      "2025-04-15_UPPER":{tipo:"UPPER",data:"2025-04-15",semana:2,cargas:{u1:{0:{carga:"34",reps:"11"},1:{carga:"34",reps:"11"},2:{carga:"36",reps:"9"}},u2:{0:{carga:"24",reps:"12"},1:{carga:"24",reps:"11"},2:{carga:"26",reps:"10"}},u3:{0:{carga:"40",reps:"11"},1:{carga:"40",reps:"11"},2:{carga:"42",reps:"9"}}}},
    },
    4:{
      "2025-03-20_PUSH":{tipo:"PUSH",data:"2025-03-20",semana:1,cargas:{rp1:{0:{carga:"60",reps:"8"},1:{carga:"60",reps:"8"},2:{carga:"65",reps:"6"}},rp2:{0:{carga:"15",reps:"10"},1:{carga:"15",reps:"10"},2:{carga:"17",reps:"9"}}}},
      "2025-03-25_LEGS":{tipo:"LEGS",data:"2025-03-25",semana:1,cargas:{rl1:{0:{carga:"80",reps:"8"},1:{carga:"80",reps:"7"},2:{carga:"85",reps:"6"}},rl2:{0:{carga:"120",reps:"10"},1:{carga:"120",reps:"10"},2:{carga:"130",reps:"9"}}}},
      "2025-04-01_PUSH":{tipo:"PUSH",data:"2025-04-01",semana:2,cargas:{rp1:{0:{carga:"65",reps:"8"},1:{carga:"65",reps:"8"},2:{carga:"70",reps:"7"}},rp2:{0:{carga:"17",reps:"10"},1:{carga:"17",reps:"10"},2:{carga:"19",reps:"9"}}}},
      "2025-04-08_PUSH":{tipo:"PUSH",data:"2025-04-08",semana:3,cargas:{rp1:{0:{carga:"70",reps:"8"},1:{carga:"70",reps:"7"},2:{carga:"75",reps:"6"}},rp2:{0:{carga:"19",reps:"10"},1:{carga:"19",reps:"9"},2:{carga:"21",reps:"8"}}}},
      "2025-04-10_LEGS":{tipo:"LEGS",data:"2025-04-10",semana:3,cargas:{rl1:{0:{carga:"87",reps:"8"},1:{carga:"87",reps:"7"},2:{carga:"92",reps:"6"}},rl2:{0:{carga:"130",reps:"10"},1:{carga:"130",reps:"9"},2:{carga:"140",reps:"8"}}}},
    },
    5:{
      "2025-04-05_PUSH":{tipo:"PUSH",data:"2025-04-05",semana:1,cargas:{jp1:{0:{carga:"40",reps:"10"},1:{carga:"40",reps:"10"},2:{carga:"42",reps:"9"}},jp2:{0:{carga:"15",reps:"10"},1:{carga:"15",reps:"10"},2:{carga:"17",reps:"9"}}}},
      "2025-04-07_PULL":{tipo:"PULL",data:"2025-04-07",semana:1,cargas:{jpu1:{0:{carga:"45",reps:"10"},1:{carga:"45",reps:"10"},2:{carga:"47",reps:"9"}},jpu2:{0:{carga:"30",reps:"10"},1:{carga:"30",reps:"10"},2:{carga:"32",reps:"9"}}}},
      "2025-04-09_LEGS":{tipo:"LEGS",data:"2025-04-09",semana:1,cargas:{jl1:{0:{carga:"50",reps:"10"},1:{carga:"50",reps:"10"},2:{carga:"55",reps:"8"}},jl2:{0:{carga:"20",reps:"12"},1:{carga:"20",reps:"12"},2:{carga:"22",reps:"10"}}}},
      "2025-04-12_PUSH":{tipo:"PUSH",data:"2025-04-12",semana:1,cargas:{jp1:{0:{carga:"42",reps:"10"},1:{carga:"42",reps:"10"},2:{carga:"44",reps:"9"}},jp2:{0:{carga:"17",reps:"10"},1:{carga:"17",reps:"10"},2:{carga:"19",reps:"9"}}}},
      "2025-04-14_PULL":{tipo:"PULL",data:"2025-04-14",semana:1,cargas:{jpu1:{0:{carga:"47",reps:"10"},1:{carga:"47",reps:"10"},2:{carga:"49",reps:"9"}},jpu2:{0:{carga:"32",reps:"10"},1:{carga:"32",reps:"10"},2:{carga:"34",reps:"9"}}}},
    },
  },
};

function useStore() {
  const [data,setData] = useState(() => { try { const s=localStorage.getItem("mjoly4"); return s?JSON.parse(s):INIT; } catch { return INIT; } });
  useEffect(() => { try { localStorage.setItem("mjoly4",JSON.stringify(data)); } catch {} },[data]);
  return [data,setData];
}

const sx = {
  app:{background:C.bg,minHeight:"100vh",fontFamily:"system-ui,sans-serif",color:C.text},
  nav:{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52},
  card:{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:18},
  input:{background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,padding:"8px 11px",color:C.text,fontSize:13,width:"100%",boxSizing:"border-box"},
  label:{fontSize:10,color:C.muted,marginBottom:3,display:"block",textTransform:"uppercase",letterSpacing:0.5},
  btn:(bg,col)=>({background:bg||C.accent,color:col||"#0f0f13",border:"none",borderRadius:7,padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer"}),
  btnOut:(active,col)=>({background:active?(col||C.accent)+"22":C.card2,color:active?(col||C.accent):C.muted,border:`1px solid ${active?(col||C.accent):C.border}`,borderRadius:7,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:active?700:400}),
  tag:(col)=>({background:col+"22",color:col,border:`1px solid ${col}44`,borderRadius:5,padding:"2px 7px",fontSize:10,fontWeight:700,display:"inline-block"}),
  avatar:(bg)=>({width:32,height:32,borderRadius:"50%",background:bg||C.accent2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}),
};

function Vazio({msg}) { return <div style={{padding:48,textAlign:"center",color:C.muted,fontSize:14}}>{msg}</div>; }

function Login({onLogin}) {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  return (
    <div style={{...sx.app,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{...sx.card,width:340,textAlign:"center"}}>
        <div style={{fontSize:26,fontWeight:800,color:C.accent,letterSpacing:3,marginBottom:2}}>MIGUEL JOLY</div>
        <div style={{color:C.muted,fontSize:11,marginBottom:24,letterSpacing:1}}>PERSONAL TRAINER</div>
        <div style={{textAlign:"left",marginBottom:10}}><label style={sx.label}>Email</label><input style={sx.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onLogin(email,pw,setErr)}/></div>
        <div style={{textAlign:"left",marginBottom:14}}><label style={sx.label}>Senha</label><input style={sx.input} type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onLogin(email,pw,setErr)}/></div>
        {err&&<div style={{color:C.accent3,fontSize:12,marginBottom:8}}>{err}</div>}
        <button style={{...sx.btn(),width:"100%",padding:"10px 0",fontSize:13}} onClick={()=>onLogin(email,pw,setErr)}>Entrar</button>
        <div style={{marginTop:16,fontSize:10,color:C.muted}}>
          Entre em contato com seu treinador para receber seu acesso.
        </div>
      </div>
    </div>
  );
}

function Nav({user,onLogout,page,setPage}) {
  const isAdmin = user.role==="admin";
  const pages = isAdmin ? ["Alunos","Progresso","Editar Treino","Criar Treino"] : ["Dashboard","Meu Treino","Registros","Evolucao"];
  const labels = isAdmin ? ["Alunos","Progresso","Editar Treino","Criar Treino"] : ["Dashboard","Meu Treino","Registros","Evolução"];
  return (
    <nav style={sx.nav}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontWeight:800,fontSize:14,color:C.accent,letterSpacing:2}}>MJ</span>
        <div style={{display:"flex",gap:2}}>
          {pages.map((p,i)=><button key={p} onClick={()=>setPage(p)} style={{background:page===p?C.accent+"18":"transparent",color:page===p?C.accent:C.muted,border:"none",borderRadius:6,padding:"5px 10px",fontSize:12,cursor:"pointer",fontWeight:page===p?700:400}}>{labels[i]}</button>)}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={sx.avatar()}>{user.avatar}</div>
        <span style={{fontSize:12}}>{user.name}</span>
        <button onClick={onLogout} style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Sair</button>
      </div>
    </nav>
  );
}

function Dashboard({user,data}) {
  const treino = data.treinos[user.id];
  if (!treino) return <Vazio msg="Nenhum treino cadastrado ainda."/>;
  const sem = treino.periodizacao.find(p=>p.semana===treino.semanaAtual);
  const regs = data.registros[user.id]||{};
  const diaHoje = treino.divisao[new Date().getDay()===0?6:new Date().getDay()-1]||treino.divisao[0];
  return (
    <div style={{padding:22}}>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:"0 0 2px",fontSize:20}}>Ola, {user.name.split(" ")[0]}!</h2>
        <p style={{color:C.muted,margin:0,fontSize:12}}>{user.objetivo} / {user.modalidade} / {user.treinos_semana}x semana</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {[["Semana",treino.semanaAtual+"/4",C.accent2],["Fase",sem?.tipo||"-",sem?.tipo==="CHOQUE"?C.accent3:C.accent],["RIR",sem?.rir||"-",C.accent],["Sessoes",Object.keys(regs).length,C.accent2]].map(([l,v,col])=>(
          <div key={l} style={{background:C.card2,borderRadius:9,border:`1px solid ${C.border}`,padding:"11px 13px"}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
            <div style={{fontSize:18,fontWeight:700,color:col}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={sx.card}>
          <div style={{fontSize:10,color:C.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Treino de Hoje</div>
          {diaHoje?.tipo!=="DESCANSO"?(<><span style={sx.tag(TC[diaHoje?.tipo]||C.muted)}>{diaHoje?.tipo}</span><div style={{fontWeight:600,fontSize:14,marginTop:6}}>{getMuscles(diaHoje?.tipo||"")}</div></>):<div style={{color:C.muted}}>Dia de descanso!</div>}
        </div>
        <div style={sx.card}>
          <div style={{fontSize:10,color:C.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Semana</div>
          {treino.divisao.map(d=>(
            <div key={d.dia} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:11,color:C.muted,width:36}}>{d.dia}</span>
              <span style={sx.tag(TC[d.tipo]||C.muted)}>{d.tipo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeuTreino({user,data}) {
  const [tipo,setTipo] = useState(null);
  const treino = data.treinos[user.id];
  if (!treino) return <Vazio msg="Nenhum treino cadastrado."/>;
  const tipos = [...new Set(treino.divisao.filter(d=>d.tipo!=="DESCANSO").map(d=>d.tipo))];
  const tipoAtual = tipo || tipos[0];
  const exs = treino.exercicios[tipoAtual]||[];
  const alongs = (treino.alongamentos||{})[tipoAtual]||[];
  return (
    <div style={{padding:22}}>
      <h2 style={{margin:"0 0 16px",fontSize:18}}>Meu Treino</h2>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {tipos.map(t=><button key={t} onClick={()=>setTipo(t)} style={sx.btnOut(tipoAtual===t,TC[t])}>{t}</button>)}
      </div>
      <div style={{marginBottom:8,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>Exercicios</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {exs.map((ex,i)=>(
          <div key={ex.id} style={{...sx.card,borderLeft:`3px solid ${TC[tipoAtual]||C.accent}`,padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <a href={"https://www.youtube.com/results?search_query="+encodeURIComponent(ex.nome+" exercicio")} target="_blank" rel="noopener noreferrer" style={{fontWeight:700,fontSize:13,color:C.accent,textDecoration:"none",borderBottom:`1px dashed ${C.accent}44`}}>{i+1}. {ex.nome}</a>
                  <span style={{fontSize:10,color:"#ff4444",opacity:0.8}}>&#9654; YT</span>
                </div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>{ex.series}</div>
                {ex.obs&&<div style={{color:C.gold,fontSize:11,marginTop:2}}>{ex.obs}</div>}
              </div>
              <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.muted}}>Descanso</div><div style={{fontSize:12,color:C.accent,fontWeight:600}}>{ex.descanso}</div></div>
            </div>
          </div>
        ))}
      </div>
      {alongs.length>0&&<>
        <div style={{marginBottom:8,fontSize:10,color:C.gold,textTransform:"uppercase",letterSpacing:0.5}}>Alongamentos e Mobilidade</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {alongs.map((a,i)=>(
            <div key={a.id} style={{...sx.card,borderLeft:`3px solid ${C.gold}`,padding:"10px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <a href={"https://www.youtube.com/results?search_query="+encodeURIComponent(a.nome)} target="_blank" rel="noopener noreferrer" style={{fontWeight:600,fontSize:12,color:C.gold,textDecoration:"none",borderBottom:`1px dashed ${C.gold}44`}}>{i+1}. {a.nome}</a>
                  <span style={{fontSize:10,color:"#ff4444",opacity:0.8}}>&#9654; YT</span>
                </div>
                <span style={{fontSize:11,color:C.muted}}>{a.series} / {a.descanso}</span>
              </div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function Registros({user,data,setData}) {
  const [tipo,setTipo] = useState(null);
  const [cargas,setCargas] = useState({});
  const [saved,setSaved] = useState(false);
  const treino = data.treinos[user.id];
  if (!treino) return <Vazio msg="Nenhum treino cadastrado."/>;
  const tipos = [...new Set(treino.divisao.filter(d=>d.tipo!=="DESCANSO").map(d=>d.tipo))];
  const tipoAtual = tipo||tipos[0];
  const exs = treino.exercicios[tipoAtual]||[];
  const sem = treino.periodizacao.find(p=>p.semana===treino.semanaAtual);
  const setC = (exId,si,field,val) => { setCargas(p=>({...p,[exId]:{...p[exId],[si]:{...(p[exId]?.[si]||{}),[field]:val}}})); setSaved(false); };
  const salvar = () => {
    const hoje = new Date().toISOString().split("T")[0];
    const key = hoje+"_"+tipoAtual;
    setData(p=>({...p,registros:{...p.registros,[user.id]:{...(p.registros[user.id]||{}),[key]:{tipo:tipoAtual,data:hoje,semana:treino.semanaAtual,cargas}}}}));
    setSaved(true);
  };
  return (
    <div style={{padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0,fontSize:18}}>Anotar Cargas</h2>
        <button style={sx.btn(saved?C.accent2:C.accent)} onClick={salvar}>{saved?"Salvo!":"Salvar Treino"}</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {tipos.map(t=><button key={t} onClick={()=>{setTipo(t);setCargas({});setSaved(false);}} style={sx.btnOut(tipoAtual===t,TC[t])}>{t}</button>)}
      </div>
      <div style={{fontSize:11,color:C.muted,marginBottom:14}}>Semana {treino.semanaAtual} / {sem?.tipo} / {sem?.rir} / {N_SERIES} series</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {exs.map((ex,i)=>(
          <div key={ex.id} style={{...sx.card,borderLeft:`3px solid ${TC[tipoAtual]||C.accent}`}}>
            <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>{i+1}. {ex.nome}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
              {Array.from({length:N_SERIES}).map((_,si)=>(
                <div key={si} style={{background:C.card2,borderRadius:7,padding:"9px 7px"}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:5,textAlign:"center"}}>Serie {si+1}</div>
                  <div style={{marginBottom:4}}><div style={{fontSize:8,color:C.muted,marginBottom:2}}>KG</div><input type="number" style={{...sx.input,padding:"4px 5px",fontSize:12,textAlign:"center"}} placeholder="0" value={cargas[ex.id]?.[si]?.carga||""} onChange={e=>setC(ex.id,si,"carga",e.target.value)}/></div>
                  <div><div style={{fontSize:8,color:C.muted,marginBottom:2}}>REPS</div><input type="number" style={{...sx.input,padding:"4px 5px",fontSize:12,textAlign:"center"}} placeholder="0" value={cargas[ex.id]?.[si]?.reps||""} onChange={e=>setC(ex.id,si,"reps",e.target.value)}/></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Evolucao({user,data}) {
  const [tipo,setTipo] = useState(null);
  const [exSel,setExSel] = useState(null);
  const treino = data.treinos[user.id];
  if (!treino) return <Vazio msg="Nenhum treino cadastrado."/>;
  const tipos = [...new Set(treino.divisao.filter(d=>d.tipo!=="DESCANSO").map(d=>d.tipo))];
  const tipoAtual = tipo||tipos[0];
  const exs = treino.exercicios[tipoAtual]||[];
  useEffect(()=>{setExSel(exs[0]?.id||null);},[tipoAtual]);
  const regs = data.registros[user.id]||{};
  const chartData = (exId) => {
    const pts=[];
    Object.entries(regs).sort().forEach(([,reg])=>{
      if (reg.tipo!==tipoAtual||!reg.cargas?.[exId]) return;
      const s=Object.values(reg.cargas[exId]);
      const maxC=Math.max(...s.map(x=>parseFloat(x.carga)||0));
      const vol=s.reduce((a,x)=>a+(parseFloat(x.carga)||0)*(parseFloat(x.reps)||0),0);
      if (maxC>0) pts.push({data:reg.data,cargaMax:maxC,volume:Math.round(vol)});
    });
    return pts;
  };
  const cd = exSel?chartData(exSel):[];
  const exAtual = exs.find(e=>e.id===exSel);
  const tt = {contentStyle:{background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:11}};
  return (
    <div style={{padding:22}}>
      <h2 style={{margin:"0 0 16px",fontSize:18}}>Evolução</h2>
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        {tipos.map(t=><button key={t} onClick={()=>setTipo(t)} style={sx.btnOut(tipoAtual===t,TC[t])}>{t}</button>)}
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>
        {exs.map(ex=><button key={ex.id} onClick={()=>setExSel(ex.id)} style={{...sx.btnOut(exSel===ex.id),fontSize:11,padding:"4px 9px"}}>{ex.nome}</button>)}
      </div>
      {cd.length===0?(
        <div style={{...sx.card,textAlign:"center",padding:40,color:C.muted}}>Sem registros para <b style={{color:C.text}}>{exAtual?.nome}</b> ainda.</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={sx.card}><div style={{fontWeight:700,fontSize:13,marginBottom:12}}>{exAtual?.nome} — Carga Maxima</div>
            <ResponsiveContainer width="100%" height={170}><LineChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="data" stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><YAxis stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><Tooltip {...tt}/><Line type="monotone" dataKey="cargaMax" stroke={C.accent} strokeWidth={2} dot={{fill:C.accent,r:3}} name="Carga Max (kg)"/></LineChart></ResponsiveContainer>
          </div>
          <div style={sx.card}><div style={{fontWeight:700,fontSize:13,marginBottom:12}}>{exAtual?.nome} — Volume Total</div>
            <ResponsiveContainer width="100%" height={170}><BarChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="data" stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><YAxis stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><Tooltip {...tt}/><Bar dataKey="volume" fill={C.accent2} radius={[3,3,0,0]} name="Volume"/></BarChart></ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAlunos({data,setData}) {
  const [form,setForm] = useState({name:"",email:"",password:"",objetivo:"Ganho de Massa",modalidade:"Musculacao",treinos_semana:4});
  const [msg,setMsg] = useState("");
  const alunos = data.users.filter(u=>u.role==="aluno");
  const add = () => {
    if (!form.name||!form.email||!form.password) { setMsg("Preencha todos os campos."); return; }
    const id=Date.now();
    const avatar=form.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
    setData(p=>({...p,users:[...p.users,{...form,id,role:"aluno",avatar,treinos_semana:parseInt(form.treinos_semana)}]}));
    setForm({name:"",email:"",password:"",objetivo:"Ganho de Massa",modalidade:"Musculacao",treinos_semana:4});
    setMsg("Aluno cadastrado!"); setTimeout(()=>setMsg(""),3000);
  };
  const remover = (id) => { if (!confirm("Remover aluno?")) return; setData(p=>({...p,users:p.users.filter(u=>u.id!==id)})); };
  return (
    <div style={{padding:22}}>
      <h2 style={{margin:"0 0 18px",fontSize:18}}>Alunos</h2>
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18}}>
        <div style={sx.card}>
          <div style={{fontWeight:700,marginBottom:12,fontSize:13}}>Novo Aluno</div>
          {[["Nome","name","text"],["Email","email","email"],["Senha","password","password"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:9}}><label style={sx.label}>{l}</label><input style={sx.input} type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
          ))}
          <div style={{marginBottom:9}}><label style={sx.label}>Objetivo</label><select style={sx.input} value={form.objetivo} onChange={e=>setForm(p=>({...p,objetivo:e.target.value}))}>{["Ganho de Massa","Emagrecimento","Condicionamento","Definicao"].map(o=><option key={o}>{o}</option>)}</select></div>
          <div style={{marginBottom:12}}><label style={sx.label}>Treinos/semana</label><input style={sx.input} type="number" min={1} max={7} value={form.treinos_semana} onChange={e=>setForm(p=>({...p,treinos_semana:e.target.value}))}/></div>
          {msg&&<div style={{color:C.accent,fontSize:11,marginBottom:8}}>{msg}</div>}
          <button style={{...sx.btn(),width:"100%"}} onClick={add}>Cadastrar Aluno</button>
        </div>
        <div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{alunos.length} aluno(s)</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {alunos.map(a=>{
              const temTreino=!!data.treinos[a.id];
              const regs=Object.keys(data.registros[a.id]||{}).length;
              return (
                <div key={a.id} style={{...sx.card,padding:"13px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={sx.avatar(C.accent2)}>{a.avatar}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{a.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>{a.email} / {a.objetivo} / {a.treinos_semana}x sem</div>
                        <div style={{display:"flex",gap:5,marginTop:4}}>
                          <span style={sx.tag(temTreino?C.accent:C.muted)}>{temTreino?"Treino ativo":"Sem treino"}</span>
                          <span style={sx.tag(C.accent2)}>{regs} sessao(oes)</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={()=>remover(a.id)} style={{background:C.accent3+"22",color:C.accent3,border:"none",borderRadius:6,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>X</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProgresso({data}) {
  const [alunoSel,setAlunoSel] = useState(null);
  const [tipo,setTipo] = useState("PUSH");
  const [exSel,setExSel] = useState(null);
  const alunos = data.users.filter(u=>u.role==="aluno");
  const tt = {contentStyle:{background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:11}};
  const aluno = alunoSel?alunos.find(a=>a.id===alunoSel):null;
  const treino = aluno?data.treinos[aluno.id]:null;
  const tipos = treino?[...new Set(treino.divisao.filter(d=>d.tipo!=="DESCANSO").map(d=>d.tipo))]:[];
  const exs = treino?(treino.exercicios[tipo]||[]):[];
  useEffect(()=>{if(exs.length) setExSel(exs[0].id);},[tipo,alunoSel]);
  const chartData = (al,t,exId) => {
    const regs=data.registros[al.id]||{};
    const pts=[];
    Object.entries(regs).sort().forEach(([,reg])=>{
      if (reg.tipo!==t||!reg.cargas?.[exId]) return;
      const s=Object.values(reg.cargas[exId]);
      const maxC=Math.max(...s.map(x=>parseFloat(x.carga)||0));
      const vol=s.reduce((a,x)=>a+(parseFloat(x.carga)||0)*(parseFloat(x.reps)||0),0);
      if (maxC>0) pts.push({data:reg.data,cargaMax:maxC,volume:Math.round(vol)});
    });
    return pts;
  };
  const cd = aluno&&exSel?chartData(aluno,tipo,exSel):[];
  const exAtual = exs.find(e=>e.id===exSel);
  const semAtual = treino?.periodizacao.find(p=>p.semana===treino.semanaAtual);
  return (
    <div style={{padding:22}}>
      <h2 style={{margin:"0 0 18px",fontSize:18}}>Progresso dos Alunos</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10,marginBottom:20}}>
        {alunos.map(a=>{
          const regs=data.registros[a.id]||{};
          const total=Object.keys(regs).length;
          const ultimo=Object.values(regs).sort((x,y)=>y.data>x.data?1:-1)[0];
          const t=data.treinos[a.id];
          const sem=t?.periodizacao.find(p=>p.semana===t.semanaAtual);
          const sel=alunoSel===a.id;
          return (
            <div key={a.id} onClick={()=>setAlunoSel(sel?null:a.id)} style={{...sx.card,cursor:"pointer",border:`1px solid ${sel?C.accent:C.border}`,padding:"13px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={sx.avatar(sel?C.accent:C.accent2)}>{a.avatar}</div>
                <div><div style={{fontWeight:700,fontSize:12}}>{a.name}</div><div style={{fontSize:10,color:C.muted}}>{a.objetivo}</div></div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                <span style={sx.tag(C.accent)}>{total} sessoes</span>
                {sem&&<span style={sx.tag(sem.tipo==="CHOQUE"?C.accent3:C.accent2)}>{sem.tipo}</span>}
                {!t&&<span style={sx.tag(C.muted)}>Sem treino</span>}
              </div>
              {ultimo&&<div style={{fontSize:10,color:C.muted,marginTop:5}}>Ultimo: {ultimo.data}</div>}
            </div>
          );
        })}
        {alunos.length===0&&<Vazio msg="Nenhum aluno cadastrado."/>}
      </div>
      {aluno&&(
        <div style={sx.card}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
            <div style={sx.avatar(C.accent)}>{aluno.avatar}</div>
            <div><div style={{fontWeight:700,fontSize:15}}>{aluno.name}</div><div style={{fontSize:11,color:C.muted}}>{aluno.objetivo}</div></div>
            <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
              {[["Sessoes",Object.keys(data.registros[aluno.id]||{}).length,C.accent],["Semana",treino?treino.semanaAtual+"/4":"—",C.accent2],["Fase",semAtual?.tipo||"—",semAtual?.tipo==="CHOQUE"?C.accent3:C.accent2]].map(([l,v,col])=>(
                <div key={l} style={{background:C.card2,borderRadius:7,padding:"8px 12px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
                  <div style={{fontSize:16,fontWeight:700,color:col}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          {!treino?<Vazio msg="Este aluno nao tem treino."/>:(
            <>
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                {tipos.map(t=><button key={t} onClick={()=>setTipo(t)} style={sx.btnOut(tipo===t,TC[t])}>{t}</button>)}
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
                {exs.map(ex=><button key={ex.id} onClick={()=>setExSel(ex.id)} style={{...sx.btnOut(exSel===ex.id),fontSize:11,padding:"4px 9px"}}>{ex.nome}</button>)}
              </div>
              {cd.length===0?(
                <div style={{color:C.muted,fontSize:12,textAlign:"center",padding:24}}>Sem registros para {exAtual?.nome}.</div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div><div style={{fontSize:12,fontWeight:700,marginBottom:10}}>{exAtual?.nome} — Carga Maxima</div>
                    <ResponsiveContainer width="100%" height={160}><LineChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="data" stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><YAxis stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><Tooltip {...tt}/><Line type="monotone" dataKey="cargaMax" stroke={C.accent} strokeWidth={2} dot={{fill:C.accent,r:3}} name="Carga Max"/></LineChart></ResponsiveContainer>
                  </div>
                  <div><div style={{fontSize:12,fontWeight:700,marginBottom:10}}>{exAtual?.nome} — Volume</div>
                    <ResponsiveContainer width="100%" height={160}><BarChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="data" stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><YAxis stroke={C.muted} tick={{fontSize:9,fill:C.muted}}/><Tooltip {...tt}/><Bar dataKey="volume" fill={C.accent2} radius={[3,3,0,0]} name="Volume"/></BarChart></ResponsiveContainer>
                  </div>
                </div>
              )}
              <div style={{marginTop:16}}>
                <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Historico</div>
                <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:160,overflowY:"auto"}}>
                  {Object.entries(data.registros[aluno.id]||{}).sort((a,b)=>b[0]>a[0]?1:-1).map(([key,reg])=>(
                    <div key={key} style={{background:C.card2,borderRadius:6,padding:"7px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={sx.tag(TC[reg.tipo]||C.muted)}>{reg.tipo}</span><span style={{fontSize:12}}>{reg.data}</span><span style={{fontSize:10,color:C.muted}}>Sem {reg.semana}</span></div>
                      <span style={{fontSize:10,color:C.muted}}>{Object.keys(reg.cargas||{}).length} ex.</span>
                    </div>
                  ))}
                  {Object.keys(data.registros[aluno.id]||{}).length===0&&<div style={{color:C.muted,fontSize:12}}>Nenhuma sessao ainda.</div>}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ExRow({ex,idx,total,onMove,onEdit,onRemove,cor}) {
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState({nome:ex.nome,series:ex.series,descanso:ex.descanso,obs:ex.obs||""});
  return (
    <div style={{...sx.card,borderLeft:`3px solid ${cor}`,padding:"10px 14px",marginBottom:6}}>
      {editing?(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
            {[["Nome",form.nome,"nome"],["Series/Reps",form.series,"series"],["Descanso",form.descanso,"descanso"]].map(([l,v,k])=>(
              <div key={k}><label style={sx.label}>{l}</label><input style={sx.input} value={v} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
            ))}
          </div>
          <div style={{marginBottom:8}}><label style={sx.label}>Observacao</label><input style={sx.input} value={form.obs} onChange={e=>setForm(p=>({...p,obs:e.target.value}))} placeholder="Opcional..."/></div>
          <div style={{display:"flex",gap:6}}>
            <button style={sx.btn(C.accent)} onClick={()=>{onEdit(form);setEditing(false);}}>Salvar</button>
            <button style={sx.btn(C.card2,C.muted)} onClick={()=>setEditing(false)}>Cancelar</button>
          </div>
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginRight:4}}>
            <button disabled={idx===0} onClick={()=>onMove(idx,idx-1)} style={{background:"transparent",border:"none",color:idx===0?C.border:C.muted,cursor:idx===0?"default":"pointer",fontSize:12,lineHeight:1,padding:"1px 3px"}}>▲</button>
            <button disabled={idx===total-1} onClick={()=>onMove(idx,idx+1)} style={{background:"transparent",border:"none",color:idx===total-1?C.border:C.muted,cursor:idx===total-1?"default":"pointer",fontSize:12,lineHeight:1,padding:"1px 3px"}}>▼</button>
          </div>
          <div style={{fontSize:11,color:C.muted,width:18,textAlign:"center",fontWeight:700}}>{idx+1}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:13}}>{ex.nome}</div>
            <div style={{fontSize:11,color:C.muted}}>{ex.series} / {ex.descanso}</div>
            {ex.obs&&<div style={{fontSize:11,color:C.gold}}>{ex.obs}</div>}
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>setEditing(true)} style={{background:C.accent2+"22",color:C.accent2,border:"none",borderRadius:5,padding:"4px 9px",fontSize:11,cursor:"pointer"}}>Editar</button>
            <button onClick={onRemove} style={{background:C.accent3+"22",color:C.accent3,border:"none",borderRadius:5,padding:"4px 9px",fontSize:11,cursor:"pointer"}}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminEditarTreino({data,setData}) {
  const alunos = data.users.filter(u=>u.role==="aluno"&&data.treinos[u.id]);
  const [alunoSel,setAlunoSel] = useState(alunos[0]?.id||null);
  const [tipo,setTipo] = useState("PUSH");
  const [form,setForm] = useState({nome:"",series:"3x10",descanso:"90-120s",obs:""});
  const [msg,setMsg] = useState("");
  const treino = alunoSel?data.treinos[alunoSel]:null;
  const tipos = treino?[...new Set(treino.divisao.filter(d=>d.tipo!=="DESCANSO").map(d=>d.tipo))]:[];
  useEffect(()=>{if(tipos.length&&!tipos.includes(tipo)) setTipo(tipos[0]);},[alunoSel]);
  const update = (fn) => { setData(p=>{const t=clone(p.treinos[alunoSel]);fn(t);return{...p,treinos:{...p.treinos,[alunoSel]:t}};}); };
  const moveEx=(from,to)=>{update(t=>{const e=[...(t.exercicios[tipo]||[])];const [item]=e.splice(from,1);e.splice(to,0,item);t.exercicios[tipo]=e;});};
  const editEx=(i,vals)=>{update(t=>{t.exercicios[tipo][i]={...t.exercicios[tipo][i],...vals};});};
  const removeEx=(i)=>{update(t=>{t.exercicios[tipo].splice(i,1);});};
  const addEx=()=>{if(!form.nome){setMsg("Digite o nome.");return;}update(t=>{if(!t.exercicios[tipo])t.exercicios[tipo]=[];t.exercicios[tipo].push({id:uid(),...form});});setForm({nome:"",series:"3x10",descanso:"90-120s",obs:""});setMsg("Adicionado!");setTimeout(()=>setMsg(""),2000);};
  const setSemana=(s)=>{update(t=>{t.semanaAtual=s;});};
  if (alunos.length===0) return <Vazio msg="Nenhum aluno com treino ativo."/>;
  const exs = treino?(treino.exercicios[tipo]||[]):[];
  const cor = TC[tipo]||C.accent;
  return (
    <div style={{padding:22}}>
      <h2 style={{margin:"0 0 16px",fontSize:18}}>Editar Treino</h2>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {alunos.map(a=><button key={a.id} onClick={()=>setAlunoSel(a.id)} style={sx.btnOut(alunoSel===a.id)}>{a.name}</button>)}
      </div>
      {treino&&(<>
        <div style={{...sx.card,marginBottom:14,padding:"12px 16px"}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Semana atual</div>
          <div style={{display:"flex",gap:6}}>
            {treino.periodizacao.map(p=><button key={p.semana} onClick={()=>setSemana(p.semana)} style={{...sx.btnOut(treino.semanaAtual===p.semana),fontSize:11}}>Sem {p.semana} / {p.tipo}</button>)}
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {tipos.map(t=><button key={t} onClick={()=>setTipo(t)} style={sx.btnOut(tipo===t,TC[t])}>{t} ({(treino.exercicios[t]||[]).length})</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
          <div style={sx.card}>
            <div style={{fontWeight:700,marginBottom:12,fontSize:13}}>+ Adicionar ao {tipo}</div>
            <div style={{marginBottom:8}}><label style={sx.label}>Nome</label><input style={sx.input} value={form.nome} onChange={e=>setForm(p=>({...p,nome:e.target.value}))} placeholder="Ex: Supino Reto"/></div>
            <div style={{marginBottom:8}}><label style={sx.label}>Series / Reps</label><input style={sx.input} value={form.series} onChange={e=>setForm(p=>({...p,series:e.target.value}))}/></div>
            <div style={{marginBottom:8}}><label style={sx.label}>Descanso</label><input style={sx.input} value={form.descanso} onChange={e=>setForm(p=>({...p,descanso:e.target.value}))}/></div>
            <div style={{marginBottom:12}}><label style={sx.label}>Obs</label><input style={sx.input} value={form.obs} onChange={e=>setForm(p=>({...p,obs:e.target.value}))} placeholder="Opcional..."/></div>
            {msg&&<div style={{color:C.accent,fontSize:11,marginBottom:8}}>{msg}</div>}
            <button style={{...sx.btn(),width:"100%"}} onClick={addEx}>+ Adicionar</button>
          </div>
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Use ▲▼ para reposicionar / {exs.length} exercicio(s)</div>
            {exs.map((ex,i)=><ExRow key={ex.id} ex={ex} idx={i} total={exs.length} cor={cor} onMove={moveEx} onEdit={(v)=>editEx(i,v)} onRemove={()=>removeEx(i)}/>)}
            {exs.length===0&&<div style={{color:C.muted,fontSize:12}}>Nenhum exercicio neste treino.</div>}
          </div>
        </div>
      </>)}
    </div>
  );
}

function AdminCriarTreino({data,setData}) {
  const alunos = data.users.filter(u=>u.role==="aluno");
  const [alunoSel,setAlunoSel] = useState(alunos[0]?.id||null);
  const [tipo,setTipo] = useState("PUSH");
  const [form,setForm] = useState({nome:"",series:"3x10",descanso:"90-120s",obs:""});
  const [formAlong,setFormAlong] = useState({nome:"",series:"1x45s",descanso:"N/D"});
  const [saved,setSaved] = useState(false);
  const [tab,setTab] = useState("exercicios");
  const [customTipo,setCustomTipo] = useState("");
  const [showCustom,setShowCustom] = useState(false);
  const tiposDivisao = ["PUSH","PULL","LEGS","UPPER","LOWER","FULL","ABS","OMBRO","BRACOS","DESCANSO","PERSONALIZADO"];
  const DIAS = ["SEG","TER","QUA","QUI","SEX","SAB","DOM"];
  const PERIOD_TIPOS = ["BASE","CHOQUE","DELOAD"];

  const makeDraft = () => ({
    semanaAtual:1,
    periodizacao:[{semana:1,tipo:"BASE",rir:"2-3 RIR"},{semana:2,tipo:"BASE",rir:"2-3 RIR"},{semana:3,tipo:"CHOQUE",rir:"0-1 RIR"},{semana:4,tipo:"CHOQUE",rir:"0-1 RIR"}],
    divisao:DIAS.map((dia,i)=>({dia,tipo:i<3?["PUSH","PULL","LEGS"][i]:"DESCANSO"})),
    exercicios:{PUSH:[],PULL:[],LEGS:[]},
    alongamentos:{PUSH:[],PULL:[],LEGS:[]},
  });

  const [draft,setDraft] = useState(()=>alunoSel&&data.treinos[alunoSel]?clone(data.treinos[alunoSel]):makeDraft());
  useEffect(()=>{ setDraft(alunoSel&&data.treinos[alunoSel]?clone(data.treinos[alunoSel]):makeDraft()); setSaved(false); },[alunoSel]);

  const upd = (fn) => setDraft(p=>{const d=clone(p);fn(d);return d;});
  const tipos = [...new Set(draft.divisao.filter(d=>d.tipo!=="DESCANSO").map(d=>d.tipo))];
  const exs = draft.exercicios[tipo]||[];
  const alongs = draft.alongamentos?.[tipo]||[];
  const cor = TC[tipo]||C.accent;

  const addEx=()=>{if(!form.nome)return;upd(d=>{if(!d.exercicios[tipo])d.exercicios[tipo]=[];d.exercicios[tipo].push({id:uid(),...form});});setForm({nome:"",series:"3x10",descanso:"90-120s",obs:""}); };
  const moveEx=(from,to)=>{upd(d=>{const e=[...(d.exercicios[tipo]||[])];const [item]=e.splice(from,1);e.splice(to,0,item);d.exercicios[tipo]=e;});};
  const editEx=(i,vals)=>{upd(d=>{d.exercicios[tipo][i]={...d.exercicios[tipo][i],...vals};});};
  const removeEx=(i)=>{upd(d=>{d.exercicios[tipo].splice(i,1);});};
  const addAlong=()=>{if(!formAlong.nome)return;upd(d=>{if(!d.alongamentos[tipo])d.alongamentos[tipo]=[];d.alongamentos[tipo].push({id:uid(),...formAlong});});setFormAlong({nome:"",series:"1x45s",descanso:"N/D"});};
  const removeAlong=(i)=>{upd(d=>{(d.alongamentos[tipo]||[]).splice(i,1);});};
  const salvar=()=>{if(!alunoSel)return;setData(p=>({...p,treinos:{...p.treinos,[alunoSel]:draft}}));setSaved(true);setTimeout(()=>setSaved(false),3000);};

  return (
    <div style={{padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0,fontSize:18}}>Criar / Montar Treino</h2>
        <button style={sx.btn(saved?C.accent2:C.accent)} onClick={salvar}>{saved?"Salvo!":"Salvar Treino do Aluno"}</button>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Aluno</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {alunos.map(a=><button key={a.id} onClick={()=>setAlunoSel(a.id)} style={{...sx.btnOut(alunoSel===a.id),display:"flex",alignItems:"center",gap:5}}>
            <div style={{...sx.avatar(alunoSel===a.id?C.accent:C.accent2),width:20,height:20,fontSize:8}}>{a.avatar}</div>{a.name}
          </button>)}
          {alunos.length===0&&<span style={{color:C.muted,fontSize:12}}>Nenhum aluno cadastrado.</span>}
        </div>
      </div>
      {alunoSel&&(<>
        <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:`1px solid ${C.border}`,paddingBottom:8}}>
          {[["divisao","Divisao da Semana"],["periodizacao","Periodizacao"],["exercicios","Exercicios"],["alongamentos","Alongamentos"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?C.accent+"22":"transparent",color:tab===k?C.accent:C.muted,border:tab===k?`1px solid ${C.accent}44`:"none",borderRadius:6,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:tab===k?700:400}}>{l}</button>
          ))}
        </div>

        {tab==="divisao"&&(
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Defina o tipo de treino para cada dia.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
              {DIAS.map((dia)=>{
                const diaObj=draft.divisao.find(d=>d.dia===dia)||{dia,tipo:"DESCANSO"};
                const t=diaObj.tipo;
                const isCustom=!tiposDivisao.slice(0,-1).includes(t);
                return (
                  <div key={dia} style={{borderRadius:9,overflow:"hidden",border:`1px solid ${TC[t]||C.border}`,textAlign:"center"}}>
                    <div style={{background:TC[t]||C.muted,padding:"6px 4px",fontSize:9,fontWeight:700,color:"#fff",letterSpacing:1}}>{dia}</div>
                    <select value={isCustom?"PERSONALIZADO":t} onChange={e=>{
                      const val=e.target.value;
                      if(val==="PERSONALIZADO"){setShowCustom(dia);}
                      else{upd(d=>{const idx=d.divisao.findIndex(x=>x.dia===dia);if(idx>-1)d.divisao[idx].tipo=val;else d.divisao.push({dia,tipo:val});if(val!=="DESCANSO"&&!d.exercicios[val])d.exercicios[val]=[];if(val!=="DESCANSO"&&!d.alongamentos[val])d.alongamentos[val]=[];});setSaved(false);}
                    }} style={{width:"100%",background:C.card2,border:"none",color:C.text,padding:"8px 4px",fontSize:11,textAlign:"center",cursor:"pointer"}}>
                      {tiposDivisao.map(td=><option key={td} value={td}>{td==="PERSONALIZADO"?"✏ Personalizado":td}</option>)}
                      {isCustom&&<option value={t}>{t}</option>}
                    </select>
                    {isCustom&&<div style={{fontSize:9,color:TC[t]||C.gold,padding:"2px 4px",fontWeight:700}}>{t}</div>}
                    {showCustom===dia&&(
                      <div style={{padding:"6px 4px",background:C.card2}}>
                        <input autoFocus style={{...sx.input,padding:"4px 6px",fontSize:11,textAlign:"center"}} placeholder="Nome..." value={customTipo} onChange={e=>setCustomTipo(e.target.value.toUpperCase())}
                          onKeyDown={e=>{
                            if(e.key==="Enter"&&customTipo.trim()){
                              const val=customTipo.trim();
                              upd(d=>{const idx=d.divisao.findIndex(x=>x.dia===dia);if(idx>-1)d.divisao[idx].tipo=val;else d.divisao.push({dia,tipo:val});if(!d.exercicios[val])d.exercicios[val]=[];if(!d.alongamentos[val])d.alongamentos[val]=[];});
                              setShowCustom(false);setCustomTipo("");setSaved(false);
                            }
                            if(e.key==="Escape"){setShowCustom(false);setCustomTipo("");}
                          }}/>
                        <div style={{fontSize:9,color:C.muted,marginTop:2,textAlign:"center"}}>Enter ok / Esc cancel</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:14,fontSize:11,color:C.muted}}>Treinos ativos: {tipos.map(t=><span key={t} style={{...sx.tag(TC[t]||C.accent2),marginLeft:4}}>{t}</span>)}</div>
          </div>
        )}

        {tab==="periodizacao"&&(
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Configure o ciclo de 4 semanas.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {draft.periodizacao.map((p,i)=>(
                <div key={p.semana} style={{...sx.card,border:`1px solid ${draft.semanaAtual===p.semana?C.accent:C.border}`,padding:12}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Semana {p.semana}</div>
                  <select value={p.tipo} onChange={e=>{upd(d=>{d.periodizacao[i].tipo=e.target.value;if(e.target.value==="BASE")d.periodizacao[i].rir="2-3 RIR";else if(e.target.value==="CHOQUE")d.periodizacao[i].rir="0-1 RIR";else d.periodizacao[i].rir="5 RIR";});}} style={{...sx.input,marginBottom:6,fontSize:12}}>
                    {PERIOD_TIPOS.map(pt=><option key={pt}>{pt}</option>)}
                  </select>
                  <input style={{...sx.input,fontSize:11}} value={p.rir} onChange={e=>{upd(d=>{d.periodizacao[i].rir=e.target.value;});}} placeholder="RIR"/>
                  <button onClick={()=>{upd(d=>{d.semanaAtual=p.semana;});}} style={{...sx.btn(draft.semanaAtual===p.semana?C.accent:C.card2,draft.semanaAtual===p.semana?"#0f0f13":C.muted),width:"100%",marginTop:8,fontSize:11}}>{draft.semanaAtual===p.semana?"Atual":"Definir como atual"}</button>
                </div>
              ))}
            </div>
            <div style={{...sx.card,padding:14}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:C.gold}}>Legenda RIR</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[["BASE","2-3 RIR","Tecnica e volume moderado",C.accent],["CHOQUE","0-1 RIR","Alta intensidade, proximo a falha",C.accent3],["DELOAD","5 RIR","Recuperacao ativa",C.gold]].map(([tp,rir,desc,col])=>(
                  <div key={tp} style={{background:col+"11",borderRadius:7,padding:"10px 12px",border:`1px solid ${col}33`}}>
                    <div style={{fontWeight:700,fontSize:12,color:col}}>{tp}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{rir}</div>
                    <div style={{fontSize:11,color:C.text,marginTop:4}}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="exercicios"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {tipos.map(t=><button key={t} onClick={()=>setTipo(t)} style={sx.btnOut(tipo===t,TC[t])}>{t} ({(draft.exercicios[t]||[]).length})</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
              <div style={sx.card}>
                <div style={{fontWeight:700,marginBottom:12,fontSize:13}}>+ Exercicio — {tipo}</div>
                <div style={{marginBottom:8}}><label style={sx.label}>Nome</label><input style={sx.input} value={form.nome} onChange={e=>setForm(p=>({...p,nome:e.target.value}))} placeholder="Ex: Supino Reto" onKeyDown={e=>e.key==="Enter"&&addEx()}/></div>
                <div style={{marginBottom:8}}><label style={sx.label}>Series / Reps</label><input style={sx.input} value={form.series} onChange={e=>setForm(p=>({...p,series:e.target.value}))}/></div>
                <div style={{marginBottom:8}}><label style={sx.label}>Descanso</label><input style={sx.input} value={form.descanso} onChange={e=>setForm(p=>({...p,descanso:e.target.value}))}/></div>
                <div style={{marginBottom:12}}><label style={sx.label}>Obs</label><input style={sx.input} value={form.obs} onChange={e=>setForm(p=>({...p,obs:e.target.value}))} placeholder="Ex: WarmUp, Feeder..."/></div>
                <button style={{...sx.btn(),width:"100%"}} onClick={addEx}>+ Adicionar</button>
                <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Templates rapidos</div>
                  {[["Voador","2x20 WarmUp + 3x10","90-180s"],["Supino Maquina","3x10","90-180s"],["Puxada Aberta","2x20 WarmUp + 3x10","120-200s"],["Agachamento Livre","2x20 WarmUp + 3x8","120-200s"],["Leg Press 45","2x20 WarmUp + 3x10","120-200s"]].map(([n,s,d])=>(
                    <button key={n} onClick={()=>setForm({nome:n,series:s,descanso:d,obs:""})} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 8px",fontSize:10,cursor:"pointer",color:C.muted,marginRight:4,marginBottom:4}}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontSize:11,color:C.muted,marginBottom:8}}>▲▼ para reordenar / {exs.length} exercicio(s)</div>
                {exs.map((ex,i)=><ExRow key={ex.id} ex={ex} idx={i} total={exs.length} cor={cor} onMove={moveEx} onEdit={(v)=>editEx(i,v)} onRemove={()=>removeEx(i)}/>)}
                {exs.length===0&&<div style={{color:C.muted,fontSize:12}}>Nenhum exercicio adicionado.</div>}
              </div>
            </div>
          </div>
        )}

        {tab==="alongamentos"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {tipos.map(t=><button key={t} onClick={()=>setTipo(t)} style={sx.btnOut(tipo===t,TC[t])}>{t} ({(draft.alongamentos?.[t]||[]).length})</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
              <div style={sx.card}>
                <div style={{fontWeight:700,marginBottom:12,fontSize:13}}>+ Alongamento — {tipo}</div>
                <div style={{marginBottom:8}}><label style={sx.label}>Nome</label><input style={sx.input} value={formAlong.nome} onChange={e=>setFormAlong(p=>({...p,nome:e.target.value}))} placeholder="Ex: Rotacao Externa"/></div>
                <div style={{marginBottom:8}}><label style={sx.label}>Series / Duracao</label><input style={sx.input} value={formAlong.series} onChange={e=>setFormAlong(p=>({...p,series:e.target.value}))}/></div>
                <div style={{marginBottom:12}}><label style={sx.label}>Descanso</label><input style={sx.input} value={formAlong.descanso} onChange={e=>setFormAlong(p=>({...p,descanso:e.target.value}))}/></div>
                <button style={{...sx.btn(C.gold,"#111"),width:"100%"}} onClick={addAlong}>+ Adicionar</button>
                <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Templates</div>
                  {[["Rotacao Externa com Band","2x20","30s"],["Barra Fixa","2xMax","60s"],["Mobilidade de Quadril","1x45s c/lado","N/D"],["Alongamento Pigeon","1x45s c/lado","N/D"],["Mobilidade de Tornozelo","1x45s c/lado","N/D"]].map(([n,s,d])=>(
                    <button key={n} onClick={()=>setFormAlong({nome:n,series:s,descanso:d})} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 8px",fontSize:10,cursor:"pointer",color:C.muted,marginRight:4,marginBottom:4}}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                {alongs.map((a,i)=>(
                  <div key={a.id} style={{...sx.card,borderLeft:`3px solid ${C.gold}`,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontWeight:600,fontSize:12}}>{i+1}. {a.nome}</div><div style={{fontSize:11,color:C.muted}}>{a.series} / {a.descanso}</div></div>
                    <button onClick={()=>removeAlong(i)} style={{background:C.accent3+"22",color:C.accent3,border:"none",borderRadius:5,padding:"4px 9px",fontSize:11,cursor:"pointer"}}>X</button>
                  </div>
                ))}
                {alongs.length===0&&<div style={{color:C.muted,fontSize:12}}>Nenhum alongamento adicionado.</div>}
              </div>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

export default function App() {
  const [data,setData] = useStore();
  const [user,setUser] = useState(null);
  const [page,setPage] = useState("");
  const handleLogin = (email,pw,setErr) => {
    const found = data.users.find(u=>u.email===email&&u.password===pw);
    if (!found) { setErr("Email ou senha incorretos."); return; }
    setUser(found); setPage(found.role==="admin"?"Alunos":"Dashboard");
  };
  if (!user) return <Login onLogin={handleLogin}/>;
  const isAdmin = user.role==="admin";
  const render = () => {
    if (isAdmin) {
      if (page==="Alunos") return <AdminAlunos data={data} setData={setData}/>;
      if (page==="Progresso") return <AdminProgresso data={data}/>;
      if (page==="Editar Treino") return <AdminEditarTreino data={data} setData={setData}/>;
      if (page==="Criar Treino") return <AdminCriarTreino data={data} setData={setData}/>;
    } else {
      if (page==="Dashboard") return <Dashboard user={user} data={data}/>;
      if (page==="Meu Treino") return <MeuTreino user={user} data={data}/>;
      if (page==="Registros") return <Registros user={user} data={data} setData={setData}/>;
      if (page==="Evolucao") return <Evolucao user={user} data={data}/>;
    }
  };
  return (
    <div style={sx.app}>
      <Nav user={user} onLogout={()=>{setUser(null);setPage("");}} page={page} setPage={setPage}/>
      <div style={{maxWidth:980,margin:"0 auto"}}>{render()}</div>
    </div>
  );
}

