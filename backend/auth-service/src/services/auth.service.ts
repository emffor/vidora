import { UsuarioRepository } from '../repositories/usuario.repository';
import { RequisicaoLogin, RequisicaoRegistro } from '../types';
import { Hash } from '../utils/hash';
import { JWT } from '../utils/jwt';

export class AuthService {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async registrar(dados: RequisicaoRegistro) {
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(dados.email);
    
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    const senhaCriptografada = Hash.criptografar(dados.senha);
    const usuario = await this.usuarioRepository.criar(dados.email, senhaCriptografada);

    const token = JWT.gerar({
      id: usuario.id.toString(),
      email: usuario.email
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    };
  }

  async entrar(dados: RequisicaoLogin) {
    const usuario = await this.usuarioRepository.buscarPorEmail(dados.email);

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = Hash.verificar(dados.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    const token = JWT.gerar({
      id: usuario.id.toString(),
      email: usuario.email
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    };
  }

  async buscarUsuario(id: number) {
    const usuario = await this.usuarioRepository.buscarPorId(id);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      criadoEm: usuario.created_at
    };
  }
}