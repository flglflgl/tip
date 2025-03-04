import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = Number(process.env.DB_PORT) || 5432;
// PostgreSQL Connection Pool
const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Required for Render PostgreSQL
    },
});
// Helper function to test the connection
export const sqlCon = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL connection successful!');
        client.release();
    }
    catch (err) {
        console.error('PostgreSQL connection error:', err);
    }
};
export default pool;
