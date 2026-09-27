import { Router } from 'express';
import { VideosController } from '../controllers/videos.controller';

const router = Router();
const videosController = new VideosController();

router.get('/buscar', videosController.buscar);
router.post('/ids', videosController.obterPorIds);

export default router;