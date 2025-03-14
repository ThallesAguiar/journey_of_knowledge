import { Router } from 'express';
import ParchmentController from '../app/controllers/parchmentController'; // Importação correta

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Parchment
 *   description: Endpoints de pergaminho
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria um novo pergaminho
 *     tags: [Parchment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 description: Tema do quiz
 *     responses:
 *       201:
 *         description: Pergaminho criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Erro no servidor
 */
router.post('/', ParchmentController.store);



// Exporta o router
export { router as parchmentRouter };