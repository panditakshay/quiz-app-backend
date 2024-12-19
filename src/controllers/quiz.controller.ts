import { Context } from "koa";
import { Answer, Question, Quiz, QuizResult } from "../types/quiz";
import QuizService from "../services/quiz.service";

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
      switch (error.message) {
        case "Invalid input data.":
          ctx.status = 400;
          ctx.body = { error: error.message };
          break;
        default:
          if (
            error.message.includes("correctOption cannot be 0.") ||
            error.message.includes("correctOption must be a number.")
          ) {
            ctx.status = 400;
            ctx.body = { error: error.message };
          } else {
            ctx.status = 500;
            ctx.body = { error: error.message };
          }
          break;
      }
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
      const result = this.quizService.submitAnswer(
        quizId,
        questionId,
        selectedOption,
        userId,
      );
      ctx.status = 200;
      ctx.body = result;
    } catch (error: any) {
      switch (error.message) {
        case "Quiz not found.":
        case "Question not found.":
          ctx.status = 404;
          ctx.body = { error: error.message };
          break;
        case "Invalid selected option.":
        case "Question has already been answered.":
        case "Missing required fields.":
        case "Only Integer value accepted in selectedOption.":
          ctx.status = 400;
          ctx.body = { error: error.message };
          break;
        default:
          ctx.status = 500;
          ctx.body = { error: error.message };
          break;
      }
    }
  }

  getResults(ctx: Context) {
    const { id: userId } = ctx.params; // User ID

    try {
      const results = this.quizService.getResults(userId);
      ctx.status = 200;
      ctx.body = {
        userId: results.userId,
        totalScore: results.score,
        quizzes: results.quizzes as QuizResult[],
      };
    } catch (error: any) {
      switch (error.message) {
        case "The User attempt for the quiz not found.":
          ctx.status = 404;
          ctx.body = { error: error.message };
          break;
        default:
          ctx.status = 500;
          ctx.body = { error: error.message };
          break;
      }
    }
  }
}

export default QuizController;
