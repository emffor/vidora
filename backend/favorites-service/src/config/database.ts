import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  : new Pool({
      host: 'localhost',
      port: 5433,
      database: 'vidora_favoritos',
      user: 'postgres',
      password: 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

export class Database {
  static async query(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  static async inicializar() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id SERIAL PRIMARY KEY,
        video_id VARCHAR(255) NOT NULL,
        usuario_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        UNIQUE(usuario_id, video_id)
      )
    `);

    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_favoritos_usuario_id ON favoritos(usuario_id)
    `);

    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_favoritos_video_id ON favoritos(video_id)
    `);

    console.log('✅ Tabela favoritos criada/verificada');
  }
}

export default Database;