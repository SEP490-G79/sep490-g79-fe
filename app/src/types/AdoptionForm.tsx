import type { Question } from "./Question";
import type { Pet } from "./Pet";



export interface AdoptionForm {

  _id: string;
  title: string;
  pet: Pet;
  description?: string;
  questions: Question[];
  createdBy: string;
  shelter: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

