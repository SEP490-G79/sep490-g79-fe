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

  // User profile
   useEffect(() => {
 
     axios.get(`${userApi}/user-profile`, {
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
       }
     })
       .then(res => {
         setUserProfile(res.data);
       })
       .catch(error => {
         console.log(error.response?.data?.message);
       });
   }, []);


  // User profile


console.log("userProfile", userProfile);


  return (

    <AppContext.Provider value={{ user, accessToken, coreAPI, authAPI, adminAPI, login, logout, userProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
