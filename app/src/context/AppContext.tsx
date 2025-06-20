import type { User } from "@/types/User";
import React, { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import axios from "axios";



interface AppContextType {
  user: User | null;
  accessToken: string | null;
  coreAPI: string;
  authAPI: string;
  adminAPI: string;
  login: (token: string, userData: User) => void;
  logout: () => void;
  getProfile: () => void;
  userProfile: User | null
}

const AppContext = createContext<AppContextType>({
  user: null,
  accessToken: null,
  coreAPI: "",
  authAPI: "",
  adminAPI: "",
  login: () => {},
  logout: () => {},
  userProfile: null,
  getProfile: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
   const [userProfile, setUserProfile] = useState<User | null>(null);
 

  // APIs
  const coreAPI = 'http://localhost:9999';
  const authAPI = 'http://localhost:9999/auth';
  const adminAPI = 'http://localhost:9999/admin';

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };


  // Api
   const userApi = "http://localhost:9999/users";

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

 const getProfile = async () => {
  const id = "684ef3df0d4fe7b7340fa873";
  try {
    const res = await axios.get(`http://localhost:9999/users/${id}`);
    setUserProfile(res.data);
    console.log("userProfile", res.data);
  } catch (error: any) {
    console.error(error.response?.data?.message || "Lỗi khi lấy userProfile");
  }
};
useEffect(() => {
  getProfile();
}, []);


  // User profile


console.log("userProfile", userProfile);


  return (

    <AppContext.Provider value={{ user, accessToken, coreAPI, authAPI, adminAPI, login, logout, getProfile, userProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
