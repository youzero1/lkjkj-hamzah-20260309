import HistoryTable from '@/components/HistoryTable';
import { CalculationRecord } from '@/types';

async function getCalculations(): Promise<CalculationRecord[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'http://localhost:3000'
        : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/calculations`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.calculations || [];
  } catch {
    return [];
  }
}

export default async function HistoryPage() {
  const calculations = await getCalculations();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculation History</h1>
        <p className="text-gray-500">
          View all your past calculations and their breakdowns.
        </p>
      </div>
      <HistoryTable initialCalculations={calculations} />
    </div>
  );
}
