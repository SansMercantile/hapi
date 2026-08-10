import React from 'react';
import { LogisticsNode, Shipment } from '../types';
import { Map, Navigation, Compass, ShieldAlert, Zap, RotateCcw, AlertOctagon } from 'lucide-react';

interface TacticalMapProps {
  nodes: LogisticsNode[];
  shipments: Shipment[];
  selectedNodeId: string | null;
  selectedShipmentId: string | null;
  activeStormSector: string | null;
  onSelectNode: (nodeId: string) => void;
  onSelectShipment: (shipmentId: string) => void;
  onInduceStorm: (sectorName: string) => void;
  onClearStorm: () => void;
  onBoostShipment: (shipmentId: string) => void;
  onDeploySupplyCrate: (originId: string, destId: string) => void;
}

export default function TacticalMap({
  nodes,
  shipments,
  selectedNodeId,
  selectedShipmentId,
  activeStormSector,
  onSelectNode,
  onSelectShipment,
  onInduceStorm,
  onClearStorm,
  onBoostShipment,
  onDeploySupplyCrate,
}: TacticalMapProps) {
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedShipment = shipments.find(s => s.id === selectedShipmentId);

  // Find exact coordinate of a node by ID
  const getNodeCoordinates = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? node.coordinates : { x: 50, y: 50 };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Map Visualizer */}
      <div className="lg:col-span-2 bg-[#07090d] border border-slate-800/80 rounded-xl p-4 flex flex-col relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-display font-medium tracking-wide text-white">CONSTELLATION VECTOR STREAM</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tactical Grid Overlay</span>
          </div>
        </div>

        {/* The Map Arena */}
        <div className="relative w-full aspect-video bg-[#050608] rounded-lg border border-slate-800/60 overflow-hidden">
          {/* Animated Background Star Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" stroke-width="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* High Definition Tactical SVG Layout */}
          <svg viewBox="0 0 100 80" className="w-full h-full">
            <defs>
              <radialGradient id="hathorRad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#b45309" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#b45309" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="shangoRad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#be123c" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#be123c" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#ec4899" stop-opacity="0.2" />
              </linearGradient>
            </defs>

            {/* Render Cosmic Hazard Zone if a storm is triggered */}
            {activeStormSector && (
              <g>
                {/* Find node location for storm center */}
                {(() => {
                  const stormNode = nodes.find(n => n.system === activeStormSector);
                  if (!stormNode) return null;
                  return (
                    <g>
                      <circle
                        cx={stormNode.coordinates.x}
                        cy={stormNode.coordinates.y}
                        r="14"
                        fill="url(#shangoRad)"
                        className="animate-pulse"
                      />
                      <circle
                        cx={stormNode.coordinates.x}
                        cy={stormNode.coordinates.y}
                        r="12"
                        fill="none"
                        stroke="#be123c"
                        stroke-width="1"
                        stroke-dasharray="3 3"
                      />
                      <text
                        x={stormNode.coordinates.x}
                        y={stormNode.coordinates.y - 10}
                        textAnchor="middle"
                        fill="#fda4af"
                        fontSize="2"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        ION STORM: {activeStormSector} SECTOR
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Step 1: Flight Vector Pipelines (Connecting lines) */}
            {nodes.map((origin) =>
              nodes.map((dest) => {
                // To avoid drawing duplicates, only draw if origin.id < dest.id
                if (origin.id >= dest.id) return null;
                const isSelectedPath =
                  (selectedShipment?.originId === origin.id && selectedShipment?.destinationId === dest.id) ||
                  (selectedShipment?.originId === dest.id && selectedShipment?.destinationId === origin.id);

                return (
                  <g key={`path-${origin.id}-${dest.id}`}>
                    <line
                      x1={origin.coordinates.x}
                      y1={origin.coordinates.y}
                      x2={dest.coordinates.x}
                      y2={dest.coordinates.y}
                      stroke={isSelectedPath ? '#06b6d4' : '#1e293b'}
                      stroke-width={isSelectedPath ? '1.5' : '0.8'}
                      stroke-dasharray={isSelectedPath ? 'none' : '2 4'}
                    />
                    {/* Animated path flows */}
                    <line
                      x1={origin.coordinates.x}
                      y1={origin.coordinates.y}
                      x2={dest.coordinates.x}
                      y2={dest.coordinates.y}
                      stroke="url(#vectorGrad)"
                      stroke-width="0.8"
                      stroke-dasharray="8 60"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="100;0"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </line>
                  </g>
                );
              })
            )}

            {/* Step 2: Render Nodes (Planets/Hubs) */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const hasStorm = activeStormSector === node.system;
              const colorClass =
                node.system === 'PTah'
                  ? '#a855f7' // Purple
                  : node.system === 'Hathor'
                  ? '#f59e0b' // Amber
                  : node.system === 'MAMI_WATA'
                  ? '#06b6d4' // Teal
                  : node.system === 'SHANGO'
                  ? '#f43f5e' // Rose
                  : '#3b82f6'; // Blue

              return (
                <g
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Glowing selection circle */}
                  <circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r={isSelected ? '6.5' : '4.5'}
                    fill="none"
                    stroke={isSelected ? '#06b6d4' : 'transparent'}
                    stroke-width="1.5"
                    className="transition-all duration-300"
                  />
                  {/* Core Hub */}
                  <circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r="3.5"
                    fill="#020617"
                    stroke={colorClass}
                    stroke-width={isSelected ? '2.5' : '1.5'}
                  />
                  {/* Inner dynamic pulsing element */}
                  <circle
                    cx={node.coordinates.x}
                    cy={node.coordinates.y}
                    r="1.5"
                    fill={colorClass}
                    opacity="0.8"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.4;1;0.4"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Text labels */}
                  <text
                    x={node.coordinates.x}
                    y={node.coordinates.y + 7}
                    fill="#cbd5e1"
                    fontSize="2.4"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="Space Grotesk, sans-serif"
                    textAnchor="middle"
                  >
                    {node.name.split(' ')[0]}
                  </text>
                  <text
                    x={node.coordinates.x}
                    y={node.coordinates.y + 10}
                    fill="#64748b"
                    fontSize="1.8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {node.currentStock} / {node.maxCapacity} u
                  </text>
                </g>
              );
            })}

            {/* Step 3: Render Active Freighters (Animated Transports) */}
            {shipments.map((ship) => {
              const origin = getNodeCoordinates(ship.originId);
              const dest = getNodeCoordinates(ship.destinationId);

              // Interpolate position along coordinate line based on progress percentage
              const dx = dest.x - origin.x;
              const dy = dest.y - origin.y;
              const currentX = origin.x + dx * (ship.progress / 100);
              const currentY = origin.y + dy * (ship.progress / 100);

              const isSelected = ship.id === selectedShipmentId;
              const size = isSelected ? 3.2 : 2.2;

              return (
                <g
                  key={ship.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShipment(ship.id);
                  }}
                  className="cursor-pointer"
                >
                  {/* Halo Pulsar under ship */}
                  <circle
                    cx={currentX}
                    cy={currentY}
                    r={size * 1.8}
                    fill="none"
                    stroke={isSelected ? '#06b6d4' : '#1e293b'}
                    stroke-width="0.5"
                    opacity={isSelected ? 0.8 : 0.4}
                  >
                    <animate
                      attributeName="r"
                      values={`${size};${size * 2.2};${size}`}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Cargo Pod shape */}
                  <path
                    d={`M ${currentX} ${currentY - size} L ${currentX + size} ${currentY + size} L ${currentX - size} ${currentY + size} Z`}
                    fill={isSelected ? '#22d3ee' : '#38bdf8'}
                    stroke="#020617"
                    stroke-width="0.5"
                    className="transition-transform duration-300"
                  />

                  {/* Tiny identifier text */}
                  <text
                    x={currentX}
                    y={currentY - size - 2}
                    fill={isSelected ? '#22d3ee' : '#94a3b8'}
                    fontSize="1.8"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {ship.name.split(' ')[1] || 'SHIP'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tactical Simulator Controls */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-300">Cosmic Status Controls</p>
            <p className="text-[10px] text-slate-500 font-mono">Simulate orbital hazards and environment interference</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeStormSector ? (
              <button
                onClick={onClearStorm}
                className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-md flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                CLEAR ACTIVE STORM
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 mr-1">Simulate storm:</span>
                <button
                  onClick={() => onInduceStorm('Hathor')}
                  className="bg-slate-800 hover:bg-amber-950/60 hover:text-amber-400 border border-slate-700/80 hover:border-amber-800/60 text-slate-300 text-3xs font-mono px-2 py-1 rounded"
                >
                  HATHOR GALES
                </button>
                <button
                  onClick={() => onInduceStorm('SHANGO')}
                  className="bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700/80 hover:border-rose-800/60 text-slate-300 text-3xs font-mono px-2 py-1 rounded"
                >
                  SHANGO CYCLONE
                </button>
                <button
                  onClick={() => onInduceStorm('RA')}
                  className="bg-slate-800 hover:bg-blue-950/60 hover:text-blue-400 border border-slate-700/80 hover:border-blue-800/60 text-slate-300 text-3xs font-mono px-2 py-1 rounded"
                >
                  RA ENERGETICS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Detail Control Deck */}
      <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between shadow-2xl">
        <div>
          {/* Detail Panel Header */}
          <div className="pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">TELEMETRY ANALYSIS DECK</h3>
            <p className="text-sm font-sans font-medium text-slate-200 mt-1">
              {selectedShipment ? 'Selected Active Transport' : selectedNode ? 'Selected Constellation Node' : 'Select any map point for analysis'}
            </p>
          </div>

          {/* Scenario A: Selected Shipment Details */}
          {selectedShipment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-display font-medium text-teal-400">{selectedShipment.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  selectedShipment.type === 'Critical' 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800/60' 
                    : selectedShipment.type === 'Climate-Sensitive'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {selectedShipment.type.toUpperCase()}
                </span>
              </div>

              <div className="bg-[#050608] p-3 rounded-lg border border-slate-800/60 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin Node:</span>
                  <span className="text-slate-300">{nodes.find(n => n.id === selectedShipment.originId)?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Node:</span>
                  <span className="text-slate-300">{nodes.find(n => n.id === selectedShipment.destinationId)?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resource payload:</span>
                  <span className="text-teal-400 font-semibold">{selectedShipment.cargo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Load Factor:</span>
                  <span className="text-slate-400">{selectedShipment.cargoLoad}% capacity</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ship Velocity:</span>
                  <span className="text-teal-400">{selectedShipment.speed.toFixed(1)}x Warp Speed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cycle ETA:</span>
                  <span className="text-emerald-400">{selectedShipment.eta} standard cycles</span>
                </div>
              </div>

              {/* Transit Progress Bar */}
              <div>
                <div className="flex justify-between text-2xs font-mono text-slate-500 mb-1.5">
                  <span>TRANSIT SEQUENCE</span>
                  <span>{selectedShipment.progress}% COMPLETE</span>
                </div>
                <div className="w-full bg-[#050608] rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-[#0e7490] h-full rounded-full transition-all duration-300"
                    style={{ width: `${selectedShipment.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={() => onBoostShipment(selectedShipment.id)}
                  className="w-full bg-gradient-to-r from-teal-950 to-[#0c4a6e]/40 hover:from-teal-900 hover:to-[#0c4a6e]/60 border border-teal-800/60 text-teal-300 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all active:translate-y-0.5"
                >
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  TRIGGER VELOCITY BOOST (+0.5x)
                </button>
              </div>
            </div>
          ) : selectedNode ? (
            /* Scenario B: Selected Node Details */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-display font-medium text-white">{selectedNode.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded uppercase">
                  {selectedNode.system} Node
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed bg-[#050608] p-3 rounded-lg border border-slate-800/40">
                {selectedNode.description}
              </p>

              {/* Stock Management Metrics */}
              <div className="bg-[#050608] p-3 rounded-lg border border-slate-800/60 space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-2xs mb-1">
                    <span className="text-slate-500">STORAGE RECOVERY STATUS</span>
                    <span className="text-slate-300">
                      {selectedNode.currentStock} / {selectedNode.maxCapacity} Units
                    </span>
                  </div>
                  <div className="w-full bg-[#050608] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedNode.currentStock / selectedNode.maxCapacity < 0.35
                          ? 'bg-rose-500'
                          : 'bg-teal-500'
                      }`}
                      style={{ width: `${(selectedNode.currentStock / selectedNode.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Primary Product:</span>
                  <span className="text-teal-400 font-medium">{selectedNode.criticalResource}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Demand Stream:</span>
                  <span className={`capitalize font-medium ${
                    selectedNode.demandTrend === 'rising'
                      ? 'text-rose-400'
                      : selectedNode.demandTrend === 'stable'
                      ? 'text-teal-400'
                      : 'text-emerald-400'
                  }`}>
                    {selectedNode.demandTrend} vector
                  </span>
                </div>
              </div>

              {/* Deploy Supply Drop */}
              <div className="pt-2">
                <p className="text-2xs font-mono text-slate-500 mb-2 uppercase">Core Inter-System Integration</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const other = nodes.find(n => n.id !== selectedNode.id);
                      if (other) onDeploySupplyCrate(selectedNode.id, other.id);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 py-2 px-1 rounded text-3xs font-mono border border-slate-700 transition"
                  >
                    DISPATCH CARGO OUT
                  </button>
                  <button
                    onClick={() => {
                      const other = nodes.find(n => n.id !== selectedNode.id);
                      if (other) onDeploySupplyCrate(other.id, selectedNode.id);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 py-2 px-1 rounded text-3xs font-mono border border-slate-700 transition"
                  >
                    REQUEST CARGO IN
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Scenario C: Default view */
            <div className="space-y-4 text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[#050608] flex items-center justify-center mx-auto border border-slate-800">
                <Navigation className="w-5 h-5 text-slate-500 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Awaiting Coordinate Select</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                  Select any active freighter path or planetary node model coordinates on the tactical overlay grid to trigger core data telemetry.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Constellation Weather warning status */}
        <div className="mt-6 pt-4 border-t border-slate-800 bg-[#050608]/40 p-3 rounded-lg flex items-start gap-2.5">
          {activeStormSector ? (
            <>
              <ShieldAlert className="w-5 h-5 text-rose-500 flex-shrink-0 animate-bounce" />
              <div>
                <p className="text-xs font-semibold text-rose-400">ACTIVE HAZARD WARNING</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Ion gales are hindering logistics streams matching the {activeStormSector} sector. Ship ETAs may experience buffer lag.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertOctagon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest font-mono">CONSTELLATION HEALTH: SECURE</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  All interstellar flight vectors are clear. Standard lightspeed multipliers remain fully operational.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
