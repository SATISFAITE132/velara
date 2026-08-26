'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/currency';

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();

  const [flatRate, setFlatRate] = useState(6.5);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(75);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Morocco');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings', {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setFlatRate(Number(data.flat_rate ?? 6.5));
        setFreeShippingThreshold(
          Number(data.free_shipping_threshold ?? 75)
        );
      } catch (error) {
        console.error('Store settings load error:', error);
      }
    }

    loadSettings();
  }, []);

  const currentSubtotal = subtotal();

  const shipping =
    currentSubtotal < freeShippingThreshold
      ? flatRate
      : 0;

  const total = currentSubtotal + shipping;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    if (lines.length === 0) {
      setError('Your bag is empty.');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (!address.trim()) {
      setError('Please enter your address.');
      return;
    }

    if (!city.trim()) {
      setError('Please enter your city.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          items: lines,
          subtotal: currentSubtotal,
          shipping,
          discount: 0,
          total,
          paymentMethod: 'cash_on_delivery',
          shippingAddress: {
            fullName: fullName.trim(),
            line1: address.trim(),
            line2: '',
            city: city.trim(),
            state: '',
            postalCode: '',
            country: country.trim(),
            phone: phone.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Could not place order'
        );
      }

      clear();

      router.push(
        `/thank-you?order=${encodeURIComponent(
          data.orderNumber
        )}`
      );
    } catch (error) {
      console.error('Checkout error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Could not place order'
      );

      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-vl py-32 text-center">
        <h1 className="font-display text-3xl">
          Your bag is empty
        </h1>

        <p className="text-obsidian/60 mt-3">
          Add a product to your bag before checkout.
        </p>

        <a
          href="/shop"
          className="btn-primary inline-flex mt-8"
        >
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <div className="container-vl py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl mb-12">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 gap-12"
        >
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="font-display text-xl mb-5">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    className="input-field mt-1"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    className="input-field mt-1"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    className="input-field mt-1"
                    placeholder="+212 6 00 00 00 00"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl mb-5">
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                    Address
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    className="input-field mt-1"
                    placeholder="Street address"
                    autoComplete="street-address"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    className="input-field mt-1"
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                </div>

                <div>
                  <label className="text-xs text-obsidian/50 uppercase tracking-wide">
                    Country
                  </label>

                  <input
                    type="text"
                    value={country}
                    onChange={(event) =>
                      setCountry(event.target.value)
                    }
                    className="input-field mt-1"
                    autoComplete="country-name"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl mb-5">
                Payment
              </h2>

              <div className="border border-obsidian/15 p-5">
                <p className="font-medium">
                  Cash on Delivery
                </p>

                <p className="text-sm text-obsidian/60 mt-1">
                  Pay when your order arrives.
                </p>
              </div>
            </section>

            {error && (
              <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading
                ? 'Placing Order...'
                : 'Place Order'}
            </button>
          </div>

          <aside className="bg-blush/60 p-8 h-fit">
            <h2 className="font-display text-xl mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              {lines.map((line) => (
                <div
                  key={line.productId}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p>{line.name}</p>

                    <p className="text-xs text-obsidian/50 mt-1">
                      {line.quantity} × {formatPrice(line.price)}
                    </p>
                  </div>

                  <p className="shrink-0">
                    {formatPrice(
                      line.price * line.quantity
                    )}
                  </p>
                </div>
              ))}

              <div className="border-t border-obsidian/15 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>
                    {formatPrice(currentSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? 'Free'
                      : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-obsidian/15 pt-4 font-medium">
                  <span>Total</span>

                  <span>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}