'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

type TrackedOrder = {
  order_number: string;
  status: string;
  created_at: string;
  timeline: { label: string; done: boolean }[];
};

function TrackOrderContent() {
  const params = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(
    params.get('order') || ''
  );
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/track?order=${encodeURIComponent(orderNumber)}`
      );

      const data = await res.json();

      if (!data.order) throw new Error();

      setOrder(data.order);
    } catch {
      setError(
        'We couldn’t find an order with that number. Please check and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-vl py-24 max-w-lg mx-auto">
      <p className="eyebrow text-center">Order Tracking</p>

      <h1 className="font-display text-3xl md:text-4xl text-center mt-3">
        Track Your Order
      </h1>

      <form onSubmit={lookup} className="mt-10 flex gap-3">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. VEL-4821-XQ"
          className="input-field"
          required
        />

        <button
          type="submit"
          className="btn-primary shrink-0"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Track'}
        </button>
      </form>

      {error && <p className="error-text mt-3">{error}</p>}

      {order && (
        <div className="mt-12 border border-obsidian/10 p-8">
          <p className="text-xs uppercase tracking-widest2 text-obsidian/50">
            Order
          </p>

          <p className="font-display text-xl mt-1">
            {order.order_number}
          </p>

          <p className="text-sm text-obsidian/50 mt-1 capitalize">
            Status: {order.status}
          </p>

          <div className="mt-8 space-y-4">
            {order.timeline.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    step.done
                      ? 'bg-gold text-obsidian'
                      : 'bg-obsidian/10 text-obsidian/30'
                  }`}
                >
                  {step.done ? (
                    <Check size={14} />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>

                <span
                  className={
                    step.done
                      ? 'text-obsidian'
                      : 'text-obsidian/40'
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderContent />
    </Suspense>
  );
}