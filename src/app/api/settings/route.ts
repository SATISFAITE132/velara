import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('store_settings')
      .select('currency')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Public settings error:', error);

      return NextResponse.json({ currency: 'EUR' });
    }

    return NextResponse.json({
      currency: data?.currency ?? 'EUR',
    });
  } catch (error) {
    console.error('Public settings API error:', error);

    return NextResponse.json({
      currency: 'EUR',
    });
  }
}