import fs from 'fs';
import path from 'path';
import pool from '../config/database.js';

async function runMigrations() {
  const client = await pool.connect();
  try {
    const migrationsDir = path.dirname(new URL(import.meta.url).pathname);
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      console.log(`Running migration: ${file}`);
      await client.query(sql);
      console.log(`✓ ${file} completed`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
