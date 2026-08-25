'use client';
import { motion } from 'framer-motion';

// Signature brand motif: a ribbon of "liquid gold" pouring down and pooling
// into a droplet. Used in the hero and as a section divider throughout the site.
export default function GoldPour({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex justify-center ${className}`} aria-hidden="true">
      <svg width="64" height="140" viewBox="0 0 64 140" fill="none">
        <motion.rect
          x="30" y="0" width="4" height="100" rx="2"
          fill="url(#pourGradient)"
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: 100, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.path
          d="M32 96 C 20 96 12 106 12 116 C 12 128 21 136 32 136 C 43 136 52 128 52 116 C 52 106 44 96 32 96 Z"
          fill="url(#pourGradient)"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '32px 116px' }}
        />
        <defs>
          <linearGradient id="pourGradient" x1="0" y1="0" x2="0" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D9BD8E" />
            <stop offset="1" stopColor="#8A6B3F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
