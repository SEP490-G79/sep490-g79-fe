export type QuestionType = "SINGLECHOICE" | "MULTIPLECHOICE" | "TEXT";
export type QuestionPriority = "none" | "low" | "medium" | "high";
export type QuestionStatus = "active" | "inactive";

export interface QuestionOption {
  title: string;
  isTrue: boolean;
}

export interface Question {
  _id: string;
  title: string;
  priority: QuestionPriority;
  options: QuestionOption[];
  status: QuestionStatus;
  type: QuestionType;
  createdAt?: string;
  updatedAt?: string;
}
