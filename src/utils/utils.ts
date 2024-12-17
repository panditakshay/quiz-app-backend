import { Quiz } from "../types/quiz";
import { validateCorrectOption } from "./validation";

function generateSequentialId(existingMap: Map<string, any>) {
    return String(existingMap.size + 1);
}

function removeAnswersBeforeDisplaying(quiz: Quiz) {
    return {
        ...quiz,
        questions: quiz.questions.map(({ correctOption, ...rest }) => rest),
    }
}

function validateAndGenerateQuestions(questions: Quiz['questions']) {
    return questions.map((question, index) => {
        validateCorrectOption(question, index); 
        return {
            ...question,
            id: String(index + 1), // Generate sequential ID starting from 1 for each question added
        };
    });
}

// function initialize

export { generateSequentialId, removeAnswersBeforeDisplaying, validateAndGenerateQuestions };