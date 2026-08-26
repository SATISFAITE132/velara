'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/store/cart';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email'),
  fullName: z.string().min(2, 'Enter your full name'),
  line1: z.string().min(3, 'Enter your address'),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(1, 'Required'),
  postalCode: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  paymentMethod: z.enum(['cod', 'card']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const shipping = subtotal() < 75 ? 6.5 : 0;
  const total = subtotal() + shipping;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'United States',
      paymentMethod: 'cod',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          items: lines,
          subtotal: subtotal(),
          shipping,
          total,
          paymentMethod: data.paymentMethod,
          shippingAddress: {
            fullName: data.fullName,
            line1: data.line1,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
            phone: data.phone,
          },
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || 'Could not place order');
      }

      clear();
      router.push(`/thank-you?order=${result.orderNumber}`);
    } catch (error) {
      console.error('Checkout error:', error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong placing your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="container-vl py-32 text-center">
        <h1 className="font-display text-3xl">
          Nothing to check out yet
        </h1>

        <p className="text-obsidian/60 mt-3">
          Add a product to your bag first.
        </p>
      </div>
    );
  }

  return (
    <div className="container-vl py-16">
      <h1 className="font-display text-3xl md:text-4xl mb-12">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-3 gap-12"
      >
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="font-display text-xl mb-4">
              Contact
            </h2>

            <input
              {...register('email')}
              placeholder="Email address"
              className="input-field"
            />

            {errors.email && (
              <p className="error-text">
                {errors.email.message}
              </p>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl mb-4">
              Shipping Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                {...register('fullName')}
                placeholder="Full name"
                className="input-field sm:col-span-2"
              />

              <input
                {...register('line1')}
                placeholder="Address"
                className="input-field sm:col-span-2"
              />

              <input
                {...register('city')}
                placeholder="City"
                className="input-field"
              />

              <input
                {...register('state')}
                placeholder="State / Province"
                className="input-field"
              />

              <input
                {...register('postalCode')}
                placeholder="Postal Code"
                className="input-field"
              />

              <input
                {...register('country')}
                placeholder="Country"
                className="input-field"
              />

              <input
                {...register('phone')}
                placeholder="Phone"
                className="input-field sm:col-span-2"
              />
            </div>

            {(errors.fullName ||
              errors.line1 ||
              errors.city ||
              errors.state ||
              errors.postalCode ||
              errors.country ||
              errors.phone) && (
              <p className="error-text">
                Please complete all required shipping fields.
              </p>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl mb-4">
              Payment
            </h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 border border-obsidian/20 p-4 cursor-pointer">
                <input
                  type="radio"
                  value="cod"
                  {...register('paymentMethod')}
                  className="mt-1"
                />

                <span>
                  <span className="block font-medium">
                    Cash on Delivery
                  </span>

                  <span className="block text-xs text-obsidian/50 mt-1">
                    Pay when your order is delivered.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 border border-obsidian/20 p-4 cursor-pointer">
                <input
                  type="radio"
                  value="card"
                  {...register('paymentMethod')}
                  className="mt-1"
                />

                <span>
                  <span className="block font-medium">
                    Pay by Card
                  </span>

                  <span className="block text-xs text-obsidian/50 mt-1">
                    Pay securely by credit or debit card.
                  </span>
                </span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-6 space-y-4">
                <p className="text-xs text-obsidian/50">
                  Payments are processed securely. Card details
                  are never stored on our servers.
                </p>

                <input
                  {...register('cardNumber')}
                  placeholder="Card number"
                  className="input-field"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    {...register('cardExpiry')}
                    placeholder="MM/YY"
                    className="input-field"
                  />

                  <input
                    {...register('cardCvc')}
                    placeholder="CVC"
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {submitting
              ? 'Placing Order...'
              : `Place Order — €${total.toFixed(2)}`}
          </button>
        </div>

        <div className="bg-blush/60 p-8 h-fit">
          <h2 className="font-display text-xl mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {lines.map((l) => (
              <div
                key={l.productId}
                className="flex gap-3"
              >
                <div className="relative w-14 h-16 bg-cream shrink-0 overflow-hidden">
                  <Image
                    src={l.image}
                    alt={l.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                <div className="flex-1 text-sm">
                  <p>
                    {l.name} Ã— {l.quantity}
                  </p>

                  <p className="text-obsidian/50">
                    €{(l.price * l.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-obsidian/15 mt-6 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>€{subtotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? 'Free'
                  : `€${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between font-medium text-base pt-2">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


