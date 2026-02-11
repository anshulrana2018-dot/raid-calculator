import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { HardDrive, AlertTriangle, Zap, Server, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { RAID_DATA, RaidLevel, RaidConfig, RaidCalculationResult } from '../types';
import { calculateRaid } from '../utils/raidCalculations';
import { getRaidAdvice } from '../services/gemini';

const LEVELS: RaidLevel[] = ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'RAID 10', 'RAID 50', 'RAID 60'];

export const Calculator: React.FC = () => {
  const [config, setConfig] = useState<RaidConfig>({
    level: 'RAID 5',
    diskCount: 4,
    diskSize: 4,
    diskSizeUnit: 'TB'
  });

  const [result, setResult] = useState<RaidCalculationResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setResult(calculateRaid(config));
    setAiAdvice(''); // Reset advice on change
  }, [config]);

  const handleAiAsk = async () => {
    setLoadingAi(true);
    const advice = await getRaidAdvice(config);
    setAiAdvice(advice);
    setLoadingAi(false);
  };

  const chartData = result ? [
    { name: 'Usable Storage', value: result.usable, color: '#3b82f6' },
    { name: 'Protection/Parity', value: result.protection, color: '#10b981' },
    { name: 'Unused/Lost', value: result.unused, color: '#94a3b8' }
  ].filter(d => d.value > 0) : [];

  const meta = RAID_DATA[config.level];
  const isInvalid = config.diskCount < meta.minDrives;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">RAID Calculator</h1>
        <p className="text-lg text-slate-600">
          Visualize capacity, speed, and fault tolerance for your storage array.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2 text-primary-600" /> Configuration
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RAID Level</label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                    value={config.level}
                    onChange={(e) => setConfig({ ...config, level: e.target.value as RaidLevel })}
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Drives</label>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={config.diskCount}
                  onChange={(e) => setConfig({ ...config, diskCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between mt-2">
                  <input
                    type="number"
                    min="1"
                    className="w-20 p-1 border rounded text-center"
                    value={config.diskCount}
                    onChange={(e) => setConfig({ ...config, diskCount: parseInt(e.target.value) || 0 })}
                  />
                  <span className="text-xs text-slate-500 pt-2">Min: {meta.minDrives}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Drive Size</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={config.diskSize}
                    onChange={(e) => setConfig({ ...config, diskSize: parseFloat(e.target.value) || 0 })}
                    className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
                  />
                  <select
                    value={config.diskSizeUnit}
                    onChange={(e) => setConfig({ ...config, diskSizeUnit: e.target.value as any })}
                    className="w-20 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
                  >
                    <option value="TB">TB</option>
                    <option value="GB">GB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
              </div>
            </div>

            {isInvalid && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>RAID {config.level.split(' ')[1]} requires at least {meta.minDrives} drives.</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-indigo-900 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" /> AI Advisor
              </h2>
              <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">Gemini</span>
            </div>
            
            {aiAdvice ? (
              <div className="text-sm text-indigo-800 bg-white/60 p-4 rounded-lg leading-relaxed whitespace-pre-line">
                {aiAdvice}
              </div>
            ) : (
              <p className="text-sm text-indigo-600 mb-4">
                Not sure if this configuration is right for you? Ask our AI storage expert for a quick analysis.
              </p>
            )}

            {!aiAdvice && (
              <button
                onClick={handleAiAsk}
                disabled={loadingAi || isInvalid}
                className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loadingAi ? 'Analyzing...' : 'Get AI Opinion'}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Usable Capacity</h3>
              <p className="text-3xl font-bold text-primary-600">{result?.readableUsable}</p>
              <p className="text-xs text-slate-400 mt-1">{result?.efficiency.toFixed(1)}% Efficiency</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Fault Tolerance</h3>
              <p className="text-xl font-bold text-slate-800 mt-1">{result?.faultTolerance}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Performance</h3>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="text-center">
                  <span className="block text-xs text-slate-400">Read</span>
                  <span className="font-semibold text-emerald-600">{result?.readSpeed}</span>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center">
                  <span className="block text-xs text-slate-400">Write</span>
                  <span className="font-semibold text-amber-600">{result?.writeSpeed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
             <h2 className="text-lg font-semibold mb-6">Storage Allocation</h2>
             <div className="flex flex-col md:flex-row items-center">
               <div className="h-64 w-full md:w-1/2">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={chartData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip 
                       formatter={(value: number) => formatValue(value)}
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="w-full md:w-1/2 space-y-4 md:pl-8">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: d.color }}></div>
                        <span className="font-medium text-slate-700">{d.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatValue(d.value)} TB</span>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          {/* Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h2 className="text-xl font-bold mb-4">{meta.name}</h2>
             <p className="text-slate-600 mb-6 leading-relaxed">{meta.description}</p>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-semibold text-emerald-700 mb-2 flex items-center">
                   <CheckCircle2 className="w-4 h-4 mr-2" /> Pros
                 </h3>
                 <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
                   {meta.pros.map((p, i) => <li key={i}>{p}</li>)}
                 </ul>
               </div>
               <div>
                 <h3 className="font-semibold text-amber-700 mb-2 flex items-center">
                   <AlertTriangle className="w-4 h-4 mr-2" /> Cons
                 </h3>
                 <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
                   {meta.cons.map((c, i) => <li key={i}>{c}</li>)}
                 </ul>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for tooltip
const formatValue = (v: number) => {
  if (v >= 1) return `${v.toFixed(2)}`;
  return `${v.toFixed(3)}`;
};
