"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlCon = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Access environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = Number(process.env.DB_PORT) || 3306;
// Create a connection pool
const pool = mysql_1.default.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0,
});
// Helper function to test the connection
const sqlCon = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('MySQL connection error:', err);
            return;
        }
        console.log('MySQL connection successful!');
        connection.release(); // Release the connection back to the pool
    });
};
exports.sqlCon = sqlCon;
exports.default = pool;
