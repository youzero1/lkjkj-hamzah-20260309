import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('calculations')
export class Calculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice!: number;

  @Column('int')
  quantity!: number;

  @Column('varchar', { length: 20 })
  discountType!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountValue!: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  taxRate!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingCost!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalDiscount!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalTax!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  grandTotal!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
