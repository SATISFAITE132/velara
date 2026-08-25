'use client';
import { useState } from 'react';
import { mockOrders } from '@/data/admin-mock';
import { Search } from 'lucide-react';

export default function AdminOrdersPage() {
  const [query, setQuery] = useState('');
  const filtered = mockOrders.filter(
    (o) => o.orderNumber.toLowerCase().includes(query.toLowerCase()) || o.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Orders</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders…"
            className="input-field pl-9 py-2.5 w-64"
          />
        </div>
      </div>

      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30">
                <td className="p-4 font-medium">{o.orderNumber}</td>
                <td className="p-4 text-obsidian/60">{o.email}</td>
                <td className="p-4 text-obsidian/60">{o.createdAt}</td>
                <td className="p-4">
                  <select
                    defaultValue={o.status}
                    className="bg-transparent text-xs border border-obsidian/15 rounded-full px-2 py-1 capitalize focus:outline-none"
                  >
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right font-medium">${o.total.toFixed(2)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-obsidian/40">No orders match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
