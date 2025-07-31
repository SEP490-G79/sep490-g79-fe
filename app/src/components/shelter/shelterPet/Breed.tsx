import type { Species } from "@/types/pet.types";

export type Breed = {
  _id: string;
  name: string;
  species: string | Species;
  description?: string;
};
