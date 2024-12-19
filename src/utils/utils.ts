import { Quiz } from "../types/quiz";
import {
  validateCorrectOption,
  validateQuestion,
  validateQuiz,
} from "./validation";

function generateSequentialId(existingMap: Map<string, any>) {
  return String(existingMap.size + 1);
}

function removeAnswersBeforeDisplaying(quiz: Quiz) {
  return {
    ...quiz,
    questions: quiz.questions.map(({ correctOption, ...rest }) => rest),
  };
}

function validateAndGenerateQuestionIds(questions: Quiz["questions"]) {
  return questions.map((question, index) => {
    validateCorrectOption(question, index);
    return {
      ...question,
      id: String(index + 1), // Generate sequential ID starting from 1 for each question added
    };
  });
}

function findQuestionFromQuizzes(
  quizzes: Map<string, Quiz>,
  quizId: string,
  questionId: string,
) {
  const quiz = quizzes.get(quizId)!;
  validateQuiz(quiz);
  const question = quiz.questions.find((q) => q.id === questionId)!;
  validateQuestion(question);
  return question;
}

export {
  generateSequentialId,
  removeAnswersBeforeDisplaying,
  validateAndGenerateQuestionIds,
  findQuestionFromQuizzes,
};
