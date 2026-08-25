import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get('order');
  if (!orderNumber) return NextResponse.json({ error: 'Missing order number' }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('orders').select('*').eq('order_number', orderNumber).single();
    if (error || !data) throw new Error('not found');
    return NextResponse.json({
  order: {
    ...data,
    timeline: [
      { label: 'Order placed', done: true },
      { label: 'Processing', done: data.status !== 'pending' },
      { label: 'Shipped', done: data.status === 'shipped' || data.status === 'delivered' },
      { label: 'Delivered', done: data.status === 'delivered' },
    ],
  },
});
  } catch {
    // Demo fallback when Supabase isn't connected yet.
    return NextResponse.json({
      order: {
        order_number: orderNumber,
        status: 'processing',
        created_at: new Date().toISOString(),
        timeline: [
          { label: 'Order placed', done: true },
          { label: 'Processing', done: true },
          { label: 'Shipped', done: false },
          { label: 'Delivered', done: false },
        ],
      },
    });
  }
}
