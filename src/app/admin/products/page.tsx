'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Product } from '@/lib/types';

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  story: string | null;
  price: number;
  compare_at_price: number | null;
  size: string | null;
  category: Product['category'];
  hero_image: string | null;
  gallery: string[];
  ingredients: string[];
  how_to_use: string[];
  rating: number;
  review_count: number;
  stock: number;
  bestseller: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
};

const CATEGORIES = [
  'Elixirs',
  'Serums',
  'Treatments',
  'Sets',
] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await fetch('/api/admin/products');

      if (!response.ok) {
        throw new Error('Could not load products');
      }

      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Products error:', error);
      alert('Could not load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function saveProduct(product: DbProduct) {
    try {
      const isEditing = Boolean(editing);

      const response = await fetch('/api/admin/products', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Could not save product');
      }

      const savedProduct = await response.json();

      if (isEditing) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === savedProduct.id ? savedProduct : p
          )
        );
      } else {
        setProducts((prev) => [
          savedProduct,
          ...prev,
        ]);
      }

      setEditing(null);
      setShowNew(false);
    } catch (error) {
      console.error('Save product error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Could not save product'
      );
    }
  }

  async function removeProduct(id: string) {
    if (!confirm('Delete this product?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Could not delete product');
      }

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Could not delete product');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">
          Products
        </h1>

        <button
          onClick={() => setShowNew(true)}
          className="btn-primary py-2.5 px-5 text-xs"
        >
          <Plus size={15} />
          New Product
        </button>
      </div>

      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-sm text-obsidian/50">
            Loading products...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flags</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-obsidian/40"
                  >
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-blush overflow-hidden shrink-0">
                          {p.hero_image && (
                            <Image
                              src={p.hero_image}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>

                        <div>
                          <div className="font-medium">
                            {p.name}
                          </div>

                          <div className="text-xs text-obsidian/40">
                            {p.size || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-obsidian/60">
                      {p.category}
                    </td>

                    <td className="p-4">
                      {Number(p.price).toFixed(2)} د.م.

                      {p.compare_at_price && (
                        <span className="ml-2 text-xs line-through text-obsidian/40">
                          {Number(p.compare_at_price).toFixed(2)} د.م.
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          p.stock < 20
                            ? 'text-error'
                            : 'text-obsidian/70'
                        }
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="p-4 text-xs space-x-1">
                      {p.bestseller && (
                        <span className="inline-block border border-gold px-2 py-1">
                          Bestseller
                        </span>
                      )}

                      {p.is_new && (
                        <span className="inline-block border border-obsidian/20 px-2 py-1">
                          New
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setEditing(p)}
                          aria-label="Edit product"
                        >
                          <Pencil
                            size={15}
                            className="text-obsidian/50 hover:text-obsidian"
                          />
                        </button>

                        <button
                          onClick={() =>
                            removeProduct(p.id)
                          }
                          aria-label="Delete product"
                        >
                          <Trash2
                            size={15}
                            className="text-obsidian/50 hover:text-error"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {(editing || showNew) && (
        <ProductFormModal
          product={editing}
          onClose={() => {
            setEditing(null);
            setShowNew(false);
          }}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: DbProduct | null;
  onClose: () => void;
  onSave: (product: DbProduct) => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [description, setDescription] = useState(
    product?.description || ''
  );
  const [story, setStory] = useState(product?.story || '');

  const [price, setPrice] = useState(
    product?.price || 0
  );

  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price || 0
  );

  const [size, setSize] = useState(
    product?.size || '50ml'
  );

  const [category, setCategory] =
    useState<Product['category']>(
      product?.category || 'Elixirs'
    );

  const [heroImage, setHeroImage] = useState(
    product?.hero_image || ''
  );

  const [gallery, setGallery] = useState(
    product?.gallery?.join('\n') || ''
  );

  const [ingredients, setIngredients] = useState(
    product?.ingredients?.join('\n') || ''
  );

  const [howToUse, setHowToUse] = useState(
    product?.how_to_use?.join('\n') || ''
  );

  const [rating, setRating] = useState(
    product?.rating || 5
  );

  const [reviewCount, setReviewCount] = useState(
    product?.review_count || 0
  );

  const [stock, setStock] = useState(
    product?.stock || 0
  );

  const [bestseller, setBestseller] = useState(
    product?.bestseller || false
  );

  const [isNew, setIsNew] = useState(
    product?.is_new || false
  );

  function handleSave() {
    const cleanName = name.trim();

    if (!cleanName) {
      alert('Product name is required');
      return;
    }

    const generatedSlug =
      cleanName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const newProduct: DbProduct = {
      id:
        product?.id ||
        crypto.randomUUID(),

      slug:
        slug.trim() ||
        product?.slug ||
        generatedSlug,

      name: cleanName,

      tagline:
        tagline.trim() || null,

      description:
        description.trim() || null,

      story:
        story.trim() || null,

      price: Number(price) || 0,

      compare_at_price:
        Number(compareAtPrice) || null,

      size:
        size.trim() || null,

      category,

      hero_image:
        heroImage.trim() || null,

      gallery: gallery
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),

      ingredients: ingredients
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),

      how_to_use: howToUse
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),

      rating: Number(rating) || 0,

      review_count:
        Number(reviewCount) || 0,

      stock:
        Number(stock) || 0,

      bestseller,

      is_new: isNew,

      created_at:
        product?.created_at ||
        new Date().toISOString(),

      updated_at:
        new Date().toISOString(),
    };

    onSave(newProduct);
  }

  return (
    <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-cream max-w-2xl w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-2xl mb-6">
          {product
            ? 'Edit Product'
            : 'New Product'}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="input-field mt-1"
              placeholder="Gold Elixir"
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Slug
            </label>

            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              className="input-field mt-1"
              placeholder="gold-elixir"
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Tagline
            </label>

            <input
              value={tagline}
              onChange={(e) =>
                setTagline(e.target.value)
              }
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="input-field mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Story
            </label>

            <textarea
              value={story}
              onChange={(e) =>
                setStory(e.target.value)
              }
              className="input-field mt-1"
              rows={3}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Price (د.م.)
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Compare-at Price (د.م.)
              </label>

              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) =>
                  setCompareAtPrice(
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Size
              </label>

              <input
                value={size}
                onChange={(e) =>
                  setSize(e.target.value)
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as Product['category']
                  )
                }
                className="input-field mt-1"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Hero Image URL
            </label>

            <input
              value={heroImage}
              onChange={(e) =>
                setHeroImage(e.target.value)
              }
              className="input-field mt-1"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Gallery URLs
            </label>

            <textarea
              value={gallery}
              onChange={(e) =>
                setGallery(e.target.value)
              }
              className="input-field mt-1"
              rows={4}
              placeholder="One image URL per line"
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              Ingredients
            </label>

            <textarea
              value={ingredients}
              onChange={(e) =>
                setIngredients(e.target.value)
              }
              className="input-field mt-1"
              rows={4}
              placeholder="One ingredient per line"
            />
          </div>

          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">
              How To Use
            </label>

            <textarea
              value={howToUse}
              onChange={(e) =>
                setHowToUse(e.target.value)
              }
              className="input-field mt-1"
              rows={4}
              placeholder="One step per line"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Rating
              </label>

              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Review Count
              </label>

              <input
                type="number"
                min="0"
                value={reviewCount}
                onChange={(e) =>
                  setReviewCount(
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(
                    Number(e.target.value)
                  )
                }
                className="input-field mt-1"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-obsidian/10 pt-5">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={(e) =>
                  setBestseller(
                    e.target.checked
                  )
                }
              />

              <span>
                Bestseller
              </span>
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) =>
                  setIsNew(
                    e.target.checked
                  )
                }
              />

              <span>
                New Product
              </span>
            </label>
          </div>
        </div>

        <button
          className="btn-primary w-full mt-8"
          onClick={handleSave}
        >
          {product
            ? 'Save Changes'
            : 'Create Product'}
        </button>
      </div>
    </div>
  );
}