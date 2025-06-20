import type { User } from "@/types/User";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { toast } from "sonner";

interface AppContextType {
  user: User | null;
  accessToken: string | null;
  coreAPI: string;
  authAPI: string;
  adminAPI: string;
  login: (token: string, userData: User) => void;
  logout: () => void;
  userProfile: User | null;
  loginLoading: Boolean;
  setLoginLoading: (loading: boolean) => void;
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
  loginLoading: false,
  setLoginLoading: (loginLoading: boolean) => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const accessToken = localStorage.getItem("accessToken");
  const [loginLoading, setLoginLoading] = useState<Boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  // APIs
  const coreAPI = "http://localhost:9999";
  const authAPI = "http://localhost:9999/auth";
  const adminAPI = "http://localhost:9999/admin";
  const userApi = "http://localhost:9999/users";

  const login = (accessToken: string, userData: User) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Api

  const logout = () => {
    axios
      .post(`${authAPI}/logout`, { id: user?._id })
      .then((res) => {
        toast.success("Đăng xuất thành công");
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      })
      .catch((err) => toast.error("Lỗi đăng xuất!"));
  };

  // User profile
  useEffect(() => {
    if(accessToken){
      axios
      .get(`${userApi}/user-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setUserProfile(res?.data);
        setUser(res?.data);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
    }
  }, [accessToken]);

  // User profile

  // console.log("userProfile", userProfile);

  return (
    <AppContext.Provider
      value={{
        user,
        accessToken,
        coreAPI,
        authAPI,
        adminAPI,
        login,
        logout,
        userProfile,
        loginLoading,
        setLoginLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
