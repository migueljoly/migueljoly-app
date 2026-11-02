import { useEffect, useRef, useState } from "react";
import { BRAND } from "../brand.js";
import { C } from "../theme.js";
import {
  DIAS, DIAS_LABEL, TIPOS_DIVISAO, PERIOD_TIPOS, OBJETIVOS, PHASE, typeColor, typeLabel, tiposDo, uid, clone, iniciais,
  isoLocal, mondayOf, chartPoints, ultimoRegistro, fmtDataLonga, diasDesde,
} from "../data.js";
import { Icon, Tag, Avatar, StatTile, PageHeader, SectionTitle, TypeTabs, Vazio } from "../ui.jsx";
import { EvoCharts } from "../charts.jsx";
import { toast, burst } from "../events.js";

const TODAS = "Todas";

function FiltroUnidade({ value, onChange, alunos }) {
  const conta = (u) => alunos.filter((a) => u === TODAS || a.unidade === u).length;
  return (
    <div className="chips scroll" style={{ marginBottom: 14 }}>
      {[TODAS, ...BRAND.unidades].map((u) => (
        <button key={u} className={"chip sm" + (value === u ? " on" : "")} onClick={() => onChange(u)}>
          {u !== TODAS && <Icon n="pin" size={12} />}{u}<span className="count">{conta(u)}</span>
        </button>
      ))}
    </div>
  );
}

function AlunoPicker({ alunos, value, onChange }) {
  return (
    <div className="chips scroll" style={{ marginBottom: 14 }}>
      {alunos.map((a) => (
        <button key={a.id} className={"chip" + (value === a.id ? " on" : "")} onClick={() => onChange(a.id)}>
          <Avatar text={a.avatar} size={20} color={value === a.id ? C.brand : C.dim} />{a.name}
        </button>
      ))}
    </div>
  );
}

const Field = ({ label, children }) => <label className="field"><span className="label">{label}</span>{children}</label>;
const ultimaFrase = (iso) => { const d = diasDesde(iso); return d === 0 ? "hoje" : d === 1 ? "ontem" : `há ${d} dias`; };

