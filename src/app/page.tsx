import Calculator from '@/components/Calculator';

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Commerce Calculator</h1>
        <p className="text-gray-500">
          Calculate product prices, discounts, taxes, and shipping costs with precision.
        </p>
      </div>
      <Calculator />
    </div>
  );
}
