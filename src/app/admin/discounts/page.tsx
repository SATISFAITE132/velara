'use client';

import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Power } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';

type Discount = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  usage_count: number;
  usage_limit: number | null;
  expires_at: string | null;
  created_at: string;
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDiscounts = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/discounts');

      if (!response.ok) {
        throw new Error('Could not load discounts');
      }

      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const toggleDiscount = async (discount: Discount) => {
    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: discount.id,
          active: !discount.active,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not update discount');
      }

      const updated = await response.json();

      setDiscounts((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDiscount = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this discount code?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Could not delete discount');
      }

      setDiscounts((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Discounts</h1>

        <button
          onClick={() => setShowNew(true)}
          className="btn-primary py-2.5 px-5 text-xs"
        >
          <Plus size={15} />
          New Code
        </button>
      </div>

      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-sm text-obsidian/50">
            Loading discounts...
          </div>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-sm text-obsidian/50">
            No discount codes yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Used</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody>
              {discounts.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30"
                >
                  <td className="p-4 font-mono font-medium">
                    {d.code}
                  </td>

                  <td className="p-4 capitalize text-obsidian/60">
                    {d.type}
                  </td>

                  <td className="p-4">
  {d.type === 'percentage'
    ? `${d.value}%`
    : `${d.value.toFixed(2)} د.م.`}
</td>

                  <td className="p-4">
                    {d.usage_count}
                    {d.usage_limit
                      ? ` / ${d.usage_limit}`
                      : ''}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleDiscount(d)}
                      title={
                        d.active
                          ? 'Deactivate'
                          : 'Activate'
                      }
                    >
                      <StatusBadge
                        status={
                          d.active
                            ? 'active'
                            : 'inactive'
                        }
                      />
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => toggleDiscount(d)}
                        aria-label={
                          d.active
                            ? 'Deactivate discount'
                            : 'Activate discount'
                        }
                        className="text-obsidian/50 hover:text-obsidian"
                      >
                        <Power size={15} />
                      </button>

                      <button
                        onClick={() => deleteDiscount(d.id)}
                        aria-label="Delete discount"
                        className="text-obsidian/50 hover:text-error"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showNew && (
        <NewDiscountModal
          onClose={() => setShowNew(false)}
          onCreated={(discount) => {
            setDiscounts((current) => [
              discount,
              ...current,
            ]);
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
}

function NewDiscountModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (discount: Discount) => void;
}) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>(
    'percentage'
  );
  const [value, setValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [saving, setSaving] = useState(false);

  const createDiscount = async () => {
    if (!code.trim() || !value) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value: Number(value),
          active: true,
          usage_count: 0,
          usage_limit: usageLimit
            ? Number(usageLimit)
            : null,
          expires_at: expiresAt
            ? `${expiresAt}T23:59:59`
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Could not create discount'
        );
      }

      onCreated(data);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : 'Could not create discount'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-6">
      <div className="bg-cream max-w-sm w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-2xl mb-6">
          New Discount Code
        </h2>

        <div className="space-y-4">
          <input
            value={code}
            onChange={(e) =>
              setCode(e.target.value.toUpperCase())
            }
            placeholder="CODE"
            className="input-field uppercase"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | 'percentage'
                    | 'fixed'
                )
              }
              className="input-field"
            >
              <option value="percentage">
                Percentage
              </option>
              <option value="fixed">
                Fixed
              </option>
            </select>

            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) =>
                setValue(e.target.value)
              }
              placeholder="Value"
              className="input-field"
            />
          </div>

          <input
            type="number"
            min="1"
            value={usageLimit}
            onChange={(e) =>
              setUsageLimit(e.target.value)
            }
            placeholder="Usage limit (optional)"
            className="input-field"
          />

          <input
            type="date"
            value={expiresAt}
            onChange={(e) =>
              setExpiresAt(e.target.value)
            }
            className="input-field"
          />
        </div>

        <button
          className="btn-primary w-full mt-8"
          onClick={createDiscount}
          disabled={saving}
        >
          {saving ? 'Creating...' : 'Create Code'}
        </button>
      </div>
    </div>
  );
}