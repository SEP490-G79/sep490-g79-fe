export interface ShelterStaffRequestInvitation {
  requestId: string;
  requestType: string;
  sender: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  receiver: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  shelter: {
    id: string;
    name: string;
    avatar: string;
    background: string;
  };
  roles: string[];
  requestStatus: string;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date;
}
