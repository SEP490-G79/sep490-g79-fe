export interface Blog {
  _id: string;
  shelter: string;
  thumbnail_url: string;
  title: string;
  description?: string;
  content: string;
  status: "moderating" | "published";
  createdAt: string;
  updatedAt: string;
}