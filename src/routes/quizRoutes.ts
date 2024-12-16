import Router from 'koa-router';
import { createQuiz, getQuiz, getResults, submitAnswer } from '../controllers/quizController';

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

/**
 * @swagger
 * /quiz/{id}/answers:
 *   post:
 *     summary: Submit an answer for a question in the quiz
 *     description: Submit an answer to a specific question and get feedback if the answer is correct
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Quiz ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               questionId:
 *                 type: string
 *               selectedOption:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answer submitted with feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isCorrect:
 *                   type: boolean
 *                 correctOption:
 *                   type: integer
 *       404:
 *         description: Quiz or question not found
 */
router.post('/:id/answers', submitAnswer); // Submit an answer for a question

/**
 * @swagger
 * /quiz/score/{id}:
 *   get:
 *     summary: Get the total score of a user
 *     description: Get the total score of a user across all quizzes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Total score of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *       404:
 *         description: User not found
 */
router.get('/score/:id', getResults); // Get total score for a user

export default router;
