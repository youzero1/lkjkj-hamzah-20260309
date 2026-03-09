import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calculation } from '@/entities/Calculation';
import path from 'path';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH
    ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
    : path.resolve(process.cwd(), 'database.sqlite');

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [Calculation],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
  });

  await dataSource.initialize();
  return dataSource;
}
