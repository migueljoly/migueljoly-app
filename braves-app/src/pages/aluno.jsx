import { useState } from "react";
import { C } from "../theme.js";
import {
  N_SERIES, DIAS, DIAS_LABEL, PHASE, typeColor, typeLabel, getMuscles, tiposDo, isoLocal, addDays, mondayOf,
  diaIndexHoje, fmtData, fmtDataLonga, saudacao, primeiroNome, parseRest, seriesAlvo, chartPoints, ultimaExecucao, ultimoRegistro,
} from "../data.js";
import { Icon, Tag, Ring, CountUp, StatTile, PageHeader, SectionTitle, TypeTabs, Vazio } from "../ui.jsx";
import { EvoCharts } from "../charts.jsx";
import { toast, burst, startTimer } from "../events.js";

const SEM_TREINO = "Seu treino ainda não foi montado. Fale com a equipe da sua unidade.";
const ytUrl = (nome, along) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(nome + (along ? "" : " exercício"));

// ============ INÍCIO ============
export function Dashboard({ user, data, go }) {
  const treino = data.treinos[user.id];
  if (!treino) return <Vazio msg={SEM_TREINO} />;
  const regs = data.registros[user.id] || {};
  const sem = treino.periodizacao.find((p) => p.semana === treino.semanaAtual);
  const fase = PHASE[sem?.tipo] || PHASE.BASE;
  const hojeIdx = diaIndexHoje();
  const diaHoje = treino.divisao.find((d) => d.dia === DIAS[hojeIdx]) || { tipo: "DESCANSO" };
  const descanso = diaHoje.tipo === "DESCANSO";
  const cor = typeColor(diaHoje.tipo);
  const seg = mondayOf();
  const datasSemana = DIAS.map((_, i) => isoLocal(addDays(seg, i)));
  const feitos = new Set(Object.values(regs).map((r) => r.data).filter((d) => datasSemana.includes(d)));
  const meta = user.treinos_semana || tiposDo(treino).length;
  const ultimo = ultimoRegistro(regs);
  const nEx = (treino.exercicios[diaHoje.tipo] || []).length;

  return (
    <div className="page">
      <PageHeader kicker={saudacao() + ","} title={primeiroNome(user.name)} subtitle={[user.objetivo, user.modalidade, user.unidade].filter(Boolean).join(" · ")} />

      <div className="grid g-hero stagger">
        <div className={"card hero" + (descanso ? "" : " glow")} style={{ "--c": cor, "--i": 0 }}>
          <div className="hero-word display" aria-hidden="true">{descanso ? "REST" : typeLabel(diaHoje.tipo)}</div>
          <div className="label">Treino de hoje · {DIAS_LABEL[DIAS[hojeIdx]]}</div>
          {descanso ? (
            <>
              <div className="display hero-title" style={{ color: C.text }}>Descanso</div>
              <div className="hero-sub">Recuperação também é treino. Hidrate, durma bem e volte mais forte.</div>
              <div className="row mt">
                <button className="btn btn-soft" onClick={() => go("treino")}><Icon n="dumbbell" size={16} />Ver meu plano</button>
              </div>
            </>
          ) : (
            <>
              <div className="display hero-title" style={{ color: cor }}>{typeLabel(diaHoje.tipo)}</div>
              <div className="hero-sub">{getMuscles(diaHoje.tipo)}</div>
              <div className="row">
                <Tag c={fase.cor}>{sem?.tipo}</Tag>
                <Tag c={C.muted}>{sem?.rir}</Tag>
                <Tag c={cor}>{nEx} exercícios</Tag>
              </div>
              <div className="row mt">
                <button className="btn btn-primary btn-shine" onClick={() => go("registros", { tipo: diaHoje.tipo })}><Icon n="play" size={14} />Começar treino</button>
                <button className="btn btn-soft" onClick={() => go("treino", { tipo: diaHoje.tipo })}>Ver exercícios</button>
              </div>
            </>
          )}
        </div>

        <div className="card ring-card" style={{ "--i": 1 }}>
          <div className="label">Meta da semana</div>
          <Ring value={feitos.size} max={meta} size={124}>
            <div className="display ring-num"><CountUp value={feitos.size} /><span>/{meta}</span></div>
            <div className="ring-cap">treinos</div>
          </Ring>
          <div className="ring-msg">
            {feitos.size >= meta ? <><Icon n="flame" size={14} style={{ color: C.gold }} /> Meta batida. Brabo!</> : `Faltam ${meta - feitos.size} para bater a meta`}
          </div>
        </div>
      </div>

      <div className="grid g-stats stagger" style={{ marginTop: 14 }}>
        <StatTile i={2} icon="calendar" label="Semana do ciclo" value={treino.semanaAtual} suffix="/4" color={C.brand} />
        <StatTile i={3} icon="layers" label="Fase" value={sem?.tipo || "-"} color={fase.cor} />
        <StatTile i={4} icon="bolt" label="Intensidade" value={sem?.rir || "-"} color={C.gold} />
        <StatTile i={5} icon="trophy" label="Sessões" value={Object.keys(regs).length} color={C.info} />
      </div>

      <SectionTitle icon="calendar">Sua semana</SectionTitle>
      <div className="week stagger">
        {DIAS.map((d, i) => {
          const dv = treino.divisao.find((x) => x.dia === d) || { tipo: "DESCANSO" };
          const done = feitos.has(datasSemana[i]);
          const today = i === hojeIdx;
          return (
            <div key={d} className={"day" + (today ? " today" : "") + (done ? " done" : "")} style={{ "--i": i, "--c": typeColor(dv.tipo) }}>
              <div className="day-d">{DIAS_LABEL[d]}</div>
              <div className="day-t">{dv.tipo === "DESCANSO" ? "—" : typeLabel(dv.tipo)}</div>
              {done && <span className="day-check"><Icon n="check" size={10} /></span>}
              {today && !done && <span className="pulse-dot day-dot" />}
            </div>
          );
        })}
      </div>

      <SectionTitle icon="layers">Periodização · ciclo de 4 semanas</SectionTitle>
      <div className="period stagger">
        {treino.periodizacao.map((p, i) => {
          const ph = PHASE[p.tipo] || PHASE.BASE;
          const cur = p.semana === treino.semanaAtual;
          const pct = p.semana < treino.semanaAtual ? 100 : cur ? Math.round(((hojeIdx + 1) / 7) * 100) : 0;
          return (
            <div key={p.semana} className={"card tight" + (cur ? " sel" : "")} style={{ "--i": i, "--c": ph.cor }}>
              <div className="label">Sem {p.semana}{cur ? " · atual" : ""}</div>
              <div className="display period-t" style={{ color: ph.cor }}>{p.tipo}</div>
              <div className="small muted">{p.rir}</div>
              <div className="pbar"><i style={{ width: pct + "%" }} /></div>
            </div>
          );
        })}
      </div>

      {ultimo && (
        <div className="foot-note">
          <Icon n="history" size={14} /> Último treino: <b>{typeLabel(ultimo.tipo)}</b> em {fmtDataLonga(ultimo.data)}
        </div>
      )}
    </div>
  );
}

