import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';
import { calculateOrder } from '@/lib/calculator';
import { CalculationInput } from '@/types';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return NextResponse.json({
      calculations: calculations.map((c) => ({
        id: c.id,
        basePrice: Number(c.basePrice),
        quantity: Number(c.quantity),
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        taxRate: Number(c.taxRate),
        shippingCost: Number(c.shippingCost),
        subtotal: Number(c.subtotal),
        totalDiscount: Number(c.totalDiscount),
        totalTax: Number(c.totalTax),
        grandTotal: Number(c.grandTotal),
        createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
      })),
    });
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: CalculationInput = {
      basePrice: parseFloat(body.basePrice) || 0,
      quantity: parseInt(body.quantity) || 1,
      discountType: body.discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: parseFloat(body.discountValue) || 0,
      taxRate: parseFloat(body.taxRate) || 0,
      shippingCost: parseFloat(body.shippingCost) || 0,
    };

    if (input.basePrice < 0 || input.quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid input: basePrice must be >= 0 and quantity must be >= 1' },
        { status: 400 }
      );
    }

    const result = calculateOrder(input);

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);

    const calculation = repo.create({
      basePrice: input.basePrice,
      quantity: input.quantity,
      discountType: input.discountType,
      discountValue: input.discountValue,
      taxRate: input.taxRate,
      shippingCost: input.shippingCost,
      subtotal: result.subtotal,
      totalDiscount: result.totalDiscount,
      totalTax: result.totalTax,
      grandTotal: result.grandTotal,
    });

    await repo.save(calculation);

    return NextResponse.json(
      {
        success: true,
        calculation: {
          id: calculation.id,
          ...input,
          ...result,
          createdAt: calculation.createdAt instanceof Date
            ? calculation.createdAt.toISOString()
            : calculation.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
