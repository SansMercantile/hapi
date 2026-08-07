import React, { useState } from 'react';
import { 
  Car, 
  Truck, 
  Orbit, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Gauge, 
  Zap, 
  Wrench, 
  HelpCircle, 
  Shuffle, 
  Sparkles, 
  Check, 
  ChevronRight,
  Database,
  RefreshCw
} from 'lucide-react';

interface QuantumVehicle {
  id: string;
  name: string;
  class: 'personal' | 'commercial' | 'industrial';
  propulsion: string;
  speedMultiplier: number;
  antiGravLevel: number;
  neuralSyncStatus: boolean;
  stabilizerActive: boolean;
  status: 'Cruising' | 'Hyper-Warp' | 'Staged' | 'Orbital Entry';
  currentEfficiency: number;
  payload: string;
}

const INITIAL_QUANTUM_VEHICLES: QuantumVehicle[] = [
  // Personal vehicles
  {
    id: 'q-pers-1',
    name: 'Zephyr Hoverpod V-1',
    class: 'personal',
    propulsion: 'Quantum Lock Levitation',
    speedMultiplier: 12,
    antiGravLevel: 85,
    neuralSyncStatus: true,
    stabilizerActive: true,
    status: 'Cruising',
    currentEfficiency: 98.4,
    payload: 'Executive Dispatch / Personal commuter'
  },
  {
    id: 'q-pers-2',
    name: 'Aether Slide Mk-IX',
    class: 'personal',
    propulsion: 'Sub-Grid Density Folding',
    speedMultiplier: 25,
    antiGravLevel: 95,
    neuralSyncStatus: false,
    stabilizerActive: true,
    status: 'Cruising',
    currentEfficiency: 92.1,
    payload: 'Sub-sector fast-transit commuter'
  },
  // Commercial vehicles
  {
    id: 'q-comm-1',
    name: 'Atmos Hypersonic Carrier 08',
    class: 'commercial',
    propulsion: 'Repulsor Wave Induction',
    speedMultiplier: 45,
    antiGravLevel: 60,
    neuralSyncStatus: true,
    stabilizerActive: false,
    status: 'Hyper-Warp',
    currentEfficiency: 89.7,
    payload: '8.4t Medical isotopes & food-caps'
  },
  {
    id: 'q-comm-2',
    name: 'Matter-vane Slingshot V',
    class: 'commercial',
    propulsion: 'Relativistic Particle Streamer',
    speedMultiplier: 70,
    antiGravLevel: 45,
    neuralSyncStatus: true,
    stabilizerActive: true,
    status: 'Orbital Entry',
    currentEfficiency: 94.6,
    payload: 'Heavy machinery parts & electronic blocks'
  },
  // Industrial vehicles
  {
    id: 'q-ind-1',
    name: 'Tectonic Dark-Matter Hauler',
    class: 'industrial',
    propulsion: 'Asymmetric Gravitational Dipole',
    speedMultiplier: 80,
    antiGravLevel: 98,
    neuralSyncStatus: true,
    stabilizerActive: true,
    status: 'Hyper-Warp',
    currentEfficiency: 99.2,
    payload: '450t Titanium architectural beams'
  },
  {
    id: 'q-ind-2',
    name: 'Aurelia Orbital Drop-Rig',
    class: 'industrial',
    propulsion: 'Zero-Point Mass Nullifier',
    speedMultiplier: 95,
    antiGravLevel: 100,
    neuralSyncStatus: false,
    stabilizerActive: true,
    status: 'Staged',
    currentEfficiency: 97.8,
    payload: 'Cryogenic fuel cores'
  }
];

interface QuantumTransportsProps {
  onAddLog: (system: 'HAPI Core' | 'PTah' | 'Hathor' | 'MAMI_WATA' | 'SHANGO' | 'RA', type: 'info' | 'warning' | 'success', message: string) => void;
}

