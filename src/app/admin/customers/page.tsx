'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatPrice } from '@/lib/currency';

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

  const loadCustomers = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/customers?t=${Date.now()}`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Could not load customers');
      }

      const data = await response.json();

      const normalizedCustomers: Customer[] = Array.isArray(data)
        ? data.map((customer: any) => ({
            id: customer.id,
            full_name: customer.full_name ?? '',
            email: customer.email ?? '',
            phone: customer.phone ?? null,
            created_at: customer.created_at,
            orders: Number(customer.orders ?? 0),
            totalSpent: Number(customer.totalSpent ?? 0),
          }))
        : [];

      setCustomers(normalizedCustomers);
    } catch (error) {
      console.error('Customers error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();

    const interval = setInterval(() => {
      loadCustomers();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadCustomers]);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">
        Customers
      </h1>

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
                <td
                  colSpan={5}
                  className="p-8 text-center text-obsidian/40"
                >
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-obsidian/40"
                >
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30"
                >
                  <td className="p-4 font-medium">
                    {customer.full_name}
                  </td>

                  <td className="p-4 text-obsidian/60">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    {customer.orders}
                  </td>

                  <td className="p-4">
                    {formatPrice(customer.totalSpent)}
                  </td>

                  <td className="p-4 text-obsidian/60">
                    {new Date(
                      customer.created_at
                    ).toLocaleDateString()}
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