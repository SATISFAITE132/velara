'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Eye,
  ShoppingCart,
  CreditCard,
  Package,
  DollarSign,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
} from 'lucide-react';

type Overview = {
  visitors: number;
  productViews: number;
  addToCart: number;
  checkoutStarts: number;
  orders: number;
  revenue: number;
  conversionRate: number;
};

type ProductStat = {
  productId: string;
  name: string;
  views: number;
  unitsSold: number;
  revenue: number;
};

type TrafficSource = {
  source: string;
  count: number;
};

type DeviceStat = {
  device: string;
  count: number;
};

type DailyStat = {
  date: string;
  visitors: number;
  sales: number;
  orders: number;
};

type InsightsData = {
  overview: Overview;
  topProducts: ProductStat[];
  trafficSources: TrafficSource[];
  devices: DeviceStat[];
  daily: DailyStat[];
};

const emptyData: InsightsData = {
  overview: {
    visitors: 0,
    productViews: 0,
    addToCart: 0,
    checkoutStarts: 0,
    orders: 0,
    revenue: 0,
    conversionRate: 0,
  },
  topProducts: [],
  trafficSources: [],
  devices: [],
  daily: [],
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getDeviceIcon(device: string) {
  if (device === 'mobile') {
    return Smartphone;
  }

  if (device === 'tablet') {
    return Tablet;
  }

  return Monitor;
}

export default function InsightsPage() {
  const [data, setData] =
    useState<InsightsData>(emptyData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadInsights() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        '/api/admin/insights',
        {
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Could not load insights'
        );
      }

      setData({
        overview: result.overview ?? emptyData.overview,
        topProducts: Array.isArray(
          result.topProducts
        )
          ? result.topProducts
          : [],
        trafficSources: Array.isArray(
          result.trafficSources
        )
          ? result.trafficSources
          : [],
        devices: Array.isArray(result.devices)
          ? result.devices
          : [],
        daily: Array.isArray(result.daily)
          ? result.daily
          : [],
      });
    } catch (error) {
      console.error(
        'Insights load error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Could not load insights'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInsights();
  }, []);

  const overviewCards = [
    {
      label: 'Visitors',
      value: data.overview.visitors.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Product Views',
      value:
        data.overview.productViews.toLocaleString(),
      icon: Eye,
    },
    {
      label: 'Add to Cart',
      value:
        data.overview.addToCart.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      label: 'Checkout Starts',
      value:
        data.overview.checkoutStarts.toLocaleString(),
      icon: CreditCard,
    },
    {
      label: 'Orders',
      value: data.overview.orders.toLocaleString(),
      icon: Package,
    },
    {
      label: 'Revenue',
      value: formatMoney(
        data.overview.revenue
      ),
      icon: DollarSign,
    },
    {
      label: 'Conversion Rate',
      value: `${data.overview.conversionRate}%`,
      icon: TrendingUp,
    },
  ];

  const maxDailySales = Math.max(
    ...data.daily.map((item) => item.sales),
    0
  );

  const maxDailyVisitors = Math.max(
    ...data.daily.map(
      (item) => item.visitors
    ),
    0
  );

  const maxTraffic = Math.max(
    ...data.trafficSources.map(
      (item) => item.count
    ),
    0
  );

  const maxDevice = Math.max(
    ...data.devices.map(
      (item) => item.count
    ),
    0
  );

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-obsidian/40">
            Store performance
          </p>

          <h1 className="font-display text-3xl mt-2">
            Insights
          </h1>

          <p className="text-sm text-obsidian/60 mt-2">
            Real data collected from your store.
          </p>
        </div>

        <button
          onClick={loadInsights}
          disabled={loading}
          className="btn-outline text-xs px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="border border-obsidian/10 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest2 text-obsidian/40">
                    {card.label}
                  </p>

                  <Icon
                    size={16}
                    className="text-obsidian/40"
                  />
                </div>

                <p className="font-display text-2xl mt-4">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={18} />

          <h2 className="font-display text-xl">
            Sales & Revenue
          </h2>
        </div>

        <div className="border border-obsidian/10 bg-white p-6">
          {data.daily.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-obsidian/50">
                No sales data yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {data.daily.map((item) => {
                const width =
                  maxDailySales > 0
                    ? (item.sales /
                        maxDailySales) *
                      100
                    : 0;

                return (
                  <div key={item.date}>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-obsidian/50">
                        {formatDate(item.date)}
                      </span>

                      <span>
                        {formatMoney(item.sales)}
                      </span>
                    </div>

                    <div className="h-2 bg-obsidian/5 overflow-hidden">
                      <div
                        className="h-full bg-obsidian"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>

                    <p className="text-[11px] text-obsidian/40 mt-1">
                      {item.orders}{' '}
                      {item.orders === 1
                        ? 'order'
                        : 'orders'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-5">
          <Users size={18} />

          <h2 className="font-display text-xl">
            Traffic & Visitors
          </h2>
        </div>

        <div className="border border-obsidian/10 bg-white p-6">
          {data.daily.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-obsidian/50">
                No visitor data yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {data.daily.map((item) => {
                const width =
                  maxDailyVisitors > 0
                    ? (item.visitors /
                        maxDailyVisitors) *
                      100
                    : 0;

                return (
                  <div key={item.date}>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-obsidian/50">
                        {formatDate(item.date)}
                      </span>

                      <span>
                        {item.visitors.toLocaleString()}{' '}
                        visitors
                      </span>
                    </div>

                    <div className="h-2 bg-obsidian/5 overflow-hidden">
                      <div
                        className="h-full bg-gold"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="border border-obsidian/10 bg-white p-6">
          <h2 className="font-display text-xl mb-6">
            Traffic Sources
          </h2>

          {data.trafficSources.length === 0 ? (
            <p className="text-sm text-obsidian/50 py-8 text-center">
              No traffic data yet.
            </p>
          ) : (
            <div className="space-y-5">
              {data.trafficSources.map(
                (item) => {
                  const width =
                    maxTraffic > 0
                      ? (item.count /
                          maxTraffic) *
                        100
                      : 0;

                  return (
                    <div key={item.source}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>
                          {item.source}
                        </span>

                        <span className="text-obsidian/50">
                          {item.count.toLocaleString()}
                        </span>
                      </div>

                      <div className="h-2 bg-obsidian/5">
                        <div
                          className="h-full bg-obsidian"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className="border border-obsidian/10 bg-white p-6">
          <h2 className="font-display text-xl mb-6">
            Devices
          </h2>

          {data.devices.length === 0 ? (
            <p className="text-sm text-obsidian/50 py-8 text-center">
              No device data yet.
            </p>
          ) : (
            <div className="space-y-5">
              {data.devices.map((item) => {
                const Icon =
                  getDeviceIcon(item.device);

                const width =
                  maxDevice > 0
                    ? (item.count /
                        maxDevice) *
                      100
                    : 0;

                return (
                  <div key={item.device}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} />

                        <span className="capitalize">
                          {item.device}
                        </span>
                      </div>

                      <span className="text-obsidian/50">
                        {item.count.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 bg-obsidian/5">
                      <div
                        className="h-full bg-obsidian"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl mb-5">
          Top Products
        </h2>

        <div className="border border-obsidian/10 bg-white">
          {data.topProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-obsidian/50">
                No product data yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-obsidian/10">
              {data.topProducts.map(
                (product, index) => (
                  <div
                    key={product.productId}
                    className="grid grid-cols-[40px_1fr_auto_auto] gap-4 items-center p-5"
                  >
                    <span className="text-xs text-obsidian/40">
                      #{index + 1}
                    </span>

                    <div>
                      <p className="font-medium">
                        {product.name}
                      </p>

                      <p className="text-xs text-obsidian/50 mt-1">
                        {product.views.toLocaleString()}{' '}
                        views ·{' '}
                        {product.unitsSold.toLocaleString()}{' '}
                        sold
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm">
                        {formatMoney(
                          product.revenue
                        )}
                      </p>

                      <p className="text-[11px] text-obsidian/40">
                        revenue
                      </p>
                    </div>

                    <Eye
                      size={16}
                      className="text-obsidian/30"
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}