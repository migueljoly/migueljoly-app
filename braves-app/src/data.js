import { C } from "./theme.js";
import { BRAND } from "./brand.js";

// ---------- constantes ----------
export const N_SERIES = 5;
export const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
export const DIAS_LABEL = { SEG: "Seg", TER: "Ter", QUA: "Qua", QUI: "Qui", SEX: "Sex", SAB: "Sáb", DOM: "Dom" };
export const TIPOS_DIVISAO = ["PUSH", "PULL", "LEGS", "UPPER", "LOWER", "FULL", "ABS", "OMBRO", "BRACOS", "DESCANSO", "PERSONALIZADO"];
export const PERIOD_TIPOS = ["BASE", "CHOQUE", "DELOAD"];
export const OBJETIVOS = ["Ganho de Massa", "Emagrecimento", "Condicionamento", "Definição"];

export const PHASE = {
  BASE: { cor: C.info, rir: "2-3 RIR", desc: "Técnica e volume moderado" },
  CHOQUE: { cor: C.brand, rir: "0-1 RIR", desc: "Alta intensidade, próximo à falha" },
  DELOAD: { cor: C.ok, rir: "5 RIR", desc: "Recuperação ativa" },
};

const TC = {
  PUSH: "#FF7A45", PULL: "#5B9DFF", LEGS: "#2DD4A7", UPPER: "#F5B700", LOWER: "#22C1DC",
  FULL: "#A78BFA", OMBRO: "#FB923C", BRACOS: "#F472B6", ABS: "#A3E635", DESCANSO: C.dim,
};
const EXTRA = ["#38BDF8", "#F43F5E", "#C084FC", "#FACC15", "#34D399", "#FB7185"];
const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export const typeColor = (t) => TC[t] || EXTRA[hash(t) % EXTRA.length];
export const typeLabel = (t) => ({ BRACOS: "BRAÇOS" })[t] || t;

const MUSCLES = {
  PUSH: "Peito · Ombro · Tríceps", PULL: "Costas · Bíceps", LEGS: "Quadríceps · Posterior · Panturrilha",
  UPPER: "Peito · Costas · Ombro · Braços", LOWER: "Posterior · Glúteo · Panturrilha", FULL: "Corpo todo",
  OMBRO: "Deltoide · Trapézio", ABS: "Abdominais · Core", BRACOS: "Bíceps · Tríceps",
};
export const getMuscles = (n = "") => {
  const k = n.toUpperCase();
  if (MUSCLES[k]) return MUSCLES[k];
  for (const [mk, mv] of Object.entries(MUSCLES)) if (k.includes(mk)) return mv;
  return "Treino personalizado";
};

// ---------- helpers ----------
export const uid = () => "id_" + Math.random().toString(36).slice(2, 9);
export const clone = (x) => JSON.parse(JSON.stringify(x));
export const iniciais = (name = "") => name.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
export const primeiroNome = (name = "") => name.trim().split(/\s+/)[0];
export const tiposDo = (treino) => [...new Set(treino.divisao.filter((d) => d.tipo !== "DESCANSO").map((d) => d.tipo))];

// data local (evita o bug do toISOString virar o dia depois das 21h no Brasil)
export const isoLocal = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const mondayOf = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
export const diaIndexHoje = () => (new Date().getDay() + 6) % 7;
export const fmtData = (iso = "") => { const [, m, d] = iso.split("-"); return `${d}/${m}`; };
export const fmtDataLonga = (iso = "") => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
export const diasDesde = (iso) => Math.round((new Date(isoLocal() + "T00:00") - new Date(iso + "T00:00")) / 86400000);

export const saudacao = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};

// "90-180s" -> 90 | "2min" -> 120 | "N/D" -> 0
export const parseRest = (s) => {
  const m = String(s).match(/(\d+)\s*(min|m(?![a-z]))?/i);
  if (!m) return 0;
  return m[2] ? +m[1] * 60 : +m[1];
};

// "2x20 WarmUp + 3x10" -> 5 séries | "3x10" -> 3
export const seriesAlvo = (s) => {
  const total = [...String(s).matchAll(/(\d+)\s*x/gi)].reduce((a, m) => a + +m[1], 0);
  return Math.min(N_SERIES, total || 3);
};

export const chartPoints = (regs, tipo, exId) =>
  Object.values(regs)
    .filter((r) => r.tipo === tipo && r.cargas?.[exId])
    .sort((a, b) => (a.data < b.data ? -1 : 1))
    .map((reg) => {
      const s = Object.values(reg.cargas[exId]);
      const cargaMax = Math.max(0, ...s.map((x) => parseFloat(x.carga) || 0));
      const volume = s.reduce((a, x) => a + (parseFloat(x.carga) || 0) * (parseFloat(x.reps) || 0), 0);
      return { data: reg.data, label: fmtData(reg.data), cargaMax, volume: Math.round(volume) };
    })
    .filter((p) => p.cargaMax > 0);

