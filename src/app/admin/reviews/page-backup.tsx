'use client';
import { useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';
import { reviews as seedReviews } from '@/data/products';
import { products } from '@/data/products';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(seedReviews);
  const productName = (id: string) => products.find((p) => p.id === id)?.name || 'Unknown';

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Reviews</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-cream border border-obsidian/10 p-5 flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className={i < r.rating ? 'fill-gold text-gold' : 'text-obsidian/20'} />)}
                </div>
                <span className="font-medium text-sm">{r.title}</span>
                {r.verified && <span className="text-[10px] uppercase text-success">Verified</span>}
              </div>
              <p className="text-sm text-obsidian/60 mt-2 max-w-xl">{r.body}</p>
              <p className="text-xs text-obsidian/40 mt-2">{r.author} on {productName(r.productId)} · {r.date}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button aria-label="Approve review" className="p-2 border border-obsidian/15 hover:bg-success/10"><Check size={15} /></button>
              <button onClick={() => setReviews((rs) => rs.filter((x) => x.id !== r.id))} aria-label="Delete review" className="p-2 border border-obsidian/15 hover:bg-error/10"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
