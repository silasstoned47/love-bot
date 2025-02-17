import mysql from 'mysql2/promise';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const pool = mysql.createPool({
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export async function connectMySQL() {
  try {
    logger.info('Tentando conectar ao MySQL...');
    logger.info(`Host: ${env.MYSQL_HOST}, Port: ${env.MYSQL_PORT}, User: ${env.MYSQL_USER}, Database: ${env.MYSQL_DATABASE}`);
    await pool.query('SELECT 1');
    logger.info(' Conectado ao MySQL');
  } catch (error) {
    logger.error(' Erro ao conectar ao MySQL:', error);
    throw error;
  }
}