import { Answer, Quiz } from '../types/quiz';
import { findQuestionFromQuizzes, generateSequentialId, removeAnswersBeforeDisplaying, validateAndGenerateQuestionIds } from '../utils/utils';
import { validateAndMarkQuestionAnswered, validateAnswerSubmissionInput, validateQuizCreate, validateSelectedOption, validateUserAttempt } from '../utils/validation';

class QuizService {
    // Mock in-memory database (as per requirement doc)
    // Acts like a storage for admin to create quizes
    private quizzes: Map<string, Quiz> = new Map();
    
    // Initialize with no userId, add when answering each question in the quiz
    // Acts like a storage for user answered quizes
    private quizAttemptsByUser: Map<string, Map<string, { answers: Answer[], quizId: string }>> = new Map();
    
    
    createQuiz(title: string, questions: Quiz['questions']) {

        // Validate create quiz body params
        validateQuizCreate(title, questions);

        const quizQuestions = validateAndGenerateQuestionIds(questions);
        const id = generateSequentialId(this.quizzes); // Generate sequential ID starting from 1 for each quiz added
        const newQuiz: Quiz = { id, title, questions: quizQuestions }; // Define quiz structure
        this.quizzes.set(id, newQuiz); // Add defined quiz with structure to database (in-memory)
        return newQuiz;
    }

    getQuiz(quizId: string) {
        const quiz = this.quizzes.get(quizId);
        if (!quiz) {
            return null;
        }

        // Sanitize quiz questions and display
        return removeAnswersBeforeDisplaying(quiz);
    }

    submitAnswer(quizId: string, questionId: string, selectedOption: number, userId: string) {

        // Validate submit answer body params
        validateAnswerSubmissionInput(userId, questionId, quizId, selectedOption);

        const question = findQuestionFromQuizzes(this.quizzes, quizId, questionId);
        
        // Validate the selected option and compare with question's options length
        validateSelectedOption(selectedOption, question);

        // Initialize userAttempts for the user if it doesn't exist
        if (!this.quizAttemptsByUser.has(userId)) {
            this.quizAttemptsByUser.set(userId, new Map());
        }

        const userAttempts = this.quizAttemptsByUser.get(userId)!;

        // Initialize userAttempts for the quiz if it doesn't exist
        if (!userAttempts.has(quizId)) {
            userAttempts.set(quizId, { answers: [], quizId });
        }

        const quizAttempt = userAttempts.get(quizId)!;

        // Check if the question has already been answered
        validateAndMarkQuestionAnswered(quizAttempt, questionId);

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

    getResults(userId: string) {
        // Check if the user has attempted any quizzes
        const userAttempts = validateUserAttempt(this.quizAttemptsByUser, userId);
        
        // Initialize collective score and quiz results
        let collectiveScore = 0;
        const quizzesResults: { quizId: string; score: number; answers: Answer[]; }[] = [];

         // Iterate over all quizzes the user has attempted
        userAttempts.forEach((quizAttempt, quizId) => {
            // Calculate the score for each individual quiz
            const quizScore = quizAttempt.answers.filter(answer => answer.isCorrect).length;

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
        }

    }

}

export default QuizService;