import { Context } from 'koa';
import { Quiz } from '../types/quiz';

// Mock in-memory database
const quizzes: Map<string, Quiz> = new Map();

export const createQuiz = async (ctx: Context) => {
  const { title, questions } = ctx.request.body as Quiz;

  if (!title || !questions || questions.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid input data.' };
    return;
  }

  const id = String(quizzes.size + 1);
  const newQuiz: Quiz = { id, title, questions };
  quizzes.set(id, newQuiz);

  ctx.status = 201;
  ctx.body = newQuiz;
};

// Get a quiz by ID
export const getQuiz = async (ctx: Context) => {
  const { id } = ctx.params;
  const quiz = quizzes.get(id);

  if (!quiz) {
    ctx.status = 404;
    ctx.body = { error: 'Quiz not found.' };
    return;
  }

  // Remove the correct answers before sending the response
  const sanitizedQuestions = quiz.questions.map(({ correctOption, ...rest }) => rest);

  ctx.body = { id: quiz.id, title: quiz.title, questions: sanitizedQuestions };
};
