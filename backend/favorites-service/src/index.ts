import dotenv from 'dotenv';
import express from 'express';
import Database from './config/database';
import { corsMiddleware } from './middlewares/cors';
import favoritosRoutes from './routes/favoritos.routes';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3003;

app.use(corsMiddleware);
app.use(express.json());

app.use('/api', favoritosRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'online',
    servico: 'favorites-service',
    timestamp: new Date().toISOString()
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    sucesso: false,
    erro: 'Erro interno do servidor' 
  });
});

Database.inicializar()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`Serviço de Favoritos rodando em http://localhost:${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error('Erro ao inicializar banco:', erro);
    process.exit(1);
  });