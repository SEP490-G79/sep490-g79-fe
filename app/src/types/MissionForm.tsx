export interface MissionForm {
  _id: string;
  createdAt: string;
  status: "pending" | "interviewing" | "approved" | "rejected" | "reviewed";
  transportMethod: string;
adoptionsLastMonth: number;
total: number;
  performedBy: {
    _id: string;
    email: string;
  };

  adoptionForm: {
    _id: string;
    title: string;
    description: string;
    status: "active" | string;
    pet: {
      _id: string;
      name: string;
      petCode?: string;
      photos: string[];
      tokenMoney?: number;
    };
    shelter: {
      _id: string;
      name: string;
    };
  };

  answers: Answer[];
}

export interface Answer {
  _id: string;
  questionId: Question;
  selections: string[];
}

export interface Question {
  _id: string;
  title: string;
  priority: "none" | "low" | "medium" | "high";
  type: "TEXT" | "SINGLECHOICE" | "MULTIPLECHOICE";
  status: "active" | "inactive";
  options: Option[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Option {
  _id?: string;
  title: string;
  isTrue: boolean;
}
