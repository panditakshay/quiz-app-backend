import { Context } from 'koa';
import { Answer, Question, Quiz } from '../types/quiz';

// Mock in-memory database (as per requirement doc)
// Acts like a storage for admin to create quizes
const quizzes: Map<string, Quiz> = new Map();

//Initialize with no userId, add when answering each question in the quiz
// Acts like a storage for user answered quizes
const quizAttemptsByUser: Map<string, Map<string, { answers: Answer[], quizId: string }>> = new Map();

const createQuiz = async (ctx: Context) => {
  const { title, questions } = ctx.request.body as Quiz;

  if (!title || !questions || questions.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid input data.' };
    return;
  }

   // Assign sequential IDs to each question
   const quizQuestions: Question[] = questions.map((question, index) => ({
    ...question,
    id: String(index + 1),  // Generate sequential ID starting from 1
  }));

  const id = String(quizzes.size + 1); // Generate sequential ID starting from 1
  const newQuiz: Quiz = { id, title, questions: quizQuestions };
  quizzes.set(id, newQuiz);

  ctx.status = 201;
  ctx.body = newQuiz;
};

// Get a quiz by ID
const getQuiz = async (ctx: Context) => {
  const { id } = ctx.params; // Quiz ID
  const quiz = quizzes.get(id);

  if (!quiz) {
    ctx.status = 404;
    ctx.body = { error: 'Quiz not found.' };
    return;
  }

  // Remove the correct answers before sending the response
  const sanitizedQuestions = quiz.questions.map(({ correctOption, ...rest }) => rest);

  ctx.status = 200;
  ctx.body = { 
    id: quiz.id, 
    title: quiz.title, 
    questions: sanitizedQuestions 
  };
};
  
const submitAnswer = async (ctx: Context) => {
  const { id: quizId } = ctx.params; // Quiz ID
  const { questionId, selectedOption, userId } = ctx.request.body;

  // Validate input
  if (!userId || !quizId || !questionId || !selectedOption) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required fields.' };
    return;
  }

  // Get the quiz
  const quiz = quizzes.get(quizId);
  if (!quiz) {
    ctx.status = 404;
    ctx.body = { error: 'Quiz not found.' };
    return;
  }

  // Find the question
  const question = quiz.questions.find(q => q.id === questionId);

  if (!question) {
    ctx.status = 404;
    ctx.body = { error: 'Question not found.' };
    return;
  }

  // Validate the selected option
  if (typeof selectedOption === 'string') {
    ctx.status = 400;
    ctx.body = { error: 'Integer value expected in selectedOption.' };
    return;
  }
  if (selectedOption < 0 || selectedOption >= question.options.length) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid option selected.' };
    return;
  }


  // Initialize userAttempts for the user if it doesn't exist
  if (!quizAttemptsByUser.has(userId)) {
    quizAttemptsByUser.set(userId, new Map());
  }

  const userAttempts = quizAttemptsByUser.get(userId)!;

  // Initialize quizAttempt for the quiz if it doesn't exist
  if (!userAttempts.has(quizId)) {
    userAttempts.set(quizId, { answers: [], quizId });
  }

  const quizAttempt = userAttempts.get(quizId)!;

  // Check if the question has already been answered
  if (quizAttempt.answers.some(answer => answer.questionId === questionId)) {
    ctx.status = 400;
    ctx.body = { error: 'Question has already been answered.' };
    return;
  }

  // Check if the answer is correct
  const isCorrect = question.correctOption === selectedOption;

  // Append the new answer to the answers array
  quizAttempt.answers.push({ questionId, selectedOption, isCorrect });

  // Return result
  ctx.status = 200;
  ctx.body = {
    isCorrect,
    correctOption: question.correctOption,
  };
};

const getResults = async (ctx: Context) => {
  const { id: userId } = ctx.params; // User ID

  // Check if the user has attempted any quizzes
  const userAttempts = quizAttemptsByUser.get(userId);
  if (!userAttempts) {
    ctx.status = 404;
    ctx.body = { error: 'User quiz attempts not found.' };
    return;
  }

  // Initialize collective score and prepare quiz results
  let collectiveScore = 0;
  const quizzesResults: { quizId: string; score: number; answers: Answer[]; }[] = [];

  // Iterate over all quizzes the user has attempted
  userAttempts.forEach((quizAttempt, quizId) => {
    // Calculate the score for this quiz
    const quizScore = quizAttempt.answers.filter(answer => answer.isCorrect).length;

    // Add to collective score
    collectiveScore += quizScore;

    // Add quiz results to the response
    quizzesResults.push({
      quizId,
      score: quizScore,
      answers: quizAttempt.answers,
    });
  });

  // Return results
  ctx.status = 200;
  ctx.body = {
    user: userId,
    score: collectiveScore,
    quizzes: quizzesResults,
  };
};

export { 
  createQuiz, 
  getQuiz, 
  submitAnswer, 
  getResults 
};