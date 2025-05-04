import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

async function main() {
  // Configuración para conexión NeonDB
  const config = { webSocketConstructor: ws };
  
  // Crear el pool de conexiones
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Creating tables...');
    
    // Creando tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY NOT NULL,
        username VARCHAR UNIQUE NOT NULL,
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        bio TEXT,
        profile_image_url VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Users table created');
    
    // Creando tabla de sesiones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY NOT NULL,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);
    console.log('Sessions table created');
    
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error in migration script:', err);
  process.exit(1);
});