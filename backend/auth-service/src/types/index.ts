export interface Usuario {
  id: number;
  email: string;
  criadoEm: Date;
}

export interface RequisicaoRegistro {
  email: string;
  senha: string;
}

export interface RequisicaoLogin {
  email: string;
  senha: string;
}

export interface CargaToken {
  id: string;
  email: string;
}

export interface RespostaAPI<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  codigo?: number;
}