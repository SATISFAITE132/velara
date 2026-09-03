import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('store_settings')
      .select('tracking_pixels')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Tracking settings error:', error);

      return NextResponse.json({
        tracking_pixels: {
          meta: [],
          tiktok: [],
          google_analytics: [],
          snapchat: [],
        },
      });
    }

    return NextResponse.json({
      tracking_pixels: data?.tracking_pixels ?? {
        meta: [],
        tiktok: [],
        google_analytics: [],
        snapchat: [],
      },
    });
  } catch (error) {
    console.error('Tracking API error:', error);

    return NextResponse.json({
      tracking_pixels: {
        meta: [],
        tiktok: [],
        google_analytics: [],
        snapchat: [],
      },
    });
  }
}