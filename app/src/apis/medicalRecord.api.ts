import axios from "axios";

const BASE_URL = "http://localhost:9999/pets";

export const getMedicalRecordsByPet = async (
  petId: string,
  accessToken: string
) => {
  return axios.get(`${BASE_URL}/${petId}/medical-records/get-by-pet`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const getMedicalRecordById = async (
  petId: string,
  id: string,
  accessToken: string
) => {
  return axios.get(`${BASE_URL}/${petId}/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const createMedicalRecord = async (
  petId: string,
  data: Record<string, any>,
  accessToken: string
) => {
  return axios.post(`${BASE_URL}/${petId}/medical-records`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const updateMedicalRecord = async (
  petId: string,
  id: string,
  data: Record<string, any>,
  accessToken: string
) => {
  return axios.put(`${BASE_URL}/${petId}/medical-records/${id}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const deleteMedicalRecord = async (
  petId: string,
  id: string,
  accessToken: string
) => {
  return axios.delete(`${BASE_URL}/${petId}/medical-records/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const getMedicalRecords = (petId, page, limit) =>
  axios.get(`${BASE_URL}/${petId}/medical-records?page=${page}&limit=${limit}`);
