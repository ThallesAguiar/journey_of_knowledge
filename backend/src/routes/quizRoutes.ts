import { Router } from 'express';
import { generateQuiz, checkQuizAnswer } from '../app/controllers/quizController';

const router = Router();

router.post('/generate', generateQuiz);
router.post('/check-answer', checkQuizAnswer);

export { router as quizRouter };