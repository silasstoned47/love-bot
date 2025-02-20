import mysql from 'mysql2/promise';
import env from '../config/env.js';

const pool = mysql.createPool({
  host: env.MYSQL_HOST,
  port: parseInt(env.MYSQL_PORT),
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', () => {
  console.log('Connected to MySQL');
});

pool.on('error', (error) => {
  console.error('MySQL connection error:', error);
});

export default pool;