import { Response } from 'express';
import { RequisicaoAutenticada } from '../middlewares/autenticado';
import { AuthService } from '../services/auth.service';
import { RequisicaoLogin, RequisicaoRegistro } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  registrar = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const dados: RequisicaoRegistro = req.body;

      if (!dados.email || !dados.senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      if (dados.senha.length < 6) {
        return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });
      }

      const resultado = await this.authService.registrar(dados);
      return res.status(201).json({ sucesso: true, dados: resultado });
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  };

  entrar = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const dados: RequisicaoLogin = req.body;

      if (!dados.email || !dados.senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const resultado = await this.authService.entrar(dados);
      return res.status(200).json({ sucesso: true, dados: resultado });
    } catch (erro: any) {
      return res.status(401).json({ erro: erro.message });
    }
  };

  obterUsuario = async (req: RequisicaoAutenticada, res: Response) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
      }

      const usuario = await this.authService.buscarUsuario(Number(req.usuario.id));
      return res.status(200).json({ sucesso: true, dados: usuario });
    } catch (erro: any) {
      return res.status(404).json({ erro: erro.message });
    }
  };
}