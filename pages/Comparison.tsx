import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateRaid } from '../utils/raidCalculations';
import { RaidLevel, RaidConfig, RAID_DATA } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export const Comparison: React.FC = () => {
  const [items, setItems] = useState<RaidConfig[]>([
    { level: 'RAID 5', diskCount: 4, diskSize: 4, diskSizeUnit: 'TB' },
    { level: 'RAID 10', diskCount: 4, diskSize: 4, diskSizeUnit: 'TB' },
    { level: 'RAID 6', diskCount: 4, diskSize: 4, diskSizeUnit: 'TB' }
  ]);

  const addRow = () => {
    setItems([...items, { level: 'RAID 0', diskCount: 4, diskSize: 4, diskSizeUnit: 'TB' }]);
  };

  const removeRow = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, field: keyof RaidConfig, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  };

  const results = items.map((config, idx) => {
    const res = calculateRaid(config);
    return {
      name: `Config ${idx + 1}: ${config.level}`,
      Usable: res.usable,
      Protection: res.protection,
      Unused: res.unused,
      config
    };
  });

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">RAID Comparison Tool</h1>
        <p className="text-slate-600">Compare up to 5 different configurations to find the perfect balance of redundancy and capacity.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Config</th>
                <th className="px-6 py-3">RAID Level</th>
                <th className="px-6 py-3">Drives</th>
                <th className="px-6 py-3">Drive Size (TB)</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Config {idx + 1}</td>
                  <td className="px-6 py-4">
                    <select
                      value={item.level}
                      onChange={(e) => updateRow(idx, 'level', e.target.value)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    >
                      {Object.keys(RAID_DATA).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                     <input
                      type="number"
                      min="2"
                      max="24"
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg w-20 p-2"
                      value={item.diskCount}
                      onChange={(e) => updateRow(idx, 'diskCount', parseInt(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4">
                     <input
                      type="number"
                      min="0.1"
                      className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg w-24 p-2"
                      value={item.diskSize}
                      onChange={(e) => updateRow(idx, 'diskSize', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeRow(idx)} disabled={items.length === 1} className="text-red-500 hover:text-red-700 disabled:opacity-30">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length < 5 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button onClick={addRow} className="flex items-center text-primary-600 font-medium hover:text-primary-800">
              <Plus size={18} className="mr-1" /> Add Configuration
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
          <h3 className="text-lg font-bold mb-4">Capacity Comparison (TB)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={results}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Usable" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Protection" stackId="a" fill="#10b981" />
              <Bar dataKey="Unused" stackId="a" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Detailed Analysis</h3>
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {results.map((res, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-1">{res.name}</h4>
                <div className="grid grid-cols-2 text-sm gap-2">
                  <span className="text-slate-500">Usable:</span>
                  <span className="font-medium">{res.Usable.toFixed(2)} TB</span>
                  <span className="text-slate-500">Efficiency:</span>
                  <span className="font-medium">{((res.Usable / (res.Usable + res.Protection + res.Unused)) * 100).toFixed(1)}%</span>
                  <span className="text-slate-500">Fault Tolerance:</span>
                  <span className="font-medium text-emerald-600">{RAID_DATA[res.config.level as RaidLevel].faultToleranceDesc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
