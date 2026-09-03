'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (lastPath.current === pathname) {
      return;
    }

    lastPath.current = pathname;

    trackEvent('page_view', {
      path: window.location.pathname + window.location.search,
    });
  }, [pathname]);

  return null;
}