import { Question, Quiz } from "../types/quiz";

function validateQuizCreate(title: string, questions: Quiz['questions']){
    if (!title || !questions || questions.length === 0) {
        throw new Error('Invalid input data.');
    }
}

function validateCorrectOption(question: Question, index: number) {
    if (question.correctOption === 0) {
        throw new Error(`Question ${index + 1}: correctOption cannot be 0.`);
    }
}

function validateAnswerSubmissionInput(userId: string, questionId: string, quizId: string, selectedOption: number) {
    if (!userId || !quizId || !questionId) {
        throw new Error('Missing required fields.');
    }

    if (typeof selectedOption === 'string') {
        throw new Error('Only Integer value accepted in selectedOption.');
    }
}

function validateSelectedOption(selectedOption: number, question: Question) {
    if (selectedOption < 1 || selectedOption >= question.options.length) {
        throw new Error('Invalid selected option.');
    }
}

function validateAndMarkQuestionAnswered(quizAttemptByUser: { answers: { questionId: string }[] }, questionId: string) {
    if (quizAttemptByUser.answers.some(answer => answer.questionId === questionId)) {
        throw new Error('Question has already been answered.');
    }
}

export { 
    validateQuizCreate,  
    validateCorrectOption,
    validateAnswerSubmissionInput,
    validateSelectedOption,
    validateAndMarkQuestionAnswered,
};