"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const validation_1 = require("../utils/validation");
class QuizService {
    constructor() {
        // Mock in-memory database (as per requirement doc)
        // Acts like a storage for admin to create quizes
        this.quizzes = new Map();
        // Initialize with no userId, add when answering each question in the quiz
        // Acts like a storage for user answered quizes
        this.quizAttemptsByUser = new Map();
    }
    createQuiz(title, questions) {
        // Validate create quiz body params
        (0, validation_1.validateQuizCreate)(title, questions);
        const quizQuestions = (0, utils_1.validateAndGenerateQuestionIds)(questions);
        const id = (0, utils_1.generateSequentialId)(this.quizzes); // Generate sequential ID starting from 1 for each quiz added
        const newQuiz = { id, title, questions: quizQuestions }; // Define quiz structure
        this.quizzes.set(id, newQuiz); // Add defined quiz with structure to database (in-memory)
        return newQuiz;
    }
    getQuiz(quizId) {
        const quiz = this.quizzes.get(quizId);
        if (!quiz) {
            return null;
        }
        // Sanitize quiz questions and display
        return (0, utils_1.removeAnswersBeforeDisplaying)(quiz);
    }
    submitAnswer(quizId, questionId, selectedOption, userId) {
        // Validate submit answer body params
        (0, validation_1.validateAnswerSubmissionInput)(userId, questionId, quizId, selectedOption);
        const question = (0, utils_1.findQuestionFromQuizzes)(this.quizzes, quizId, questionId);
        // Validate the selected option and compare with question's options length
        (0, validation_1.validateSelectedOption)(selectedOption, question);
        // Initialize userAttempts for the user if it doesn't exist
        if (!this.quizAttemptsByUser.has(userId)) {
            this.quizAttemptsByUser.set(userId, new Map());
        }
        const userAttempts = this.quizAttemptsByUser.get(userId);
        // Initialize userAttempts for the quiz if it doesn't exist
        if (!userAttempts.has(quizId)) {
            userAttempts.set(quizId, { answers: [], quizId });
        }
        const quizAttempt = userAttempts.get(quizId);
        // Check if the question has already been answered
        (0, validation_1.validateAndMarkQuestionAnswered)(quizAttempt, questionId);
        // Check if the answer is correct
        const isCorrect = question.correctOption === selectedOption;
        // Append the new answer to the answers array
        quizAttempt.answers.push({ questionId, selectedOption, isCorrect });
        // Return result
        return {
            isCorrect,
            correctOption: question.correctOption,
        };
    }
    getResults(userId) {
        // Check if the user has attempted any quizzes
        const userAttempts = (0, validation_1.validateUserAttempt)(this.quizAttemptsByUser, userId);
        // Initialize collective score and quiz results
        let collectiveScore = 0;
        const quizzesResults = [];
        // Iterate over all quizzes the user has attempted
        userAttempts.forEach((quizAttempt, quizId) => {
            // Calculate the score for each individual quiz
            const quizScore = quizAttempt.answers.filter((answer) => answer.isCorrect).length;
            // Add to individual score to collective score
            collectiveScore += quizScore;
            // Add quiz results to the response
            quizzesResults.push({
                quizId,
                score: quizScore,
                answers: quizAttempt.answers,
            });
        });
        // Return results
        return {
            userId: userId,
            score: collectiveScore,
            quizzes: quizzesResults,
        };
    }
}
exports.default = QuizService;
