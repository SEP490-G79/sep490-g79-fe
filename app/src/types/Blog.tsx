import type { Shelter } from "./Shelter";

export interface Blog {
  _id: string;
  shelter: {
    _id: string;
    name: string;
    avatar?: string;
    address?: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
  createdBy: {
    _id: string;
    fullName: string;
    avatar?: string;
  }
  thumbnail_url: string;
  title: string;
  description?: string;
  content: string;
  status: "moderating" | "published" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// export interface BlogCard {
//   _id: string;
//   shelter: string;
//   thumbnail_url: string;
//   title: string;
//   description?: string;
//   content: string;
//   status: "moderating" | "published";
//   createdAt: string;
//   updatedAt: string;
// }


// export interface BlogDetail {
//   _id: string;
//   shelter: Shelter;
//   thumbnail_url: string;
//   title: string;
//   description?: string;
//   content: string;
//   status: "moderating" | "published";
//   createdAt: string;
//   updatedAt: string;
// }