import { useEffect, useState } from "react";
import { BRAND } from "./brand.js";
import { C } from "./theme.js";
import { buildSeed } from "./data.js";
import { Icon, Emblem, Logo, Avatar, Toaster, Confetti, RestTimer } from "./ui.jsx";
import { Dashboard, MeuTreino, Registros, Evolucao } from "./pages/aluno.jsx";
import { AdminAlunos, AdminProgresso, AdminEditarTreino, AdminCriarTreino } from "./pages/admin.jsx";

const KEY = "braves_ct_v1";
const KEY_SESSAO = "braves_ct_sessao";

function useStore() {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : buildSeed(); } catch { return buildSeed(); }
  });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* sem storage */ } }, [data]);
  return [data, setData];
}

const PAGES = {
  aluno: [
    { k: "inicio", l: "Início", i: "home" },
    { k: "treino", l: "Meu Treino", s: "Treino", i: "dumbbell" },
    { k: "registros", l: "Registrar", i: "edit" },
    { k: "evolucao", l: "Evolução", i: "chart" },
  ],
  admin: [
    { k: "alunos", l: "Alunos", i: "users" },
    { k: "progresso", l: "Progresso", i: "chart" },
    { k: "editar", l: "Editar Treino", s: "Editar", i: "edit" },
    { k: "criar", l: "Criar Treino", s: "Criar", i: "plus" },
  ],
};

const VIEWS = {
  inicio: Dashboard, treino: MeuTreino, registros: Registros, evolucao: Evolucao,
  alunos: AdminAlunos, progresso: AdminProgresso, editar: AdminEditarTreino, criar: AdminCriarTreino,
};

// ============ LOGIN ============
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  const entrar = (e, em = email, senha = pw) => {
    e?.preventDefault();
    if (!onLogin(em, senha)) { setErr("Email ou senha incorretos."); setShake(true); }
  };

  return (
    <div className="login">
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      <div className="gridlines" />
      <form className={"login-card" + (shake ? " shake" : "")} onSubmit={entrar} onAnimationEnd={() => setShake(false)}>
        <div className="login-emblem"><Emblem size={78} /></div>
        <div className="login-word display">
          <span className="shimmer">{BRAND.nome}</span><span className="logo-ct">{BRAND.sufixo}</span>
        </div>
        <div className="login-slogan">{BRAND.slogan}</div>
        <div className="login-chamada">{BRAND.chamada}</div>

        <label className="field">
          <span className="label">Email</span>
          <span className="input-icon"><Icon n="mail" size={16} />
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="seu@email.com" />
          </span>
        </label>
        <label className="field">
          <span className="label">Senha</span>
          <span className="input-icon"><Icon n="lock" size={16} />
            <input className="input" type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} placeholder="••••••••" />
            <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}><Icon n={show ? "eyeOff" : "eye"} size={16} /></button>
          </span>
        </label>
        {err && <div className="form-msg">{err}</div>}
        <button type="submit" className="btn btn-primary btn-block btn-lg btn-shine">Entrar <Icon n="bolt" size={15} /></button>
        <div className="login-foot">Seu acesso é liberado pela equipe da sua unidade.</div>

        {BRAND.demo && (
          <div className="demo">
            <div className="demo-div"><span>ou teste agora</span></div>
            <div className="demo-btns">
              <button type="button" className="btn btn-soft" onClick={(e) => entrar(e, "lucas@braves.app", "aluno123")}><Icon n="dumbbell" size={15} />Sou aluno</button>
              <button type="button" className="btn btn-soft" onClick={(e) => entrar(e, "coach@braves.app", "braves123")}><Icon n="users" size={15} />Sou coach</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ============ NAVEGAÇÃO ============
function TopBar({ user, pages, page, go, onLogout }) {
  const admin = user.role === "admin";
  return (
    <header className="topbar">
      <div className="topbar-in">
        <button className="logo-btn" onClick={() => go(pages[0].k)} aria-label="Início"><Logo size={30} /></button>
        <nav className="tabs">
          {pages.map((p) => (
            <button key={p.k} className={"tab" + (page === p.k ? " on" : "")} onClick={() => go(p.k)}>
              <Icon n={p.i} size={16} />{p.l}
            </button>
          ))}
        </nav>
        <div className="user-box">
          <div className="user-meta">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{admin ? "Equipe · " + BRAND.nome : user.unidade}</div>
          </div>
          <Avatar text={user.avatar} color={C.brand} size={34} />
          <button className="icon-btn" onClick={onLogout} title="Sair" aria-label="Sair"><Icon n="logout" size={17} /></button>
        </div>
      </div>
    </header>
  );
}

function BottomNav({ pages, page, go }) {
  return (
    <nav className="bottomnav">
      {pages.map((p) => (
        <button key={p.k} className={"bn" + (page === p.k ? " on" : "")} onClick={() => go(p.k)}>
          <Icon n={p.i} size={21} />
          <span>{p.s || p.l}</span>
        </button>
      ))}
    </nav>
  );
}

// ============ APP ============
export default function App() {
  const [data, setData] = useStore();
  const [userId, setUserId] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY_SESSAO)); } catch { return null; } });
  const user = data.users.find((u) => u.id === userId) || null;
  const pages = user ? PAGES[user.role === "admin" ? "admin" : "aluno"] : [];
  const [nav, setNav] = useState({ page: null, params: {} });
  const page = pages.some((p) => p.k === nav.page) ? nav.page : pages[0]?.k;

  useEffect(() => { try { localStorage.setItem(KEY_SESSAO, JSON.stringify(userId)); } catch { /* sem storage */ } }, [userId]);

  const go = (k, params = {}) => {
    setNav({ page: k, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const login = (email, pw) => {
    const found = data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === pw);
    if (!found) return false;
    setUserId(found.id);
    setNav({ page: null, params: {} });
    return true;
  };
  const logout = () => { setUserId(null); setNav({ page: null, params: {} }); };

  if (!user) return <><Login onLogin={login} /><Toaster /></>;

  const props = { user, data, setData, go, initialTipo: nav.params.tipo };
  const View = VIEWS[page];

  return (
    <div className="app">
      <TopBar user={user} pages={pages} page={page} go={go} onLogout={logout} />
      <main className="main" key={page + (nav.params.tipo || "")}>
        <View {...props} />
      </main>
      <BottomNav pages={pages} page={page} go={go} />
      <RestTimer />
      <Confetti />
      <Toaster />
    </div>
  );
}
