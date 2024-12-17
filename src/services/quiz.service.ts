import { Answer, Quiz, SanitizedQuestion } from '../types/quiz';

class QuizService {
    // Mock in-memory database (as per requirement doc)
    // Acts like a storage for admin to create quizes
    private quizzes: Map<string, Quiz> = new Map();
    
    // Initialize with no userId, add when answering each question in the quiz
    // Acts like a storage for user answered quizes
    private quizAttemptsByUser: Map<string, Map<string, { answers: Answer[], quizId: string }>> = new Map();
    
    
    public createQuiz(title: string, questions: Quiz['questions']) {
        if (!title || !questions || questions.length === 0) {
            throw new Error('Invalid input data.');
        }

        // Validate correctOption and generate IDs
        const quizQuestions: Quiz['questions'] = questions.map((question, index) => {
            if (question.correctOption === 0) {
                throw new Error(`Question ${index + 1}: correctOption cannot be 0.`);
            }

            return {
                ...question,
                id: String(index + 1), // Generate sequential ID starting from 1
            };
        });

        const id = String(this.quizzes.size + 1); // Generate sequential ID starting from 1
        const newQuiz: Quiz = { id, title, questions: quizQuestions };
        this.quizzes.set(id, newQuiz);
        return newQuiz;
    }

    getQuiz(quizId: string) {
        const quiz = this.quizzes.get(quizId);
        if (!quiz) {
            return null;
        }

        // Remove correct answers before sending response
        const sanitizedQuiz = {
            ...quiz,
            questions: quiz.questions.map(({ correctOption, ...rest }) => rest),
        };
        return sanitizedQuiz
    }

    submitAnswer(quizId: string, questionId: string, selectedOption: number, userId: string) {
        // Validate input
        if (!userId || !quizId || !questionId) {
            throw new Error('Missing required fields.');
        }

        // Get the quiz
        const quiz = this.quizzes.get(quizId);
        if (!quiz) {
            throw new Error('Quiz not found.');
        }

        // Find the question
        const question = quiz.questions.find(q => q.id === questionId);
        if (!question) {
            throw new Error('Question not found.'); 
        }

        // Validate the selected option
        if (typeof selectedOption === 'string') {
           throw new Error('Only Integer value accepted in selectedOption.');
        }
        if (selectedOption < 1 || selectedOption >= question.options.length) {
            throw new Error('Invalid selected option.');
        }

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
        if (quizAttempt.answers.some(answer => answer.questionId === questionId)) {
            throw new Error('Question has already been answered.');
        }

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
        const userAttempts = this.quizAttemptsByUser.get(userId);
        if (!userAttempts) {
           throw new Error('This User has not attempted any quizzes.');
        }

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
            user: userId,
            score: collectiveScore,
            quizzes: quizzesResults,
        }

    }

}

export default QuizService;