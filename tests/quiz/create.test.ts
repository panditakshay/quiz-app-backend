import request from 'supertest';
import app, { server } from '../../src/app';

describe('Quiz API: CREATE QUIZ', () => {

  // Test case for successful quiz creation
  it('should create a new quiz', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      title: 'Sample Quiz',
      questions: [
        {
          id: '1',
          text: 'What is 2+2?',
          options: ['1', '2', '3', '4'],
          correctOption: 3,
        },
      ],
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Sample Quiz');
  });

  // Test case for missing title
  it('should return 400 status code when title is missing', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      questions: [
        {
          text: 'What is 2+2?',
          options: ['1', '2', '3', '4'],
          correctOption: 3,
        },
      ],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid input data.');
  });

  // Test case for missing questions
  it('should return 400 status code when questions are missing', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      title: 'Sample Quiz',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid input data.');
  });

  // Test case for empty questions array
  it('should return 400 status code when questions array is empty', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      title: 'Sample Quiz',
      questions: [],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid input data.');
  });

  // Test case for invalid correctOption
  it('should return 400 status code when correctOption is 0', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      title: 'Sample Quiz',
      questions: [
        {
          text: 'What is 2+2?',
          options: ['1', '2', '3', '4'],
          correctOption: 0,
        },
      ],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('correctOption cannot be 0.');
  });

  // Test case for missing options
  it('should return 400 status code when options are missing in a question', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      title: 'Sample Quiz',
      questions: [
        {
          text: 'What is 2+2?',
          correctOption: 3,
        },
      ],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid input data.');
  });

  // Test case for invalid options (not an array)
  it('should return 400 status code when options are not an array', async () => {
    const response = await request(app.callback()).post('/quiz').send({
      title: 'Sample Quiz',
      questions: [
        {
          text: 'What is 2+2?',
          options: 'not-an-array',
          correctOption: 3,
        },
      ],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid input data.');
  });
});



// afterAll to clean up the server when tests finish
afterAll(() => {
    server.close();
});

// __mocks__/koa2-swagger-ui.js
export const koaSwagger = jest.fn(() => jest.fn());
