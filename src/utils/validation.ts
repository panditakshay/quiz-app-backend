import { Question, Quiz } from "../types/quiz";

function validateQuizCreate(title: string, questions: Quiz['questions']){
    if (
        !title                              || // No title payload key
        title.length === 0                  || // Blank title payload
        !questions                          || // No questions payload key
        questions.length === 0              || // Empty questions payload
        questions.some(question => 
            !question.text                  || // Each question's no text payload key
            question.text.length === 0      || // Each question's empty text payload
            !question.options               || // Each question's no options payload key
            question.options.length === 0   ||  // Each question's empty options payload
            typeof question.options !== 'object' // Each question's options payload is not an array
        )
    ) {
        throw new Error('Invalid input data.');
    }

    questions.some((question, index) => {
        if (question.options.length > 6) {
            throw new Error(`Question ${index + 1}: Only 6 maximum options allowed.`);
        }

        if(question.options.length < 2){
            throw new Error(`Question ${index + 1}: At least 2 options required.`);
        }

    });
}

function validateQuiz(quiz: Quiz){
    if(!quiz){
        throw new Error('Quiz not found.');
    }
    return quiz;
}

function validateQuestion(question: Question){
    if(!question){
        throw new Error('Question not found.');
    }
    return question;
}

function validateCorrectOption(question: Question, index: number) {
    // if(!question.correctOption){
    //     throw new Error(`Question ${index + 1}: correctOption is required.`);
    // }
    if (question.correctOption === 0) {
        throw new Error(`Question ${index + 1}: correctOption cannot be 0.`);
    }

    if(typeof question.correctOption !== 'number'){
        throw new Error(`Question ${index + 1}: correctOption must be a number.`);
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
    validateQuiz,
    validateQuestion,
};