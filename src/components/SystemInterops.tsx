import React from 'react';
import { SYSTEM_DESCRIPTIONS } from '../data';
import { Hammer, HardHat, Waves, Flame, Zap, Database, ExternalLink } from 'lucide-react';

interface SystemInteropsProps {
  onAddLog: (sys: string, type: 'info' | 'warning' | 'success', msg: string) => void;
}

export default function SystemInterops({ onAddLog }: SystemInteropsProps) {
  const triggerHandshake = (sysName: string) => {
    onAddLog(
      sysName,
      'success',
      `Manual sync completed successfully with ${sysName} core databases. Staging frameworks updated.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5 border-b border-slate-800/80 pb-4 font-sans">
        <h2 className="text-xl font-display font-medium text-white tracking-wide uppercase">CONSTELLATION INTEGRATION CLOUD</h2>
        <p className="text-xs text-slate-400">
          Real-time interface channels anchoring HAPI logistic feeds to planetary construction, mining extractions, and climate operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* PTah Block */}
        <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-[#a855f7]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-[#a855f7] bg-[#a855f7]/10 border border-[#a855f7]/30 px-2 py-0.5 rounded">
                PTah
              </span>
              <Hammer className="w-4 h-4 text-[#a855f7] group-hover:rotate-12 transition-transform" />
            </div>
            <h3 className="text-xs font-display font-medium text-slate-100 truncate">
              {SYSTEM_DESCRIPTIONS.PTah.title}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.PTah.focus}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.PTah.contribution}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => triggerHandshake('PTah')}
              className="w-full text-center py-1 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#a855f7] text-[10px] font-mono rounded border border-[#a855f7]/20 transition"
            >
              SYNC PATHWAY
            </button>
          </div>
        </div>

        {/* Hathor Block */}
        <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-[#f59e0b]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2 py-0.5 rounded">
                Hathor
              </span>
              <HardHat className="w-4 h-4 text-[#f59e0b] group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="text-xs font-display font-medium text-slate-100 truncate">
              {SYSTEM_DESCRIPTIONS.Hathor.title}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.Hathor.focus}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.Hathor.contribution}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => triggerHandshake('Hathor')}
              className="w-full text-center py-1 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-mono rounded border border-[#f59e0b]/20 transition"
            >
              PORT HANDSHAKE
            </button>
          </div>
        </div>

        {/* MAMI_WATA Block */}
        <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-[#06b6d4]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/30 px-2 py-0.5 rounded">
                MAMI_WATA
              </span>
              <Waves className="w-4 h-4 text-[#06b6d4] group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="text-xs font-display font-medium text-slate-100 truncate">
              {SYSTEM_DESCRIPTIONS.MAMI_WATA.title}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.MAMI_WATA.focus}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.MAMI_WATA.contribution}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => triggerHandshake('MAMI_WATA')}
              className="w-full text-center py-1 bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 text-[#06b6d4] text-[10px] font-mono rounded border border-[#06b6d4]/20 transition"
            >
              GRID PUMP LINE
            </button>
          </div>
        </div>

        {/* SHANGO Block */}
        <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-[#f43f5e]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-[#f43f5e] bg-[#f43f5e]/10 border border-[#f43f5e]/30 px-2 py-0.5 rounded">
                SHANGO
              </span>
              <Flame className="w-4 h-4 text-[#f43f5e] group-hover:animate-pulse transition-transform" />
            </div>
            <h3 className="text-xs font-display font-medium text-slate-100 truncate">
              {SYSTEM_DESCRIPTIONS.SHANGO.title}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.SHANGO.focus}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.SHANGO.contribution}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => triggerHandshake('SHANGO')}
              className="w-full text-center py-1 bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 text-[#f43f5e] text-[10px] font-mono rounded border border-[#f43f5e]/20 transition"
            >
              BAROMETER FEED
            </button>
          </div>
        </div>

        {/* RA Energy Block */}
        <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between group hover:border-[#3b82f6]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/30 px-2 py-0.5 rounded">
                RA
              </span>
              <Zap className="w-4 h-4 text-[#3b82f6] group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xs font-display font-medium text-slate-100 truncate">
              {SYSTEM_DESCRIPTIONS.RA.title}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.RA.focus}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {SYSTEM_DESCRIPTIONS.RA.contribution}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <button
              onClick={() => triggerHandshake('RA')}
              className="w-full text-center py-1 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] text-[10px] font-mono rounded border border-[#3b82f6]/20 transition"
            >
              COORDINATE FEED
            </button>
          </div>
        </div>
      </div>

      {/* Integration Benefits Overlay (Static Text Blocks) */}
      <div className="border border-slate-800/85 bg-[#050608] rounded-xl p-5 font-sans">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#2dd4bf] mb-4 flex items-center gap-2 font-bold">
          <Database className="w-4.5 h-4.5 text-teal-400" />
          Intel Core Operational Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Reduced Delivery Risk</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Minimize route and staging disruptions with structural hazard-aware scheduling filters, guarding logistics against magnetic solar storms.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Faster Response Cycles</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Automated supply chain replenishment matrices instantly optimize vector flow speeds, preventing material staging lag times.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Robust Supply Elasticity</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Configure flexible warehouse allocations to insulate planetary nodes from production shortages with responsive protective reserves.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Cross-System Coordination</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Align logistics payloads globally, linking structural building matrices to raw mineral extraction and planetary energy storage grids.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
