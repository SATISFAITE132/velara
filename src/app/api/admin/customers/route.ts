import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

   const { data, error } = await supabase
  .from('customers')
  .select('id, full_name, email, phone, created_at')
  .order('created_at', { ascending: false });

console.log('CUSTOMERS COUNT:', data?.length ?? 0);
console.log('CUSTOMERS NAMES:', data?.map((c) => c.full_name));

    if (error) {
      console.error('Customers GET error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Customers found:', data?.length ?? 0);
    
    const { data: orders, error: ordersError } = await supabase
  .from('orders')
  .select('customer_id, total, order_number, email');

console.log('ALL ORDERS:', orders);
console.log('ORDERS ERROR:', ordersError);

console.log('CUSTOMERS FROM DB:', data);
const { data: testCustomer, error: testCustomerError } = await supabase
  .from('customers')
  .select('id, full_name, email, phone, created_at')
  .eq('id', '71a3bbb0-6432-42ae-aeb3-7b9b2bf42949')
  .maybeSingle();

console.log('YOUSSFE DIRECT TEST:', testCustomer);
console.log('YOUSSFE DIRECT ERROR:', testCustomerError);
const customersWithStats = (data ?? []).map((customer) => {
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