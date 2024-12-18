export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number; // index of the correct option
}
  
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}
  
export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}
  
export interface Result {
  quizId: string;
  userId: string;
  score: number;
  answers: Answer[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  answers: Answer[];
}
  