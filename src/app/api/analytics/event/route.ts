import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'product_view',
  'add_to_cart',
  'checkout_start',
  'purchase',
]);

function cleanString(
  value: unknown,
  maxLength = 500
): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  return cleaned.slice(0, maxLength);
}

function cleanValue(value: unknown): number | null {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return Math.min(value, 10000000);
}

function cleanMetadata(
  value: unknown
): Record<string, unknown> {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventName = cleanString(
      body?.event_name,
      50
    );

    const sessionId = cleanString(
      body?.session_id,
      200
    );

    if (
      !eventName ||
      !ALLOWED_EVENTS.has(eventName)
    ) {
      return NextResponse.json(
        { error: 'Invalid analytics event' },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    const productId = cleanString(
      body?.product_id,
      100
    );

    const orderId = cleanString(
      body?.order_id,
      100
    );

    const source = cleanString(
      body?.source,
      200
    );

    const medium = cleanString(
      body?.medium,
      100
    );

    const campaign = cleanString(
      body?.campaign,
      200
    );

    const device = cleanString(
      body?.device,
      50
    );

    const path = cleanString(
      body?.path,
      1000
    );

    const value = cleanValue(body?.value);

    const metadata = cleanMetadata(
      body?.metadata
    );

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: eventName,
        session_id: sessionId,
        product_id: productId,
        order_id: orderId,
        source,
        medium,
        campaign,
        device,
        path,
        value,
        metadata,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error(
        'Analytics event insert error:',
        error.message
      );

      return NextResponse.json(
        { error: 'Could not save analytics event' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      'Analytics event API error:',
      error
    );

    return NextResponse.json(
      { error: 'Invalid analytics request' },
      { status: 400 }
    );
  }
}