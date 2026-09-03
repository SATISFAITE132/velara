'use client';

export type AnalyticsEventName =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'purchase';

type TrackEventOptions = {
  productId?: string;
  orderId?: string;
  value?: number;
  path?: string;
  metadata?: Record<string, unknown>;
};

const SESSION_KEY = 'velara-analytics-session';

function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = window.localStorage.getItem(SESSION_KEY);

  if (existing) {
    return existing;
  }

  const sessionId =
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  window.localStorage.setItem(
    SESSION_KEY,
    sessionId
  );

  return sessionId;
}

function getTrafficData() {
  if (typeof window === 'undefined') {
    return {
      source: null,
      medium: null,
      campaign: null,
    };
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');

  let source = utmSource;
  let medium = utmMedium;

  if (!source && document.referrer) {
    try {
      source = new URL(document.referrer).hostname;
      medium = medium || 'referral';
    } catch {
      source = 'referral';
      medium = 'referral';
    }
  }

  return {
    source: source || 'direct',
    medium: medium || 'none',
    campaign: utmCampaign || null,
  };
}

function getDevice() {
  if (typeof window === 'undefined') {
    return null;
  }

  const width = window.innerWidth;

  if (width < 768) {
    return 'mobile';
  }

  if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
}

export async function trackEvent(
  eventName: AnalyticsEventName,
  options: TrackEventOptions = {}
) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const traffic = getTrafficData();

    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        session_id: getSessionId(),
        product_id: options.productId ?? null,
        order_id: options.orderId ?? null,
        value:
          typeof options.value === 'number' &&
          Number.isFinite(options.value)
            ? options.value
            : null,
        path:
          options.path ??
          `${window.location.pathname}${window.location.search}`,
        source: traffic.source,
        medium: traffic.medium,
        campaign: traffic.campaign,
        device: getDevice(),
        metadata: options.metadata ?? {},
      }),
    });
  } catch (error) {
    console.error(
      'Analytics tracking error:',
      error
    );
  }
}