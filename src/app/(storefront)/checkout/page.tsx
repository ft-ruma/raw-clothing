"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import { createOrder } from "@/actions/order";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      fullName: formData.get("fullName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      items: items.map(item => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity
      }))
    };

    const result = await createOrder(data);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      clearCart();
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center mt-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl uppercase">Thank you!</h1>
        <p className="mt-4 text-xl text-gray-500">Your order has been placed successfully.</p>
        <p className="mt-2 text-base text-gray-500">We'll send you an email confirmation shortly.</p>
        <div className="mt-10">
          <Link href="/" className="inline-block bg-black px-8 py-4 font-bold uppercase tracking-wide text-white hover:bg-neutral-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center mt-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl uppercase">Your cart is empty</h1>
        <div className="mt-10">
          <Link href="/" className="inline-block bg-black px-8 py-4 font-bold uppercase tracking-wide text-white hover:bg-neutral-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-24 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto lg:max-w-none">
        <h1 className="sr-only">Checkout</h1>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Order summary */}
          <div className="mt-10 lg:mt-0 mb-10 lg:mb-0 lg:order-last">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.size}`} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0 relative w-20 h-20 rounded-md bg-gray-100 border">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex-1 flex flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                        </div>
                      </div>
                      <div className="flex-1 pt-2 flex items-end justify-between">
                        <p className="mt-1 text-sm font-medium text-gray-900">Rs. {Number(item.price).toFixed(2)}</p>
                        <div className="text-sm text-gray-500">Qty {item.quantity}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">Rs. {cartTotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">Free</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">Rs. {cartTotal.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Checkout form */}
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input type="email" id="email" name="email" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 border" />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full name</label>
                    <div className="mt-1">
                      <input type="text" name="fullName" id="fullName" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 border" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1">
                      <input type="text" name="address" id="address" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 border" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <div className="mt-1">
                      <input type="text" name="city" id="city" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 border" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <div className="mt-1">
                      <select id="country" name="country" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 border bg-white">
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                    <div className="mt-1">
                      <input type="text" name="postalCode" id="postalCode" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 border" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section - Stubbed */}
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Payment</h2>
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-600">This is a simulated checkout. No real payment will be processed. Clicking "Place Order" will successfully generate an order in the database.</p>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="mt-10 border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-black border border-transparent rounded-md shadow-sm py-4 px-4 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                >
                  {isPending ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
