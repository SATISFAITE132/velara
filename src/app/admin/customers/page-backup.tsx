'use client';
import { mockCustomers } from '@/data/admin-mock';

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>
      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
              <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Orders</th><th className="p-4">Total Spent</th><th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map((c) => (
              <tr key={c.id} className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30">
                <td className="p-4 font-medium">{c.fullName}</td>
                <td className="p-4 text-obsidian/60">{c.email}</td>
                <td className="p-4">{c.orders}</td>
                <td className="p-4">${c.totalSpent.toFixed(2)}</td>
                <td className="p-4 text-obsidian/60">{c.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
