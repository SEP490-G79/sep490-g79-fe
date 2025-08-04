// src/types/pet.types.ts

export interface Species {
  _id: string;
  name: string;
}

export interface Breed {
  _id: string;
  name: string;
  species: string | Species;
}
export interface PetFormState {
  _id?: string;
  name: string;
  age: string;
  isMale: boolean;
  weight: string;
  color: string;
  identificationFeature: string;
  sterilizationStatus: boolean;
  status: string;
  species: string;
  breeds: string[];
  bio: string;
  photos: string[];
  shelter?: string | { _id: string };
  tokenMoney: number;
}
