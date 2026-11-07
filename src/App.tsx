import React, { useState, useEffect } from 'react';
import { LogisticsNode, Shipment, SystemLog, OperationalMetrics } from './types';
import { INITIAL_NODES, INITIAL_SHIPMENTS, INITIAL_LOGS } from './data';
import Header from './components/Header';
import TacticalMap from './components/TacticalMap';
import ForecastingPanel from './components/ForecastingPanel';
import SystemInterops from './components/SystemInterops';
import ContactHapi from './components/ContactHapi';
import CorridorPanel from './components/CorridorPanel';
import { Terminal, Shield, Cpu, RefreshCw, Layers, Sparkles, Building2, HelpCircle } from 'lucide-react';

export default function App() {
  const [nodes, setNodes] = useState<LogisticsNode[]>(INITIAL_NODES);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('ptah-citadel');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>('ship-001');
  const [activeStormSector, setActiveStormSector] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Operational toggles
  const [hazardAware, setHazardAware] = useState<boolean>(true);
  const [elasticBuffer, setElasticBuffer] = useState<boolean>(true);
  const [crossSync, setCrossSync] = useState<boolean>(true);

  // Dynamic simulation telemetry
  const [directiveCount, setDirectiveCount] = useState<number>(142);

  const globalRiskIndex = activeStormSector ? (hazardAware ? 38 : 65) : 12;
  const transitEfficiency = crossSync ? (activeStormSector ? 88 : 96) : 74;

  const operationalMetrics: OperationalMetrics = {
    totalActiveShipments: shipments.filter((s) => s.status === 'In Transit').length,
    autonomousDirectivesCount: directiveCount,
    averageTransitEfficiency: transitEfficiency,
    globalRiskIndex: globalRiskIndex,
    bufferSafetyMargin: elasticBuffer ? 25 : 10,
    hazardAwareScheduling: hazardAware,
    elasticBufferAllocation: elasticBuffer,
    crossSystemSync: crossSync,
  };

  const addLog = (
    system: SystemLog['system'],
    type: SystemLog['type'],
    message: string
  ) => {
    const time = new Date();
    const ts =
      String(time.getUTCHours()).padStart(2, '0') + ':' +
      String(time.getUTCMinutes()).padStart(2, '0') + ':' +
      String(time.getUTCSeconds()).padStart(2, '0');

    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: ts,
      system,
      type,
      message,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Simulation Loop 1: Increment cargo freighter movements
  useEffect(() => {
    const interval = setInterval(() => {
      setShipments((prevShipments) =>
        prevShipments.map((ship) => {
          if (ship.status === 'Arrived') {
            // After standard cycle rest, reset ship on a new cargo run
            const isStormInTarget = activeStormSector && nodes.find(n => n.id === ship.destinationId)?.system === activeStormSector;
            const newProgress = 0;
            const newSpeed = 1.0 + Math.random() * 0.8;

            // Pick a random product based on current destination
            return {
              ...ship,
              status: 'In Transit',
              progress: newProgress,
              eta: Math.max(2, Math.round(14 / newSpeed)),
              speed: newSpeed,
              activeHazard: isStormInTarget ? `Ion turbulence in ${activeStormSector} sector` : null,
            };
          }

          // Compute new progress delta based on ship speed and potential storms
          const hasSectorStorm = activeStormSector && (
            nodes.find(n => n.id === ship.originId)?.system === activeStormSector ||
            nodes.find(n => n.id === ship.destinationId)?.system === activeStormSector
          );

          // Storm halves progress speed
          const speedMultiplier = hasSectorStorm ? (hazardAware ? 0.35 : 0.8) : 1;
          const advanceAmount = ship.speed * 8.5 * speedMultiplier;
          const updatedProgress = Math.min(100, ship.progress + advanceAmount);

          const isArriving = updatedProgress >= 100;

          if (isArriving) {
            // Statically trigger warehouse update on arrival
            setNodes((prevNodes) =>
              prevNodes.map((node) => {
                if (node.id === ship.destinationId) {
                  const gainedAmount = Math.round(ship.cargoLoad * 1.5);
                  const updatedStock = Math.min(node.maxCapacity, node.currentStock + gainedAmount);
                  return { ...node, currentStock: updatedStock };
                }
                return node;
              })
            );

            // Log the achievement
            const destNode = nodes.find((n) => n.id === ship.destinationId);
            addLog(
              destNode?.system || 'HAPI Core',
              'success',
              `Freighter '${ship.name}' completed vector trajectory. Docked at ${destNode?.name || 'hub'}. Stock increased by ${Math.round(ship.cargoLoad * 1.5)} units.`
            );

            setDirectiveCount((d) => d + 1);

            return {
              ...ship,
              status: 'Arrived',
              progress: 100,
              eta: 0,
            };
          }

          const currentEta = Math.max(1, Math.round((100 - updatedProgress) / advanceAmount));

          return {
            ...ship,
            progress: Math.round(updatedProgress),
            eta: currentEta,
            activeHazard: hasSectorStorm ? `Ion interference` : null,
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [activeStormSector, hazardAware, nodes]);

  // Simulation Loop 2: Passive resource consumption across planetary stations
  useEffect(() => {
    const drainInterval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const drainRate = 10 + Math.floor(Math.random() * 25);
          const currentRating = Math.max(0, node.currentStock - drainRate);

          // Evaluate Auto-Replenishment Thresholds
          const capacityRatio = currentRating / node.maxCapacity;
          if (capacityRatio < 0.25) {
            // Auto dispatch replenishment payload
            const replenishmentBoost = 180;
            const rescuedStock = Math.min(node.maxCapacity, currentRating + replenishmentBoost);

            addLog(
              node.system,
              'warning',
              `Critical storage threshold breached on ${node.name} (${Math.round(capacityRatio * 100)}%). Intelligent HAPI autopilot engaged. Dispatched reserve drone payload.`
            );

            setDirectiveCount((d) => d + 1);

            return {
              ...node,
              currentStock: rescuedStock,
            };
          }

          return {
            ...node,
            currentStock: currentRating,
          };
        })
      );
    }, 10000);

    return () => clearInterval(drainInterval);
  }, []);

  // Handler: Warp Boost speed
  const handleBoostShipment = (shipId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipId) {
          const boostedSpeed = s.speed + 0.5;
          addLog(
            'HAPI Core',
            'info',
            `Manual overcharge directive dispatched to ${s.name}. Warp parameters aligned at ${boostedSpeed.toFixed(1)}x coefficient.`
          );
          setDirectiveCount((d) => d + 1);
          return {
            ...s,
            speed: boostedSpeed,
            progress: Math.min(99, s.progress + 15),
          };
        }
        return s;
      })
    );
  };

  // Handler: Trigger solar storms
  const handleInduceStorm = (sectorName: string) => {
    setActiveStormSector(sectorName);
    addLog(
      sectorName as any,
      'warning',
      `Stellar ion storm reported in proximity to ${sectorName} sector coordinate bounds. Risk multipliers adjusted.`
    );
  };

  const handleClearStorm = () => {
    setActiveStormSector(null);
    addLog(
      'HAPI Core',
      'success',
      `Climatological anomalies neutralized. Space corridors reopened for normal lightspeed operations.`
    );
  };

  // Handler: Manual Replenishment action
  const handleTriggerReplenish = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const supplyCargo = 200;
          const updated = Math.min(n.maxCapacity, n.currentStock + supplyCargo);
          addLog(
            n.system,
            'success',
            `Heavy cargo stage dropped at ${n.name}. Staged payload successfully transferred: +${supplyCargo} supply stock.`
          );
          setDirectiveCount((d) => d + 1);
          return { ...n, currentStock: updated };
        }
        return n;
      })
    );
  };

  // Handler: Deploy custom container cargo from origin to dest
  const handleDeployCrate = (originId: string, destId: string) => {
    const originNode = nodes.find(n => n.id === originId);
    const destNode = nodes.find(n => n.id === destId);

    if (!originNode || !destNode) return;

    if (originNode.currentStock < 100) {
      addLog(
        'HAPI Core',
        'warning',
        `Transit failed. Node ${originNode.name} does not hold sufficient buffer reserve (needs at least 100 units).`
      );
      return;
    }

    // Creating a fresh ad-hoc cargo unit
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newShip: Shipment = {
      id: `ship-user-${Date.now()}`,
      name: `HAPI Cargo-${randomSuffix}`,
      type: 'Standard',
      originId: originId,
      destinationId: destId,
      status: 'In Transit',
      cargo: `${originNode.criticalResource} Buffer`,
      cargoLoad: 90,
      progress: 5,
      eta: 10,
      speed: 1.1,
      activeHazard: null,
    };

    // Decrement origin stockpile
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === originId) {
          return { ...n, currentStock: Math.max(0, n.currentStock - 100) };
        }
        return n;
      })
    );

    setShipments((prev) => [...prev, newShip]);
    setSelectedShipmentId(newShip.id);

    addLog(
      'HAPI Core',
      'info',
      `Manual interlock: Routed ${newShip.cargo} container from ${originNode.name} to ${destNode.name}.`
    );
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 flex flex-col font-sans bg-dot-grid">
      {/* Top Header Bar */}
      <Header
        metrics={operationalMetrics}
        onToggleHazard={() => {
          setHazardAware(!hazardAware);
          addLog('HAPI Core', 'info', `Hazard-aware scheduling algorithm ${!hazardAware ? 'engaged' : 'staged'}.`);
        }}
        onToggleElastic={() => {
          setElasticBuffer(!elasticBuffer);
          addLog('HAPI Core', 'info', `Warehouse safety buffer allocation set to ${!elasticBuffer ? 'Dynamic Elasticity' : 'Fixed Margin'}.`);
        }}
        onToggleSync={() => {
          setCrossSync(!crossSync);
          addLog('HAPI Core', 'info', `Inter-system metadata coordination pathways ${!crossSync ? 'connected' : 'discharged'}.`);
        }}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Core Dashboard Layout */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Intention statement & Intro section */}
        <section className="bg-gradient-to-r from-[#07090d] to-[#0a0c10]/45 border border-slate-800/80 p-6 rounded-xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-3xl space-y-3 font-sans">
            <span className="text-3xs font-mono tracking-widest text-[#2dd4bf] uppercase bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/25 inline-block font-bold">
              SANS MERCANTILE LOGISTICAL NETWORK
            </span>
            <h2 className="text-2xl font-display font-medium tracking-wide text-white">HAPI Logistics Intelligence</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Real logistics-corridor intelligence for African trade. HAPI monitors live conditions at key ports and trade hubs and flags weather-driven disruption risk. Below is our live corridor feed; the orchestration sandbox further down is a concept simulation of the autonomous routing we're building toward (not a live fleet).
            </p>
          </div>
        </section>

        {/* LIVE: Real trade-corridor conditions (Open-Meteo) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">LIVE: REAL CORRIDOR CONDITIONS</h3>
          </div>
          <CorridorPanel />
        </section>

        {/* CONCEPT SIMULATION: orchestration sandbox (not a live fleet) */}
        <section className="space-y-4 pt-2 border-t border-slate-800">
          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider pt-4">▼ Concept simulation (sandbox) — not a live fleet</p>
        </section>

        {/* Level 1 Grid: Map Viewer & side analysis terminal */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">SYS_LEVEL_01: REAL-TIME ORCHESTRATION OVERLAY</h3>
          </div>
          <TacticalMap
            nodes={nodes}
            shipments={shipments}
            selectedNodeId={selectedNodeId}
            selectedShipmentId={selectedShipmentId}
            activeStormSector={activeStormSector}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              setSelectedShipmentId(null);
            }}
            onSelectShipment={(id) => {
              setSelectedShipmentId(id);
              setSelectedNodeId(null);
            }}
            onInduceStorm={handleInduceStorm}
            onClearStorm={handleClearStorm}
            onBoostShipment={handleBoostShipment}
            onDeploySupplyCrate={handleDeployCrate}
          />
        </section>

        {/* Level 2 Grid: Demand Forecasting visualization & telemetry logs */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">SYS_LEVEL_02: DEMAND PREDICTION MODELS</h3>
            </div>
            <ForecastingPanel
              nodes={nodes}
              onTriggerReplenish={handleTriggerReplenish}
              logs={logs.map((l) => l.message)}
              systemLogsTrigger={(message) => addLog('HAPI Core', 'info', message)}
            />
          </div>

          <div className="space-y-4 font-sans">
            {/* Live Telemetry Terminal Logs console */}
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">TELEMETRY STREAM</h3>
            </div>

            <div className="bg-[#07090d] border border-slate-800/80 rounded-xl p-5 h-[340px] flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80 mb-3">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wide font-bold">INTELLIGENCE TERMINAL LOGS</span>
                  </div>

                  {/* Scrollable logs area */}
                  <div className="space-y-3 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-slate-800 pr-1 text-[11px] font-mono">
                    {paveLogsLines(logs)}
                  </div>
                </div>

                {/* Reset or Clear simulation */}
                <div className="pt-3 border-t border-slate-800/60 mt-2 flex items-center justify-between text-3xs text-slate-500 font-mono">
                  <span>HAPI DISPATCH CORE [V2.0]</span>
                  <button
                    onClick={() => {
                      setLogs(INITIAL_LOGS);
                      setNodes(INITIAL_NODES);
                      setShipments(INITIAL_SHIPMENTS);
                      setActiveStormSector(null);
                    }}
                    className="text-teal-400 hover:text-teal-300 hover:underline transition font-bold"
                    title="Reset all stockpile records and flight vectors to default"
                  >
                    RESET SYSTEM DB
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Level 3: Constellation Integration Cloud & Faction blocks */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">SYS_LEVEL_03: INTER-CONSTELLATION SYNC</h3>
          </div>
          <SystemInterops onAddLog={addLog} />
        </section>
      </main>

      {/* Corporate/Constellation Footer */}
      <footer className="bg-[#0a0c10] border-t border-slate-800/85 py-8 px-6 mt-16 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse"></div>
              <span className="text-slate-300 font-display font-semibold tracking-wider">HAPI SYSTEM</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              &copy; 2026 HAPI Supply Chain Intelligence • Part of Sans Mercantile Constellation. 
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[10px]">
            <a 
              href="https://sansmercantile.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-teal-400 transition-colors flex items-center gap-1 border-b border-transparent hover:border-teal-400/35"
            >
              sansmercantile.com
            </a>
            <a 
              href="https://hapi.sansmercantile.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-teal-400 transition-colors flex items-center gap-1 border-b border-transparent hover:border-teal-400/35"
            >
              hapi.sansmercantile.com
            </a>
            <button
              onClick={() => setIsContactOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Division
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Contact Terminal Slideover */}
      <ContactHapi
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onSubmitLog={(message) => addLog('HAPI Core', 'info', message)}
      />
    </div>
  );
}

// Visual Helper to layout terminal entries gracefully without emojis
function paveLogsLines(logs: SystemLog[]) {
  return logs.map((log) => {
    let tagColor = 'text-blue-400';
    let label = '[INFO]';
    if (log.type === 'warning') {
      tagColor = 'text-amber-500';
      label = '[WARN]';
    } else if (log.type === 'success') {
      tagColor = 'text-emerald-400';
      label = '[OK]';
    }

    return (
      <div key={log.id} className="leading-relaxed border-b border-slate-900/40 pb-2">
        <div className="flex justify-between items-center text-3xs text-slate-500">
          <span>{log.timestamp} • {log.system.toUpperCase()}</span>
          <span className={`${tagColor} font-bold`}>{label}</span>
        </div>
        <p className="text-slate-300 mt-0.5 leading-snug">{log.message}</p>
      </div>
    );
  });
}
