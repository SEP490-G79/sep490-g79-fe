
export interface Option {

  title: string;
  isTrue: boolean;
}

export interface Question {
  _id: string;
  title: string;
  priority: string;
  options: Option[];
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}



