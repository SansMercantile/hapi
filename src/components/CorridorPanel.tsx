import React, { useEffect, useState } from "react";
import { Wind, Navigation, AlertTriangle, CheckCircle2, Eye } from "lucide-react";

// Real logistics-corridor conditions for HAPI, fed by /api/v1/corridors
// (Open-Meteo at real African trade hubs). No fabricated shipment positions.

interface Corridor {
  id: string;
  name: string;
  country: string;
  kind: string;
  conditions: { temperatureC: number; windSpeedKmh: number; precipitationMm: number; visibilityM: number; weatherCode: number };
  disruption: { level: "clear" | "caution" | "disrupted"; note: string };
}

const LEVEL_STYLE = {
  clear: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  caution: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  disrupted: "text-red-400 border-red-500/30 bg-red-500/10",
};

export default function CorridorPanel() {
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [meta, setMeta] = useState<{ source?: string; fetchedAt?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const base = (import.meta as any).env?.VITE_API_BASE_URL || "";
    fetch(`${base}/api/v1/corridors`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!alive) return;
        if (!ok) throw new Error(j.error || "request failed");
        setCorridors(j.corridors ?? []);
        setMeta({ source: j.source, fetchedAt: j.fetchedAt });
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" />
          Live Trade-Corridor Conditions
        </h3>
        <span className="text-[10px] font-mono text-slate-500">
          {meta.source?.toUpperCase()} · {meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleString() : ""}
        </span>
      </div>

      {loading && <p className="text-slate-400 text-xs">Loading live corridor conditions…</p>}
      {error && <p className="text-red-400 text-xs">Live corridor data unavailable: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {corridors.map((c) => (
          <div key={c.id} className="bg-slate-950/60 border border-slate-800 rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm font-bold text-slate-100">{c.name}</div>
                <div className="text-[10px] font-mono text-slate-500">{c.country} · {c.kind}</div>
              </div>
              <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded ${LEVEL_STYLE[c.disruption.level]}`}>
                {c.disruption.level === "clear" ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                {c.disruption.level}
              </span>
            </div>
            <div className="flex gap-4 text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{c.conditions.windSpeedKmh.toFixed(0)} km/h</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(c.conditions.visibilityM / 1000).toFixed(1)} km</span>
              <span>{c.conditions.temperatureC.toFixed(0)}°C</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{c.disruption.note}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] font-mono text-slate-600 mt-3">
        Real conditions from Open-Meteo at key African ports and trade hubs. Disruption signals derived from real wind, visibility, and weather codes.
      </p>
    </div>
  );
}
