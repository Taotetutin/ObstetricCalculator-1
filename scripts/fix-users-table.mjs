import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configuración para WebSocket
neonConfig.webSocketConstructor = ws;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Fixing users table...');
    
    // Primero verificamos si la tabla existe
    const tableExistsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'users'
      );
    `);
    
    const tableExists = tableExistsResult.rows[0].exists;
    
    if (tableExists) {
      // Si la tabla existe, la eliminamos para recrearla correctamente
      console.log('Users table exists, dropping it to recreate');
      await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    }
    
    // Crear tabla users con la estructura correcta
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        google_id TEXT UNIQUE,
        role TEXT NOT NULL DEFAULT 'user'
      );
    `);
    
    console.log('Users table created successfully');
    
    // Crear un usuario de prueba con criptografía compatible con nuestra función de autenticación
    // Utilizamos scrypt como se hace en auth.ts
    const crypto = await import('crypto');
    const { scrypt, randomBytes } = crypto;
    const { promisify } = await import('util');
    
    const scryptAsync = promisify(scrypt);
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync("123456", salt, 64);
    const hashedPassword = `${buf.toString("hex")}.${salt}`;
    
    await pool.query(`
      INSERT INTO users (email, password, name, role)
      VALUES ('test@example.com', $1, 'Usuario de Prueba', 'user')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);
    
    console.log('Test user created successfully');
    
  } catch (error) {
    console.error('Error fixing users table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error in script:', err);
  process.exit(1);
});