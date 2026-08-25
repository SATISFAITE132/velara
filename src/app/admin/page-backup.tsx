'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, BarChart, Bar } from 'recharts';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { revenueByMonth, salesByCategory, mockOrders } from '@/data/admin-mock';
import StatusBadge from '@/components/admin/StatusBadge';

const COLORS = ['#B8935B', '#6B3F23', '#D9BD8E', '#8A6B3F'];

const STAT_CARDS = [
  { label: 'Total Revenue', value: '$79,012', delta: '+18.2%', icon: DollarSign },
  { label: 'Orders', value: '1,348', delta: '+9.4%', icon: ShoppingBag },
  { label: 'New Customers', value: '286', delta: '+12.1%', icon: Users },
  { label: 'Avg. Order Value', value: '$58.60', delta: '+3.7%', icon: TrendingUp },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Analytics</h1>
      <p className="text-obsidian/50 mb-8">Overview of Velara store performance.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-cream border border-obsidian/10 p-5">
            <div className="flex items-center justify-between">
              <s.icon size={18} className="text-gold-dark" />
              <span className="text-xs text-success">{s.delta}</span>
            </div>
            <p className="text-2xl font-display mt-3">{s.value}</p>
            <p className="text-xs text-obsidian/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cream border border-obsidian/10 p-6">
          <h2 className="font-display text-lg mb-4">Revenue — Last 7 Months</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21201c1a" />
              <XAxis dataKey="month" stroke="#21201c66" fontSize={12} />
              <YAxis stroke="#21201c66" fontSize={12} />
              <Tooltip contentStyle={{ background: '#15120F', border: 'none', color: '#F7F2E9' }} />
              <Line type="monotone" dataKey="revenue" stroke="#B8935B" strokeWidth={2.5} dot={{ fill: '#B8935B' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-cream border border-obsidian/10 p-6">
          <h2 className="font-display text-lg mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={salesByCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {salesByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#15120F', border: 'none', color: '#F7F2E9' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {salesByCategory.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  {c.name}
                </span>
                <span className="text-obsidian/50">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-cream border border-obsidian/10 p-6">
          <h2 className="font-display text-lg mb-4">Orders per Month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21201c1a" />
              <XAxis dataKey="month" stroke="#21201c66" fontSize={12} />
              <YAxis stroke="#21201c66" fontSize={12} />
              <Tooltip contentStyle={{ background: '#15120F', border: 'none', color: '#F7F2E9' }} />
              <Bar dataKey="orders" fill="#6B3F23" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg mb-4">Recent Orders</h2>
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
              {mockOrders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b border-obsidian/5 last:border-0">
                  <td className="p-4 font-medium">{o.orderNumber}</td>
                  <td className="p-4 text-obsidian/60">{o.email}</td>
                  <td className="p-4"><StatusBadge status={o.status} /></td>
                  <td className="p-4 text-right">${o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}