// ============ ALUNOS ============
export function AdminAlunos({ data, setData }) {
  const vazio = { name: "", email: "", password: "", objetivo: OBJETIVOS[0], modalidade: BRAND.modalidades[0], unidade: BRAND.unidades[0], treinos_semana: 4 };
  const [form, setForm] = useState(vazio);
  const [msg, setMsg] = useState("");
  const [un, setUn] = useState(TODAS);
  const [q, setQ] = useState("");
  const alunos = data.users.filter((u) => u.role === "aluno");
  const lista = alunos.filter((a) => (un === TODAS || a.unidade === un) && (a.name + " " + a.email).toLowerCase().includes(q.trim().toLowerCase()));
  const ini = isoLocal(mondayOf());
  const sessSemana = alunos.reduce((acc, a) => acc + Object.values(data.registros[a.id] || {}).filter((r) => r.data >= ini).length, 0);
  const ativos = alunos.filter((a) => data.treinos[a.id]).length;
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const add = (e) => {
    if (!form.name.trim() || !form.email.trim() || !form.password) { setMsg("Preencha nome, email e senha."); return; }
    const email = form.email.trim().toLowerCase();
    if (data.users.some((u) => u.email.toLowerCase() === email)) { setMsg("Já existe um aluno com esse email."); return; }
    const id = Date.now();
    setData((p) => ({ ...p, users: [...p.users, { ...form, name: form.name.trim(), email, id, role: "aluno", avatar: iniciais(form.name), treinos_semana: parseInt(form.treinos_semana) || 3 }] }));
    setForm(vazio); setMsg("");
    burst(e.clientX, e.clientY);
    toast("Aluno cadastrado!");
  };
  const remover = (a) => {
    if (!confirm(`Remover ${a.name}?`)) return;
    setData((p) => ({ ...p, users: p.users.filter((u) => u.id !== a.id) }));
    toast("Aluno removido");
  };

  return (
    <div className="page">
      <PageHeader kicker="Painel da equipe" title="Alunos" subtitle={`${BRAND.nome} ${BRAND.sufixo} · ${BRAND.unidades.length} unidades`} />
      <div className="grid g-stats stagger" style={{ marginBottom: 18 }}>
        <StatTile i={0} icon="users" label="Alunos" value={alunos.length} color={C.brand} />
        <StatTile i={1} icon="dumbbell" label="Treinos ativos" value={ativos} color={C.ok} />
        <StatTile i={2} icon="flame" label="Sessões na semana" value={sessSemana} color={C.gold} />
        <StatTile i={3} icon="pin" label="Unidades" value={BRAND.unidades.length} color={C.info} />
      </div>

      <div className="grid g-side">
        <div className="card">
          <div className="card-t"><Icon n="plus" size={16} />Novo aluno</div>
          <Field label="Nome"><input className="input" value={form.name} onChange={set("name")} placeholder="Nome completo" /></Field>
          <Field label="Email"><input className="input" type="email" value={form.email} onChange={set("email")} placeholder="email@exemplo.com" /></Field>
          <Field label="Senha"><input className="input" type="text" value={form.password} onChange={set("password")} placeholder="Senha inicial" /></Field>
          <Field label="Unidade">
            <select className="input" value={form.unidade} onChange={set("unidade")}>{BRAND.unidades.map((u) => <option key={u}>{u}</option>)}</select>
          </Field>
          <div className="grid g-2" style={{ gap: 10 }}>
            <Field label="Modalidade">
              <select className="input" value={form.modalidade} onChange={set("modalidade")}>{BRAND.modalidades.map((m) => <option key={m}>{m}</option>)}</select>
            </Field>
            <Field label="Treinos/semana"><input className="input" type="number" min={1} max={7} value={form.treinos_semana} onChange={set("treinos_semana")} /></Field>
          </div>
          <Field label="Objetivo">
            <select className="input" value={form.objetivo} onChange={set("objetivo")}>{OBJETIVOS.map((o) => <option key={o}>{o}</option>)}</select>
          </Field>
          {msg && <div className="form-msg">{msg}</div>}
          <button className="btn btn-primary btn-block" onClick={add}><Icon n="plus" size={15} />Cadastrar aluno</button>
        </div>

        <div>
          <FiltroUnidade value={un} onChange={setUn} alunos={alunos} />
          <div className="input-icon" style={{ marginBottom: 12 }}>
            <Icon n="search" size={16} />
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aluno por nome ou email" />
          </div>
          <div className="list stagger" key={un}>
            {lista.map((a, i) => {
              const regs = data.registros[a.id] || {};
              const ult = ultimoRegistro(regs);
              const temTreino = !!data.treinos[a.id];
              return (
                <div key={a.id} className="card tight lift" style={{ "--i": i }}>
                  <div className="aluno-row">
                    <Avatar text={a.avatar} color={typeColor(a.objetivo)} size={40} />
                    <div className="aluno-info">
                      <div className="aluno-nome">{a.name}</div>
                      <div className="small muted">{a.email} · {a.objetivo} · {a.treinos_semana}x/sem</div>
                      <div className="row" style={{ marginTop: 6, gap: 5 }}>
                        <Tag c={C.info}><Icon n="pin" size={10} />{a.unidade || "—"}</Tag>
                        <Tag c={temTreino ? C.ok : C.muted}>{temTreino ? "Treino ativo" : "Sem treino"}</Tag>
                        <Tag c={C.gold}>{Object.keys(regs).length} sessões</Tag>
                        {ult && <Tag c={C.muted}>último {ultimaFrase(ult.data)}</Tag>}
                      </div>
                    </div>
                    <button className="icon-btn danger" onClick={() => remover(a)} aria-label={`Remover ${a.name}`}><Icon n="x" size={16} /></button>
                  </div>
                </div>
              );
            })}
            {lista.length === 0 && <div className="muted small" style={{ padding: 16 }}>Nenhum aluno encontrado.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PROGRESSO ============
export function AdminProgresso({ data }) {
  const [un, setUn] = useState(TODAS);
  const [alunoSel, setAlunoSel] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [exSel, setExSel] = useState(null);
  const detalhe = useRef(null);
  const todos = data.users.filter((u) => u.role === "aluno");
  const alunos = todos.filter((u) => un === TODAS || u.unidade === un);
  const aluno = alunos.find((a) => a.id === alunoSel) || null;
  const treino = aluno ? data.treinos[aluno.id] : null;
  const tipos = treino ? tiposDo(treino) : [];
  const t = tipos.includes(tipo) ? tipo : tipos[0];
  const exs = treino && t ? treino.exercicios[t] || [] : [];
  const ex = exs.find((e) => e.id === exSel) || exs[0];
  const regs = aluno ? data.registros[aluno.id] || {} : {};
  const pts = ex ? chartPoints(regs, t, ex.id) : [];
  const semAtual = treino?.periodizacao.find((p) => p.semana === treino.semanaAtual);

  useEffect(() => {
    if (alunoSel) detalhe.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [alunoSel]);

  const escolher = (id) => { setAlunoSel(alunoSel === id ? null : id); setTipo(null); setExSel(null); };

  return (
    <div className="page">
      <PageHeader kicker="Acompanhamento" title="Progresso" subtitle="Toque em um aluno para ver cargas, volume e histórico." />
      <FiltroUnidade value={un} onChange={(u) => { setUn(u); setAlunoSel(null); }} alunos={todos} />
      <div className="grid g-auto stagger" key={un}>
        {alunos.map((a, i) => {
          const r = data.registros[a.id] || {};
          const ult = ultimoRegistro(r);
          const tr = data.treinos[a.id];
          const sem = tr?.periodizacao.find((p) => p.semana === tr.semanaAtual);
          const sel = alunoSel === a.id;
          return (
            <button key={a.id} className={"card tight lift aluno-card" + (sel ? " sel" : "")} style={{ "--i": i }} onClick={() => escolher(a.id)}>
              <div className="aluno-row">
                <Avatar text={a.avatar} color={sel ? C.brand : typeColor(a.objetivo)} size={36} />
                <div className="aluno-info">
                  <div className="aluno-nome">{a.name}</div>
                  <div className="small muted">{a.objetivo} · {a.unidade}</div>
                </div>
              </div>
              <div className="row" style={{ marginTop: 10, gap: 5 }}>
                <Tag c={C.gold}>{Object.keys(r).length} sessões</Tag>
                {sem && <Tag c={(PHASE[sem.tipo] || PHASE.BASE).cor}>{sem.tipo}</Tag>}
                {!tr && <Tag c={C.muted}>Sem treino</Tag>}
              </div>
              {ult && <div className="small muted" style={{ marginTop: 8 }}>Último treino {ultimaFrase(ult.data)}</div>}
            </button>
          );
        })}
        {alunos.length === 0 && <div className="muted small">Nenhum aluno nesta unidade.</div>}
      </div>

      {aluno && (
        <div className="card detail page" ref={detalhe}>
          <div className="detail-h">
            <Avatar text={aluno.avatar} color={C.brand} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="display" style={{ fontSize: 26 }}>{aluno.name}</div>
              <div className="small muted">{aluno.objetivo} · {aluno.modalidade} · {aluno.unidade}</div>
            </div>
            <div className="mini-stats">
              {[["Sessões", Object.keys(regs).length, C.gold], ["Semana", treino ? treino.semanaAtual + "/4" : "—", C.info], ["Fase", semAtual?.tipo || "—", (PHASE[semAtual?.tipo] || PHASE.BASE).cor]].map(([l, v, col]) => (
                <div key={l} className="mini-stat"><div className="label">{l}</div><div className="display" style={{ color: col }}>{v}</div></div>
              ))}
            </div>
          </div>
          {!treino ? <Vazio msg="Este aluno ainda não tem treino. Monte em Criar Treino." /> : (
            <>
              <TypeTabs tipos={tipos} value={t} onChange={(x) => { setTipo(x); setExSel(null); }} />
              <div className="chips scroll" style={{ marginTop: 10 }}>
                {exs.map((e) => <button key={e.id} className={"chip sm" + (ex?.id === e.id ? " on" : "")} onClick={() => setExSel(e.id)}>{e.nome}</button>)}
              </div>
              {pts.length === 0
                ? <div className="muted small" style={{ textAlign: "center", padding: 28 }}>Sem registros para {ex?.nome}.</div>
                : <div key={t + ex.id}><EvoCharts pts={pts} nome={ex.nome} lado h={180} /></div>}
              <SectionTitle icon="history">Histórico</SectionTitle>
              <div className="history">
                {Object.entries(regs).sort((a, b) => (b[0] > a[0] ? 1 : -1)).map(([key, reg]) => (
                  <div key={key} className="history-row">
                    <Tag c={typeColor(reg.tipo)}>{typeLabel(reg.tipo)}</Tag>
                    <span>{fmtDataLonga(reg.data)}</span>
                    <span className="small muted">Sem {reg.semana}</span>
                    <span className="small muted" style={{ marginLeft: "auto" }}>{Object.keys(reg.cargas || {}).length} ex.</span>
                  </div>
                ))}
                {Object.keys(regs).length === 0 && <div className="muted small">Nenhuma sessão ainda.</div>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============ LINHA DE EXERCÍCIO (editar/reordenar) ============
function ExRow({ ex, idx, total, onMove, onEdit, onRemove, cor }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nome: ex.nome, series: ex.series, descanso: ex.descanso, obs: ex.obs || "" });
  return (
    <div className="card tight accent-l exrow" style={{ "--c": cor, "--i": idx }}>
      {editing ? (
        <div>
          <div className="grid g-3" style={{ gap: 8 }}>
            {[["Nome", "nome"], ["Séries/Reps", "series"], ["Descanso", "descanso"]].map(([l, k]) => (
              <Field key={k} label={l}><input className="input" value={form[k]} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} /></Field>
            ))}
          </div>
          <Field label="Observação"><input className="input" value={form.obs} onChange={(e) => setForm((p) => ({ ...p, obs: e.target.value }))} placeholder="Opcional..." /></Field>
          <div className="row">
            <button className="btn btn-primary btn-sm" onClick={() => { onEdit(form); setEditing(false); toast("Exercício atualizado"); }}>Salvar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="ex">
          <div className="move">
            <button disabled={idx === 0} onClick={() => onMove(idx, idx - 1)} aria-label="Subir"><Icon n="up" size={14} /></button>
            <button disabled={idx === total - 1} onClick={() => onMove(idx, idx + 1)} aria-label="Descer"><Icon n="down" size={14} /></button>
          </div>
          <div className="ex-num sm">{idx + 1}</div>
          <div className="ex-body">
            <div className="ex-name">{ex.nome}</div>
            <div className="ex-meta">{ex.series} · {ex.descanso}</div>
            {ex.obs && <div className="ex-obs">{ex.obs}</div>}
          </div>
          <div className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
            <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Editar"><Icon n="edit" size={15} /></button>
            <button className="icon-btn danger" onClick={onRemove} aria-label="Remover"><Icon n="x" size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormExercicio({ tipo, form, setForm, onAdd, templates, along }) {
  const cor = along ? C.gold : typeColor(tipo);
  return (
    <div className="card">
      <div className="card-t" style={{ color: cor }}><Icon n="plus" size={16} />{along ? "Alongamento" : "Exercício"} · {typeLabel(tipo)}</div>
      <Field label="Nome"><input className="input" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} placeholder={along ? "Ex: Rotação Externa" : "Ex: Supino Reto"} onKeyDown={(e) => e.key === "Enter" && onAdd()} /></Field>
      <Field label={along ? "Séries / Duração" : "Séries / Reps"}><input className="input" value={form.series} onChange={(e) => setForm((p) => ({ ...p, series: e.target.value }))} /></Field>
      <Field label="Descanso"><input className="input" value={form.descanso} onChange={(e) => setForm((p) => ({ ...p, descanso: e.target.value }))} /></Field>
      {!along && <Field label="Observação"><input className="input" value={form.obs} onChange={(e) => setForm((p) => ({ ...p, obs: e.target.value }))} placeholder="Ex: WarmUp, Feeder..." /></Field>}
      <button className={"btn btn-block " + (along ? "btn-gold" : "btn-primary")} onClick={onAdd}><Icon n="plus" size={15} />Adicionar</button>
      {templates && (
        <div className="templates">
          <div className="label" style={{ marginBottom: 8 }}>Atalhos rápidos</div>
          <div className="chips">
            {templates.map(([n, s, d]) => (
              <button key={n} className="chip sm" onClick={() => setForm((p) => ({ ...p, nome: n, series: s, descanso: d, ...(along ? {} : { obs: "" }) }))}>{n}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const EX_VAZIO = { nome: "", series: "3x10", descanso: "90-120s", obs: "" };
const AL_VAZIO = { nome: "", series: "1x45s", descanso: "N/D" };
const TPL_EX = [["Voador", "2x20 WarmUp + 3x10", "90-180s"], ["Supino Máquina", "3x10", "90-180s"], ["Puxada Aberta", "2x20 WarmUp + 3x10", "120-200s"], ["Agachamento Livre", "2x20 WarmUp + 3x8", "120-200s"], ["Leg Press 45", "2x20 WarmUp + 3x10", "120-200s"]];
const TPL_AL = [["Rotação Externa com Band", "2x20", "30s"], ["Barra Fixa Suspensa", "2xMax", "60s"], ["Mobilidade de Quadril", "1x45s c/lado", "N/D"], ["Alongamento Pigeon", "1x45s c/lado", "N/D"], ["Mobilidade de Tornozelo", "1x45s c/lado", "N/D"]];

// ============ EDITAR TREINO ============
export function AdminEditarTreino({ data, setData }) {
  const alunos = data.users.filter((u) => u.role === "aluno" && data.treinos[u.id]);
  const [alunoSel, setAlunoSel] = useState(alunos[0]?.id || null);
  const [tipo, setTipo] = useState(null);
  const [form, setForm] = useState(EX_VAZIO);
  const treino = alunoSel ? data.treinos[alunoSel] : null;
  if (alunos.length === 0 || !treino) return <Vazio msg="Nenhum aluno com treino ativo. Monte um em Criar Treino." icon="edit" />;
  const tipos = tiposDo(treino);
  const t = tipos.includes(tipo) ? tipo : tipos[0];
  const exs = treino.exercicios[t] || [];
  const cor = typeColor(t);

  const update = (fn) => setData((p) => { const tr = clone(p.treinos[alunoSel]); fn(tr); return { ...p, treinos: { ...p.treinos, [alunoSel]: tr } }; });
  const moveEx = (from, to) => update((tr) => { const e = [...(tr.exercicios[t] || [])]; const [it] = e.splice(from, 1); e.splice(to, 0, it); tr.exercicios[t] = e; });
  const editEx = (i, vals) => update((tr) => { tr.exercicios[t][i] = { ...tr.exercicios[t][i], ...vals }; });
  const removeEx = (i) => update((tr) => { tr.exercicios[t].splice(i, 1); });
  const addEx = () => {
    if (!form.nome.trim()) { toast("Digite o nome do exercício.", "warn"); return; }
    update((tr) => { if (!tr.exercicios[t]) tr.exercicios[t] = []; tr.exercicios[t].push({ id: uid(), ...form }); });
    setForm(EX_VAZIO); toast("Exercício adicionado!");
  };
  const setSemana = (s) => { update((tr) => { tr.semanaAtual = s; }); toast(`Semana ${s} definida como atual`); };

  return (
    <div className="page">
      <PageHeader kicker="Ajuste fino" title="Editar Treino" subtitle="Reordene, edite ou adicione exercícios. As mudanças salvam na hora." />
      <AlunoPicker alunos={alunos} value={alunoSel} onChange={(id) => { setAlunoSel(id); setTipo(null); }} />
      <div className="card tight" style={{ marginBottom: 14 }}>
        <div className="label" style={{ marginBottom: 8 }}>Semana atual do ciclo</div>
        <div className="chips">
          {treino.periodizacao.map((p) => (
            <button key={p.semana} className={"chip sm" + (treino.semanaAtual === p.semana ? " on" : "")} style={{ "--c": (PHASE[p.tipo] || PHASE.BASE).cor }} onClick={() => setSemana(p.semana)}>
              Sem {p.semana} · {p.tipo}
            </button>
          ))}
        </div>
      </div>
      <TypeTabs tipos={tipos} value={t} onChange={setTipo} counts={Object.fromEntries(tipos.map((x) => [x, (treino.exercicios[x] || []).length]))} />
      <div className="grid g-side" style={{ marginTop: 14 }}>
        <FormExercicio tipo={t} form={form} setForm={setForm} onAdd={addEx} />
        <div>
          <div className="small muted" style={{ marginBottom: 8 }}>Use as setas para reposicionar · {exs.length} exercício(s)</div>
          <div className="list stagger" key={alunoSel + t}>
            {exs.map((ex, i) => <ExRow key={ex.id} ex={ex} idx={i} total={exs.length} cor={cor} onMove={moveEx} onEdit={(v) => editEx(i, v)} onRemove={() => removeEx(i)} />)}
            {exs.length === 0 && <div className="muted small">Nenhum exercício neste treino.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ CRIAR / MONTAR TREINO ============
const novoDraft = () => ({
  semanaAtual: 1,
  periodizacao: [{ semana: 1, tipo: "BASE", rir: "2-3 RIR" }, { semana: 2, tipo: "BASE", rir: "2-3 RIR" }, { semana: 3, tipo: "CHOQUE", rir: "0-1 RIR" }, { semana: 4, tipo: "CHOQUE", rir: "0-1 RIR" }],
  divisao: DIAS.map((dia, i) => ({ dia, tipo: i < 3 ? ["PUSH", "PULL", "LEGS"][i] : "DESCANSO" })),
  exercicios: { PUSH: [], PULL: [], LEGS: [] },
  alongamentos: { PUSH: [], PULL: [], LEGS: [] },
});

export function AdminCriarTreino({ data, setData }) {
  const alunos = data.users.filter((u) => u.role === "aluno");
  const carregar = (id) => (id && data.treinos[id] ? clone(data.treinos[id]) : novoDraft());
  const [alunoSel, setAlunoSel] = useState(alunos[0]?.id || null);
  const [draft, setDraft] = useState(() => carregar(alunos[0]?.id));
  const [tipo, setTipo] = useState(null);
  const [form, setForm] = useState(EX_VAZIO);
  const [formAlong, setFormAlong] = useState(AL_VAZIO);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("divisao");
  const [customDia, setCustomDia] = useState(null);
  const [customTipo, setCustomTipo] = useState("");

  const escolherAluno = (id) => { setAlunoSel(id); setDraft(carregar(id)); setTipo(null); setSaved(false); };
  const upd = (fn) => { setDraft((p) => { const d = clone(p); fn(d); return d; }); setSaved(false); };
  const tipos = tiposDo(draft);
  const t = tipos.includes(tipo) ? tipo : tipos[0];
  const exs = draft.exercicios[t] || [];
  const alongs = draft.alongamentos?.[t] || [];
  const cor = typeColor(t);

  const setDia = (dia, val) => upd((d) => {
    const i = d.divisao.findIndex((x) => x.dia === dia);
    if (i > -1) d.divisao[i].tipo = val; else d.divisao.push({ dia, tipo: val });
    if (!d.alongamentos) d.alongamentos = {};
    if (val !== "DESCANSO") { if (!d.exercicios[val]) d.exercicios[val] = []; if (!d.alongamentos[val]) d.alongamentos[val] = []; }
  });
  const addEx = () => { if (!form.nome.trim() || !t) return; upd((d) => { if (!d.exercicios[t]) d.exercicios[t] = []; d.exercicios[t].push({ id: uid(), ...form }); }); setForm(EX_VAZIO); };
  const moveEx = (from, to) => upd((d) => { const e = [...(d.exercicios[t] || [])]; const [it] = e.splice(from, 1); e.splice(to, 0, it); d.exercicios[t] = e; });
  const editEx = (i, vals) => upd((d) => { d.exercicios[t][i] = { ...d.exercicios[t][i], ...vals }; });
  const removeEx = (i) => upd((d) => { d.exercicios[t].splice(i, 1); });
  const addAlong = () => { if (!formAlong.nome.trim() || !t) return; upd((d) => { if (!d.alongamentos) d.alongamentos = {}; if (!d.alongamentos[t]) d.alongamentos[t] = []; d.alongamentos[t].push({ id: uid(), ...formAlong }); }); setFormAlong(AL_VAZIO); };
  const removeAlong = (i) => upd((d) => { (d.alongamentos[t] || []).splice(i, 1); });
  const salvar = (e) => {
    if (!alunoSel) return;
    setData((p) => ({ ...p, treinos: { ...p.treinos, [alunoSel]: draft } }));
    setSaved(true); burst(e.clientX, e.clientY); toast("Treino salvo para o aluno!");
  };

  const TABS = [["divisao", "Divisão", "calendar"], ["periodizacao", "Periodização", "layers"], ["exercicios", "Exercícios", "dumbbell"], ["alongamentos", "Alongamentos", "stretch"]];

  return (
    <div className="page">
      <PageHeader kicker="Montagem" title="Criar Treino" subtitle="Divisão, periodização, exercícios e mobilidade em um só lugar."
        right={<button className={"btn " + (saved ? "btn-ok" : "btn-primary btn-shine")} onClick={salvar} disabled={!alunoSel}><Icon n={saved ? "check" : "bolt"} size={15} />{saved ? "Salvo" : "Salvar treino"}</button>} />
      {alunos.length === 0 ? <Vazio msg="Cadastre um aluno primeiro." icon="users" /> : (
        <>
          <div className="label" style={{ marginBottom: 8 }}>Aluno</div>
          <AlunoPicker alunos={alunos} value={alunoSel} onChange={escolherAluno} />
          <div className="segment">
            {TABS.map(([k, l, ic]) => (
              <button key={k} className={"seg" + (tab === k ? " on" : "")} onClick={() => setTab(k)}><Icon n={ic} size={15} /><span>{l}</span></button>
            ))}
          </div>

          <div key={tab + alunoSel} className="page">
            {tab === "divisao" && (
              <div>
                <div className="small muted" style={{ marginBottom: 12 }}>Defina o tipo de treino de cada dia. Use “Personalizado” para criar um nome próprio.</div>
                <div className="divisao stagger">
                  {DIAS.map((dia, i) => {
                    const tp = (draft.divisao.find((d) => d.dia === dia) || { tipo: "DESCANSO" }).tipo;
                    const custom = !TIPOS_DIVISAO.slice(0, -1).includes(tp);
                    const c = typeColor(tp);
                    return (
                      <div key={dia} className="div-day" style={{ "--c": c, "--i": i }}>
                        <div className="div-day-h">{DIAS_LABEL[dia]}</div>
                        <select className="div-sel" value={tp} onChange={(e) => { if (e.target.value === "PERSONALIZADO") { setCustomDia(dia); setCustomTipo(""); } else setDia(dia, e.target.value); }}>
                          {TIPOS_DIVISAO.map((td) => <option key={td} value={td}>{td === "PERSONALIZADO" ? "✏ Personalizado" : typeLabel(td)}</option>)}
                          {custom && <option value={tp}>{tp}</option>}
                        </select>
                        <div className="div-day-t display">{tp === "DESCANSO" ? "OFF" : typeLabel(tp)}</div>
                        {customDia === dia && (
                          <div className="div-custom">
                            <input autoFocus className="input" placeholder="Nome..." value={customTipo} onChange={(e) => setCustomTipo(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && customTipo.trim()) { setDia(dia, customTipo.trim()); setCustomDia(null); setCustomTipo(""); }
                                if (e.key === "Escape") { setCustomDia(null); setCustomTipo(""); }
                              }} />
                            <div className="row" style={{ gap: 4, marginTop: 4 }}>
                              <button className="btn btn-primary btn-xs" onClick={() => { if (customTipo.trim()) { setDia(dia, customTipo.trim()); setCustomDia(null); setCustomTipo(""); } }}>OK</button>
                              <button className="btn btn-ghost btn-xs" onClick={() => setCustomDia(null)}>×</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="row" style={{ marginTop: 16, gap: 6 }}>
                  <span className="small muted">Treinos ativos:</span>
                  {tipos.map((x) => <Tag key={x} c={typeColor(x)}>{typeLabel(x)}</Tag>)}
                </div>
              </div>
            )}

            {tab === "periodizacao" && (
              <div>
                <div className="small muted" style={{ marginBottom: 12 }}>Configure o ciclo de 4 semanas.</div>
                <div className="period stagger" style={{ marginBottom: 16 }}>
                  {draft.periodizacao.map((p, i) => {
                    const ph = PHASE[p.tipo] || PHASE.BASE;
                    const atual = draft.semanaAtual === p.semana;
                    return (
                      <div key={p.semana} className={"card tight" + (atual ? " sel" : "")} style={{ "--c": ph.cor, "--i": i }}>
                        <div className="label" style={{ marginBottom: 8 }}>Semana {p.semana}</div>
                        <select className="input" value={p.tipo} style={{ marginBottom: 8, color: ph.cor, fontWeight: 800 }}
                          onChange={(e) => upd((d) => { d.periodizacao[i].tipo = e.target.value; d.periodizacao[i].rir = (PHASE[e.target.value] || PHASE.BASE).rir; })}>
                          {PERIOD_TIPOS.map((pt) => <option key={pt}>{pt}</option>)}
                        </select>
                        <input className="input" value={p.rir} onChange={(e) => upd((d) => { d.periodizacao[i].rir = e.target.value; })} placeholder="RIR" />
                        <button className={"btn btn-sm btn-block " + (atual ? "btn-primary" : "btn-soft")} style={{ marginTop: 8 }} onClick={() => upd((d) => { d.semanaAtual = p.semana; })}>
                          {atual ? "Atual" : "Definir como atual"}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="card">
                  <div className="card-t" style={{ color: C.gold }}>Legenda RIR</div>
                  <div className="grid g-3" style={{ gap: 10 }}>
                    {Object.entries(PHASE).map(([k, ph]) => (
                      <div key={k} className="legend" style={{ "--c": ph.cor }}>
                        <div className="display" style={{ color: ph.cor, fontSize: 20 }}>{k}</div>
                        <div className="small muted">{ph.rir}</div>
                        <div className="small" style={{ marginTop: 4 }}>{ph.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "exercicios" && (
              <div>
                <TypeTabs tipos={tipos} value={t} onChange={setTipo} counts={Object.fromEntries(tipos.map((x) => [x, (draft.exercicios[x] || []).length]))} />
                <div className="grid g-side" style={{ marginTop: 14 }}>
                  <FormExercicio tipo={t} form={form} setForm={setForm} onAdd={addEx} templates={TPL_EX} />
                  <div>
                    <div className="small muted" style={{ marginBottom: 8 }}>Setas para reordenar · {exs.length} exercício(s)</div>
                    <div className="list">
                      {exs.map((ex, i) => <ExRow key={ex.id} ex={ex} idx={i} total={exs.length} cor={cor} onMove={moveEx} onEdit={(v) => editEx(i, v)} onRemove={() => removeEx(i)} />)}
                      {exs.length === 0 && <div className="muted small">Nenhum exercício adicionado.</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "alongamentos" && (
              <div>
                <TypeTabs tipos={tipos} value={t} onChange={setTipo} counts={Object.fromEntries(tipos.map((x) => [x, (draft.alongamentos?.[x] || []).length]))} />
                <div className="grid g-side" style={{ marginTop: 14 }}>
                  <FormExercicio tipo={t} form={formAlong} setForm={setFormAlong} onAdd={addAlong} templates={TPL_AL} along />
                  <div className="list">
                    {alongs.map((a, i) => (
                      <div key={a.id} className="card tight accent-l" style={{ "--c": C.gold }}>
                        <div className="ex">
                          <div className="ex-num sm">{i + 1}</div>
                          <div className="ex-body"><div className="ex-name">{a.nome}</div><div className="ex-meta">{a.series} · {a.descanso}</div></div>
                          <button className="icon-btn danger" onClick={() => removeAlong(i)} aria-label="Remover"><Icon n="x" size={15} /></button>
                        </div>
                      </div>
                    ))}
                    {alongs.length === 0 && <div className="muted small">Nenhum alongamento adicionado.</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
