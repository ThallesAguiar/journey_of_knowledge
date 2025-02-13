import { Router } from 'express';
import DefaultController from '../app/controllers/defaultController'; // Importação correta

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Default
 *   description: Endpoints padrão
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria um novo item
 *     tags: [Default]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do item
 *               description:
 *                 type: string
 *                 description: Descrição do item
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
router.post('/', DefaultController.store);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todos os itens com filtros opcionais
 *     tags: [Default]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenação (ascendente ou descendente)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa para filtrar os resultados
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
router.get('/', DefaultController.index);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtém um item específico pelo ID
 *     tags: [Default]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item encontrado
 */
router.get('/:id', DefaultController.show);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza um item existente pelo ID
 *     tags: [Default]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do item
 *               description:
 *                 type: string
 *                 description: Nova descrição do item
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 */
router.put('/:id', DefaultController.update);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove um item pelo ID
 *     tags: [Default]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 */
router.delete('/:id', DefaultController.destroy);



// Exporta o router
export { router as defaultRouter };