import request from 'supertest';
import app, { server } from '../../src/app';
import QuizService from '../../src/services/quiz.service';

describe('QUIZ API: SUBMIT ANSWER', () => {
  const quizService = new QuizService();
  const mockQuizId = '1';
  const mockQuestionId = '1';
  const mockUserId = 'user-789';
  const correctOption = 4;
  const quizTitle = 'Sample Quiz';

  const mockQuiz = {
    title: quizTitle,
    questions: [
      {
        text: 'What is 2+2?',
        options: ['1', '2', '3', '4'],
        correctOption: correctOption,
      },
    ],
  };

  app.context.quizService = quizService; // Ensure this is set correctly


  beforeEach(async () => {
    // Create a mock quiz to use for testing
    const res = await request(app.callback()).post('/quiz').send(mockQuiz);
  });

  // Success case
  it('should submit an answer successfully and return the result', async () => {
    const response = await request(app.callback())
      .post(`/quiz/${mockQuizId}/answers`)
      .send({
        questionId: mockQuestionId,
        selectedOption: correctOption,
        userId: mockUserId,
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      isCorrect: true,
      correctOption,
    });
  });

  // Quiz not found
  it('should return 404 for a non-existing quiz ID', async () => {
    const response = await request(app.callback())
      .post('/quiz/non-existent-quiz-id/answers')
      .send({
        questionId: mockQuestionId,
        selectedOption: correctOption,
        userId: mockUserId,
      });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: 'Quiz not found.',
    });
  });

  // Question not found
  it('should return 400 for a non-existing question ID', async () => {
    const response = await request(app.callback())
        .post(`/quiz/${mockQuizId}/answers`)
        .send({
            questionId: 'non-existent-question-id',
            selectedOption: correctOption,
            userId: mockUserId,
        });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
        error: 'Question not found.',
    });
  });

    // Invalid selected option
    it('should return 400 for a invalid selection option', async () => {
        const response = await request(app.callback())
            .post(`/quiz/${mockQuizId}/answers`)
            .send({
                questionId: mockQuestionId,
                selectedOption: 6,
                userId: mockUserId,
            });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: 'Invalid selected option.',
        });
    });

    // selectedOption type other than number
    it('should return 400 for a invalid selection option', async () => {
        const response = await request(app.callback())
            .post(`/quiz/${mockQuizId}/answers`)
            .send({
                questionId: mockQuestionId,
                selectedOption: 'A',
                userId: mockUserId,
            });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: 'Only Integer value accepted in selectedOption.',
        });
    });

    // missing required fields -- userId/selectedOptons/questionId
    it('should return 400 for missing userId', async () => {
        const response = await request(app.callback())
            .post(`/quiz/${mockQuizId}/answers`)
            .send({
                // questionId: mockQuestionId,
                // selectedOption: 2,
                // userId: mockUserId,
            });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            error: 'Missing required fields.',
        });
    });

  // Question already answered
  it('should return 400 for already answered question', async () => {
    // First submission
    await request(app.callback())
      .post(`/quiz/${mockQuizId}/answers`)
      .send({
        questionId: mockQuestionId,
        selectedOption: correctOption,
        userId: mockUserId,
      });

    // Second submission (duplicate)
    const response = await request(app.callback())
      .post(`/quiz/${mockQuizId}/answers`)
      .send({
        questionId: mockQuestionId,
        selectedOption: correctOption,
        userId: mockUserId,
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Question has already been answered.',
    });
  });

  afterAll(() => {
    server.close();
  });
});