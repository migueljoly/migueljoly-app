import { useId } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { C } from "./theme.js";
import { Tag } from "./ui.jsx";

const tt = {
  contentStyle: { background: C.card2, border: `1px solid ${C.borderHi}`, borderRadius: 12, color: C.text, fontSize: 12, boxShadow: "0 12px 30px rgba(0,0,0,.4)" },
  labelStyle: { color: C.muted, marginBottom: 4 },
  itemStyle: { color: C.text, fontWeight: 700 },
};
const axis = { stroke: C.dim, tick: { fontSize: 10, fill: C.muted }, tickLine: false, axisLine: false };

export function EvoCharts({ pts, nome, lado = false, h = 200 }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={"grid stagger" + (lado ? " g-2" : "")} style={{ marginTop: 14 }}>
      <div className="card" style={{ "--i": 0 }}>
        <div className="chart-h">
          <div><div className="label">Carga máxima</div><div className="chart-t">{nome}</div></div>
          <Tag c={C.brand}>kg</Tag>
        </div>
        <ResponsiveContainer width="100%" height={h}>
          <AreaChart data={pts} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={id + "a"} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.brand} stopOpacity={0.5} />
                <stop offset="100%" stopColor={C.brand} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" stroke={C.border} vertical={false} />
            <XAxis dataKey="label" {...axis} />
            <YAxis {...axis} domain={[(d) => Math.max(0, Math.floor(d * 0.88)), (d) => Math.ceil(d * 1.06)]} />
            <Tooltip {...tt} cursor={{ stroke: C.borderHi }} />
            <Area type="monotone" dataKey="cargaMax" name="Carga máx (kg)" stroke={C.brand} strokeWidth={2.5} fill={`url(#${id}a)`}
              dot={{ r: 3.5, fill: C.bg, stroke: C.brand, strokeWidth: 2 }} activeDot={{ r: 6, fill: C.brand, stroke: "#fff", strokeWidth: 2 }}
              animationDuration={1200} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card" style={{ "--i": 1 }}>
        <div className="chart-h">
          <div><div className="label">Volume total</div><div className="chart-t">{nome}</div></div>
          <Tag c={C.gold}>kg × reps</Tag>
        </div>
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={pts} margin={{ top: 10, right: 6, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id={id + "b"} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.gold} />
                <stop offset="100%" stopColor={C.gold} stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" stroke={C.border} vertical={false} />
            <XAxis dataKey="label" {...axis} />
            <YAxis {...axis} />
            <Tooltip {...tt} cursor={{ fill: "rgba(255,255,255,.04)" }} />
            <Bar dataKey="volume" name="Volume" fill={`url(#${id}b)`} radius={[6, 6, 0, 0]} maxBarSize={34} animationDuration={1100} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
