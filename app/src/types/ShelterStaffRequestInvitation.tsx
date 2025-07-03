export interface ShelterStaffRequestInvitation {
  requestId: string;
  requestType: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
  };
  shelter: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  roles: string[];
  requestStatus: string;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date;
}
