import React, { useEffect, useState } from 'react';
import { OperationalMetrics } from '../types';
import { Shield, Sparkles, Activity, AlertTriangle, Cpu } from 'lucide-react';

interface HeaderProps {
  metrics: OperationalMetrics;
  onToggleHazard: () => void;
  onToggleElastic: () => void;
  onToggleSync: () => void;
  onOpenContact: () => void;
}

export default function Header({
  metrics,
  onToggleHazard,
  onToggleElastic,
  onToggleSync,
  onOpenContact,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.getUTCFullYear() + '-' +
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(now.getUTCDate()).padStart(2, '0') + ' ' +
        String(now.getUTCHours()).padStart(2, '0') + ':' +
        String(now.getUTCMinutes()).padStart(2, '0') + ':' +
        String(now.getUTCSeconds()).padStart(2, '0') + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-[#0a0c10]/95 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Identity / Animated Logo */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex-shrink-0 group">
            {/* Embedded High Definition Animated SVG Logo */}
            <svg viewBox="0 0 100 100" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
              <defs>
                <linearGradient id="headerHapiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2dd4bf" />
                  <stop offset="50%" stop-color="#0d9488" />
                  <stop offset="100%" stop-color="#0f766e" />
                </linearGradient>
                <linearGradient id="headerBackGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#050608" />
                  <stop offset="100%" stop-color="#0a0c10" />
                </linearGradient>
                <filter id="hGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="100" height="100" rx="20" fill="url(#headerBackGrad)" stroke="#1e293b" stroke-width="1.5" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#334155" stroke-dasharray="2 3" />
              <path d="M 22 50 Q 36 28, 50 50 T 78 50" fill="none" stroke="#475569" stroke-width="2" />
              <path d="M 22 50 Q 36 28, 50 50 T 78 50" fill="none" stroke="url(#headerHapiGrad)" stroke-width="2.5" stroke-dasharray="12 120">
                <animate attributeName="stroke-dashoffset" values="132;0" dur="2.5s" repeatCount="indefinite" />
              </path>
              <circle cx="22" cy="50" r="3" fill="#2dd4bf" />
              <circle cx="50" cy="50" r="4.5" fill="#050608" stroke="url(#headerHapiGrad)" stroke-width="1.5" filter="url(#hGlow)" />
              <circle cx="78" cy="50" r="3" fill="#0d9488" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-semibold tracking-wider text-white">HAPI</h1>
              <span className="text-xs bg-slate-900 text-teal-400 font-mono px-1.5 py-0.5 rounded border border-teal-500/20">SYS_V2.0</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Supply Chain Orchestration • Sans Mercantile Constellation
            </p>
          </div>
        </div>

        {/* Real-time Telemetry & Contact action */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {/* UTC Clock */}
          <div className="bg-[#07090d] border border-slate-800/80 rounded-lg px-3 py-1.5 font-mono text-xs text-teal-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 animate-pulse text-teal-400" />
            <span>{currentTime || 'SYSTEM STANDBY'}</span>
          </div>

          {/* Quick Config Toggles */}
          <div className="flex items-center gap-2 bg-[#07090d] border border-slate-800/80 rounded-lg p-1">
            <button
              onClick={onToggleHazard}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                metrics.hazardAwareScheduling
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle automatic weather and cosmic storm rerouting"
            >
              HAZARD ROUTE
            </button>
            <button
              onClick={onToggleElastic}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                metrics.elasticBufferAllocation
                  ? 'bg-teal-950/80 text-teal-300 border border-teal-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle dynamic warehouse safety margins under load"
            >
              ELASTIC BUFFER
            </button>
            <button
              onClick={onToggleSync}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                metrics.crossSystemSync
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Synchronize material streams with PTah, Hathor, MAMI_WATA, and SHANGO"
            >
              CROSS-SYNC
            </button>
          </div>

          <button
            onClick={onOpenContact}
            className="bg-gradient-to-r from-teal-600 to-[#0e7490] hover:from-teal-500 hover:to-[#155e75] text-white text-xs font-mono tracking-wider font-medium px-4 py-2 rounded-lg shadow-lg shadow-teal-950/30 transition-all border border-teal-400/20 active:translate-y-0.5"
            id="btn-contact-trigger"
          >
            CONTACT HAPI
          </button>
        </div>
      </div>

      {/* Quick Status Sub-Bar */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Active Freighters</p>
            <p className="text-sm font-semibold font-mono text-slate-100">{metrics.totalActiveShipments} Fleet Units</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Directives Run</p>
            <p className="text-sm font-semibold font-mono text-slate-100">{metrics.autonomousDirectivesCount} Autonomous</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-teal-400" />
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Transit Efficiency</p>
            <p className="text-sm font-semibold font-mono text-teal-400">{metrics.averageTransitEfficiency}% Optimal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-4 h-4 ${metrics.globalRiskIndex > 40 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Global Risk Index</p>
            <p className={`text-sm font-semibold font-mono ${metrics.globalRiskIndex > 40 ? 'text-amber-400' : 'text-slate-100'}`}>
              {metrics.globalRiskIndex}% Risk Coefficient
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