export const ultimaExecucao = (regs, tipo, exId, antesDe) => {
  const r = Object.values(regs)
    .filter((x) => x.tipo === tipo && x.cargas?.[exId] && (!antesDe || x.data < antesDe))
    .sort((a, b) => (a.data < b.data ? 1 : -1))[0];
  return r ? { data: r.data, series: r.cargas[exId] } : null;
};

export const ultimoRegistro = (regs) => Object.values(regs).sort((a, b) => (a.data < b.data ? 1 : -1))[0];

// ---------- dados de demonstração (sem alunos reais) ----------
const PERIOD_PADRAO = [
  { semana: 1, tipo: "BASE", rir: "2-3 RIR" }, { semana: 2, tipo: "BASE", rir: "2-3 RIR" },
  { semana: 3, tipo: "CHOQUE", rir: "0-1 RIR" }, { semana: 4, tipo: "CHOQUE", rir: "0-1 RIR" },
];
const div = (arr) => DIAS.map((dia, i) => ({ dia, tipo: arr[i] }));
const ex = (id, nome, series, descanso, obs = "") => ({ id, nome, series, descanso, obs });
const al = (id, nome, series, descanso) => ({ id, nome, series, descanso });

const PLANOS = {
  ppl: {
    divisao: div(["PUSH", "PULL", "LEGS", "DESCANSO", "PUSH", "DESCANSO", "DESCANSO"]),
    exercicios: {
      PUSH: [
        ex("p1", "Voador", "2x20 WarmUp + 3x10", "90-180s"),
        ex("p2", "Supino Declinado Máquina", "3x10", "90-180s"),
        ex("p3", "Desenvolvimento Halter", "3x10", "90-180s"),
        ex("p4", "Elevação Lateral", "3x10", "90-180s"),
        ex("p5", "Tríceps Máquina", "3x10", "90-180s"),
        ex("p6", "Tríceps Francês na Polia", "3x10", "90-180s"),
      ],
      PULL: [
        ex("pu1", "Puxada Aberta", "2x20 WarmUp + 3x10", "120-200s"),
        ex("pu2", "Puxada Neutra Unilateral", "3x10", "90-180s"),
        ex("pu3", "Remada Curvada Máquina", "3x10", "90-180s"),
        ex("pu4", "Remada Aberta Máquina", "3x10", "90-180s"),
        ex("pu5", "Rosca Martelo Alternada", "3x10", "90-120s"),
        ex("pu6", "Rosca Scott Máquina", "3x10", "90-120s"),
      ],
      LEGS: [
        ex("l1", "Agachamento Livre", "2x20 WarmUp + 3x10-8-6", "120-200s", "Desça controlando 3s"),
        ex("l2", "Búlgaro", "3x10", "120-200s"),
        ex("l3", "Stiff com Barra", "3x10", "120-200s"),
        ex("l4", "Extensora", "3x10", "90-180s"),
        ex("l5", "Panturrilha Máquina", "3x10", "90s"),
      ],
    },
    alongamentos: {
      PUSH: [al("ap1", "Rotação Externa com Band", "2x20", "30s")],
      PULL: [al("apu1", "Rotação Externa com Band", "2x20", "30s"), al("apu2", "Barra Fixa Suspensa", "2xMax", "60s")],
      LEGS: [al("al1", "Mobilidade de Quadril e Tornozelo", "1x45s c/lado", "N/D"), al("al2", "Alongamento Pigeon", "1x45s c/lado", "N/D")],
    },
  },
  ul: {
    divisao: div(["UPPER", "LOWER", "DESCANSO", "UPPER", "DESCANSO", "LOWER", "DESCANSO"]),
    exercicios: {
      UPPER: [
        ex("u1", "Supino Reto Máquina", "3x12", "90s"),
        ex("u2", "Voador", "3x12", "90s"),
        ex("u3", "Puxada Aberta", "3x12", "90-120s"),
        ex("u4", "Remada Curvada", "3x12", "90s"),
        ex("u5", "Elevação Lateral", "3x15", "60s"),
      ],
      LOWER: [
        ex("lo1", "Leg Press 45", "3x15", "90s"),
        ex("lo2", "Extensora", "3x15", "90s"),
        ex("lo3", "Flexora", "3x15", "90s"),
        ex("lo4", "Panturrilha Máquina", "4x20", "60s"),
      ],
    },
    alongamentos: {
      UPPER: [al("au1", "Rotação Externa com Band", "2x20", "30s"), al("au2", "Alongamento de Peitoral", "1x45s", "N/D")],
      LOWER: [al("alo1", "Mobilidade de Quadril", "1x45s c/lado", "N/D"), al("alo2", "Alongamento Pigeon", "1x45s c/lado", "N/D")],
    },
  },
  pplo: {
    divisao: div(["PUSH", "PULL", "LEGS", "OMBRO", "PUSH", "DESCANSO", "DESCANSO"]),
    exercicios: {
      PUSH: [
        ex("tp1", "Supino Inclinado", "4x8", "120s"),
        ex("tp2", "Crossover Polia Alta", "4x10", "90s"),
        ex("tp3", "Tríceps Corda", "4x12", "90s"),
      ],
      PULL: [
        ex("tpu1", "Puxada Neutra", "3x10", "120s"),
        ex("tpu2", "Remada Unilateral Halter", "4x10", "90s"),
        ex("tpu3", "Rosca Direta", "3x10", "90s"),
      ],
      LEGS: [
        ex("tl1", "Agachamento Hack", "3x10", "120s"),
        ex("tl2", "Leg Press 45", "4x10", "120s"),
        ex("tl3", "Flexora", "3x12", "90s"),
        ex("tl4", "Panturrilha Máquina", "4x20", "60s"),
      ],
      OMBRO: [
        ex("to1", "Desenvolvimento Máquina", "3x10", "90s"),
        ex("to2", "Elevação Lateral", "4x15", "60s"),
        ex("to3", "Voador Inverso", "3x12", "90s"),
      ],
    },
    alongamentos: {
      PUSH: [al("tap1", "Rotação Externa com Band", "2x20", "30s")],
      PULL: [al("tapu1", "Barra Fixa Suspensa", "2xMax", "60s")],
      LEGS: [al("tal1", "Mobilidade de Quadril", "1x45s c/lado", "N/D")],
      OMBRO: [al("tao1", "Mobilidade de Ombro", "1x20", "N/D")],
    },
  },
};

