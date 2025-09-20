import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

export default function createPool() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10, // max connections in the pool
      queueLimit: 0,       // unlimited queue
    });

    console.log('Database pool created');
    return pool; // return pool for queries
  } catch (err) {
    console.error('DB pool creation failed:', err);
    process.exit(1);
  }
}