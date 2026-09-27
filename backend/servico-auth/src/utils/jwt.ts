import { createHmac } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '3600'); // segundos

interface CargaToken {
  id: string;
  email: string;
}

interface TokenPayload extends CargaToken {
  exp: number;
  iat: number;
}

export class JWT {
  private static base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString('utf8');
  }

  static gerar(carga: CargaToken): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const agora = Math.floor(Date.now() / 1000);
    
    const payload: TokenPayload = {
      ...carga,
      iat: agora,
      exp: agora + JWT_EXPIRES_IN
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    
    const signature = createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static verificar(token: string): CargaToken {
    const partes = token.split('.');
    
    if (partes.length !== 3) {
      throw new Error('Token inválido');
    }

    const [encodedHeader, encodedPayload, signature] = partes;
    
    const expectedSignature = createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignature) {
      throw new Error('Assinatura inválida');
    }

    const payload: TokenPayload = JSON.parse(this.base64UrlDecode(encodedPayload));
    
    const agora = Math.floor(Date.now() / 1000);
    if (payload.exp < agora) {
      throw new Error('Token expirado');
    }

    return {
      id: payload.id,
      email: payload.email
    };
  }
}