export interface Notification {
  _id: string;
  from: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  redirectUrl: string;
  seen: boolean;
  createdAt: Date; 
  updatedAt: Date; 
}