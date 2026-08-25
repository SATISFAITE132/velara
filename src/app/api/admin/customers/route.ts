import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, full_name, email, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (customersError) {
      console.error('Customers GET error:', customersError.message);

      return NextResponse.json(
        { error: customersError.message },
        { status: 500 }
      );
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('customer_id, total');

    if (ordersError) {
      console.error('Orders GET error:', ordersError.message);

      return NextResponse.json(
        { error: ordersError.message },
        { status: 500 }
      );
    }

    const customersWithStats = (customers ?? []).map((customer) => {
      const customerOrders = (orders ?? []).filter(
        (order) => order.customer_id === customer.id
      );

      const totalSpent = customerOrders.reduce(
        (sum, order) => sum + Number(order.total ?? 0),
        0
      );

      return {
        ...customer,
        orders: customerOrders.length,
        totalSpent,
      };
    });

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error('Customers API error:', error);

    return NextResponse.json(
      { error: 'Could not load customers' },
      { status: 500 }
    );
  }
}