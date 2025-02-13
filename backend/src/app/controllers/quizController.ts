import { Request, Response, NextFunction } from 'express';
import { generateQuestions } from '../../services/gpt';
// import questions from '../questions.json';

export const generateQuiz = async (req: Request, res: Response) => {
    const { theme, discipline, level, quantity } = req.body;

    try {
        const questions = await generateQuestions(theme, discipline, level, quantity);
        res.json({ questions });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to generate questions' });
    }
};

export const checkQuizAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { questionIndex, userAnswer } = req.body;
    const questions = req.app.locals.questions;

    try {
        if (!questions || !questions[questionIndex]) {
            res.status(400).json({ error: 'Invalid question index' });
            return;
        }

        const isCorrect = checkAnswer(questions[questionIndex], userAnswer);
        res.json({ isCorrect });
    } catch (error: any) {
        next(error);
    }
};

const checkAnswer = (question: any, userAnswer: string) => {
    return userAnswer.toUpperCase() === question.resposta_correta.toUpperCase();
};