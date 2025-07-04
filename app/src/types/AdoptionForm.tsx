import type { Question } from "./Question";

export interface Pet {
  _id: string;
  [key: string]: any;
}


export interface AdoptionForm {
  _id: string;
  title: string;
  pet: Pet;
  description?: string;
  questions: Question[];
  createdBy: string;
  shelter: string;
  status: "draft" | "active" | "closed";
  createdAt: string;
  updatedAt: string;
}

