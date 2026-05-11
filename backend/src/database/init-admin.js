/**
 * Script para crear el SuperAdministrador inicial.
 * Ejecutar una sola vez con: node src/database/init-admin.js
 * O con: npm run db:init-admin
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function createSuperAdmin() {
  const credentials = {
    first_name: 'Super',
    last_name: 'Admin',
    user_name: 'superadmin',
    mail: 'superadmin@fourpark.com',
    password: 'Admin123!',
    identification_card: '0000000000',
  };

  try {
    // Verificar si ya existe
    const existing = await db.query(
      'SELECT id_user FROM users WHERE user_name = $1',
      [credentials.user_name]
    );
    if (existing.rows.length > 0) {
      console.log('SuperAdmin ya existe. No se creó uno nuevo.');
      process.exit(0);
    }

    const roleRes = await db.query("SELECT id_role FROM roles WHERE name = 'SuperAdministrador'");
    if (roleRes.rows.length === 0) {
      console.error('ERROR: Primero ejecuta el seed SQL (npm run db:seed)');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 12);
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');
      const res = await client.query(
        `INSERT INTO users (first_name, last_name, user_name, mail, password, identification_card, is_active, mail_verified, id_role_fk)
         VALUES ($1,$2,$3,$4,$5,$6,true,true,$7) RETURNING id_user`,
        [credentials.first_name, credentials.last_name, credentials.user_name,
         credentials.mail, hashedPassword, credentials.identification_card, roleRes.rows[0].id_role]
      );
      await client.query(
        'INSERT INTO user_controllers (is_account_blocked, failed_attempts, id_user_fk) VALUES (false, 0, $1)',
        [res.rows[0].id_user]
      );
      await client.query('COMMIT');
      console.log('SuperAdmin creado exitosamente.');
      console.log(`  Usuario: ${credentials.user_name}`);
      console.log(`  Contraseña: ${credentials.password}`);
      console.log('  *** CAMBIA LA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN ***');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creando SuperAdmin:', err.message);
    process.exit(1);
  }
  process.exit(0);
}

createSuperAdmin();
