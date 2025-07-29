export interface FileData {
  fileName: string;
  url: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShelterMember {
  _id: string;
  roles: ("manager" | "staff")[];
  [key: string]: any;
}

export interface Invitation {
  _id: string;
  shelter: string;
  user: string; 
  type: string;
  roles: string[];
  status: string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface Shelter {
  _id: string;
  name: string;
  bio?: string;
  email: string;
  hotline: number;
  avatar: string;
  address?: string;
  background: string;
  members: ShelterMember[];
  shelterLicense: FileData;
  invitations?: Invitation[];
  foundationDate: string;
  status: "verifying" | "active" | "banned";
  warningCount: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}