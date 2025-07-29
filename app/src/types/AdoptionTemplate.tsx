import type { Question } from "./Question";

export interface createdBy {
    _id: string;
    [key:string]:any;
  }
  export interface Species {
    _id: string;
    [key:string]:any;
  }


export interface AdoptionTemplate {
  _id?: string;
  title: string;
  species: Species;
  description?: string;
  questions: Question[];
  createdBy: createdBy;
  shelter: string;
  status: "active";
  createdAt?: Date;
  updatedAt?: Date;
}
