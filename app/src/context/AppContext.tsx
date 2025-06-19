import type { User } from "@/types/User";
import React, { createContext, useState, useContext, type ReactNode } from "react";


interface AppContextType {
  user: User | null;
  accessToken: string | null;
  coreAPI: string;
  authAPI: string;
  adminAPI: string;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  accessToken: null,
  coreAPI: "",
  authAPI: "",
  adminAPI: "",
  login: () => {},
  logout: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AppContext.Provider value={{ user, accessToken, coreAPI, authAPI, adminAPI, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
