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
      tracking_pixels,
    } = body;

    const cleanTrackingPixels = {
      meta: Array.isArray(tracking_pixels?.meta)
        ? tracking_pixels.meta
            .map((id: unknown) =>
              typeof id === 'string' ? id.trim() : ''
            )
            .filter(Boolean)
        : [],

      tiktok: Array.isArray(tracking_pixels?.tiktok)
        ? tracking_pixels.tiktok
            .map((id: unknown) =>
              typeof id === 'string' ? id.trim() : ''
            )
            .filter(Boolean)
        : [],

      google_analytics: Array.isArray(
        tracking_pixels?.google_analytics
      )
        ? tracking_pixels.google_analytics
            .map((id: unknown) =>
              typeof id === 'string' ? id.trim() : ''
            )
            .filter(Boolean)
        : [],

      snapchat: Array.isArray(tracking_pixels?.snapchat)
        ? tracking_pixels.snapchat
            .map((id: unknown) =>
              typeof id === 'string' ? id.trim() : ''
            )
            .filter(Boolean)
        : [],
    };

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('store_settings')
      .update({
        store_name,
        support_email,
        currency,
        flat_rate,
        free_shipping_threshold,
        tracking_pixels: cleanTrackingPixels,
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