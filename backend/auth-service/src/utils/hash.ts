import { createHash, randomBytes } from 'crypto';

export class Hash {
  private static readonly TAMANHO_SALT = 16;
  private static readonly ITERACOES = 100000;

  static criptografar(senha: string): string {
    const salt = randomBytes(this.TAMANHO_SALT).toString('hex');
    const hash = this.gerarChave(senha, salt);
    return `${salt}:${hash}`;
  }

  static verificar(senha: string, senhaCriptografada: string): boolean {
    const [salt, hash] = senhaCriptografada.split(':');
    const novaHash = this.gerarChave(senha, salt);
    return novaHash === hash;
  }

  private static gerarChave(senha: string, salt: string): string {
    return createHash('sha256')
      .update(senha + salt)
      .digest('hex');
  }
}