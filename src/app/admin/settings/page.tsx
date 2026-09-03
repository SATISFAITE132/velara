'use client';

import { useEffect, useState } from 'react';

type Settings = {
  id: number;
  store_name: string;
  support_email: string;
  currency: string;
  flat_rate: number;
  free_shipping_threshold: number;
  tracking_pixels: {
    meta: string[];
    tiktok: string[];
    google_analytics: string[];
    snapchat: string[];
  };
};

type PlatformKey =
  | 'meta'
  | 'tiktok'
  | 'google_analytics'
  | 'snapchat';

const platforms: {
  key: PlatformKey;
  name: string;
  description: string;
  placeholder: string;
  label: string;
  logo: React.ReactNode;
}[] = [
  {
    key: 'meta',
    name: 'Meta',
    description: 'Facebook & Instagram Pixel',
    placeholder: 'Enter Meta Pixel ID',
    label: 'Meta Pixel ID',
    logo: (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white font-bold text-lg">
        f
      </div>
    ),
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    description: 'TikTok Pixel',
    placeholder: 'Enter TikTok Pixel ID',
    label: 'TikTok Pixel ID',
    logo: (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-bold text-sm">
        ♪
      </div>
    ),
  },
  {
    key: 'google_analytics',
    name: 'Google Analytics',
    description: 'Google Analytics 4',
    placeholder: 'G-XXXXXXXXXX',
    label: 'Measurement ID',
    logo: (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-obsidian/10 text-[#F9AB00] font-bold text-lg">
        G
      </div>
    ),
  },
  {
    key: 'snapchat',
    name: 'Snapchat',
    description: 'Snap Pixel',
    placeholder: 'Enter Snapchat Pixel ID',
    label: 'Snap Pixel ID',
    logo: (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFC00] text-black font-bold text-lg">
        👻
      </div>
    ),
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    id: 1,
    store_name: '',
    support_email: '',
    currency: 'MAD',
    flat_rate: 0,
    free_shipping_threshold: 0,
    tracking_pixels: {
      meta: [],
      tiktok: [],
      google_analytics: [],
      snapchat: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openPlatform, setOpenPlatform] =
    useState<PlatformKey | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');

        if (!response.ok) {
          throw new Error('Could not load settings');
        }

        const data = await response.json();

        const tracking = data.tracking_pixels ?? {};

        setSettings({
          id: data.id,
          store_name: data.store_name ?? '',
          support_email: data.support_email ?? '',
          currency: 'MAD',
          flat_rate: Number(data.flat_rate ?? 0),
          free_shipping_threshold: Number(
            data.free_shipping_threshold ?? 0
          ),
          tracking_pixels: {
            meta: Array.isArray(tracking.meta)
              ? tracking.meta
              : [],
            tiktok: Array.isArray(tracking.tiktok)
              ? tracking.tiktok
              : [],
            google_analytics: Array.isArray(
              tracking.google_analytics
            )
              ? tracking.google_analytics
              : [],
            snapchat: Array.isArray(tracking.snapchat)
              ? tracking.snapchat
              : [],
          },
        });
      } catch (error) {
        console.error('Settings load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateField = (
    field: keyof Settings,
    value: string | number
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateTrackingIds = (
    platform: PlatformKey,
    ids: string[]
  ) => {
    setSettings((current) => ({
      ...current,
      tracking_pixels: {
        ...current.tracking_pixels,
        [platform]: ids,
      },
    }));
  };

  const addTrackingId = (platform: PlatformKey) => {
    const currentIds =
      settings.tracking_pixels[platform];

    updateTrackingIds(platform, [...currentIds, '']);

    setOpenPlatform(platform);
  };

  const updateTrackingId = (
    platform: PlatformKey,
    index: number,
    value: string
  ) => {
    const currentIds =
      settings.tracking_pixels[platform];

    const updatedIds = [...currentIds];
    updatedIds[index] = value;

    updateTrackingIds(platform, updatedIds);
  };

  const removeTrackingId = (
    platform: PlatformKey,
    index: number
  ) => {
    const currentIds =
      settings.tracking_pixels[platform];

    updateTrackingIds(
      platform,
      currentIds.filter((_, i) => i !== index)
    );
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setSaved(false);

      const cleanedTracking = {
        meta: settings.tracking_pixels.meta
          .map((id) => id.trim())
          .filter(Boolean),

        tiktok: settings.tracking_pixels.tiktok
          .map((id) => id.trim())
          .filter(Boolean),

        google_analytics:
          settings.tracking_pixels.google_analytics
            .map((id) => id.trim())
            .filter(Boolean),

        snapchat: settings.tracking_pixels.snapchat
          .map((id) => id.trim())
          .filter(Boolean),
      };

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_name: settings.store_name,
          support_email: settings.support_email,
          currency: 'MAD',
          flat_rate: settings.flat_rate,
          free_shipping_threshold:
            settings.free_shipping_threshold,
          tracking_pixels: cleanedTracking,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Could not save settings'
        );
      }

      setSettings((current) => ({
        ...current,
        id: data.id,
        store_name: data.store_name ?? '',
        support_email: data.support_email ?? '',
        currency: 'MAD',
        flat_rate: Number(data.flat_rate ?? 0),
        free_shipping_threshold: Number(
          data.free_shipping_threshold ?? 0
        ),
        tracking_pixels: {
          meta: Array.isArray(data.tracking_pixels?.meta)
            ? data.tracking_pixels.meta
            : [],
          tiktok: Array.isArray(
            data.tracking_pixels?.tiktok
          )
            ? data.tracking_pixels.tiktok
            : [],
          google_analytics: Array.isArray(
            data.tracking_pixels?.google_analytics
          )
            ? data.tracking_pixels.google_analytics
            : [],
          snapchat: Array.isArray(
            data.tracking_pixels?.snapchat
          )
            ? data.tracking_pixels.snapchat
            : [],
        },
      }));

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Settings save error:', error);

      window.alert(
        error instanceof Error
          ? error.message
          : 'Could not save settings'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl mb-8">
          Settings
        </h1>

        <div className="bg-cream border border-obsidian/10 p-8 text-sm text-obsidian/50">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-8">
        Settings
      </h1>

      <div className="bg-cream border border-obsidian/10 p-8 space-y-8">
        {/* Store Details */}
        <section>
          <h2 className="font-display text-lg mb-4">
            Store Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Store Name
              </label>

              <input
                value={settings.store_name}
                onChange={(e) =>
                  updateField(
                    'store_name',
                    e.target.value
                  )
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Support Email
              </label>

              <input
                type="email"
                value={settings.support_email}
                onChange={(e) =>
                  updateField(
                    'support_email',
                    e.target.value
                  )
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Currency
              </label>

              <div className="input-field mt-1 bg-obsidian/5">
                MAD — Moroccan Dirham (د.م.)
              </div>
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="font-display text-lg mb-4">
            Shipping
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Flat Rate (د.م.)
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={settings.flat_rate}
                onChange={(e) =>
                  updateField(
                    'flat_rate',
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Free Shipping Threshold (د.م.)
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={
                  settings.free_shipping_threshold
                }
                onChange={(e) =>
                  updateField(
                    'free_shipping_threshold',
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>
          </div>
        </section>

        {/* Tracking & Pixels */}
        <section>
          <div className="mb-5">
            <h2 className="font-display text-lg">
              Tracking & Pixels
            </h2>

            <p className="text-sm text-obsidian/50 mt-1">
              Connect your advertising and analytics
              platforms to track visitors and conversions.
            </p>
          </div>

          <div className="space-y-3">
            {platforms.map((platform) => {
              const isOpen =
                openPlatform === platform.key;

              const ids =
                settings.tracking_pixels[
                  platform.key
                ];

              return (
                <div
                  key={platform.key}
                  className="border border-obsidian/10 bg-white/40 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPlatform(
                        isOpen ? null : platform.key
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-obsidian/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {platform.logo}

                      <div className="min-w-0">
                        <div className="font-medium">
                          {platform.name}
                        </div>

                        <div className="text-xs text-obsidian/50 mt-0.5">
                          {platform.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {ids.length > 0 && (
                        <span className="text-xs text-obsidian/40">
                          {ids.length}{' '}
                          {ids.length === 1
                            ? 'ID'
                            : 'IDs'}
                        </span>
                      )}

                      <span className="text-lg text-obsidian/50">
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-obsidian/10 p-4 space-y-4">
                      {ids.length === 0 ? (
                        <div className="text-sm text-obsidian/50 py-2">
                          No tracking IDs added yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {ids.map((id, index) => (
                            <div
                              key={`${platform.key}-${index}`}
                            >
                              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                                {platform.label}{' '}
                                {index + 1}
                              </label>

                              <div className="flex gap-2 mt-1">
                                <input
                                  value={id}
                                  onChange={(e) =>
                                    updateTrackingId(
                                      platform.key,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder={
                                    platform.placeholder
                                  }
                                  className="input-field flex-1"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTrackingId(
                                      platform.key,
                                      index
                                    )
                                  }
                                  className="px-3 border border-obsidian/10 text-obsidian/50 hover:text-red-600 hover:border-red-200 transition-colors"
                                  aria-label={`Remove ${platform.label} ${index + 1}`}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          addTrackingId(platform.key)
                        }
                        className="text-sm font-medium hover:underline"
                      >
                        + Add ID
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h2 className="font-display text-lg mb-4">
            Integrations
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center border border-obsidian/10 p-3">
              <span>Supabase Database</span>

              <span className="text-xs text-obsidian/50">
                Configured via .env
              </span>
            </div>

            <div className="flex justify-between items-center border border-obsidian/10 p-3">
              <span>Cloudinary Media</span>

              <span className="text-xs text-obsidian/50">
                Configured via .env
              </span>
            </div>
          </div>
        </section>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary"
        >
          {saving
            ? 'Saving...'
            : saved
              ? 'Saved ✓'
              : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}