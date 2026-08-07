import React, { useState } from 'react';
import { Mail, ShieldCheck, X, Terminal, Radio } from 'lucide-react';

interface ContactHapiProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLog: (msg: string) => void;
}

export default function ContactHapi({ isOpen, onClose, onSubmitLog }: ContactHapiProps) {
  const [formData, setFormData] = useState({
    name: '',
    channel: '',
    sector: 'PTah Celestial',
    priority: 'Standard',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checksum, setChecksum] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate HAPI coordinate transmission
    setTimeout(() => {
      const generatedChecksum = 'HAPI-TX-' + Math.floor(100000 + Math.random() * 900000);
      setChecksum(generatedChecksum);
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSubmitLog(
        `Priority channel handoff: ${formData.priority} distribution request routed via ${formData.channel} channel (Tx: ${generatedChecksum}).`
      );
    }, 1200);
  };

  const resetForm = () => {
    setFormData({ name: '', channel: '', sector: 'PTah Celestial', priority: 'Standard', message: '' });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608]/90 backdrop-blur-sm p-4 font-sans">
      <div 
        className="w-full max-w-lg bg-[#07090d] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl relative"
        id="contact-terminal-window"
      >
        {/* Terminal Header Bar */}
        <div className="bg-[#050608] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-slate-300">SECURE LOGISTICS HANDOFF • TERMINAL</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 leading-normal">
                  Dispatch communication requests, material routing inquiries, or synchronization handshakes directly to HAPI orchestrator nodes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Operator Name */}
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono uppercase tracking-wider text-slate-500">Operator Identity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Officer Hathor-4"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#050608] text-slate-100 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/80 font-mono"
                  />
                </div>

                {/* Return Coordinate channel */}
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono uppercase tracking-wider text-slate-500">Return Channel</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. secure-net://0087.net"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full bg-[#050608] text-slate-100 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/80 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Sector target */}
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono uppercase tracking-wider text-slate-500">Target Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full bg-[#050608] text-slate-100 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/80 font-mono"
                  >
                    <option>PTah Celestial</option>
                    <option>Hathor Extraction</option>
                    <option>MAMI_WATA Liquids</option>
                    <option>SHANGO Climatology</option>
                    <option>RA power cells</option>
                  </select>
                </div>

                {/* Priority Status */}
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono uppercase tracking-wider text-slate-500">Emergency Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#050608] text-slate-100 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/80 font-mono"
                  >
                    <option>Standard</option>
                    <option>Critical</option>
                    <option>Emergency System Sync</option>
                  </select>
                </div>
              </div>

              {/* Secure message */}
              <div className="space-y-1.5">
                <label className="text-2xs font-mono uppercase tracking-wider text-slate-500">Routing Query Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail logistics issues, resource shortages, or node replenishment plans..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#050608] text-slate-100 text-xs px-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-teal-500/80 resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-teal-600 to-[#0e7490] hover:from-teal-500 hover:to-[#155e75] text-white py-2.5 rounded text-xs font-mono tracking-widest font-medium transition active:translate-y-0.5 disabled:opacity-55"
              >
                {isSubmitting ? 'TRANSMITTING COGNITIVE METRIC...' : 'INITIATE ROUTING STACK DISPATCH'}
              </button>
            </form>
          ) : (
            /* Submission Success Screen */
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-800 text-teal-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-display font-medium text-slate-100">TRANSMISSION ESTABLISHED</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                  Your logistical inquiry has successfully passed HAPI digital coordinate handshakes and is now queued.
                </p>
              </div>

              {/* Telemetry log code display */}
              <div className="bg-[#050608] p-4 rounded-lg border border-slate-800 text-left font-mono text-[10px] space-y-1 text-teal-400 max-w-sm mx-auto">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TRANSMIND LOGS:</span>
                </div>
                <p><span className="text-slate-600">&gt; Status:</span> COMPLETED</p>
                <p><span className="text-slate-600">&gt; Sector:</span> {formData.sector.toUpperCase()}</p>
                <p><span className="text-slate-600">&gt; Checksum:</span> {checksum}</p>
                <p><span className="text-slate-600">&gt; Pipeline:</span> {formData.channel}</p>
                <p><span className="text-slate-600">&gt; Code:</span> SIG-SECURE-200</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs px-5 py-2 rounded-lg border border-slate-700 transition"
                >
                  DISMISS TERMINAL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
