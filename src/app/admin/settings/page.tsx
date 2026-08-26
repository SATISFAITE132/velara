'use client';

import { useEffect, useState } from 'react';

type Settings = {
  id: number;
  store_name: string;
  support_email: string;
  currency: string;
  flat_rate: number;
  free_shipping_threshold: number;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    id: 1,
    store_name: '',
    support_email: '',
    currency: 'USD',
    flat_rate: 0,
    free_shipping_threshold: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');

        if (!response.ok) {
          throw new Error('Could not load settings');
        }

        const data = await response.json();

        setSettings({
          id: data.id,
          store_name: data.store_name ?? '',
          support_email: data.support_email ?? '',
          currency: data.currency ?? 'USD',
          flat_rate: Number(data.flat_rate ?? 0),
          free_shipping_threshold: Number(data.free_shipping_threshold ?? 0),
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

  const saveSettings = async () => {
    try {
      setSaving(true);
      setSaved(false);

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_name: settings.store_name,
          support_email: settings.support_email,
          currency: settings.currency,
          flat_rate: settings.flat_rate,
          free_shipping_threshold: settings.free_shipping_threshold,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Could not save settings');
      }

      setSettings({
        id: data.id,
        store_name: data.store_name ?? '',
        support_email: data.support_email ?? '',
        currency: data.currency ?? 'USD',
        flat_rate: Number(data.flat_rate ?? 0),
        free_shipping_threshold: Number(data.free_shipping_threshold ?? 0),
      });

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

  const currencySymbol =
    settings.currency === 'EUR'
      ? '€'
      : settings.currency === 'GBP'
        ? '£'
        : '$';

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-8">
        Settings
      </h1>

      <div className="bg-cream border border-obsidian/10 p-8 space-y-8">
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
                  updateField('store_name', e.target.value)
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
                  updateField('support_email', e.target.value)
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Currency
              </label>

              <select
                value={settings.currency}
                onChange={(e) =>
                  updateField('currency', e.target.value)
                }
                className="input-field mt-1"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg mb-4">
            Shipping
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Flat Rate ({currencySymbol})
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.flat_rate}
                onChange={(e) =>
                  updateField('flat_rate', Number(e.target.value))
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Free Shipping Threshold ({currencySymbol})
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.free_shipping_threshold}
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
