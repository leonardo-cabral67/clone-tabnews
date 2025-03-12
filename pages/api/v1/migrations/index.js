import migrationRunner from 'node-pg-migrate';
import database from 'infra/database';
import { join } from 'node:path';

export default async function migrations(request, response) {
  const allowedMethods = ['GET', 'POST']

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`
    })
  }
  let dbClient
  try {
    dbClient = await database.getNewClient();
    const defaultMigrations = {
      dbClient: dbClient,
      databaseUrl: process.env.DATABASE_URL,
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pg-migrations'
    };

    if (request.method === 'GET') {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrations,
        dryRun: true,
      });
      return response.status(200).json(pendingMigrations)
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrations,
        dryRun: false
      });
      if (migratedMigrations.length > 0) return response.status(201).json(migratedMigrations);
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error)
  } finally {
    await dbClient.end()
  }
}