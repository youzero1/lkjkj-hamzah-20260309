import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const isConnected = dataSource.isInitialized;

    return NextResponse.json({
      status: 'ok',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
