'use client';

import { useState } from 'react';
import { DiscountType } from '@/types';

interface Props {
  discountType: DiscountType;
  discountValue: number;
  onChange: (type: DiscountType, value: number) => void;
}

export default function DiscountInput({ discountType, discountValue, onChange }: Props) {
  const [valueStr, setValueStr] = useState(discountValue === 0 ? '' : String(discountValue));
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (type: DiscountType) => {
    setValueStr('');
    setError(null);
    onChange(type, 0);
  };

  const handleValueChange = (val: string) => {
    setValueStr(val);
    const num = parseFloat(val);
    if (val === '' || isNaN(num)) {
      setError(null);
      onChange(discountType, 0);
      return;
    }
    if (num < 0) {
      setError('Discount cannot be negative');
      return;
    }
    if (discountType === 'percentage' && num > 100) {
      setError('Percentage cannot exceed 100%');
      return;
    }
    setError(null);
    onChange(discountType, num);
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
        Discount
      </h2>
      <div className="space-y-4">
        <div>
          <label className="label">Discount Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange('percentage')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-all duration-200 ${
                discountType === 'percentage'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              % Percentage
            </button>
            <button
              onClick={() => handleTypeChange('fixed')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-all duration-200 ${
                discountType === 'fixed'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              $ Fixed Amount
            </button>
          </div>
        </div>
        <div>
          <label className="label">
            {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (per item)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              {discountType === 'percentage' ? '%' : '$'}
            </span>
            <input
              type="number"
              min="0"
              max={discountType === 'percentage' ? 100 : undefined}
              step={discountType === 'percentage' ? '1' : '0.01'}
              value={valueStr}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={discountType === 'percentage' ? '0' : '0.00'}
              className="input-field pl-8"
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
