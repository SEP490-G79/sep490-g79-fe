import type { CommentType } from "@/types/Comment";
export interface PostType {
  _id: string;
  title: string;
  photos: string[];
  privacy: string[];
  status: "active" | "hidden" | "deleted";
  createdAt: string;
  updatedAt?: string;
  createdBy: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  shelter?: {
    _id: string;
    name: string;
    avatar: string;
    members: {
      _id: string;
      roles: ("manager" | "staff")[];
    }[];
  } | null;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  user: {
    avatar: string;
    fullName: string;
  };
  likedBy: string[];
  latestComment?: CommentType | null;
}
