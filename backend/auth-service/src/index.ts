import dotenv from 'dotenv';
import express from 'express';
import Database from './config/database';
import { corsMiddleware } from './middlewares/cors';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(express.json());
app.use('/api', authRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

Database.inicializar()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`Serviço de Autenticação rodando em http://localhost:${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error('Erro ao inicializar banco:', erro);
    process.exit(1);
  });