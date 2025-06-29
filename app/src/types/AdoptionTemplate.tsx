export interface createdBy {
    _id: string;
    [key:string]:any;
  }

export interface AdoptionTemplate {
  _id?: string;
  title: string;
  species: string;
  description?: string;
  questions: (string)[];
  createdBy: createdBy;
  shelter: string;
  status: "active";
  createdAt?: Date;
  updatedAt?: Date;
}
