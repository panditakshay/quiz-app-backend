import request from 'supertest';
import app, { server } from '../src/app';

describe('Quiz API', () => {
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
  });
});

// afterAll to clean up the server when tests finish
afterAll(() => {
    server.close();
});