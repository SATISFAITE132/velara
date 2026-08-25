'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { mockDiscounts } from '@/data/admin-mock';
import { Discount } from '@/lib/types';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Discounts</h1>
        <button onClick={() => setShowNew(true)} className="btn-primary py-2.5 px-5 text-xs"><Plus size={15} /> New Code</button>
      </div>
      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
              <th className="p-4">Code</th><th className="p-4">Type</th><th className="p-4">Value</th><th className="p-4">Used</th><th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30">
                <td className="p-4 font-mono font-medium">{d.code}</td>
                <td className="p-4 capitalize text-obsidian/60">{d.type}</td>
                <td className="p-4">{d.type === 'percentage' ? `${d.value}%` : `$${d.value}`}</td>
                <td className="p-4">{d.usageCount}{d.usageLimit ? ` / ${d.usageLimit}` : ''}</td>
                <td className="p-4"><StatusBadge status={d.active ? 'active' : 'inactive'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-6">
          <div className="bg-cream max-w-sm w-full p-8 relative">
            <button onClick={() => setShowNew(false)} className="absolute top-5 right-5" aria-label="Close"><X size={20} /></button>
            <h2 className="font-display text-2xl mb-6">New Discount Code</h2>
            <div className="space-y-4">
              <input placeholder="CODE" className="input-field uppercase" />
              <div className="grid grid-cols-2 gap-4">
                <select className="input-field"><option>Percentage</option><option>Fixed</option></select>
                <input type="number" placeholder="Value" className="input-field" />
              </div>
            </div>
            <button className="btn-primary w-full mt-8" onClick={() => setShowNew(false)}>Create Code</button>
          </div>
        </div>
      )}
    </div>
  );
}
