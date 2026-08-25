'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { products as seedProducts } from '@/data/products';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showNew, setShowNew] = useState(false);

  const removeProduct = (id: string) => setProducts((p) => p.filter((x) => x.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <button onClick={() => setShowNew(true)} className="btn-primary py-2.5 px-5 text-xs">
          <Plus size={15} /> New Product
        </button>
      </div>

      <div className="bg-cream border border-obsidian/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-obsidian/50 border-b border-obsidian/10">
              <th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-obsidian/5 last:border-0 hover:bg-blush/30">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative w-10 h-12 bg-blush overflow-hidden shrink-0">
                    <Image src={p.heroImage} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-obsidian/60">{p.category}</td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">
                  <span className={p.stock < 20 ? 'text-error' : 'text-obsidian/70'}>{p.stock} units</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setEditing(p)} aria-label="Edit product"><Pencil size={15} className="text-obsidian/50 hover:text-obsidian" /></button>
                    <button onClick={() => removeProduct(p.id)} aria-label="Delete product"><Trash2 size={15} className="text-obsidian/50 hover:text-error" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || showNew) && (
        <ProductFormModal
          product={editing}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSave={(p) => {
            setProducts((prev) => (editing ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p]));
            setEditing(null);
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [category, setCategory] = useState(product?.category || 'Elixirs');

  return (
    <div className="fixed inset-0 bg-obsidian/50 z-50 flex items-center justify-center p-6">
      <div className="bg-cream max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5" aria-label="Close"><X size={20} /></button>
        <h2 className="font-display text-2xl mb-6">{product ? 'Edit Product' : 'New Product'}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input-field mt-1" />
            </div>
            <div>
              <label className="text-xs text-obsidian/50 uppercase tracking-wide">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="input-field mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs text-obsidian/50 uppercase tracking-wide">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Product['category'])} className="input-field mt-1">
              {['Elixirs', 'Serums', 'Treatments', 'Sets'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button
          className="btn-primary w-full mt-8"
          onClick={() =>
            onSave({
              ...(product || {
                id: crypto.randomUUID(),
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                tagline: '', description: '', story: '', size: '50ml', heroImage: '/placeholder.jpg',
                gallery: [], ingredients: [], howToUse: [], rating: 5, reviewCount: 0,
              }),
              name, price, stock, category,
            } as Product)
          }
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
