import { Router } from 'express';
import QuestionController from '../app/controllers/questionController'; // Importação correta

const router = Router();

// Define as rotas
router.post('/', QuestionController.store);
router.get('/', QuestionController.index);
router.get('/:id', QuestionController.show);
router.put('/:id', QuestionController.update);
router.delete('/:id', QuestionController.destroy);

// Exporta o router
export { router as questionRouter };