const BASE_CARGA = [
  [/leg press/i, 120], [/agachamento/i, 55], [/stiff/i, 40], [/supino/i, 40], [/puxada|remada/i, 45],
  [/desenvolvimento/i, 16], [/elevação/i, 8], [/rosca/i, 12], [/tríceps/i, 22], [/voador|crossover/i, 30],
  [/extensora|flexora/i, 35], [/panturrilha/i, 50], [/búlgaro/i, 14],
];
const cargaBase = (nome) => BASE_CARGA.find(([re]) => re.test(nome))?.[1] ?? 25;
const repsDe = (series) => { const m = [...String(series).matchAll(/(\d+)\s*x\s*(\d+)/gi)].pop(); return m ? +m[2] : 10; };

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gerarRegistros(treino, seed, offset, fator = 1) {
  const rand = rng(seed);
  const regs = {};
  const hoje = isoLocal();
  const SEMANAS = 6;
  for (let wb = SEMANAS - 1; wb >= 0; wb--) {
    const seg = addDays(mondayOf(), -7 * wb);
    const idx = SEMANAS - 1 - wb;
    treino.divisao.forEach((d, i) => {
      if (d.tipo === "DESCANSO") return;
      const data = isoLocal(addDays(seg, i));
      if (data > hoje || rand() < 0.14) return;
      const cargas = {};
      (treino.exercicios[d.tipo] || []).forEach((e) => {
        const base = cargaBase(e.nome) * fator;
        const step = Math.max(1, Math.round(base * 0.035));
        const c = Math.round(base + idx * step + (rand() < 0.3 ? step : 0));
        const r = repsDe(e.series);
        cargas[e.id] = {
          0: { carga: String(c), reps: String(r) },
          1: { carga: String(c), reps: String(r - (rand() < 0.4 ? 1 : 0)) },
          2: { carga: String(Math.round(c * 1.04)), reps: String(Math.max(4, r - 1 - Math.round(rand()))) },
        };
      });
      regs[data + "_" + d.tipo] = { tipo: d.tipo, data, semana: ((idx + offset) % 4) + 1, cargas };
    });
  }
  return regs;
}

export function buildSeed() {
  const users = [
    { id: 1, name: "Equipe Braves", email: "coach@braves.app", password: "braves123", role: "admin", avatar: "EB", unidade: "Todas" },
    { id: 2, name: "Lucas Demo", email: "lucas@braves.app", password: "aluno123", role: "aluno", avatar: "LD", objetivo: "Ganho de Massa", modalidade: "Musculação", treinos_semana: 4, unidade: "Xaxim" },
    { id: 3, name: "Bianca Demo", email: "bianca@braves.app", password: "aluno123", role: "aluno", avatar: "BD", objetivo: "Emagrecimento", modalidade: "Musculação", treinos_semana: 3, unidade: "Jardim Social" },
    { id: 4, name: "Thiago Demo", email: "thiago@braves.app", password: "aluno123", role: "aluno", avatar: "TD", objetivo: "Definição", modalidade: "Funcional", treinos_semana: 5, unidade: "Fazendinha" },
    { id: 5, name: "Marina Demo", email: "marina@braves.app", password: "aluno123", role: "aluno", avatar: "MD", objetivo: "Condicionamento", modalidade: "Lutas", treinos_semana: 3, unidade: BRAND.unidades[0] },
  ];
  const plano = (key, semanaAtual) => ({ semanaAtual, periodizacao: clone(PERIOD_PADRAO), ...clone(PLANOS[key]) });
  const treinos = { 2: plano("ppl", 3), 3: plano("ul", 2), 4: plano("pplo", 1) };
  const registros = {
    2: gerarRegistros(treinos[2], 11, 1, 1.15),
    3: gerarRegistros(treinos[3], 23, 0, 0.7),
    4: gerarRegistros(treinos[4], 37, 3, 1),
  };
  return { versao: 1, users, treinos, registros };
}
