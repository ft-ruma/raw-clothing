"use client";

import { useCart } from "./CartProvider";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setIsCartOpen(false)}
          >
            <span className="sr-only">Close panel</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-1 text-gray-900 font-medium">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>Rs. {cartTotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
