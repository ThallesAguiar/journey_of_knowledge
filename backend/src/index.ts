import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import { defaultRouter } from './routes/defaultRoutes';
import { questionRouter } from './routes/questionRoutes';
import { diceRouter } from './routes/diceRoutes';
import { quizRouter } from './routes/quizRoutes';
import { parchmentRouter } from './routes/parchmentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', // URL do seu frontend React
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Configurar Swagger
setupSwagger(app);

// Armazene as perguntas aqui
app.locals.questions = [];

app.use('/api/defaults', defaultRouter);
app.use('/api/questions', questionRouter);
app.use('/api/dices', diceRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/parchments', parchmentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});