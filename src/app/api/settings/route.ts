
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('store_settings')
      .select(
        'currency, flat_rate, free_shipping_threshold'
      )
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Public settings error:', error);

      return NextResponse.json({
        currency: 'MAD',
        flat_rate: 6.5,
        free_shipping_threshold: 75,
      });
    }

    return NextResponse.json({
      currency: data?.currency ?? 'MAD',
      flat_rate: Number(data?.flat_rate ?? 6.5),
      free_shipping_threshold: Number(
        data?.free_shipping_threshold ?? 75
      ),
    });
  } catch (error) {
    console.error('Public settings API error:', error);

    return NextResponse.json({
      currency: 'MAD',
      flat_rate: 6.5,
      free_shipping_threshold: 75,
    });
  }
}

