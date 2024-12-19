"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSequentialId = generateSequentialId;
exports.removeAnswersBeforeDisplaying = removeAnswersBeforeDisplaying;
exports.validateAndGenerateQuestionIds = validateAndGenerateQuestionIds;
exports.findQuestionFromQuizzes = findQuestionFromQuizzes;
const validation_1 = require("./validation");
function generateSequentialId(existingMap) {
    return String(existingMap.size + 1);
}
function removeAnswersBeforeDisplaying(quiz) {
    return Object.assign(Object.assign({}, quiz), { questions: quiz.questions.map((_a) => {
            var { correctOption } = _a, rest = __rest(_a, ["correctOption"]);
            return rest;
        }) });
}
function validateAndGenerateQuestionIds(questions) {
    return questions.map((question, index) => {
        (0, validation_1.validateCorrectOption)(question, index);
        return Object.assign(Object.assign({}, question), { id: String(index + 1) });
    });
}
function findQuestionFromQuizzes(quizzes, quizId, questionId) {
    const quiz = quizzes.get(quizId);
    (0, validation_1.validateQuiz)(quiz);
    const question = quiz.questions.find((q) => q.id === questionId);
    (0, validation_1.validateQuestion)(question);
    return question;
}
