export interface User {

  _id: string;
  username: string;
  fullName: string;
  role: string;
  email: string;
  isActive?: boolean;
  avatar: string;
  bio: string;
  dob: string; 
  phoneNumber: string;
  address: string;
  background: string;
  createdAt?: string;
}

