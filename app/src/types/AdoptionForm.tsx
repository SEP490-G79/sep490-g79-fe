export interface Pet {
  _id: string;
  [key: string]: any;
}

export interface AdoptionForm {
  _id: string;
  title: string;
  pet: Pet;
  description?: string;
  questions: string[];
  createdBy: string;
  shelter: string;
  status: "draft" | "active" | "closed";
  createdAt: string;
  updatedAt: string;
}

