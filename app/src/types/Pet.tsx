import type { Species } from "@/types/Species";
import type { Breed } from "@/types/Breed";
import type { Shelter } from "@/types/Shelter";

export interface Pet {
  _id: string;
  name: string;
  isMale: boolean;
  age: number;
  weight?: number;
  identificationFeature?: string;
  sterilizationStatus?: boolean;
  species: Species;
  breeds?: Breed[];
  color?: string;
  bio?: string;
  intakeTime?: string;
  photos: string[];
  foundLocation?: string;
  tokenMoney?: number;
  shelter?: Shelter;
  adopter?: string | { _id: string; fullName?: string };
  status: "unavailable" | "available" | "adopted" | "disabled" | "booking" | "delivered";
  createdAt?: string;
  updatedAt?: string;
  petCode?: string;
}

