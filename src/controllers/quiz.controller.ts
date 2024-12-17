import { Context } from 'koa';
import { Answer, Question, Quiz, QuizResult } from '../types/quiz';
import QuizService from '../services/quiz.service';

class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
    
    // Bind methods to ensure 'this' retains the correct context
    this.createQuiz = this.createQuiz.bind(this);
    this.getQuiz = this.getQuiz.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.getResults = this.getResults.bind(this);
  }

  createQuiz(ctx: Context) {
    const { title, questions } = ctx.request.body;
    try {
      const newQuiz = this.quizService.createQuiz(title, questions);
      ctx.status = 201;
      ctx.body = newQuiz;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  getQuiz(ctx: Context) {
    const id = ctx.params.id;
    try {
      const quiz = this.quizService.getQuiz(id);
      if (!quiz) {
        ctx.status = 404;
        ctx.body = { error: `Quiz not found.` };
      } else {
        ctx.status = 200;
        ctx.body = quiz;
      }
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  submitAnswer(ctx: Context) {
    const { id: quizId } = ctx.params;
    const { questionId, selectedOption, userId } = ctx.request.body;
  
    try {
      const result = this.quizService.submitAnswer(quizId, questionId, selectedOption, userId);
      ctx.status = 200;
      ctx.body = result;
    } catch (error: any) {
      if (error.message === 'Quiz not found.' || error.message === 'Question not found.') {
        ctx.status = 404;
        ctx.body = { error: error.message };
      } else {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    }
  }

  getResults (ctx: Context) {
    const { id: userId } = ctx.params; // User ID
  
    try {
      const results = this.quizService.getResults(userId);
      ctx.status = 200;
      ctx.body = {
        userId: results.userId,
        score: results.score,
        quizzes: results.quizzes as QuizResult[],
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

}

export default QuizController;