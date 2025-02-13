import { Router } from 'express';
import DiceController from '../app/controllers/diceController'; // Importação correta

const router = Router();

// Define as rotas
router.post('/', DiceController.store);
router.get('/', DiceController.index);
router.get('/:id', DiceController.show);
router.put('/:id', DiceController.update);
router.delete('/:id', DiceController.destroy);

// Exporta o router
export { router as diceRouter };