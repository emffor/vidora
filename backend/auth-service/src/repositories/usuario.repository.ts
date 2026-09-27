import Database from '../config/database';

interface Usuario {
  id: number;
  email: string;
  senha: string;
  created_at: Date;
}

export class UsuarioRepository {
  async criar(email: string, senha: string): Promise<Usuario> {
    const resultado = await Database.query(
      'INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING *',
      [email, senha]
    );
    return resultado.rows[0];
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const resultado = await Database.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return resultado.rows[0] || null;
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const resultado = await Database.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    return resultado.rows[0] || null;
  }
}