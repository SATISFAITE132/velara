'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

type TrackingPixelsData = {
  meta: string[];
  tiktok: string[];
  google_analytics: string[];
  snapchat: string[];
};

const emptyTracking: TrackingPixelsData = {
  meta: [],
  tiktok: [],
  google_analytics: [],
  snapchat: [],
};

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter(
          (id): id is string =>
            typeof id === 'string' &&
            id.trim() !== '' &&
            id.trim() !== 'null' &&
            id.trim() !== 'undefined'
        )
        .map((id) => id.trim())
    )
  );
}

export default function TrackingPixels() {
  const [trackingPixels, setTrackingPixels] =
    useState<TrackingPixelsData>(emptyTracking);

  useEffect(() => {
    async function loadTrackingPixels() {
      try {
        const response = await fetch('/api/tracking', {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const tracking = data?.tracking_pixels ?? {};

        setTrackingPixels({
          meta: cleanIds(tracking.meta),
          tiktok: cleanIds(tracking.tiktok),
          google_analytics: cleanIds(
            tracking.google_analytics
          ),
          snapchat: cleanIds(tracking.snapchat),
        });
      } catch (error) {
        console.error(
          'Could not load tracking pixels:',
          error
        );
      }
    }

    loadTrackingPixels();
  }, []);

  const metaIds = cleanIds(trackingPixels.meta);
  const tiktokIds = cleanIds(trackingPixels.tiktok);
  const googleAnalyticsIds = cleanIds(
    trackingPixels.google_analytics
  );
  const snapchatIds = cleanIds(
    trackingPixels.snapchat
  );

  return (
    <>
      {/* =========================
          META PIXEL
          ========================= */}

      {metaIds.length > 0 && (
        <Script
          id="velara-meta-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(f,b,e,v,n,t,s)
            {
              if(f.fbq)return;

              n=f.fbq=function(){
                n.callMethod
                  ? n.callMethod.apply(n,arguments)
                  : n.queue.push(arguments);
              };

              if(!f._fbq)f._fbq=n;

              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];

              t=b.createElement(e);
              t.async=!0;
              t.src=v;

              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);
            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            ${metaIds
              .map(
                (id) =>
                  `fbq('init', ${JSON.stringify(id)});`
              )
              .join('\n')}

            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* =========================
          GOOGLE ANALYTICS
          ========================= */}

      {googleAnalyticsIds.length > 0 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
              googleAnalyticsIds[0]
            )}`}
            strategy="afterInteractive"
          />

          <Script
            id="velara-google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments);
              }

              gtag('js', new Date());

              ${googleAnalyticsIds
                .map(
                  (id) =>
                    `gtag('config', ${JSON.stringify(
                      id
                    )}, {
                      send_page_view: true
                    });`
                )
                .join('\n')}
            `}
          </Script>
        </>
      )}

      {/* =========================
          TIKTOK PIXEL
          ========================= */}

      {tiktokIds.length > 0 && (
        <Script
          id="velara-tiktok-pixel"
          strategy="afterInteractive"
        >
          {`
            !function(w,d,t){
              w.TiktokAnalyticsObject=t;

              var ttq=w[t]=w[t]||[];

              ttq.methods=[
                "page",
                "track",
                "identify",
                "instances",
                "debug",
                "on",
                "off",
                "once",
                "ready",
                "alias",
                "group",
                "enableCookie",
                "disableCookie"
              ];

              ttq.setAndDefer=function(t,e){
                t[e]=function(){
                  t.push(
                    [e].concat(
                      Array.prototype.slice.call(
                        arguments,
                        0
                      )
                    )
                  );
                };
              };

              for(var i=0;i<ttq.methods.length;i++){
                ttq.setAndDefer(
                  ttq,
                  ttq.methods[i]
                );
              }

              ttq.load=function(e){
                var i=
                  "https://analytics.tiktok.com/i18n/pixel/events.js";

                ttq._i=ttq._i||{};
                ttq._i[e]=[];

                ttq._t=ttq._t||{};
                ttq._t[e]=+new Date();

                ttq._o=ttq._o||{};
                ttq._o[e]={};

                var o=d.createElement("script");

                o.type="text/javascript";
                o.async=!0;
                o.src=i+"?sdkid="+e+"&lib="+t;

                var a=d.getElementsByTagName("script")[0];

                a.parentNode.insertBefore(o,a);
              };

              ${tiktokIds
                .map(
                  (id) =>
                    `ttq.load(${JSON.stringify(id)});`
                )
                .join('\n')}

              ttq.page();

            }(
              window,
              document,
              'ttq'
            );
          `}
        </Script>
      )}

      {/* =========================
          SNAPCHAT PIXEL
          ========================= */}

      {snapchatIds.length > 0 && (
        <Script
          id="velara-snapchat-pixel"
          strategy="afterInteractive"
        >
          {`
            (function(e,t,n){
              if(e.snaptr)return;

              var a=e.snaptr=function(){
                a.handleRequest
                  ? a.handleRequest.apply(
                      a,
                      arguments
                    )
                  : a.queue.push(arguments);
              };

              a.queue=[];

              var s='script';

              var r=t.createElement(s);

              r.async=!0;

              r.src=
                'https://sc-static.net/scevent.min.js';

              var u=t.getElementsByTagName(s)[0];

              u.parentNode.insertBefore(r,u);

            })(
              window,
              document,
              'snaptr'
            );

            ${snapchatIds
              .map(
                (id) =>
                  `snaptr('init', ${JSON.stringify(id)});`
              )
              .join('\n')}

            ${snapchatIds
              .map(
                () =>
                  `snaptr('track', 'PAGE_VIEW');`
              )
              .join('\n')}
          `}
        </Script>
      )}
    </>
  );
}