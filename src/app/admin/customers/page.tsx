'use client';

import { useEffect, useState } from 'react';

type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  orders: number;
  totalSpent: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCustomers() {
    try {
      const response = await fetch('/api/admin/customers');

      if (!response.ok) {
        throw new Error('Could not load customers');
      }

      const data = await response.json();

     setCustomers(
  data.map((customer: any) => ({
    ...customer,
    orders: Number(customer.orders || 0),
    totalSpent: Number(customer.totalSpent || 0),
  }))
);
    } catch (error) {
      console.error('Customers error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>

      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-obsidian/40">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-obsidian/40">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30"
                >
                  <td className="p-4 font-medium">{c.full_name}</td>

                  <td className="p-4 text-obsidian/60">
                    {c.email}
                  </td>

                  <td className="p-4">
                    {c.orders}
                  </td>

                  <td className="p-4">
                    ${c.totalSpent.toFixed(2)}
                  </td>

                  <td className="p-4 text-obsidian/60">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}