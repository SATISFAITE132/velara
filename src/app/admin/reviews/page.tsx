'use client';

import { useEffect, useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';

type Review = {
  id: string;
  product_id: string | null;
  customer_id: string | null;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  approved: boolean;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    try {
      const [reviewsRes, productsRes] = await Promise.all([
        fetch('/api/admin/reviews'),
        fetch('/api/admin/products'),
      ]);

      if (!reviewsRes.ok || !productsRes.ok) {
        throw new Error('Could not load reviews');
      }

      const reviewsData = await reviewsRes.json();
      const productsData = await productsRes.json();

      setReviews(reviewsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Reviews load error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  function productName(id: string | null) {
    if (!id) return 'Unknown';

    return (
      products.find((product) => product.id === id)?.name ||
      'Unknown'
    );
  }

  async function approveReview(id: string) {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          approved: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not approve review');
      }

      const updatedReview = await response.json();

      setReviews((current) =>
        current.map((review) =>
          review.id === updatedReview.id
            ? updatedReview
            : review
        )
      );
    } catch (error) {
      console.error('Approve review error:', error);
      alert('Could not approve review');
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('Delete this review?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Could not delete review');
      }

      setReviews((current) =>
        current.filter((review) => review.id !== id)
      );
    } catch (error) {
      console.error('Delete review error:', error);
      alert('Could not delete review');
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Reviews</h1>

      {loading ? (
        <div className="bg-cream border border-obsidian/10 p-8 text-center text-obsidian/50">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-cream border border-obsidian/10 p-8 text-center text-obsidian/50">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-cream border border-obsidian/10 p-5 flex justify-between items-start gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={13}
                        className={
                          index < review.rating
                            ? 'fill-gold text-gold'
                            : 'text-obsidian/20'
                        }
                      />
                    ))}
                  </div>

                  <span className="font-medium text-sm">
                    {review.title || 'Untitled review'}
                  </span>

                  {review.verified && (
                    <span className="text-[10px] uppercase text-success">
                      Verified
                    </span>
                  )}

                  {review.approved && (
                    <span className="text-[10px] uppercase text-success">
                      Approved
                    </span>
                  )}
                </div>

                <p className="text-sm text-obsidian/60 mt-2 max-w-xl">
                  {review.body || ''}
                </p>

                <p className="text-xs text-obsidian/40 mt-2">
                  {review.author} on{' '}
                  {productName(review.product_id)} ·{' '}
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                {!review.approved && (
                  <button
                    onClick={() => approveReview(review.id)}
                    aria-label="Approve review"
                    className="p-2 border border-obsidian/15 hover:bg-success/10"
                  >
                    <Check size={15} />
                  </button>
                )}

                <button
                  onClick={() => deleteReview(review.id)}
                  aria-label="Delete review"
                  className="p-2 border border-obsidian/15 hover:bg-error/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}