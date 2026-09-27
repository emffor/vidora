import { Router } from 'express';
import { FavoritosController } from '../controllers/favoritos.controller';
import { autenticado } from '../middlewares/autenticado';

const router = Router();
const controller = new FavoritosController();

router.post('/', autenticado, controller.adicionar);
router.delete('/:videoId', autenticado, controller.remover);
router.get('/', autenticado, controller.listar);
router.get('/:videoId/verificar', autenticado, controller.verificar);

export default router;