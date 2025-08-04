// hooks/usePetApi.ts
import useAuthAxios from "@/utils/authAxios";
const base_API = import.meta.env.VITE_BE_API; 

const BASE_URL = `${base_API}`;
const API_URL = `${base_API}/pets`;

export const usePetApi = () => {
  const authAxios = useAuthAxios();
  const getAllPets = (shelterId: string, page = 1, limit = 8) =>
    authAxios.get(`${API_URL}/get-by-shelter/${shelterId}`, {
      params: { page, limit },
    });

  const createPet = (shelterId: string, data: unknown) =>
    authAxios.post(`${API_URL}/createPet/${shelterId}`, data);
  const updatePet = (petId: string, shelterId: string, data: unknown) =>
    authAxios.put(`${API_URL}/edit/${petId}/${shelterId}`, data);

  const disablePet = (petId: string, shelterId: string) =>
    authAxios.patch(`${API_URL}/delete/${petId}/${shelterId}`);

  const analyzePetImage = (imageBase64: string) =>
    authAxios
      .post(`${API_URL}/ai-analyze`, { imageBase64 })
      .then((res) => res.data);
  const getAllSpecies = () => authAxios.get(`${BASE_URL}/species/getAll`);
  const getAllBreeds = () => authAxios.get(`${BASE_URL}/breeds/getAll`);
  const searchPetWithGPT = (formData: FormData) =>
    authAxios.post(`${API_URL}/search-by-ai`, formData).then((res) => res.data);

  return {
    getAllPets,
    createPet,
    updatePet,
    disablePet,
    analyzePetImage,
    getAllSpecies,
    getAllBreeds,
    searchPetWithGPT,
  };
};
