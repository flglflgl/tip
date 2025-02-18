import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = Number(process.env.DB_PORT) || 3306;

// Connection Pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to test the connection
export const sqlCon = () => {
  pool.getConnection((err: any, connection: { release: () => void; }) => {
    if (err) {
      console.error('MySQL connection error:', err);
      return;
    }
    console.log('MySQL connection successful!');
    connection.release(); 
  });
};

export default pool;
