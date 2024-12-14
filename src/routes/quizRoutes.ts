import Router from 'koa-router';
import { createQuiz, getQuiz } from '../controllers/quizController';

const router = new Router();

/**
 * @swagger
 * /quiz:
 *   post:
 *     summary: Create a new quiz
 *     description: Create a new quiz with questions and answer options
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctOption:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Quiz created successfully
 */
router.post('/', createQuiz); // Create a quiz

/**
 * @swagger
 * /quiz/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     description: Get quiz details without revealing the correct answers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Quiz ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of quiz
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', getQuiz);  // Get a quiz by ID

export default router;
