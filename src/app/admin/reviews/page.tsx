'use client';

import { useEffect, useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';

type Review = {
  id: string;
  product_id: string | null;
  customer_id: string | null;
  author: string;
  email: string | null;
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
        <div className="overflow-x-auto border border-obsidian/10">
          <table className="w-full min-w-[1000px] table-fixed bg-cream">
            <thead>
              <tr className="border-b border-obsidian/10 text-left">
                <th className="w-[18%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Email
                </th>

                <th className="w-[12%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Name
                </th>

                <th className="w-[12%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Rating
                </th>

                <th className="w-[25%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Review
                </th>

                <th className="w-[10%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Product
                </th>

                <th className="w-[8%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Status
                </th>

                <th className="w-[8%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Date
                </th>

                <th className="w-[7%] px-4 py-4 text-xs uppercase tracking-wider font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-obsidian/10 last:border-b-0 align-top"
                >
                  <td className="px-4 py-4 text-sm break-words">
                    {review.email || 'Not provided'}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium break-words">
                    {review.author}
                  </td>

                  <td className="px-4 py-4">
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
                  </td>

                  <td className="px-4 py-4 text-sm text-obsidian/60">
                    <p className="max-h-16 overflow-hidden break-words leading-5">
                      {review.body || ''}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm break-words">
                    {productName(review.product_id)}
                  </td>

                  <td className="px-4 py-4">
                    {review.approved ? (
                      <span className="text-[10px] uppercase text-success">
                        Approved
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase text-obsidian/40">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-obsidian/50">
                    {new Date(
                      review.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}