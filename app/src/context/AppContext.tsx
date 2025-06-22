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
import useAuthAxios from "@/utils/authAxios";

const excludedURLs = ['/','/login', '/register', '/active-account', '/faq']

interface AppContextType {
  user: User | null;
  accessToken: string | null;
  coreAPI: string;
  authAPI: string;
  adminAPI: string;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  userProfile: User | null;
  loginLoading: Boolean;
  setLoginLoading: (loading: boolean) => void;
  setUserProfile: (user: User | null) => void;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  accessToken: null,
  coreAPI: "",
  authAPI: "",
  adminAPI: "",
  login: () => { },
  logout: () => { },
  userProfile: null,
  loginLoading: false,
  setLoginLoading: (loginLoading: boolean) => { },
  setUserProfile: () => { },       
  setUser: () => { },
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const accessToken = localStorage.getItem("accessToken");
  const [loginLoading, setLoginLoading] = useState<Boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const authAxios = useAuthAxios();

  // APIs
  const coreAPI = "http://localhost:9999";
  const authAPI = "http://localhost:9999/auth";
  const adminAPI = "http://localhost:9999/admin";
  const userApi = "http://localhost:9999/users";



  const login = (accessToken: string, userData: User) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    axios.post(`${authAPI}/logout`,{id: user?.id})
    .then(res => {
      toast.success("Thoát đăng nhập thành công");
      setUser(null);
      localStorage.clear();
    })
    .catch(err => toast.error("Lỗi thoát đăng nhập!"))
  };

  // Check trạng thái login và access token mỗi khi chuyển trang trừ các trang public
  useEffect(() => {
     if (!excludedURLs.includes(location.pathname)) {
      authAxios
        .get("http://localhost:9999/users/user-profile")
          .then((res) => {
            setUserProfile(res?.data);
            setUser(res?.data);
                })
          .catch((error) => {
            // console.log(error.response?.data?.message);
        });
     }
  }, [location.pathname]);


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
        setUserProfile,  
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;