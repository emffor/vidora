export interface Usuario {
  id: number;
  email: string;
  criadoEm: Date;
}

export interface RespostaAuth {
  sucesso: boolean;
  dados?: {
    token?: string;
    usuario?: Usuario;
    id?: number;
    email?: string;
    criadoEm?: Date;
  };
  erro?: string;
}