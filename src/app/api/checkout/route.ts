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

  try {
    const supabase = createAdminClient();

    // Find existing customer by email
    const { data: existingCustomer, error: customerSearchError } =
      await supabase
        .from('customers')
        .select('*')
        .eq('email', body.email)
        .maybeSingle();

    if (customerSearchError) {
      console.error(
        'Customer search error:',
        customerSearchError.message
      );

      return NextResponse.json(
        { error: customerSearchError.message },
        { status: 500 }
      );
    }

    let customer = existingCustomer;

    // Create customer if they don't exist
    if (!customer) {
      const { data: newCustomer, error: customerCreateError } =
        await supabase
          .from('customers')
          .insert({
            full_name: body.shippingAddress?.fullName,
            email: body.email,
            phone: body.shippingAddress?.phone,
          })
          .select()
          .single();

      if (customerCreateError) {
        console.error(
          'Customer create error:',
          customerCreateError.message
        );

        return NextResponse.json(
          { error: customerCreateError.message },
          { status: 500 }
        );
      }

      customer = newCustomer;
    }

    const order = {
      order_number: orderNumber,
      customer_id: customer.id,
      email: body.email,
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      discount: body.discount ?? 0,
      total: body.total,
      status: 'pending',
      payment_method: body.paymentMethod,
      shipping_address: body.shippingAddress,
      created_at: new Date().toISOString(),
    };

    // Save order and return its real database ID
    const { data: savedOrder, error: orderError } =
      await supabase
        .from('orders')
        .insert(order)
        .select('id')
        .single();

    if (orderError) {
      console.error(
        'Order insert error:',
        orderError.message
      );

      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: savedOrder.id,
      orderNumber,
      status: 'pending',
    });
  } catch (error) {
    console.error('Checkout error:', error);

    return NextResponse.json(
      { error: 'Could not place order' },
      { status: 500 }
    );
  }
}