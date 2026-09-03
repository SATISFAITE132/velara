'use client';

import { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/lib/types';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent } from '@/lib/analytics';

export default function AddToBagPanel({
  product,
}: {
  product: Product;
}) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const trackedProductView = useRef(false);

  useEffect(() => {
    if (trackedProductView.current) {
      return;
    }

    trackedProductView.current = true;

    trackEvent('product_view', {
      productId: product.id,
      path: window.location.pathname,
      metadata: {
        product_name: product.name,
        product_slug: product.slug,
      },
    });
  }, [product.id, product.name, product.slug]);

  function handleAddToBag() {
    addItem(product, qty);

    trackEvent('add_to_cart', {
      productId: product.id,
      value: product.price * qty,
      path: window.location.pathname,
      metadata: {
        product_name: product.name,
        quantity: qty,
      },
    });

    toast.success(
      `${product.name} added to your bag`
    );
  }

  return (
    <div className="flex items-center gap-4 mt-8">
      <div className="flex items-center border border-obsidian/20">
        <button
          className="p-3"
          onClick={() =>
            setQty((q) => Math.max(1, q - 1))
          }
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>

        <span className="px-4 text-sm w-8 text-center">
          {qty}
        </span>

        <button
          className="p-3"
          onClick={() =>
            setQty((q) => q + 1)
          }
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        className="btn-primary flex-1"
        onClick={handleAddToBag}
      >
        Add to Bag — {formatPrice(product.price * qty)}
      </button>
    </div>
  );
}