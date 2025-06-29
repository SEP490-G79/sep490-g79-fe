import axios from "axios";

const API_URL = "http://localhost:9999/pets"; // Sửa lại cho đúng với backend

export const getAllPets = () => axios.get(`${API_URL}/getAllPets`);
export const createPet = (data: any) =>
  axios.post(`${API_URL}/createPet`, data);
export const updatePet = (id: string, data: any) =>
  axios.put(`${API_URL}/updatePet/${id}`, data);
export const deletePet = (id: string) =>
  axios.delete(`${API_URL}/deletePet/${id}`);
