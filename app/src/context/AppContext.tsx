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
import type { Shelter } from "@/types/Shelter";

const excludedURLs = ["/", "/login", "/register", "/active-account", "/faq"];

interface AppContextType {
  user: User | null;
  shelters:Shelter[] | null;
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
  setShelters: (shelter: Shelter[]) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  shelters:[],
  accessToken: null,
  coreAPI: "",
  authAPI: "",
  adminAPI: "",
  login: () => {},
  logout: () => {},
  userProfile: null,
  loginLoading: false,
  setLoginLoading: (loginLoading: boolean) => {},
  setUserProfile: () => {},
  setUser: () => {},
  setShelters: () => [],
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
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
    axios
      .post(`${authAPI}/logout`, { id: user?.id })
      .then((res) => {
        toast.success("Thoát đăng nhập thành công");
        setUser(null);
        localStorage.removeItem("accessToken");
      })
      .catch((err) => toast.error("Lỗi thoát đăng nhập!"));
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

  //Shelter
  useEffect(() => {
    axios
      .get(`${coreAPI}/shelters/get-all`)
      .then((res) => {
        setShelters(res.data)
      })
      .catch((error) => {
        // console.log(error.response?.data?.message);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        shelters,
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
        setUser,
        setShelters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
