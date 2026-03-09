import { CalculationInput, CalculationResult } from '@/types';

export function calculateOrder(input: CalculationInput): CalculationResult {
  const { basePrice, quantity, discountType, discountValue, taxRate, shippingCost } = input;

  // Calculate subtotal
  const subtotal = round(basePrice * quantity);

  // Calculate discount
  let totalDiscount = 0;
  if (discountType === 'percentage') {
    totalDiscount = round(subtotal * (discountValue / 100));
  } else {
    totalDiscount = round(Math.min(discountValue * quantity, subtotal));
  }

  // Calculate taxable amount (after discount)
  const taxableAmount = round(subtotal - totalDiscount);

  // Calculate tax
  const totalTax = round(taxableAmount * (taxRate / 100));

  // Calculate grand total
  const grandTotal = round(taxableAmount + totalTax + shippingCost);

  return {
    subtotal,
    totalDiscount,
    taxableAmount,
    totalTax,
    shippingCost: round(shippingCost),
    grandTotal,
  };
}

export function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
