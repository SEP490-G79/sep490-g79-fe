import axios from "axios";

const BASE_URL = "http://localhost:9999/medical-records";

export const getMedicalRecordsByPet = async (
  petId: string,
  accessToken: string
) => {
  return axios.get(`${BASE_URL}?petId=${petId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const getMedicalRecordById = async (id: string, accessToken: string) => {
  return axios.get(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const createMedicalRecord = async (
  data: Record<string, any>,
  accessToken: string
) => {
  return axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const updateMedicalRecord = async (
  id: string,
  data: Record<string, any>,
  accessToken: string
) => {
  return axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const deleteMedicalRecord = async (id: string, accessToken: string) => {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
