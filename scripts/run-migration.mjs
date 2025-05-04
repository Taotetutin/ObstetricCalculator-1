import { Pool, neonConfig } from '@neondatabase/serverless';
import fs from 'node:fs/promises';
import ws from 'ws';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Configuración para WebSocket
neonConfig.webSocketConstructor = ws;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Running migration...');
    
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'migration.sql');
    const sql = await fs.readFile(sqlFile, 'utf8');
    
    // Ejecutar el SQL
    await pool.query(sql);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error in migration script:', err);
  process.exit(1);
});