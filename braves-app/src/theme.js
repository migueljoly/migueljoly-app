import { BRAND } from "./brand.js";

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// amount > 0 clareia, < 0 escurece
export const shade = (hex, amount) => {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c) => {
    const v = amount >= 0 ? c + (255 - c) * amount : c * (1 + amount);
    return Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  };
  return "#" + mix(r) + mix(g) + mix(b);
};

export const C = {
  bg: "#09090B",
  bg2: "#0E0E12",
  card: "#141418",
  card2: "#1B1B21",
  border: "#25252D",
  borderHi: "#33333D",
  text: "#F4F4F6",
  muted: "#8C8C99",
  dim: "#5B5B67",
  brand: BRAND.cores.primaria,
  brand2: shade(BRAND.cores.primaria, 0.22),
  brandDark: shade(BRAND.cores.primaria, -0.42),
  gold: BRAND.cores.secundaria,
  info: "#60A5FA",
  ok: "#22C55E",
  danger: "#EF4444",
};

export function applyBrand() {
  const s = document.documentElement.style;
  s.setProperty("--brand", C.brand);
  s.setProperty("--brand-2", C.brand2);
  s.setProperty("--brand-dark", C.brandDark);
  s.setProperty("--gold", C.gold);
  document.title = `${BRAND.nome} ${BRAND.sufixo} · Treino`;
}
