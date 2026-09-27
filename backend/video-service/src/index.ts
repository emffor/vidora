import dotenv from 'dotenv';
import express from 'express';
import { validateYoutubeConfig } from './config/youtube';
import { corsMiddleware } from './middlewares/cors';
import videosRoutes from './routes/videos.routes';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3002;

app.use(corsMiddleware);
app.use(express.json());

app.use('/api', videosRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'online',
    servico: 'video-service',
    timestamp: new Date().toISOString()
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

try {
  validateYoutubeConfig();
  app.listen(PORTA, () => {
    console.log(`Serviço de Vídeos rodando em http://localhost:${PORTA}`);
  });
} catch (erro: any) {
  console.error('Erro ao iniciar serviço:', erro.message);
  process.exit(1);
}
