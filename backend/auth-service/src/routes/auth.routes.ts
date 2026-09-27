import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { autenticado } from '../middlewares/autenticado';

const router = Router();
const authController = new AuthController();

router.post('/registrar', authController.registrar);
router.post('/entrar', authController.entrar);
router.get('/usuario', autenticado, authController.obterUsuario);

export default router;