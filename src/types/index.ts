export type DiscountType = 'percentage' | 'fixed';

export interface CalculationInput {
  basePrice: number;
  quantity: number;
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  shippingCost: number;
}

export interface CalculationResult {
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  shippingCost: number;
  grandTotal: number;
}

export interface CalculationRecord {
  id: number;
  basePrice: number;
  quantity: number;
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  shippingCost: number;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  createdAt: string;
}

export interface ShippingOption {
  label: string;
  value: number;
  description: string;
}
