export interface MedicalRecord {
  _id: string;
  title: string;
  description: string;
  cost: number;
  procedureDate: string;
  dueDate: string;
  status: string;
  photos: string[];
  type: string;
}
