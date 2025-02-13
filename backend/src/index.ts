import express from 'express';
import dotenv from 'dotenv';
import { setupSwagger } from './config/swagger';
import { defaultRouter } from './routes/defaultRoutes';
import { questionRouter } from './routes/questionRoutes';
import { diceRouter } from './routes/diceRoutes';
import { quizRouter } from './routes/quizRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurar Swagger
setupSwagger(app);

// Armazene as perguntas aqui
app.locals.questions = [];

app.use('/api/defaults', defaultRouter);
app.use('/api/questions', questionRouter);
app.use('/api/dices', diceRouter);
app.use('/api/quiz', quizRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});