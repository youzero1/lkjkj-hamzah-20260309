'use client';

import { useState, useCallback, useEffect } from 'react';
import PriceInput from './PriceInput';
import DiscountInput from './DiscountInput';
import TaxInput from './TaxInput';
import ShippingInput from './ShippingInput';
import OrderSummary from './OrderSummary';
import { CalculationInput, CalculationResult, DiscountType } from '@/types';
import { calculateOrder } from '@/lib/calculator';

const DEFAULT_TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TAX_RATE || '10');
const DEFAULT_SHIPPING = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_SHIPPING_RATE || '5.99');

const defaultInput: CalculationInput = {
  basePrice: 0,
  quantity: 1,
  discountType: 'percentage',
  discountValue: 0,
  taxRate: DEFAULT_TAX_RATE || 10,
  shippingCost: DEFAULT_SHIPPING || 5.99,
};

export default function Calculator() {
  const [input, setInput] = useState<CalculationInput>(defaultInput);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const compute = useCallback((inp: CalculationInput) => {
    if (inp.basePrice > 0 && inp.quantity > 0) {
      setResult(calculateOrder(inp));
    } else {
      setResult(null);
    }
  }, []);

  useEffect(() => {
    compute(input);
  }, [input, compute]);

  const handlePriceChange = (basePrice: number, quantity: number) => {
    setInput((prev) => ({ ...prev, basePrice, quantity }));
  };

  const handleDiscountChange = (discountType: DiscountType, discountValue: number) => {
    setInput((prev) => ({ ...prev, discountType, discountValue }));
  };

  const handleTaxChange = (taxRate: number) => {
    setInput((prev) => ({ ...prev, taxRate }));
  };

  const handleShippingChange = (shippingCost: number) => {
    setInput((prev) => ({ ...prev, shippingCost }));
  };

  const handleReset = () => {
    setInput(defaultInput);
    setResult(null);
    setSaveMsg(null);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        setSaveMsg({ type: 'success', text: 'Calculation saved to history!' });
      } else {
        setSaveMsg({ type: 'error', text: 'Failed to save calculation.' });
      }
    } catch {
      setSaveMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: inputs */}
      <div className="lg:col-span-2 space-y-6">
        <PriceInput
          basePrice={input.basePrice}
          quantity={input.quantity}
          onChange={handlePriceChange}
        />
        <DiscountInput
          discountType={input.discountType}
          discountValue={input.discountValue}
          onChange={handleDiscountChange}
        />
        <TaxInput taxRate={input.taxRate} onChange={handleTaxChange} />
        <ShippingInput shippingCost={input.shippingCost} onChange={handleShippingChange} />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={!result || saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save to History
              </>
            )}
          </button>
          <button onClick={handleReset} className="btn-danger flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <a href="/history" className="btn-secondary flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View History
          </a>
        </div>

        {saveMsg && (
          <div
            className={`px-4 py-3 rounded-lg text-sm font-medium ${
              saveMsg.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {saveMsg.type === 'success' ? '✓ ' : '✗ '}{saveMsg.text}
          </div>
        )}
      </div>

      {/* Right column: summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <OrderSummary input={input} result={result} />
        </div>
      </div>
    </div>
  );
}
