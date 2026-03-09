'use client';

import { CalculationInput, CalculationResult } from '@/types';
import { formatCurrency } from '@/lib/calculator';

interface Props {
  input: CalculationInput;
  result: CalculationResult | null;
}

export default function OrderSummary({ input, result }: Props) {
  if (!result) {
    return (
      <div className="card">
        <h2 className="section-title">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Order Summary
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">Enter a price and quantity<br />to see your order summary.</p>
        </div>
      </div>
    );
  }

  const rows = [
    {
      label: `Subtotal (${input.quantity} × ${formatCurrency(input.basePrice)})`,
      value: result.subtotal,
      color: 'text-gray-800',
      bg: '',
    },
    {
      label:
        input.discountValue > 0
          ? `Discount (${
              input.discountType === 'percentage'
                ? `${input.discountValue}%`
                : `$${input.discountValue} × ${input.quantity}`
            })`
          : 'Discount',
      value: -result.totalDiscount,
      color: result.totalDiscount > 0 ? 'text-green-600' : 'text-gray-400',
      bg: result.totalDiscount > 0 ? 'bg-green-50' : '',
    },
    {
      label: `Tax (${input.taxRate}%)`,
      value: result.totalTax,
      color: 'text-gray-800',
      bg: '',
    },
    {
      label: 'Shipping',
      value: result.shippingCost,
      color: result.shippingCost === 0 ? 'text-green-600' : 'text-gray-800',
      bg: '',
    },
  ];

  return (
    <div className="card">
      <h2 className="section-title">
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Order Summary
      </h2>

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex justify-between items-center px-3 py-2.5 rounded-lg ${
              row.bg || 'bg-gray-50'
            }`}
          >
            <span className="text-sm text-gray-600">{row.label}</span>
            <span className={`text-sm font-semibold ${row.color}`}>
              {row.value < 0
                ? `-${formatCurrency(Math.abs(row.value))}`
                : row.value === 0 && row.label === 'Shipping'
                ? 'Free'
                : formatCurrency(row.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-blue-100">
        <div className="flex justify-between items-center px-3 py-3 bg-blue-600 rounded-xl">
          <span className="text-base font-bold text-white">Grand Total</span>
          <span className="text-xl font-bold text-white">{formatCurrency(result.grandTotal)}</span>
        </div>
      </div>

      {result.totalDiscount > 0 && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-700 font-medium">
            🎉 You save {formatCurrency(result.totalDiscount)}!
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Breakdown</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>After Discount</span>
            <span>{formatCurrency(result.taxableAmount)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Before Tax & Shipping</span>
            <span>{formatCurrency(result.taxableAmount)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tax + Shipping</span>
            <span>{formatCurrency(result.totalTax + result.shippingCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
