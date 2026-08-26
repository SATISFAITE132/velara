'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

type OrderItem = {
  name: string;
  size?: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  order_number: string;
  email: string;
  created_at: string;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  total: number;
  items: OrderItem[];
  shipping_address?: {
    fullName?: string;
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
};

const STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    try {
      const response = await fetch('/api/admin/orders');

      if (!response.ok) {
        throw new Error('Could not load orders');
      }

      const data = await response.json();

      setOrders(
        (data || []).map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          email: o.email,
          created_at: o.created_at,
          status: o.status,
          total: Number(o.total || 0),
          items: Array.isArray(o.items) ? o.items : [],
          shipping_address: o.shipping_address ?? {},
        }))
      );
    } catch (error) {
      console.error(error);
      alert('Could not load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(
    id: string,
    status: Order['status']
  ) {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not update order');
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert('Could not update order');
      loadOrders();
    }
  }

  const filtered = orders.filter((o) => {
    const search = query.toLowerCase();

    return (
      o.order_number.toLowerCase().includes(search) ||
      o.email.toLowerCase().includes(search) ||
      o.shipping_address?.fullName
        ?.toLowerCase()
        .includes(search) ||
      o.shipping_address?.phone
        ?.toLowerCase()
        .includes(search) ||
      o.items.some((item) =>
        item.name?.toLowerCase().includes(search)
      )
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">
          Orders
        </h1>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/40"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders..."
            className="input-field pl-9 py-2.5 w-64"
          />
        </div>
      </div>

      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-sm text-obsidian/50">
            Loading orders...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Products</th>
                <th className="p-4">Address</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30"
                >
                  <td className="p-4 font-medium">
                    {o.order_number}
                  </td>

                  <td className="p-4 text-obsidian/60">
                    <div className="font-medium text-obsidian">
                      {o.shipping_address?.fullName || '—'}
                    </div>

                    <div>{o.email}</div>

                    <div>
                      {o.shipping_address?.phone || '—'}
                    </div>
                  </td>

                  <td className="p-4">
                    {o.items.length > 0 ? (
                      <div className="space-y-2 min-w-[220px]">
                        {o.items.map((item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="text-obsidian/70"
                          >
                            <div className="font-medium text-obsidian">
                              {item.name}
                            </div>

                            <div className="text-xs text-obsidian/50">
                              {item.size
                                ? `${item.size} · `
                                : ''}
                              Qty: {item.quantity} ·{' '}
                              {formatPrice(
                                Number(item.price)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-obsidian/40">
                        No products
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-obsidian/60">
                    <div>
                      {o.shipping_address?.line1 || '—'}
                    </div>

                    <div>
                      {[
                        o.shipping_address?.city,
                        o.shipping_address?.state,
                        o.shipping_address?.postalCode,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </div>

                    <div>
                      {o.shipping_address?.country || '—'}
                    </div>
                  </td>

                  <td className="p-4 text-obsidian/60">
                    {new Date(
                      o.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(
                          o.id,
                          e.target.value as Order['status']
                        )
                      }
                      className="bg-transparent text-xs border border-obsidian/15 rounded-full px-2 py-1 capitalize focus:outline-none"
                    >
                      {STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-right font-medium">
                    {formatPrice(o.total)}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-obsidian/40"
                  >
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}