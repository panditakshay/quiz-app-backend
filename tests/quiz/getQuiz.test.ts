import request from "supertest";
import app, { server } from "../../src/app";

describe("GET /quiz/:id", () => {
  const mockQuiz = {
    id: "1",
    title: "Sample Quiz",
    questions: [
      {
        text: "What is 2+2?",
        options: ["1", "2", "3", "4"],
        correctOption: 4,
      },
    ],
  };

  beforeAll(async () => {
    // Create a mock quiz to use for testing
    await request(app.callback()).post("/quiz").send(mockQuiz);
  });

  it("should return a quiz when a valid ID is provided", async () => {
    const response = await request(app.callback()).get(`/quiz/${mockQuiz.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: mockQuiz.id,
      title: mockQuiz.title,
      questions: expect.any(Array), // Ensure it returns sanitized questions
    });
  });

  it("should return 404 when the quiz ID does not exist", async () => {
    const response = await request(app.callback()).get("/quiz/nonexistent-id");
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Quiz not found.",
    });
  });

  afterAll(() => {
    server.close();
  });
});
