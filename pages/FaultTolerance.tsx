import React from 'react';
import { ShieldCheck, ShieldAlert, XCircle } from 'lucide-react';
import { RAID_DATA } from '../types';

export const FaultTolerance: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">RAID Fault Tolerance Guide</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Understanding how many drives can fail before you lose data is critical for disaster planning.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(RAID_DATA).map((raid) => (
          <div key={raid.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-1 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-200"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">{raid.id}</h3>
                {raid.minDrives === 0 ? (
                    <XCircle className="text-red-500" />
                ) : raid.id === 'RAID 6' || raid.id === 'RAID 60' ? (
                    <ShieldCheck className="text-emerald-600" />
                ) : (
                    <ShieldAlert className="text-amber-500" />
                )}
              </div>
              
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Survival Limit</span>
                <p className="text-lg font-medium text-slate-900 mt-1">{raid.faultToleranceDesc}</p>
              </div>

              <div className="space-y-3">
                <div className="text-sm">
                   <span className="text-slate-500 block mb-1">Risk Profile:</span>
                   {raid.id === 'RAID 0' ? (
                     <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Extreme Risk</span>
                   ) : raid.id === 'RAID 5' ? (
                     <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Moderate Risk</span>
                   ) : (
                     <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">Low Risk</span>
                   )}
                </div>
                <p className="text-sm text-slate-600 italic">
                  Min drives required: {raid.minDrives}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Important Note on Rebuilds</h2>
        <p className="text-blue-800 leading-relaxed">
          Fault tolerance refers to drives failing <em>simultaneously</em>. However, the most dangerous time for a RAID array is during the <strong>rebuild process</strong>. 
          When a drive fails in RAID 5, replacing it forces the array to read every sector of the remaining drives to rebuild the missing data. 
          This intensive workload can cause a second, aging drive to fail (URE - Unrecoverable Read Error), leading to total array loss. 
          This is why <strong>RAID 6</strong> is highly recommended for modern large-capacity drives.
        </p>
      </div>
    </div>
  );
};
