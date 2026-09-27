import { UsuarioRepository } from '../../../src/repositories/usuario.repository';
import { AuthService } from '../../../src/services/auth.service';
import { Hash } from '../../../src/utils/hash';
import { JWT } from '../../../src/utils/jwt';

jest.mock('../../../src/repositories/usuario.repository');
jest.mock('../../../src/utils/hash');
jest.mock('../../../src/utils/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let usuarioRepository: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    authService = new AuthService();
    usuarioRepository = (authService as any).usuarioRepository;
  });

  describe('registrar', () => {
    it('deve registrar novo usuário com sucesso', async () => {
      const dados = { email: 'novo@test.com', senha: '123456' };
      const senhaCriptografada = 'hash:salt';
      const usuarioCriado = { id: 1, email: dados.email, senha: senhaCriptografada, created_at: new Date() };
      const token = 'jwt.token.here';

      usuarioRepository.buscarPorEmail.mockResolvedValue(null);
      (Hash.criptografar as jest.Mock).mockReturnValue(senhaCriptografada);
      usuarioRepository.criar.mockResolvedValue(usuarioCriado);
      (JWT.gerar as jest.Mock).mockReturnValue(token);

      const resultado = await authService.registrar(dados);

      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dados.email);
      expect(Hash.criptografar).toHaveBeenCalledWith(dados.senha);
      expect(usuarioRepository.criar).toHaveBeenCalledWith(dados.email, senhaCriptografada);
      expect(JWT.gerar).toHaveBeenCalledWith({
        id: usuarioCriado.id.toString(),
        email: usuarioCriado.email
      });
      expect(resultado).toEqual({
        token,
        usuario: {
          id: usuarioCriado.id,
          email: usuarioCriado.email
        }
      });
    });

    it('deve lançar erro se email já existe', async () => {
      const dados = { email: 'existente@test.com', senha: '123456' };
      usuarioRepository.buscarPorEmail.mockResolvedValue({
        id: 1,
        email: dados.email,
        senha: 'hash',
        created_at: new Date()
      });

      await expect(authService.registrar(dados)).rejects.toThrow('Email já cadastrado');
      expect(Hash.criptografar).not.toHaveBeenCalled();
      expect(usuarioRepository.criar).not.toHaveBeenCalled();
    });
  });

  describe('entrar', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const dados = { email: 'user@test.com', senha: '123456' };
      const usuarioExistente = {
        id: 1,
        email: dados.email,
        senha: 'hash:salt',
        created_at: new Date()
      };
      const token = 'jwt.token.here';

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);
      (Hash.verificar as jest.Mock).mockReturnValue(true);
      (JWT.gerar as jest.Mock).mockReturnValue(token);

      const resultado = await authService.entrar(dados);

      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dados.email);
      expect(Hash.verificar).toHaveBeenCalledWith(dados.senha, usuarioExistente.senha);
      expect(JWT.gerar).toHaveBeenCalledWith({
        id: usuarioExistente.id.toString(),
        email: usuarioExistente.email
      });
      expect(resultado).toEqual({
        token,
        usuario: {
          id: usuarioExistente.id,
          email: usuarioExistente.email
        }
      });
    });

    it('deve lançar erro se usuário não existe', async () => {
      const dados = { email: 'naoexiste@test.com', senha: '123456' };
      usuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(authService.entrar(dados)).rejects.toThrow('Credenciais inválidas');
      expect(Hash.verificar).not.toHaveBeenCalled();
      expect(JWT.gerar).not.toHaveBeenCalled();
    });

    it('deve lançar erro se senha está incorreta', async () => {
      const dados = { email: 'user@test.com', senha: 'senhaerrada' };
      const usuarioExistente = {
        id: 1,
        email: dados.email,
        senha: 'hash:salt',
        created_at: new Date()
      };

      usuarioRepository.buscarPorEmail.mockResolvedValue(usuarioExistente);
      (Hash.verificar as jest.Mock).mockReturnValue(false);

      await expect(authService.entrar(dados)).rejects.toThrow('Credenciais inválidas');
      expect(Hash.verificar).toHaveBeenCalledWith(dados.senha, usuarioExistente.senha);
      expect(JWT.gerar).not.toHaveBeenCalled();
    });
  });

  describe('buscarUsuario', () => {
    it('deve retornar usuário existente', async () => {
      const usuarioId = 1;
      const usuarioExistente = {
        id: usuarioId,
        email: 'user@test.com',
        senha: 'hash',
        created_at: new Date()
      };

      usuarioRepository.buscarPorId.mockResolvedValue(usuarioExistente);

      const resultado = await authService.buscarUsuario(usuarioId);

      expect(usuarioRepository.buscarPorId).toHaveBeenCalledWith(usuarioId);
      expect(resultado).toEqual({
        id: usuarioExistente.id,
        email: usuarioExistente.email,
        criadoEm: usuarioExistente.created_at
      });
    });

    it('deve lançar erro se usuário não existe', async () => {
      const usuarioId = 999;
      usuarioRepository.buscarPorId.mockResolvedValue(null);

      await expect(authService.buscarUsuario(usuarioId)).rejects.toThrow('Usuário não encontrado');
      expect(usuarioRepository.buscarPorId).toHaveBeenCalledWith(usuarioId);
    });
  });
});