"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductFormClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSize) return;
    if (product.colors?.length > 0 && !selectedColour) return;
    
    addItem({
      productId: product.id,
      name: `${product.name}${selectedColour ? ` - ${selectedColour}` : ""}`,
      price: Number(product.price),
      size: selectedSize,
      quantity: 1,
      image: product.images?.[0]?.url
    });
  };

  const hasStock = product.sizes.some((size: any) => size.stock > 0);

  if (!hasStock) {
    return null; // Don't render the form if completely out of stock
  }

  const hasColors = product.colors && product.colors.length > 0;

  return (
    <form className="mt-6" onSubmit={handleAddToCart}>
      {/* Colour picker */}
      {hasColors && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium text-gray-900">Colour</h2>
            {selectedColour && (
              <span className="text-sm text-gray-500">— {selectedColour}</span>
            )}
          </div>
          <div className="flex gap-3">
            {product.colors.map((colour: any) => {
              const isSelected = selectedColour === colour.name;
              const isWhite = colour.hex.toLowerCase() === "#ffffff" || colour.hex.toLowerCase() === "#fff";
              return (
                <button
                  key={colour.name}
                  type="button"
                  aria-label={colour.name}
                  title={colour.name}
                  onClick={() => setSelectedColour(colour.name)}
                  className={`
                    w-8 h-8 rounded-full transition-all duration-200 focus:outline-none
                    ${isWhite ? "border border-gray-300" : ""}
                    ${isSelected
                      ? "ring-2 ring-offset-2 ring-black scale-110"
                      : "hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-gray-400"}
                  `}
                  style={{ backgroundColor: colour.hex }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Size picker */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Size</h2>
        </div>

        <div className="mt-2">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {product.sizes.map((size: any) => {
              const isOutOfStock = size.stock === 0;
              const isSelected = selectedSize === size.name;
              
              return (
                <label 
                  key={size.id}
                  className={`border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none 
                    ${isOutOfStock ? "bg-gray-50 text-gray-200 cursor-not-allowed opacity-50" : "bg-white text-gray-900 hover:bg-gray-50"}
                    ${isSelected ? "ring-2 ring-black border-transparent" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size.name}
                    disabled={isOutOfStock}
                    className="sr-only"
                    onChange={() => setSelectedSize(size.name)}
                    checked={isSelected}
                  />
                  <span>{size.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedSize || (hasColors && !selectedColour)}
        className={`mt-8 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-4 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
          (selectedSize && (!hasColors || selectedColour)) ? "bg-black hover:bg-gray-800" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to cart
      </button>
    </form>
  );
}