export default function QuantumTransports({ onAddLog }: QuantumTransportsProps) {
  const [vehicles, setVehicles] = useState<QuantumVehicle[]>(INITIAL_QUANTUM_VEHICLES);
  const [activeTab, setActiveTab] = useState<'personal' | 'commercial' | 'industrial'>('commercial');
  
  // Registration form state
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState<'personal' | 'commercial' | 'industrial'>('personal');
  const [newPropulsion, setNewPropulsion] = useState('Quantum Lock Levitation');
  const [newPayload, setNewPayload] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Dynamic Routing simulation state
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routingSuccess, setRoutingSuccess] = useState(false);
  const [quantumLogs, setQuantumLogs] = useState<string[]>([
    'INTELLISENSE SYSTEM: Quantum transport overlay activated.',
    'FLEET STATUS: 6 neural-entangled hulls detected on deep planetary grid.'
  ]);

  // Handle module toggle
  const toggleVehicleModule = (vId: string, moduleType: 'neural' | 'stabilizer') => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vId) {
        const updated = { ...v };
        if (moduleType === 'neural') {
          updated.neuralSyncStatus = !v.neuralSyncStatus;
          const statusMsg = updated.neuralSyncStatus ? 'CONNECTED' : 'DISCHARGED';
          addQuantumLog(`TELEMETRY: Vehicle ${v.name} neural sync link established to HAPI core - [${statusMsg}]`);
          onAddLog('HAPI Core', 'info', `AI quantum interlock initialized for ship ${v.name}. Synchronization: ${statusMsg}.`);
        } else {
          updated.stabilizerActive = !v.stabilizerActive;
          const statusMsg = updated.stabilizerActive ? 'ENGAGED' : 'DISENGAGED';
          addQuantumLog(`TELEMETRY: Inertial warp stabilizer ${statusMsg} on ${v.name}.`);
          onAddLog('HAPI Core', 'success', `Manually adjusted warp stabilizers on ${v.name} to ${statusMsg}.`);
        }
        
        // Recalculate efficiency dynamically
        let bonus = 0;
        if (updated.neuralSyncStatus) bonus += 3.5;
        if (updated.stabilizerActive) bonus += 2.0;
        updated.currentEfficiency = Math.min(100, Math.max(75, 85 + bonus + (updated.antiGravLevel * 0.1)));
        return updated;
      }
      return v;
    }));
  };

  // Add helper for component internal logs
  const addQuantumLog = (msg: string) => {
    const ts = new Date().toISOString().substring(11, 19);
    setQuantumLogs(prev => [`[${ts}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Handle register transport
  const handleRegisterUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newUnit: QuantumVehicle = {
      id: `q-registered-${Date.now()}`,
      name: newName,
      class: newClass,
      propulsion: newPropulsion,
      speedMultiplier: Math.round(15 + Math.random() * 80),
      antiGravLevel: Math.round(50 + Math.random() * 50),
      neuralSyncStatus: true,
      stabilizerActive: true,
      status: 'Staged',
      currentEfficiency: 95.5,
      payload: newPayload || 'General support payload'
    };

    setVehicles(prev => [...prev, newUnit]);
    setActiveTab(newClass);
    setIsRegistering(false);
    
    // Reset inputs
    setNewName('');
    setNewPayload('');

    addQuantumLog(`REGISTRY: New ${newClass} vehicle successfully initialized: ${newUnit.name}`);
    onAddLog('HAPI Core', 'success', `Custom 50-Yr futuristic transport ${newUnit.name} linked. Propelled via ${newPropulsion}.`);
  };

  // Dynamic AI routing execution simulation
  const triggerQuantumWaveRouting = () => {
    setIsCalculatingRoute(true);
    setRoutingSuccess(false);
    addQuantumLog('AI DECISION: Triggering Quantum Wave routing for transportation sectors...');
    
    setTimeout(() => {
      addQuantumLog('RESOLVING COMPILER FIELDS: Entangling sub-grid traffic matrices.');
    }, 1000);

    setTimeout(() => {
      addQuantumLog('HARMONIZING VECTORS: Friction dampening mapped for 100% of fleet.');
    }, 2000);

    setTimeout(() => {
      setIsCalculatingRoute(false);
      setRoutingSuccess(true);
      addQuantumLog('SUCCESS: Fleet coordinates realigned instantly. System latency decreased by 42ms. Cargo travel speeds optimized.');
      
      // Upgrade speed multipliers momentarily
      setVehicles(prev => prev.map(v => ({
        ...v,
        speedMultiplier: Math.min(120, v.speedMultiplier + 5),
        currentEfficiency: Math.min(100, v.currentEfficiency + 2.5)
      })));

      onAddLog('HAPI Core', 'success', 'Quantum Route Wave Solver successfully aligned. Localized transport pathways resolved to sub-millisecond precision.');
    }, 3200);
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => v.class === activeTab);

  return (
    <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-5 shadow-2xl relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Panel Title & Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-teal-400 animate-spin" style={{ animationDuration: '40s' }} />
            <h2 className="text-lg font-display font-medium tracking-wide text-white uppercase">QUANTUM NEURAL FLEET SYNC</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            AI-driven spatial transport matrix managing <strong className="text-teal-400 font-semibold font-mono">Personal Entangled Cars</strong>, <strong className="text-teal-400 font-semibold font-mono">Commercial Hyper-vessels</strong>, and <strong className="text-teal-400 font-semibold font-mono">Industrial Gravity-Locked Megas</strong>. Fits logistics 50 years ahead of terrestrial architectures.
          </p>
        </div>

        {/* Tactical Command Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerQuantumWaveRouting}
            disabled={isCalculatingRoute}
            className="bg-gradient-to-r from-teal-950 to-[#0e7490]/40 hover:from-teal-900 hover:to-[#0e7490]/60 border border-teal-500/30 text-teal-300 px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all flex items-center gap-2 active:translate-y-0.5 disabled:opacity-50"
          >
            {isCalculatingRoute ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                DILATING GRID COGNITIVE WAVE...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                INITIATE QUANTUM WAVE ROUTING
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Left - Fleet Control Tabs & Lists. Right - Tech Telemetry Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Col (span 2): Fleet Registry Dashboard */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Subheader and Registration trigger */}
          <div className="flex items-center justify-between">
            {/* View tabs */}
            <div className="flex gap-1 bg-[#050608] p-1 rounded-lg border border-slate-801/80">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-3 py-1.5 text-3xs font-mono rounded-md font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === 'personal'
                    ? 'bg-teal-950/80 text-teal-300 border border-teal-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                Personal Cars
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`px-3 py-1.5 text-3xs font-mono rounded-md font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === 'commercial'
                    ? 'bg-teal-950/80 text-teal-300 border border-teal-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Commercial Fleet
              </button>
              <button
                onClick={() => setActiveTab('industrial')}
                className={`px-3 py-1.5 text-3xs font-mono rounded-md font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === 'industrial'
                    ? 'bg-teal-950/80 text-teal-300 border border-teal-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Industrial Megalanders
              </button>
            </div>

            {/* Quick Fleet Addition Drawer Button */}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="bg-slate-800/60 text-[10px] text-slate-300 font-mono tracking-wider border border-slate-700/80 px-2.5 py-1 rounded hover:bg-slate-700 hover:text-white transition"
            >
              {isRegistering ? 'X DISMISS NEW UNIT' : '+ AD-HOC VESSEL INTEL'}
            </button>
          </div>

          {/* Quick Registration Form */}
          {isRegistering && (
            <form onSubmit={handleRegisterUnit} className="bg-[#050608] border border-slate-800/80 p-4 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-2">
                <Wrench className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Register Futuristic Transport Unit</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Vehicle Unit Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lev-Chrysler Quantum X"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#07090d] text-slate-200 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/70"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Class category</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value as any)}
                    className="w-full bg-[#07090d] text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-800 focus:outline-none focus:border-teal-500/70"
                  >
                    <option value="personal">Personal Pod / Car (Ultra Fast, Commute Lock)</option>
                    <option value="commercial font-mono">Commercial (Light freight, hover cargo, drone stream)</option>
                    <option value="industrial font-mono">Industrial Cargo (Heavy mass, planetary landing, ore drop)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Propulsion Engine Core</label>
                  <select
                    value={newPropulsion}
                    onChange={(e) => setNewPropulsion(e.target.value)}
                    className="w-full bg-[#07090d] text-slate-300 text-xs px-3 py-1.5 rounded border border-slate-800 focus:outline-none focus:border-teal-500/70"
                  >
                    <option value="Quantum Lock Levitation">Quantum Lock Levitation (Mag-Repelling)</option>
                    <option value="Sub-Space Wave Dilation">Sub-Space Wave Dilation (Inertial fold)</option>
                    <option value="Antimatter Kinetic Core">Antimatter Kinetic Core (Thrust Vector)</option>
                    <option value="Zero-Point Inertia Dampener">Zero-Point Inertia Dampener (Massless)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Simulated Payload / Cargo</label>
                  <input
                    type="text"
                    placeholder="e.g. Heavy structural alloys, local sub-grid commuter..."
                    value={newPayload}
                    onChange={(e) => setNewPayload(e.target.value)}
                    className="w-full bg-[#07090d] text-slate-200 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/70"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-600 to-teal-800 text-white font-mono text-xs px-4 py-2 rounded-lg hover:from-teal-500 hover:to-teal-700 transition"
                >
                  INITIALIZE ENTANGLEMENT LINK
                </button>
              </div>
            </form>
          )}

          {/* List of active futuristic hulls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="bg-[#050608] hover:bg-[#07090d] border border-slate-800/70 rounded-xl p-4 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
              >
                {/* Visual Status Tag */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"></span>
                  <span className="text-3xs font-mono text-slate-400 uppercase">{vehicle.status}</span>
                </div>

                <div className="space-y-3">
                  {/* Vehicle Label */}
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white tracking-wide uppercase">{vehicle.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide font-mono">{vehicle.propulsion}</p>
                  </div>

                  {/* Core stats metric block */}
                  <div className="grid grid-cols-3 gap-2 bg-[#07090d]/85 p-2 rounded-lg border border-slate-800/40 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase block">INTELLISENSE VEL</span>
                      <span className="text-xs text-teal-400 font-bold">{vehicle.speedMultiplier * 10} km/s</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase block">MASS REPEL</span>
                      <span className="text-xs text-[#06b6d4] font-bold">{vehicle.antiGravLevel}% AG</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase block">NET EFFICIENCY</span>
                      <span className="text-xs text-emerald-400 font-bold">{vehicle.currentEfficiency.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Interactively toggle modules */}
                  <div className="space-y-1.5 border-t border-slate-800/60 pt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-teal-400" /> Neural AI Interlock
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVehicleModule(vehicle.id, 'neural')}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded transition ${
                          vehicle.neuralSyncStatus
                            ? 'bg-teal-900/40 text-teal-300 border border-teal-500/25'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-350'
                        }`}
                      >
                        {vehicle.neuralSyncStatus ? 'HIVE_SYNC_ONLINE' : 'BYPASS'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-[#06b6d4]" /> Mass Stabilizer
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVehicleModule(vehicle.id, 'stabilizer')}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded transition ${
                          vehicle.stabilizerActive
                            ? 'bg-sky-950/40 text-sky-300 border border-sky-500/20'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-350'
                        }`}
                      >
                        {vehicle.stabilizerActive ? 'GRAV_LOCK_ACTIVE' : 'DAMPENED'}
                      </button>
                    </div>
                  </div>

                  {/* Payload Details */}
                  <p className="text-[9px] font-mono text-slate-500 text-left truncate leading-tight border-t border-slate-800/40 pt-1.5">
                    PAYLOAD DIRECTIVE: {vehicle.payload}
                  </p>

                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Col: Deep AI Space routing logs / Wave statistics */}
        <div className="bg-[#050608] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-2xs font-mono text-teal-400 font-bold uppercase tracking-wider">HAPI Quantum wave analytics</span>
              <Activity className="w-4.5 h-4.5 text-teal-400 animate-pulse" />
            </div>

            {/* Neural status visualization */}
            <div className="space-y-2 font-mono text-2xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Synchronized Vessels:</span>
                <span className="text-slate-200">{vehicles.length} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Autonomous Neural Sync Ratio:</span>
                <span className="text-teal-400 font-bold">
                  {Math.round((vehicles.filter(v => v.neuralSyncStatus).length / vehicles.length) * 100)}% Sync
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Frictionless Gravitational Locks:</span>
                <span className="text-teal-400 font-bold">
                  {vehicles.filter(v => v.stabilizerActive).length} Hulls
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mean Fleet Speed Factor:</span>
                <span className="text-[#06b6d4] font-semibold">
                  {(vehicles.reduce((acc, current) => acc + current.speedMultiplier, 0) / vehicles.length).toFixed(1)}x Relativity
                </span>
              </div>
            </div>

            {/* Simulated Quantum Graph Layer */}
            <div className="bg-[#07090d] border border-slate-800 rounded-lg p-3 relative h-28 overflow-hidden flex flex-col justify-between">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">AI WAVE PATTERN COMPILATION</span>
              {/* Animated wave lines as futuristic indicator */}
              <div className="absolute inset-x-0 bottom-4 h-12 pointer-events-none opacity-40">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0,20 Q15,4 30,20 T60,20 T100,20" fill="none" stroke="#2dd4bf" strokeWidth="1.5">
                    <animate attributeName="d" values="M0,20 Q15,4 30,20 T60,20 T100,20; M0,20 Q15,36 30,20 T60,20 T100,20; M0,20 Q15,4 30,20 T60,20 T100,20" dur="4s" repeatCount="indefinite" />
                  </path>
                  <path d="M0,20 Q10,30 25,20 T50,20 T100,20" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>
              <div className="text-[9px] font-mono text-teal-400 text-center relative z-10 font-medium">
                {isCalculatingRoute ? "AI NEURAL ENVELOPE COMPUTING CORRELATION..." : "WAVE FIELD IS CURRENTLY COMPATIBLE / STEADY"}
              </div>
            </div>

            {/* Wave logs terminal */}
            <div>
              <span className="text-3xs font-mono text-slate-500 uppercase block mb-1">LOCAL WAVE SYNAPSE JOURNAL</span>
              <div className="bg-[#07090d] p-3 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 h-28 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {quantumLogs.map((log, i) => (
                  <div key={i} className="leading-snug truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 mt-4 text-[10px] font-mono text-slate-500 leading-normal">
            HAPI Quantum Transportation module integrates directly with the deep planetary network, predicting multi-dimensional path conflicts 50 years ahead.
          </div>
        </div>

      </div>
    </div>
  );
}
