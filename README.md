# HAPI Frontend — Supply Chain & Logistics Intelligence

HAPI is Sans Mercantile's autonomous distribution, demand forecasting, and
logistics coordination system. It's a real-time operations dashboard —
fleet/shipment tracking on a tactical map, demand forecasting, and live
interop panels into PTah (construction), Hathor (mining), MAMI_WATA
(hydraulics), and SHANGO (climate/energy).

## Stack

Pure client-side single-page app — no backend server in this repo (unlike
[[ptah]], which bundles an Express server). Deployed as a static build.

- React 19 + TypeScript, Vite 6, Tailwind CSS 4
- `motion` (Framer Motion), `lucide-react` icons
- Google Gemini (`@google/genai`) is a listed dependency but the AI features
  live client-side in this app (no `/api/*` proxy route the way PTah has)

## Local Development

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev
```

Runs on **http://localhost:3000**.

## Build

```bash
npm run build     # vite build -> dist/
npm run preview   # serve the production build locally
```

## Project Structure

```
hapi/
├── src/
│   ├── App.tsx                    # Main dashboard shell + simulation loops
│   ├── data.ts                    # Seed data: nodes, shipments, logs
│   ├── types.ts
│   └── components/
│       ├── Header.tsx
│       ├── TacticalMap.tsx         # Live map: nodes, shipments, storms
│       ├── ForecastingPanel.tsx    # Demand forecasting + replenishment
│       ├── QuantumTransports.tsx   # Fleet registry (personal/commercial/industrial)
│       ├── SystemInterops.tsx      # Cross-system sync panel (PTah/Hathor/MAMI_WATA/SHANGO/RA)
│       └── ContactHapi.tsx         # Contact slideover
├── public/
└── vite.config.ts
```

## Notes

- All shipment/node/telemetry state is simulated client-side (`setInterval`
  loops in `App.tsx`) — there's no live backend feed yet.
- 2026-08-09: fixed a set of invalid Tailwind classes that were silently
  applying no style (`text-2xs`/`text-3xs` — now real theme tokens in
  `index.css`; `text-slate-350`, `border-slate-801`, `w-4.5`/`h-4.5` — typos
  for the nearest real Tailwind values). Worth checking [[ptah]] and the
  other Websites-sourced frontends for the same pattern; they share a
  generator lineage.
