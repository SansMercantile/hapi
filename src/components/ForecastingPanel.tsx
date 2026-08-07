import React, { useState } from 'react';
import { LogisticsNode, DemandForecastPoint } from '../types';
import { TrendingUp, RefreshCw, Layers, ShieldCheck, ChevronRight } from 'lucide-react';
import { SYSTEM_DEMAND_FORECASTS } from '../data';

interface ForecastingPanelProps {
  nodes: LogisticsNode[];
  onTriggerReplenish: (nodeId: string) => void;
  logs: string[];
  systemLogsTrigger: (msg: string) => void;
}

export default function ForecastingPanel({
  nodes,
  onTriggerReplenish,
  logs,
  systemLogsTrigger,
}: ForecastingPanelProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ptah-citadel');
  const [safetyBufferPercent, setSafetyBufferPercent] = useState<number>(20);
  const [isAutoReplenishActive, setIsAutoReplenishActive] = useState<boolean>(true);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const rawForecastData = SYSTEM_DEMAND_FORECASTS[selectedNodeId] || [];

  // Calculate dynamic safety buffer lines based on user selected safetyBufferPercent slider
  const forecastData: DemandForecastPoint[] = rawForecastData.map((d) => {
    const bufferMultiplier = 1 + safetyBufferPercent / 100;
    return {
      ...d,
      withBuffer: Math.round(d.predicted * bufferMultiplier),
    };
  });

  // Calculate stats
  const peakDemand = Math.max(...forecastData.map(d => d.predicted));
  const avgDemand = Math.round(forecastData.reduce((acc, d) => acc + d.predicted, 0) / forecastData.length);
  const currentUtilization = Math.round((selectedNode.currentStock / selectedNode.maxCapacity) * 100);

  // SVG Chart layout helper constants
  const chartWidth = 550;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.round(Math.max(...forecastData.map(d => Math.max(d.predicted, d.actual || 0, d.withBuffer))) * 1.1);

  // Convert (index, value) coordinates on data grid to SVG (x, y) coordinates
  const getCoordinates = (index: number, val: number) => {
    const totalPoints = forecastData.length - 1;
    const x = paddingLeft + (index / totalPoints) * graphWidth;
    const y = paddingTop + graphHeight - (val / maxVal) * graphHeight;
    return { x, y };
  };

  // Generate SVG Path for the Area underneath the Predicted Demand Curve
  const generateAreaPath = (key: 'predicted' | 'withBuffer') => {
    if (forecastData.length === 0) return '';
    let d = `M ${getCoordinates(0, 0).x} ${getCoordinates(0, 0).y}`;
    forecastData.forEach((point, i) => {
      const val = key === 'predicted' ? point.predicted : point.withBuffer;
      const coords = getCoordinates(i, val);
      d += ` L ${coords.x} ${coords.y}`;
    });
    d += ` L ${getCoordinates(forecastData.length - 1, 0).x} ${getCoordinates(forecastData.length - 1, 0).y} Z`;
    return d;
  };

  // Generate SVG Line Plot for Actual points
  const generateLinePath = (key: 'predicted' | 'actual' | 'withBuffer') => {
    if (forecastData.length === 0) return '';
    const points: string[] = [];
    forecastData.forEach((point, i) => {
      const val = point[key];
      if (val !== undefined) {
        const coords = getCoordinates(i, val);
        points.push(`${coords.x},${coords.y}`);
      }
    });
    return `M ${points.join(' L ')}`;
  };

  const handleManualReplenish = () => {
    onTriggerReplenish(selectedNodeId);
    systemLogsTrigger(`Manual replenishment requested for ${selectedNode.name}. Dispatching logistics drone fleets.`);
  };

  return (
    <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-5 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6 font-sans">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-display font-medium tracking-wide text-white">INTELLIGENT DEMAND FORECASTING</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Resource prediction matrices and adaptive safety buffers for operational nodes.
          </p>
        </div>

        {/* Top Node Selector tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#050608] p-1 rounded-lg border border-slate-800/80">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`px-3 py-1 text-2xs font-mono rounded-md transition-all ${
                selectedNodeId === node.id
                  ? 'bg-teal-950/80 text-teal-300 border border-teal-800/45 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {node.system} Node
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Interactive SVG Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-300">12-Cycle Resource Demand Curve</span>
            </div>
            <div className="flex items-center gap-4 text-3xs font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 px-1.5 bg-teal-500/80 rounded inline-block" />
                <span>PREDICTED MODEL</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 px-1.5 bg-indigo-500/80 rounded inline-block" />
                <span>DYNAMIC BUFFER</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 border-t border-dashed border-emerald-400 inline-block px-1.5" />
                <span>ACTUAL DEMAND (HISTORICAL)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#050608] p-4 rounded-xl border border-slate-800/60 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Gradients */}
              <defs>
                <linearGradient id="curveArea" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0.0" />
                </linearGradient>
                <linearGradient id="bufferArea" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#6366f1" stop-opacity="0.15" />
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Reference Grid Lines */}
              {[4, 2, 0].map((step, idx) => {
                const stepVal = Math.round((maxVal / 4) * step);
                const coords = getCoordinates(0, stepVal);
                return (
                  <g key={`yGrid-${idx}`}>
                    <line
                      x1={paddingLeft}
                      y1={coords.y}
                      x2={chartWidth - paddingRight}
                      y2={coords.y}
                      stroke="#1e293b"
                      stroke-width="0.5"
                      stroke-dasharray="2 3"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={coords.y + 3}
                      fill="#475569"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {stepVal}
                    </text>
                  </g>
                );
              })}

              {/* X Axis ticks */}
              {forecastData.map((d, i) => {
                const coords = getCoordinates(i, 0);
                return (
                  <g key={`xTick-${i}`}>
                    {/* Show grid division vertically every 2 ticks */}
                    {i % 2 === 0 && (
                      <line
                        x1={coords.x}
                        y1={paddingTop}
                        x2={coords.x}
                        y2={chartHeight - paddingBottom}
                        stroke="#1e293b"
                        stroke-width="0.5"
                        stroke-opacity="0.5"
                      />
                    )}
                    <text
                      x={coords.x}
                      y={chartHeight - paddingBottom + 14}
                      fill="#475569"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {d.cycle}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Areas underneath curves (Glow overlays) */}
              <path d={generateAreaPath('withBuffer')} fill="url(#bufferArea)" />
              <path d={generateAreaPath('predicted')} fill="url(#curveArea)" />

              {/* Curve boundaries (Plotted lines) */}
              <path
                d={generateLinePath('withBuffer')}
                fill="none"
                stroke="#6366f1"
                stroke-width="2"
                stroke-opacity="0.8"
              />
              <path
                d={generateLinePath('predicted')}
                fill="none"
                stroke="#2dd4bf"
                stroke-width="2"
                stroke-opacity="0.9"
              />
              <path
                d={generateLinePath('actual')}
                fill="none"
                stroke="#14b8a6"
                stroke-width="1.5"
                stroke-dasharray="2 2"
              />

              {/* Visual Anchor Indicator for Current Time Node */}
              {(() => {
                const midCoords = getCoordinates(5, forecastData[5].predicted);
                return (
                  <g>
                    <line
                      x1={midCoords.x}
                      y1={paddingTop}
                      x2={midCoords.x}
                      y2={chartHeight - paddingBottom}
                      stroke="#334155"
                      stroke-dasharray="1 1"
                    />
                    <circle cx={midCoords.x} cy={midCoords.y} r="4" fill="#2dd4bf" stroke="#020617" stroke-width="1" />
                    <text
                      x={midCoords.x}
                      y={paddingTop + 6}
                      fill="#ef4444"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      CURRENT CYCLE
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right Active replenishment & buffer configuration panel */}
        <div className="space-y-4">
          <div className="bg-[#050608] p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div>
              <span className="text-3xs font-mono text-slate-500 uppercase tracking-widest block font-bold">CONTROL NODE METRIC</span>
              <span className="text-base font-display font-medium text-white truncate block mt-0.5">
                {selectedNode.name}
              </span>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#07090d] p-2.5 rounded border border-slate-800/80">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">STOCK LEVEL</span>
                <span className="font-mono text-sm font-semibold text-[#2dd4bf] mt-0.5 inline-block">
                  {selectedNode.currentStock} Units
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  {currentUtilization}% Capacity
                </span>
              </div>

              <div className="bg-[#07090d] p-2.5 rounded border border-slate-800/80">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">PEAK FORECAST</span>
                <span className="font-mono text-sm font-semibold text-rose-400 mt-0.5 inline-block">
                  {peakDemand} Units
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  Avg: {avgDemand} Units
                </span>
              </div>
            </div>

            {/* Interactive safety buffer slider */}
            <div className="space-y-2 font-sans text-xs">
              <div className="flex items-center justify-between text-2xs font-mono">
                <span className="text-slate-400 font-bold uppercase">SAFETY BUFFER LEVEL</span>
                <span className="text-teal-400 font-semibold">{safetyBufferPercent}% OPTIMIZER</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={safetyBufferPercent}
                onChange={(e) => setSafetyBufferPercent(Number(e.target.value))}
                className="w-full accent-teal-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 leading-normal">
                Adjust resource reserves. Higher rates reduce delivery disruption risks but increase staging lock up costs.
              </p>
            </div>

            {/* Manual actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleManualReplenish}
                className="w-full bg-[#07090d] hover:bg-[#0a0c10] border border-slate-700/80 text-teal-400 py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition active:translate-y-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" style={{ animationDuration: '6s' }} />
                MANUAL STAGE REPLENISH
              </button>
            </div>
          </div>

          {/* Autonomous replenishment logic block */}
          <div className="bg-[#050608]/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono text-slate-200">Autonomous Replenishment</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoReplenishActive}
                  onChange={() => setIsAutoReplenishActive(!isAutoReplenishActive)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600 peer-checked:after:bg-white"></div>
              </label>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              When enabled, HAPI AI automatically triggers replenishment drops when storage falls below {safetyBufferPercent}% buffer safety levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
