import authorizedAxiosInstance from "@/utils/authorizedAxios";

export const refreshToken = async (refreshToken) => {
  return await authorizedAxiosInstance.put("/auth/refresh-token", {
    refreshToken,
  });
};
