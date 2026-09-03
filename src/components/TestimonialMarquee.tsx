
'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Testimonial = {
  id: string;
  text: string;
  author: string;
  rating: number;
};

export default function TestimonialMarquee() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);

  useEffect(() => {
    const supabase = createClient();

    async function loadReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, body, author, rating')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Reviews error:', error);
        return;
      }

      setReviews(
        (data ?? [])
          .filter((review) => review.body && review.author)
          .map((review) => ({
            id: review.id,
            text: review.body,
            author: review.author,
            rating: Number(review.rating ?? 5),
          }))
      );
    }

    loadReviews();
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  const items = [...reviews, ...reviews];

  return (
    <section className="py-16 overflow-hidden border-y border-obsidian/10">
      <div className="flex gap-16 animate-[marquee_32s_linear_infinite] w-max">
        {items.map((review, i) => (
          <div
            key={`${review.id}-${i}`}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  size={13}
                  className={
                    s < review.rating
                      ? 'fill-gold text-gold'
                      : 'text-obsidian/20'
                  }
                />
              ))}
            </div>

            <p className="font-display italic text-lg whitespace-nowrap">
              &ldquo;{review.text}&rdquo;
            </p>

            <span className="text-xs text-obsidian/40 whitespace-nowrap">
              — {review.author}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

