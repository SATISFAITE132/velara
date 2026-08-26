'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StatusBadge from '@/components/admin/StatusBadge';

type Order = {
  id: string;
  order_number: string;
  email: string;
  total: number | string;
  status: string;
  created_at: string;
};

type Customer = {
  id: string;
  created_at: string;
};

type Product = {
  category: string;
  price: number | string;
  stock: number;
};

const COLORS = ['#B8935B', '#6B3F23', '#D9BD8E', '#8A6B3F'];

export default function AdminDashboardPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  
  
  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const [
  ordersResponse,
  customersResponse,
  productsResponse,
] = await Promise.all([
  fetch('/api/admin/orders'),
  fetch('/api/admin/customers'),
  fetch('/api/admin/products'),
]);

const ordersData = await ordersResponse.json();
const customersData = await customersResponse.json();
const productsData = await productsResponse.json();

setOrders(Array.isArray(ordersData) ? ordersData : []);
setCustomers(Array.isArray(customersData) ? customersData : []);
setProducts(Array.isArray(productsData) ? productsData : []);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const filteredOrders = orders.filter((order) => {
  if (dateRange === 'all') return true;

  const orderDate = new Date(order.created_at);
  const now = new Date();

  if (dateRange === 'today') {
    return (
      orderDate.getFullYear() === now.getFullYear() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getDate() === now.getDate()
    );
  }

  if (dateRange === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return orderDate >= startOfWeek;
  }

  if (dateRange === 'month') {
    return (
      orderDate.getFullYear() === now.getFullYear() &&
      orderDate.getMonth() === now.getMonth()
    );
  }

  if (dateRange === 'year') {
    return orderDate.getFullYear() === now.getFullYear();
  }

  return true;
});
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalOrders = filteredOrders.length;

  const totalCustomers = customers.length;

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const salesByCategory = products.reduce(
    (acc: { name: string; value: number }[], product) => {
      const existing = acc.find(
        (item) => item.name === product.category
      );

      if (existing) {
        existing.value += 1;
      } else {
        acc.push({
          name: product.category,
          value: 1,
        });
      }

      return acc;
    },
    []
  );

  const totalCategoryProducts = salesByCategory.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const categoryPercentages = salesByCategory.map((item) => ({
    name: item.name,
    value:
      totalCategoryProducts > 0
        ? Math.round((item.value / totalCategoryProducts) * 100)
        : 0,
  }));

  const revenueByMonth = getLastSevenMonths(orders);

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: `${totalRevenue.toFixed(2)} د.م.`,
      delta: '',
      icon: DollarSign,
    },
    {
      label: 'Orders',
      value: totalOrders.toString(),
      delta: '',
      icon: ShoppingBag,
    },
    {
      label: 'New Customers',
      value: totalCustomers.toString(),
      delta: '',
      icon: Users,
    },
    {
      label: 'Avg. Order Value',
      value: `${averageOrderValue.toFixed(2)} د.م.`,
      delta: '',
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">
        Analytics
      </h1>

      <p className="text-obsidian/50 mb-8">
        Overview of Velara store performance.
      </p><div className="flex flex-wrap gap-2 mb-8">
  {[
    ['all', 'All Time'],
    ['today', 'Today'],
    ['week', 'This Week'],
    ['month', 'This Month'],
    ['year', 'This Year'],
  ].map(([value, label]) => (
    <button
      key={value}
      onClick={() => setDateRange(value)}
      className={`px-4 py-2 text-sm border ${
        dateRange === value
          ? 'bg-obsidian text-cream'
          : 'bg-cream border-obsidian/10'
      }`}
    >
      {label}
    </button>
  ))}
</div>

      {loading && (
        <div className="mb-6 bg-cream border border-obsidian/10 p-4 text-sm text-obsidian/60">
          Loading live data...
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="bg-cream border border-obsidian/10 p-5"
          >
            <div className="flex items-center justify-between">
              <s.icon size={18} className="text-gold-dark" />

              {s.delta && (
                <span className="text-xs text-success">
                  {s.delta}
                </span>
              )}
            </div>

            <p className="text-2xl font-display mt-3">
              {s.value}
            </p>

            <p className="text-xs text-obsidian/50 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cream border border-obsidian/10 p-6">
          <h2 className="font-display text-lg mb-4">
            Revenue — Last 7 Months
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#21201c1a"
              />

              <XAxis
                dataKey="month"
                stroke="#21201c66"
                fontSize={12}
              />

              <YAxis
                stroke="#21201c66"
                fontSize={12}
              />

              <Tooltip
                contentStyle={{
                  background: '#15120F',
                  border: 'none',
                  color: '#F7F2E9',
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#B8935B"
                strokeWidth={2.5}
                dot={{ fill: '#B8935B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-cream border border-obsidian/10 p-6">
          <h2 className="font-display text-lg mb-4">
            Products by Category
          </h2>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryPercentages}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {categoryPercentages.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: '#15120F',
                  border: 'none',
                  color: '#F7F2E9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-4">
            {categoryPercentages.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: COLORS[i % COLORS.length],
                    }}
                  />

                  {c.name}
                </span>

                <span className="text-obsidian/50">
                  {c.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-cream border border-obsidian/10 p-6">
          <h2 className="font-display text-lg mb-4">
            Orders per Month
          </h2>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#21201c1a"
              />

              <XAxis
                dataKey="month"
                stroke="#21201c66"
                fontSize={12}
              />

              <YAxis
                stroke="#21201c66"
                fontSize={12}
              />

              <Tooltip
                contentStyle={{
                  background: '#15120F',
                  border: 'none',
                  color: '#F7F2E9',
                }}
              />

              <Bar
                dataKey="orders"
                fill="#6B3F23"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg mb-4">
          Recent Orders
        </h2>

        <div className="bg-cream border border-obsidian/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-obsidian/5 last:border-0"
                >
                  <td className="p-4 font-medium">
                    {o.order_number}
                  </td>

                  <td className="p-4 text-obsidian/60">
                    {o.email}
                  </td>

                  <td className="p-4">
                    <StatusBadge status={o.status as any} />
                  </td>

                  <td className="p-4 text-right">
                    {Number(o.total || 0).toFixed(2)} د.م.
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-obsidian/50"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getLastSevenMonths(orders: Order[]) {
  const now = new Date();

  const months = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const monthName = date.toLocaleString('en-US', {
      month: 'short',
    });

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at);

      return (
        orderDate.getFullYear() === year &&
        orderDate.getMonth() === month
      );
    });

    const revenue = monthOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    months.push({
      month: monthName,
      revenue,
      orders: monthOrders.length,
    });
  }

  return months;
}