'use client';

import { useState } from 'react';

interface Props {
  taxRate: number;
  onChange: (rate: number) => void;
}

const PRESETS = [
  { label: 'None', value: 0 },
  { label: '5%', value: 5 },
  { label: '10%', value: 10 },
  { label: '15%', value: 15 },
  { label: '20%', value: 20 },
];

export default function TaxInput({ taxRate, onChange }: Props) {
  const [valueStr, setValueStr] = useState(String(taxRate));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (val: string) => {
    setValueStr(val);
    const num = parseFloat(val);
    if (val === '' || isNaN(num)) {
      setError('Enter a valid tax rate');
      return;
    }
    if (num < 0) {
      setError('Tax rate cannot be negative');
      return;
    }
    if (num > 100) {
      setError('Tax rate cannot exceed 100%');
      return;
    }
    setError(null);
    onChange(num);
  };

  const handlePreset = (value: number) => {
    setValueStr(String(value));
    setError(null);
    onChange(value);
  };

  return (
    <div className="card">
      <h2 className="section-title">
        <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
        Tax Rate
      </h2>
      <div className="space-y-4">
        <div>
          <label className="label">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  taxRate === p.value
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Custom Tax Rate</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={valueStr}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="10"
              className="input-field pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
