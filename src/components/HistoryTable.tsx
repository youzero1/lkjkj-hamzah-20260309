'use client';

import { useState, useCallback } from 'react';
import { CalculationRecord } from '@/types';
import { formatCurrency } from '@/lib/calculator';

interface Props {
  initialCalculations: CalculationRecord[];
}

export default function HistoryTable({ initialCalculations }: Props) {
  const [calculations, setCalculations] = useState<CalculationRecord[]>(initialCalculations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calculations', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCalculations(data.calculations || []);
    } catch {
      setError('Failed to load calculations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  if (calculations.length === 0 && !loading) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Past Calculations</h2>
          <button onClick={refresh} className="btn-secondary text-sm">
            Refresh
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium mb-1">No calculations yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Use the calculator and save a calculation to see it here.
          </p>
          <a href="/" className="btn-primary text-sm">
            Go to Calculator
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Past Calculations</h2>
          <p className="text-sm text-gray-400 mt-0.5">{calculations.length} record{calculations.length !== 1 ? 's' : ''} found</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipping</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grand Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {calculations.map((calc) => (
              <tr key={calc.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3 text-gray-500 text-xs">{formatDate(calc.createdAt)}</td>
                <td className="py-3 px-3 text-right text-gray-700">{formatCurrency(calc.basePrice)}</td>
                <td className="py-3 px-3 text-right text-gray-700">{calc.quantity}</td>
                <td className="py-3 px-3 text-right text-gray-700">{formatCurrency(calc.subtotal)}</td>
                <td className="py-3 px-3 text-right">
                  {calc.totalDiscount > 0 ? (
                    <span className="text-green-600 font-medium">-{formatCurrency(calc.totalDiscount)}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right text-gray-700">{formatCurrency(calc.totalTax)}</td>
                <td className="py-3 px-3 text-right text-gray-700">
                  {calc.shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(calc.shippingCost)
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-bold text-blue-600">{formatCurrency(calc.grandTotal)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-4">
        {calculations.map((calc) => (
          <div key={calc.id} className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-400">{formatDate(calc.createdAt)}</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(calc.grandTotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Unit Price</span>
                <div className="font-medium text-gray-700">{formatCurrency(calc.basePrice)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Quantity</span>
                <div className="font-medium text-gray-700">{calc.quantity}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Subtotal</span>
                <div className="font-medium text-gray-700">{formatCurrency(calc.subtotal)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Discount</span>
                <div className="font-medium text-green-600">
                  {calc.totalDiscount > 0 ? `-${formatCurrency(calc.totalDiscount)}` : '—'}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Tax ({calc.taxRate}%)</span>
                <div className="font-medium text-gray-700">{formatCurrency(calc.totalTax)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Shipping</span>
                <div className="font-medium text-gray-700">
                  {calc.shippingCost === 0 ? 'Free' : formatCurrency(calc.shippingCost)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
