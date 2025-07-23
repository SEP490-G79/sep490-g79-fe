import axios from "axios";

const BASE_URL = "http://localhost:9999";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface ShelterDashboardStatistics {
  caringPets: number;
  adoptedPets: number;
  posts: number;
  members: number;
  petGrowth: Array<{
    month: string;
    count: number;
  }>;
}

export interface ShelterProfile {
  _id: string;
  name: string;
  email: string;
  hotline: string;
  address: string;
  avatar?: string;
  background?: string;
  aspiration?: string;
  shelterCode: string;
  status: string;
  members: Array<{
    _id: {
      fullName: string;
      avatar?: string;
    };
    role: string;
  }>;
}

// Shelter Dashboard Statistics
export const getShelterDashboardStatistics = async (
  shelterId: any
): Promise<ShelterDashboardStatistics> => {
  const response = await axios.get(
    `${BASE_URL}/shelters/dashboard-statistics/${shelterId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get Shelter Profile
export const getShelterProfile = async (
  shelterId: string
): Promise<ShelterProfile> => {
  const response = await axios.get(
    `${BASE_URL}/shelters/get-profile/${shelterId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Edit Shelter Profile
export const editShelterProfile = async (
  shelterId: string,
  data: FormData
): Promise<ShelterProfile> => {
  const response = await axios.put(
    `${BASE_URL}/shelter/edit-profile/${shelterId}`,
    data,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Get All Shelters (for public view)
export const getAllShelters = async (): Promise<ShelterProfile[]> => {
  const response = await axios.get(`${BASE_URL}/shelter/get-all`);
  return response.data;
};

// Send Shelter Establishment Request
export const sendShelterEstablishmentRequest = async (
  data: FormData
): Promise<{ message: string; status: number }> => {
  const response = await axios.post(
    `${BASE_URL}/shelter/send-shelter-request`,
    data,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Get Shelter Request by User ID
export const getShelterRequestByUserId = async (): Promise<{
  message: string;
  status: number;
}> => {
  const response = await axios.get(`${BASE_URL}/shelter/get-shelter-request`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export interface WeeklyAdoptionStat {
  week: string; // ví dụ: "Tuần 29/2025"
  count: number; // số lượt nhận nuôi
}

export const getAdoptedPetsByWeek = async (
  shelterId: string
): Promise<WeeklyAdoptionStat[]> => {
  const response = await axios.get(
    `${BASE_URL}/shelters/${shelterId}/statistics/adopted-by-week`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export interface WeeklyAdoptionFormStat {
  week: string; // Ví dụ: "Tuần 30/2025"
  count: number; // Số lượng AdoptionForm được tạo trong tuần đó
}
export const getAdoptionFormsByWeek = async (
  shelterId: string
): Promise<WeeklyAdoptionFormStat[]> => {
  const response = await axios.get(
    `${BASE_URL}/shelters/${shelterId}/statistics/adoption-forms-by-week`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};
