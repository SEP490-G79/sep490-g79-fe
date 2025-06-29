import type { Species } from "@/types/Species";
export interface Breed {
  _id: string;
  name: string;
  species: string | Species; 
  description?: string;
}