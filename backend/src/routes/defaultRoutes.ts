import { Router } from 'express';
import DefaultController from '../app/controllers/defaultController'; // Importação correta

const router = Router();

// Define as rotas
router.post('/', DefaultController.store);
router.get('/', DefaultController.index);
router.get('/:id', DefaultController.show);
router.put('/:id', DefaultController.update);
router.delete('/:id', DefaultController.destroy);

// Exporta o router
export { router as defaultRouter };