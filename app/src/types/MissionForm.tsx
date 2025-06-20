// types/MissionForm.ts
export interface MissionForm {
  _id: string;
  createdAt: string;
  status: "pending" | "interviewing" | "approved" | "rejected" | "reviewed";
  transportMethod: string;
  adoptionForm: {
    pet: {
      name: string;
      photos: string[];
      tokenMoney: number;
    };
    shelter: {
      name: string;
    };
  };
}
