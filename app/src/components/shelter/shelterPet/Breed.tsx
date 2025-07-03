export type Breed = {
  _id: string;
  name: string;
  species: string | Species;
  description?: string;
};
