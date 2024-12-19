import request from "supertest";
import app, { server } from "../../src/app"; // Adjust path to your app

describe("Quiz Controller", () => {
  let quizId: string;
  const userId = "akshay";

  // Mock quiz and answer data
  const mockQuiz = {
    title: "Sample Quiz",
    questions: [
      {
        text: "What is 2+2?",
        options: [1, 2, 3, 4],
        correctOption: 4,
      },
    ],
  };

  const mockAnswer = {
    questionId: "1",
    selectedOption: 4,
    userId: userId,
  };

  // Step 1: Create a quiz
  it("should create a new quiz", async () => {
    const response = await request(app.callback()).post("/quiz").send(mockQuiz);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: mockQuiz.title,
      questions: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          text: expect.any(String),
          options: expect.arrayContaining([1, 2, 3, 4]),
        }),
      ]),
    });

    quizId = response.body.id; // Store quizId for later use
  });

  // Step 2: Submit an answer to the quiz
  it("should submit an answer to the quiz", async () => {
    const response = await request(app.callback())
      .post(`/quiz/${quizId}/answers`)
      .send(mockAnswer);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      isCorrect: true,
      correctOption: 4,
    });
  });

  // Step 3: Retrieve the results for the user
  it("should retrieve quiz results for the user", async () => {
    const response = await request(app.callback()).get(`/quiz/score/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      userId: userId,
      totalScore: expect.any(Number),
      quizzes: expect.arrayContaining([
        expect.objectContaining({
          quizId: quizId,
          score: expect.any(Number),
          answers: expect.arrayContaining([
            expect.objectContaining({
              questionId: expect.any(String),
              selectedOption: 4,
              isCorrect: true,
            }),
          ]),
        }),
      ]),
    });
  });

  // Step 4: Handle cases where the user or quiz does not exist
  it("should return 404 if user quiz results are not found", async () => {
    const response = await request(app.callback()).get(
      "/quiz/score/nonexistent-user-id",
    );
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "The User attempt for the quiz not found.",
    });
  });

  afterAll(() => {
    server.close(); // Ensure server is closed after tests
  });
});
