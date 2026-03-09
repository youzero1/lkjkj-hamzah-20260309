'use client';

import { useState } from 'react';

interface Props {
  shippingCost: number;
  onChange: (cost: number) => void;
}

const SHIPPING_OPTIONS = [
  { label: 'Free', value: 0, description: 'No shipping cost' },
  { label: 'Standard', value: 5.99, description: '5-7 business days' },
  { label: 'Express', value: 14.99, description: '2-3 business days' },
  { label: 'Overnight', value: 29.99, description: 'Next business day' },
];

export default function ShippingInput({ shippingCost, onChange }: Props) {
  const [customStr, setCustomStr] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreset = (value: number) => {
    setUseCustom(false);
    setCustomStr('');
    setError(null);
    onChange(value);
  };

  const handleCustom = (val: string) => {
    setCustomStr(val);
    setUseCustom(true);
    const num = parseFloat(val);
    if (val === '' || isNaN(num)) {
      setError('Enter a valid shipping cost');
      onChange(0);
      return;
    }
    if (num < 0) {
      setError('Shipping cost cannot be negative');
      return;
    }
    setError(null);
    onChange(num);
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">4</span>
        Shipping Cost
      </h2>
      <div className="space-y-4">
        <div>
          <label className="label">Shipping Options</label>
          <div className="grid grid-cols-2 gap-2">
            {SHIPPING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePreset(opt.value)}
                className={`p-3 rounded-lg text-left border transition-all duration-200 ${
                  !useCustom && shippingCost === opt.value
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-sm">{opt.label}</div>
                <div
                  className={`text-xs mt-0.5 ${
                    !useCustom && shippingCost === opt.value ? 'text-purple-200' : 'text-gray-400'
                  }`}
                >
                  {opt.value === 0 ? 'Free' : `$${opt.value.toFixed(2)}`} — {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Custom Shipping Cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={customStr}
              onChange={(e) => handleCustom(e.target.value)}
              placeholder="0.00"
              className="input-field pl-8"
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
