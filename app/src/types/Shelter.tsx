// src/types/Shelter.ts

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
  roles: ('manager' | 'staff')[];
  [key:string]:any;
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
  foundationDate: string;
  status: 'verifying' | 'active' | 'banned';
  warningCount: number;
  createdAt: string;
  updatedAt: string;
}

