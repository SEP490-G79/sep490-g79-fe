// hooks/usePetApi.ts
import useAuthAxios from "@/utils/authAxios";

const API_URL = "http://localhost:9999/pets";

export const usePetApi = () => {
  const authAxios = useAuthAxios();
  const getAllPets = (shelterId: string, page = 1, limit = 8) =>
    authAxios.get(`${API_URL}/get-by-shelter/${shelterId}`, {
      params: { page, limit },
    });

  const createPet = (shelterId: string, data: any) =>
    authAxios.post(`${API_URL}/createPet/${shelterId}`, data);
  const updatePet = (petId: string, shelterId: string, data: any) =>
    authAxios.put(`${API_URL}/edit/${petId}/${shelterId}`, data);

  const deletePet = (petId: string, shelterId: string) =>
    authAxios.delete(`${API_URL}/delete/${petId}/${shelterId}`);

  const analyzePetImage = (imageBase64: string) =>
    authAxios
      .post(`${API_URL}/ai-analyze`, { imageBase64 })
      .then((res) => res.data);

  return {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    analyzePetImage,
  };
};
