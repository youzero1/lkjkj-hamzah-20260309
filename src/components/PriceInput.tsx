'use client';

import { useState } from 'react';

interface Props {
  basePrice: number;
  quantity: number;
  onChange: (basePrice: number, quantity: number) => void;
}

export default function PriceInput({ basePrice, quantity, onChange }: Props) {
  const [priceStr, setPriceStr] = useState(basePrice === 0 ? '' : String(basePrice));
  const [qtyStr, setQtyStr] = useState(String(quantity));
  const [errors, setErrors] = useState<{ price?: string; qty?: string }>({});

  const handlePriceChange = (val: string) => {
    setPriceStr(val);
    const num = parseFloat(val);
    if (val === '' || isNaN(num)) {
      setErrors((e) => ({ ...e, price: 'Enter a valid price' }));
      onChange(0, quantity);
    } else if (num < 0) {
      setErrors((e) => ({ ...e, price: 'Price cannot be negative' }));
      onChange(0, quantity);
    } else {
      setErrors((e) => ({ ...e, price: undefined }));
      onChange(num, quantity);
    }
  };

  const handleQtyChange = (val: string) => {
    setQtyStr(val);
    const num = parseInt(val);
    if (val === '' || isNaN(num)) {
      setErrors((e) => ({ ...e, qty: 'Enter a valid quantity' }));
      onChange(basePrice, 1);
    } else if (num < 1) {
      setErrors((e) => ({ ...e, qty: 'Quantity must be at least 1' }));
      onChange(basePrice, 1);
    } else {
      setErrors((e) => ({ ...e, qty: undefined }));
      onChange(basePrice, num);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
        Product Pricing
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Unit Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceStr}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              className="input-field pl-8"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
          )}
        </div>
        <div>
          <label className="label">Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            value={qtyStr}
            onChange={(e) => handleQtyChange(e.target.value)}
            placeholder="1"
            className="input-field"
          />
          {errors.qty && (
            <p className="mt-1 text-xs text-red-500">{errors.qty}</p>
          )}
        </div>
      </div>
      {basePrice > 0 && quantity > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Subtotal:</span>{' '}
            ${(basePrice * quantity).toFixed(2)}
            <span className="text-blue-500 ml-2">
              ({quantity} × ${basePrice.toFixed(2)})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
