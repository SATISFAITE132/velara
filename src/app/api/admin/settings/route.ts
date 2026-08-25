import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Settings GET error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Settings GET API error:', error);

    return NextResponse.json(
      { error: 'Could not load settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const {
      store_name,
      support_email,
      currency,
      flat_rate,
      free_shipping_threshold,
    } = body;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('store_settings')
      .update({
        store_name,
        support_email,
        currency,
        flat_rate,
        free_shipping_threshold,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Settings PATCH error:', error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Settings PATCH API error:', error);

    return NextResponse.json(
      { error: 'Could not update settings' },
      { status: 500 }
    );
  }
}