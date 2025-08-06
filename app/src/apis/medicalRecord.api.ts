import axios from "axios";
const base_API = import.meta.env.VITE_BE_API; 

const BASE_URL = `${base_API}/pets`;

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
  return axios.post(
    `${BASE_URL}/${petId}/medical-records`,
    { ...data, petId }, // Thêm petId vào body
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};
export const updateMedicalRecord = async (
  petId: string,
  recordId: string,
  data: Record<string, any>,
  accessToken: string
) => {
  return axios.put(
    `${BASE_URL}/${petId}/medical-records/update`,
    { ...data, id: recordId, petId },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const deleteMedicalRecord = async (
  petId: string,
  recordId: string,
  accessToken: string
) => {
  return axios.delete(`${BASE_URL}/${petId}/medical-records/delete`, {
    data: { id: recordId, petId }, // gửi dưới dạng body
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const getMedicalRecords = (petId:any, page:any, limit:any) =>
  axios.get(`${BASE_URL}/${petId}/medical-records?page=${page}&limit=${limit}`);
