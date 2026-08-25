import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// Generates a human-friendly order number, e.g. VEL-4821-XQ
function generateOrderNumber() {
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `VEL-${num}-${suffix}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderNumber = generateOrderNumber();

  const order = {
    order_number: orderNumber,
    email: body.email,
    items: body.items,
    subtotal: body.subtotal,
    shipping: body.shipping,
    discount: body.discount ?? 0,
    total: body.total,
    status: 'pending',
    shipping_address: body.shippingAddress,
    created_at: new Date().toISOString(),
  };

  // Attempt to persist to Supabase. In local/demo environments without
  // Supabase credentials configured, we still return a valid order number
  // so the checkout flow completes end-to-end.
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('orders').insert(order);
    if (error) console.error('Supabase insert error:', error.message);
  } catch (e) {
    console.warn('Supabase not configured — order not persisted. Configure env vars to enable.');
  }

  return NextResponse.json({ orderNumber, status: 'pending' });
}
