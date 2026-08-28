import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get('order');

  if (!orderNumber) {
    return NextResponse.json(
      { error: 'Missing order number' },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.trim())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        ...data,
        timeline: [
          { label: 'Order placed', done: true },
          {
            label: 'Processing',
            done: data.status !== 'pending',
          },
          {
            label: 'Shipped',
            done:
              data.status === 'shipped' ||
              data.status === 'delivered',
          },
          {
            label: 'Delivered',
            done: data.status === 'delivered',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Track order error:', error);

    return NextResponse.json(
      { error: 'Could not track order' },
      { status: 500 }
    );
  }
}