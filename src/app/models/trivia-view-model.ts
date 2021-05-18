export interface TriviaViewModel {
    questionId: number;
    category: string;
    type: string;
    difficulty: string;
    question: string;
    options: Options[];
    correctOptionId: number;
    selectedOptionId: number;
}

export interface Options {
  optionId: number;
  option: string;
}
