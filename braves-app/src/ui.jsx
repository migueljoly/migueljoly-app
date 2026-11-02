import { useEffect, useId, useRef, useState } from "react";
import { BRAND } from "./brand.js";
import { C } from "./theme.js";
import { typeColor, typeLabel } from "./data.js";

// ---------- ícones (SVG inline, sem dependência) ----------
const P = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-6h4v6" /></>,
  dumbbell: <><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" /></>,
  edit: <><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></>,
  chart: <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  users: <><circle cx="9" cy="8" r="4" /><path d="M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" /><path d="M16 4.1a4 4 0 0 1 0 7.8M22 20v-1a5 5 0 0 0-3.5-4.8" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
  play: <path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none" />,
  timer: <><circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5v4l2.5 2M9.5 2.5h5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  flame: <path d="M12 2.5c.8 3.6 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.3 1-3.8 2.2-4.8.1 2.1 1.1 3.3 2.3 3.3-.3-3.9-.4-6.9 1-9.5z" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  up: <path d="m6 15 6-6 6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M17 6h3v2a3 3 0 0 1-3 3M7 6H4v2a3 3 0 0 0 3 3" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  pause: <path d="M8 5v14M16 5v14" />,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
  stretch: <><circle cx="12" cy="4.5" r="2" /><path d="M5 9l7 1.5L19 9M12 10.5V15l-3.5 6M12 15l3.5 6" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7.5V12l3 2" /></>,
  bolt: <path d="M13 2.5 4.5 13.5H11L10 21.5l8.5-11H12z" />,
};

export function Icon({ n, size = 20, className = "", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={"ic " + className} style={style} aria-hidden="true">
      {P[n]}
    </svg>
  );
}

// ---------- marca ----------
export function Emblem({ size = 40, className = "" }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (BRAND.logoUrl) return <img src={BRAND.logoUrl} alt={BRAND.nome} style={{ height: size, width: "auto" }} className={className} />;
  return (
    <svg viewBox="0 0 64 72" width={size} height={(size * 72) / 64} className={className} aria-label={BRAND.nome}>
      <defs>
        <linearGradient id={id + "g"} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={C.brand2} />
          <stop offset="0.55" stopColor={C.brand} />
          <stop offset="1" stopColor={C.brandDark} />
        </linearGradient>
      </defs>
      <path d="M32 2 60 12v24c0 18-13 28-28 34C17 64 4 54 4 36V12z" fill={`url(#${id}g)`} />
      <path d="M32 9.5 53 17v19c0 13.6-9.6 21.6-21 26.5C20.6 57.6 11 49.6 11 36V17z" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.6" />
      <text x="32.5" y="47" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif" fontWeight="800" fontStyle="italic" fontSize="36" fill="#fff">B</text>
    </svg>
  );
}

export function Logo({ size = 30, sub = false, shimmer = false }) {
  if (BRAND.logoUrl) return <img src={BRAND.logoUrl} alt={`${BRAND.nome} ${BRAND.sufixo}`} style={{ height: size, width: "auto" }} />;
  return (
    <div className="logo">
      <Emblem size={size} />
      <div>
        <div className="logo-word" style={{ fontSize: size * 0.78 }}>
          <span className={shimmer ? "shimmer" : ""}>{BRAND.nome}</span>
          <span className="logo-ct">{BRAND.sufixo}</span>
        </div>
        {sub && <div className="logo-sub">{BRAND.slogan}</div>}
      </div>
    </div>
  );
}

// ---------- básicos ----------
export function Tag({ c = C.muted, children, style }) {
  return <span className="tag" style={{ "--c": c, ...style }}>{children}</span>;
}

export function Avatar({ text, color = C.brand, size = 34 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.34, background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
      {text}
    </div>
  );
}

export function Vazio({ msg, icon = "dumbbell" }) {
  return (
    <div className="empty page">
      <div className="empty-ic"><Icon n={icon} size={26} /></div>
      <div>{msg}</div>
    </div>
  );
}

export function PageHeader({ kicker, title, subtitle, right }) {
  return (
    <div className="page-head">
      <div>
        {kicker && <div className="kicker">{kicker}</div>}
        <h1 className="display page-title">{title}</h1>
        {subtitle && <div className="page-sub">{subtitle}</div>}
      </div>
      {right && <div className="page-head-right">{right}</div>}
    </div>
  );
}

export function SectionTitle({ children, icon, color, right }) {
  return (
    <div className="section-title" style={{ "--c": color || C.brand }}>
      {icon && <Icon n={icon} size={15} />}
      <span>{children}</span>
      <i className="section-line" />
      {right}
    </div>
  );
}