// ============ MEU TREINO ============
function ExCard({ ex, i, cor, along }) {
  const rest = parseRest(ex.descanso);
  const yt = ytUrl(ex.nome, along);
  return (
    <div className="card tight lift accent-l" style={{ "--i": i, "--c": cor }}>
      <div className="ex">
        <div className="ex-num">{i + 1}</div>
        <div className="ex-body">
          <a className="ex-name" href={yt} target="_blank" rel="noopener noreferrer">{ex.nome}</a>
          <div className="ex-meta">{ex.series}</div>
          {ex.obs && <div className="ex-obs">{ex.obs}</div>}
        </div>
        <div className="ex-actions">
          <a className="yt" href={yt} target="_blank" rel="noopener noreferrer"><Icon n="play" size={10} />Vídeo</a>
          {rest > 0 ? (
            <button className="rest-pill" onClick={() => startTimer(rest, ex.nome)} title="Iniciar descanso">
              <Icon n="timer" size={14} />{ex.descanso}
            </button>
          ) : (
            <span className="rest-pill static">{ex.descanso}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MeuTreino({ user, data, initialTipo }) {
  const treino = data.treinos[user.id];
  const tipos = treino ? tiposDo(treino) : [];
  const [tipo, setTipo] = useState(initialTipo);
  if (!treino) return <Vazio msg={SEM_TREINO} />;
  const t = tipos.includes(tipo) ? tipo : tipos[0];
  const exs = treino.exercicios[t] || [];
  const alongs = treino.alongamentos?.[t] || [];
  const cor = typeColor(t);

  return (
    <div className="page">
      <PageHeader kicker="Seu plano" title="Meu Treino" subtitle={`${tipos.length} treinos na divisão · Semana ${treino.semanaAtual} de 4`} />
      <TypeTabs tipos={tipos} value={t} onChange={setTipo} />
      <div key={t}>
        <div className="card type-banner" style={{ "--c": cor }}>
          <div>
            <div className="display type-banner-t" style={{ color: cor }}>{typeLabel(t)}</div>
            <div className="hero-sub" style={{ margin: 0 }}>{getMuscles(t)}</div>
          </div>
          <div className="type-banner-n">
            <div className="display">{exs.length}</div>
            <div className="label">exercícios</div>
          </div>
        </div>
        <div className="hint"><Icon n="timer" size={13} /> Toque no tempo de descanso para iniciar o cronômetro.</div>
        <SectionTitle icon="dumbbell" color={cor}>Exercícios</SectionTitle>
        <div className="list stagger">
          {exs.map((ex, i) => <ExCard key={ex.id} ex={ex} i={i} cor={cor} />)}
          {exs.length === 0 && <div className="muted small">Nenhum exercício neste treino ainda.</div>}
        </div>
        {alongs.length > 0 && (
          <>
            <SectionTitle icon="stretch" color={C.gold}>Alongamentos e mobilidade</SectionTitle>
            <div className="list stagger">
              {alongs.map((a, i) => <ExCard key={a.id} ex={a} i={i} cor={C.gold} along />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============ REGISTRAR CARGAS ============
export function Registros({ user, data, setData, initialTipo }) {
  const treino = data.treinos[user.id];
  const tipos = treino ? tiposDo(treino) : [];
  const regs = data.registros[user.id] || {};
  const hoje = isoLocal();
  const t0 = tipos.includes(initialTipo) ? initialTipo : tipos[0];
  const [tipo, setTipo] = useState(t0);
  const [cargas, setCargas] = useState(() => regs[hoje + "_" + t0]?.cargas || {});
  const [saved, setSaved] = useState(false);
  if (!treino) return <Vazio msg={SEM_TREINO} />;
  const t = tipos.includes(tipo) ? tipo : tipos[0];
  const exs = treino.exercicios[t] || [];
  const sem = treino.periodizacao.find((p) => p.semana === treino.semanaAtual);
  const cor = typeColor(t);

  const trocar = (nt) => { setTipo(nt); setCargas(regs[hoje + "_" + nt]?.cargas || {}); setSaved(false); };
  const setC = (exId, si, field, val) => {
    setCargas((p) => ({ ...p, [exId]: { ...p[exId], [si]: { ...(p[exId]?.[si] || {}), [field]: val } } }));
    setSaved(false);
  };
  const cheia = (exId, si) => cargas[exId]?.[si]?.carga && cargas[exId]?.[si]?.reps;
  const alvoTotal = exs.reduce((a, ex) => a + seriesAlvo(ex.series), 0);
  const feitas = exs.reduce((a, ex) => a + Array.from({ length: N_SERIES }).filter((_, si) => cheia(ex.id, si)).length, 0);
  const pct = alvoTotal ? Math.min(100, Math.round((feitas / alvoTotal) * 100)) : 0;

  const salvar = (e) => {
    const limpo = {};
    Object.entries(cargas).forEach(([exId, series]) => {
      const s = {};
      Object.entries(series).forEach(([si, v]) => { if (v.carga || v.reps) s[si] = v; });
      if (Object.keys(s).length) limpo[exId] = s;
    });
    if (!Object.keys(limpo).length) { toast("Preencha pelo menos uma série.", "warn"); return; }
    const key = hoje + "_" + t;
    setData((p) => ({ ...p, registros: { ...p.registros, [user.id]: { ...(p.registros[user.id] || {}), [key]: { tipo: t, data: hoje, semana: treino.semanaAtual, cargas: limpo } } } }));
    setSaved(true);
    burst(e.clientX, e.clientY);
    toast("Treino salvo! Bora pra cima. 💪");
  };

  return (
    <>
    <div className="page has-savebar">
      <PageHeader kicker={"Hoje · " + fmtData(hoje)} title="Registrar Cargas"
        subtitle={`Semana ${treino.semanaAtual} · ${sem?.tipo || ""} · ${sem?.rir || ""}`} />
      <TypeTabs tipos={tipos} value={t} onChange={trocar} />

      <div className="card progress-card">
        <div className="progress-top">
          <span className="label">Progresso do treino</span>
          <span className="display progress-n" style={{ color: pct >= 100 ? C.ok : C.text }}>{feitas}<span>/{alvoTotal} séries</span></span>
        </div>
        <div className="progress"><i style={{ width: pct + "%" }} /></div>
      </div>

      <div className="list stagger" key={t}>
        {exs.map((ex, i) => {
          const ult = ultimaExecucao(regs, t, ex.id, hoje);
          const alvo = seriesAlvo(ex.series);
          const melhor = ult ? Object.values(ult.series).reduce((m, s) => ((parseFloat(s.carga) || 0) > (parseFloat(m?.carga) || 0) ? s : m), null) : null;
          const rest = parseRest(ex.descanso);
          return (
            <div key={ex.id} className="card accent-l" style={{ "--i": i, "--c": cor }}>
              <div className="ex" style={{ marginBottom: 12 }}>
                <div className="ex-num">{i + 1}</div>
                <div className="ex-body">
                  <div className="ex-name">{ex.nome}</div>
                  <div className="ex-meta">{ex.series}{ex.obs ? " · " + ex.obs : ""}</div>
                  {melhor && <div className="ex-last"><Icon n="history" size={12} />Última ({fmtData(ult.data)}): <b>{melhor.carga} kg × {melhor.reps}</b></div>}
                </div>
                {rest > 0 && <button className="rest-pill" onClick={() => startTimer(rest, ex.nome)}><Icon n="timer" size={14} />{rest}s</button>}
              </div>
              <div className="series">
                {Array.from({ length: N_SERIES }).map((_, si) => {
                  const v = cargas[ex.id]?.[si] || {};
                  const prev = ult?.series?.[si];
                  return (
                    <div key={si} className={"serie" + (cheia(ex.id, si) ? " done" : "") + (si >= alvo ? " extra" : "")}>
                      <div className="serie-h">{cheia(ex.id, si) ? <Icon n="check" size={11} /> : null}S{si + 1}</div>
                      <div className="serie-u">KG</div>
                      <input className="input" type="number" inputMode="decimal" min="0" placeholder={prev?.carga || "0"} value={v.carga || ""}
                        onChange={(e) => setC(ex.id, si, "carga", e.target.value)} aria-label={`${ex.nome} série ${si + 1} carga`} />
                      <div className="serie-u">REPS</div>
                      <input className="input" type="number" inputMode="numeric" min="0" placeholder={prev?.reps || "0"} value={v.reps || ""}
                        onChange={(e) => setC(ex.id, si, "reps", e.target.value)} aria-label={`${ex.nome} série ${si + 1} repetições`} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    {/* fora do .page: a animação de entrada não pode "prender" o botão fixo */}
    <div className="savebar">
      <button className={"btn btn-lg " + (saved ? "btn-ok" : "btn-primary btn-shine")} onClick={salvar}>
        <Icon n={saved ? "check" : "bolt"} size={16} />{saved ? "Treino salvo" : "Salvar treino"}
      </button>
    </div>
    </>
  );
}

// ============ EVOLUÇÃO ============
export function Evolucao({ user, data }) {
  const treino = data.treinos[user.id];
  const tipos = treino ? tiposDo(treino) : [];
  const [tipo, setTipo] = useState(null);
  const [exSel, setExSel] = useState(null);
  if (!treino) return <Vazio msg={SEM_TREINO} />;
  const t = tipos.includes(tipo) ? tipo : tipos[0];
  const exs = treino.exercicios[t] || [];
  const ex = exs.find((e) => e.id === exSel) || exs[0];
  const regs = data.registros[user.id] || {};
  const pts = ex ? chartPoints(regs, t, ex.id) : [];
  const pr = pts.length ? Math.max(...pts.map((p) => p.cargaMax)) : 0;
  const evo = pts.length > 1 && pts[0].cargaMax ? Math.round(((pts.at(-1).cargaMax - pts[0].cargaMax) / pts[0].cargaMax) * 100) : 0;

  return (
    <div className="page">
      <PageHeader kicker="Seus números" title="Evolução" subtitle="Carga máxima e volume de cada exercício ao longo do tempo." />
      <TypeTabs tipos={tipos} value={t} onChange={(x) => { setTipo(x); setExSel(null); }} />
      <div className="chips scroll" style={{ marginTop: 10 }}>
        {exs.map((e) => (
          <button key={e.id} className={"chip sm" + (ex?.id === e.id ? " on" : "")} onClick={() => setExSel(e.id)}>{e.nome}</button>
        ))}
      </div>
      {!ex || pts.length === 0 ? (
        <div className="card empty-card">
          <Icon n="chart" size={26} />
          <div>Sem registros para <b>{ex?.nome || "este treino"}</b> ainda.</div>
          <div className="small muted">Registre suas cargas e acompanhe a evolução aqui.</div>
        </div>
      ) : (
        <div key={t + ex.id}>
          <div className="grid g-3 stagger" style={{ marginTop: 14 }}>
            <StatTile i={0} icon="trophy" label="Recorde" value={pr} suffix="kg" color={C.gold} />
            <StatTile i={1} icon="chart" label="Evolução" value={evo} suffix="%" color={evo >= 0 ? C.ok : C.danger} />
            <StatTile i={2} icon="history" label="Sessões" value={pts.length} color={C.info} />
          </div>
          <EvoCharts pts={pts} nome={ex.nome} />
        </div>
      )}
    </div>
  );
}
