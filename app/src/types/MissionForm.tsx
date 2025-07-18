// types/MissionForm.ts
export interface MissionForm {
  _id: string;
  createdAt: string;
  status: "pending" | "interviewing" | "approved" | "rejected" | "reviewed";
  transportMethod: string;
  adoptionForm: {
    pet: {
      _id: string;
      name: string;
      photos: string[];
      tokenMoney: number;
    };
    shelter: {
      name: string;
    };
  };
}
