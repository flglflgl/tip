import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper function to test the connection
export const sqlCon = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connection successful!');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};

export default pool;
