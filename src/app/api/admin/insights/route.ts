import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type AnalyticsEvent = {
  event_name: string;
  session_id: string;
  product_id: string | null;
  order_id: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  device: string | null;
  path: string | null;
  value: number | null;
  created_at: string;
};

type OrderItem = {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

type ProductStats = {
  productId: string;
  name: string;
  views: number;
  unitsSold: number;
  revenue: number;
};

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

async function fetchAllEvents(
  supabase: ReturnType<typeof createAdminClient>
) {
  const allEvents: AnalyticsEvent[] = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('analytics_events')
      .select(
        'event_name, session_id, product_id, order_id, source, medium, campaign, device, path, value, created_at'
      )
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      break;
    }

    allEvents.push(
      ...(data as AnalyticsEvent[])
    );

    if (data.length < pageSize) {
      break;
    }
  }

  return allEvents;
}

async function fetchAllOrders(
  supabase: ReturnType<typeof createAdminClient>
) {
  const allOrders: Array<{
    id: string;
    items: OrderItem[];
    total: number;
    status: string;
    created_at: string;
  }> = [];

  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        'id, items, total, status, created_at'
      )
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      break;
    }

    allOrders.push(
      ...data.map((order) => ({
        id: order.id,
        items: Array.isArray(order.items)
          ? (order.items as OrderItem[])
          : [],
        total: toNumber(order.total),
        status: order.status,
        created_at: order.created_at,
      }))
    );

    if (data.length < pageSize) {
      break;
    }
  }

  return allOrders;
}

export async function GET(
  _request: NextRequest
) {
  try {
    const supabase = createAdminClient();

    const [events, orders] = await Promise.all([
      fetchAllEvents(supabase),
      fetchAllOrders(supabase),
    ]);

    const validOrders = orders.filter(
      (order) => order.status !== 'cancelled'
    );

    const sessions = new Set(
      events
        .map((event) => event.session_id)
        .filter(Boolean)
    );

    const visitors = sessions.size;

    const productViews = events.filter(
      (event) => event.event_name === 'product_view'
    ).length;

    const addToCart = events.filter(
      (event) => event.event_name === 'add_to_cart'
    ).length;

    const checkoutStarts = events.filter(
      (event) => event.event_name === 'checkout_start'
    ).length;

    const purchaseEvents = events.filter(
      (event) => event.event_name === 'purchase'
    );

    const revenue = validOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

   

const purchasingSessions = new Set(
  purchaseEvents
    .map((event) => event.session_id)
    .filter(Boolean)
);

const conversionRate =
  visitors > 0
    ? (purchasingSessions.size / visitors) * 100
    : 0;

    const productMap = new Map<
      string,
      ProductStats
    >();

    for (const event of events) {
      if (
        event.event_name !== 'product_view' ||
        !event.product_id
      ) {
        continue;
      }

      const existing = productMap.get(
        event.product_id
      );

      if (existing) {
        existing.views += 1;
      } else {
        productMap.set(event.product_id, {
          productId: event.product_id,
          name: 'Unknown product',
          views: 1,
          unitsSold: 0,
          revenue: 0,
        });
      }
    }

    for (const order of validOrders) {
      for (const item of order.items) {
        if (!item.productId) {
          continue;
        }

        const quantity = Math.max(
          0,
          Math.floor(toNumber(item.quantity))
        );

        const price = Math.max(
          0,
          toNumber(item.price)
        );

        const existing = productMap.get(
          item.productId
        );

        if (existing) {
          existing.name =
            item.name || existing.name;
          existing.unitsSold += quantity;
          existing.revenue +=
            price * quantity;
        } else {
          productMap.set(item.productId, {
            productId: item.productId,
            name:
              item.name || 'Unknown product',
            views: 0,
            unitsSold: quantity,
            revenue: price * quantity,
          });
        }
      }
    }

    const topProducts = Array.from(
      productMap.values()
    )
      .sort((a, b) => {
        if (b.revenue !== a.revenue) {
          return b.revenue - a.revenue;
        }

        if (b.unitsSold !== a.unitsSold) {
          return b.unitsSold - a.unitsSold;
        }

        return b.views - a.views;
      })
      .slice(0, 10);

    const trafficMap = new Map<
      string,
      number
    >();

    const deviceMap = new Map<
      string,
      number
    >();

    for (const event of events) {
      if (event.event_name !== 'page_view') {
        continue;
      }

      const source =
        event.source?.trim() || 'direct';

      trafficMap.set(
        source,
        (trafficMap.get(source) || 0) + 1
      );

      const device =
        event.device?.trim() || 'unknown';

      deviceMap.set(
        device,
        (deviceMap.get(device) || 0) + 1
      );
    }

    const trafficSources = Array.from(
      trafficMap.entries()
    )
      .map(([source, count]) => ({
        source,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const devices = Array.from(
      deviceMap.entries()
    )
      .map(([device, count]) => ({
        device,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const dailyMap = new Map<
      string,
      {
        date: string;
        visitors: Set<string>;
        sales: number;
        orders: number;
      }
    >();

    for (const event of events) {
      const date = event.created_at.slice(0, 10);

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          visitors: new Set<string>(),
          sales: 0,
          orders: 0,
        });
      }

      const day = dailyMap.get(date)!;

      if (
        event.event_name === 'page_view'
      ) {
        day.visitors.add(
          event.session_id
        );
      }
    }

    for (const order of validOrders) {
      const date =
        order.created_at.slice(0, 10);

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          visitors: new Set<string>(),
          sales: 0,
          orders: 0,
        });
      }

      const day = dailyMap.get(date)!;

      day.sales += order.total;
      day.orders += 1;
    }

    const daily = Array.from(
      dailyMap.values()
    )
      .sort((a, b) =>
        a.date.localeCompare(b.date)
      )
      .slice(-30)
      .map((day) => ({
        date: day.date,
        visitors: day.visitors.size,
        sales: Number(
          day.sales.toFixed(2)
        ),
        orders: day.orders,
      }));

    return NextResponse.json({
      overview: {
        visitors,
        productViews,
        addToCart,
        checkoutStarts,
        orders: validOrders.length,
        revenue: Number(
          revenue.toFixed(2)
        ),
        conversionRate: Number(
          conversionRate.toFixed(2)
        ),
      },
      topProducts,
      trafficSources,
      devices,
      daily,
      purchaseEvents: purchaseEvents.length,
    });
  } catch (error) {
    console.error(
      'Insights API error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Could not load insights',
      },
      { status: 500 }
    );
  }
}