export function TypeTabs({ tipos, value, onChange, counts }) {
  return (
    <div className="chips scroll">
      {tipos.map((t) => (
        <button key={t} className={"chip" + (value === t ? " on" : "")} style={{ "--c": typeColor(t) }} onClick={() => onChange(t)}>
          <i className="dot" />
          {typeLabel(t)}
          {counts && <span className="count">{counts[t] ?? 0}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------- animados ----------
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function CountUp({ value, duration = 900 }) {
  const isNum = typeof value === "number" && Number.isFinite(value);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!isNum) return;
    const dur = reduceMotion() ? 0 : duration;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = dur ? Math.min(1, (t - t0) / dur) : 1;
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, isNum]);
  return isNum ? shown : value;
}

export function Ring({ value, max, size = 110, stroke = 10, color = C.brand, children }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  const [p, setP] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setP(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.gold} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.card2} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} className="ring-arc" />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

export function StatTile({ label, value, suffix, color = C.brand, icon, i = 0 }) {
  return (
    <div className="card stat lift" style={{ "--i": i, "--c": color }}>
      <div className="stat-top">
        <span className="label">{label}</span>
        {icon && <span className="stat-ic"><Icon n={icon} size={15} /></span>}
      </div>
      <div className="stat-v display">
        <CountUp value={value} />
        {suffix && <span className="stat-suf">{suffix}</span>}
      </div>
    </div>
  );
}

// ---------- camadas globais ----------
export function Toaster() {
  const [list, setList] = useState([]);
  useEffect(() => {
    const on = (e) => {
      const id = Math.random();
      setList((l) => [...l.slice(-2), { id, ...e.detail }]);
      setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 2800);
    };
    window.addEventListener("braves:toast", on);
    return () => window.removeEventListener("braves:toast", on);
  }, []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={"toast " + t.tipo}>
          <span className="toast-ic"><Icon n={t.tipo === "warn" ? "bolt" : "check"} size={13} /></span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

const CONFETTI_CORES = [C.brand, C.brand2, C.gold, "#ffffff", "#ffd34d"];

export function Confetti() {
  const [bursts, setBursts] = useState([]);
  useEffect(() => {
    const on = (e) => {
      if (reduceMotion()) return;
      const id = Math.random();
      const pieces = Array.from({ length: 34 }, (_, k) => {
        const ang = Math.random() * Math.PI * 2;
        const dist = 70 + Math.random() * 150;
        return {
          k,
          dx: Math.cos(ang) * dist,
          dy: Math.sin(ang) * dist - 60 + Math.random() * 140,
          r: Math.random() * 720 - 360,
          c: CONFETTI_CORES[k % CONFETTI_CORES.length],
          d: Math.random() * 90,
          w: 5 + Math.random() * 6,
        };
      });
      setBursts((b) => [...b, { id, x: e.detail.x, y: e.detail.y, pieces }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1500);
    };
    window.addEventListener("braves:burst", on);
    return () => window.removeEventListener("braves:burst", on);
  }, []);
  return (
    <div className="confetti" aria-hidden="true">
      {bursts.map((b) =>
        b.pieces.map((p) => (
          <i key={b.id + "-" + p.k} style={{
            "--x": b.x + "px", "--y": b.y + "px", "--dx": p.dx + "px", "--dy": p.dy + "px",
            "--r": p.r + "deg", "--c": p.c, "--d": p.d + "ms", width: p.w, height: p.w * 1.6,
          }} />
        ))
      )}
    </div>
  );
}

export function RestTimer() {
  const [t, setT] = useState(null); // {total,left,running,label}
  const audio = useRef(null);
  useEffect(() => {
    const on = (e) => {
      try {
        audio.current = audio.current || new (window.AudioContext || window.webkitAudioContext)();
        audio.current.resume?.();
      } catch { /* sem áudio */ }
      setT({ total: e.detail.seconds, left: e.detail.seconds, running: true, label: e.detail.label });
    };
    window.addEventListener("braves:timer", on);
    return () => window.removeEventListener("braves:timer", on);
  }, []);

  const running = t?.running && t.left > 0;
  const done = !!t && t.left <= 0;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => (x ? { ...x, left: Math.max(0, x.left - 1) } : x)), 1000);
    return () => clearInterval(id);
  }, [running]);

  // fim do descanso: vibra e toca dois bipes
  useEffect(() => {
    if (!done) return;
    navigator.vibrate?.([200, 100, 200]);
    try {
      const ctx = audio.current;
      if (!ctx) return;
      [0, 0.22].forEach((delay) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.18, ctx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);
        o.start(ctx.currentTime + delay); o.stop(ctx.currentTime + delay + 0.2);
      });
    } catch { /* sem áudio */ }
  }, [done]);

  if (!t) return null;
  const size = 74, stroke = 7, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const mm = Math.floor(t.left / 60), ss = String(t.left % 60).padStart(2, "0");
  return (
    <div className={"timer" + (done ? " done" : "")}>
      <div className="ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.card2} strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={done ? C.ok : C.brand} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - t.left / t.total)} style={{ transition: "stroke-dashoffset 1s linear, stroke .3s" }} />
        </svg>
        <div className="ring-center display" style={{ fontSize: 22 }}>{done ? <Icon n="check" size={26} /> : `${mm}:${ss}`}</div>
      </div>
      <div className="timer-body">
        <div className="label">{done ? "Descanso concluído" : "Descansando"}</div>
        <div className="timer-title">{done ? "Bora! Próxima série 💪" : t.label}</div>
        <div className="timer-actions">
          {!done && (
            <button className="btn btn-soft btn-sm" onClick={() => setT((x) => ({ ...x, running: !x.running }))}>
              <Icon n={t.running ? "pause" : "play"} size={13} />{t.running ? "Pausar" : "Seguir"}
            </button>
          )}
          <button className="btn btn-soft btn-sm" onClick={() => setT((x) => ({ ...x, left: x.left + 15, total: Math.max(x.total, x.left + 15), running: true }))}>+15s</button>
          <button className="btn btn-soft btn-sm" onClick={() => setT((x) => ({ ...x, left: x.total, running: true }))}><Icon n="refresh" size={13} /></button>
        </div>
      </div>
      <button className="icon-btn timer-x" onClick={() => setT(null)} aria-label="Fechar timer"><Icon n="x" size={16} /></button>
    </div>
  );
}
