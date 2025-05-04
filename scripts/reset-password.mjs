import { Pool, neonConfig } from '@neondatabase/serverless';
import crypto from 'crypto';
import { promisify } from 'util';
import ws from 'ws';

// Configuración para WebSocket
neonConfig.webSocketConstructor = ws;

const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Resetting password for test user...');
    
    // Verificar si el usuario existe
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    );
    
    if (userResult.rows.length === 0) {
      console.log('User test@example.com does not exist. Creating user...');
      
      // Hash de la contraseña
      const hashedPassword = await hashPassword('123456');
      
      // Crear el usuario
      await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        ['test@example.com', hashedPassword, 'Usuario de Prueba', 'user']
      );
      
      console.log('User created successfully!');
    } else {
      // Actualizar la contraseña
      const hashedPassword = await hashPassword('123456');
      
      await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hashedPassword, 'test@example.com']
      );
      
      console.log('Password reset successfully!');
    }
    
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error in script:', err);
  process.exit(1);
});