
export interface ReturnRequest {
  _id: string;
  shelter: {
    _id: string;
    name: string;
    avatar?: string;
  };
  pet: {
    _id: string;
    name: string;
    petCode: string;
    photos: string[]
  };
  requestedBy: {
    _id: string;
    name: string;
    avatar?: string;
  };
  approvedBy?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  photos?: string[];
  reason?: string;
  rejectReason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
