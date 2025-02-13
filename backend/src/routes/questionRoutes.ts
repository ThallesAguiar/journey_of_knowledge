import { Router } from 'express';
import QuestionController from '../app/controllers/questionController'; // Importação correta

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Endpoints para perguntas
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Cria uma pergunta
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 description: Tema da pergunta
 *                 required: true
 *               discipline:
 *                 type: string
 *                 description: Disciplina que envolve a pergunta
 *               description:
 *                 type: string
 *                 description: Descrição para entender a pergunta
 *               level:
 *                 type: string
 *                 description: Qual o nível de dificuldade da pergunta
 *     responses:
 *       201:
 *         description: Item criado com sucesso
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
router.post('/', QuestionController.store);

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Lista todos os itens com filtros opcionais
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
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
router.get('/', QuestionController.index);

// Exporta o router
export { router as questionRouter };