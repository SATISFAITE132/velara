'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GoldPour from '@/components/GoldPour';

function ThankYouContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order') || 'VEL-0000-XX';

  return (
    <div className="container-vl py-32 text-center max-w-lg mx-auto">
      <GoldPour />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className="eyebrow mt-6">Order Confirmed</p>

        <h1 className="font-display text-4xl mt-3">
          Thank You
        </h1>

        <p className="text-obsidian/60 mt-4 leading-relaxed">
          Your ritual is on its way. A confirmation has been sent to your
          email, and your order will be blended into our next dispatch run.
        </p>

        <div className="mt-8 bg-blush/60 py-4 px-6 inline-block">
          <p className="text-xs text-obsidian/50 uppercase tracking-widest2">
            Order Number
          </p>

          <p className="font-display text-xl mt-1">
            {orderNumber}
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-10">
          <Link
            href={`/track-order?order=${orderNumber}`}
            className="btn-primary"
          >
            Track Order
          </Link>

          <Link href="/shop" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}