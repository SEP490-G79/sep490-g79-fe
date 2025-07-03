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
  shelters: Shelter[] | null;
  accessToken: string | null;
  coreAPI: string;
  authAPI: string;
  userAPI: string;
  shelterAPI: string;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  userProfile: User | null;
  loginLoading: Boolean;
  setLoginLoading: (loading: boolean) => void;
  setUserProfile: (user: User | null) => void;
  setUser: (user: User | null) => void;
  petsList: any;
  petAPI: string;
  medicalRecordAPI: string;
  setShelters: (shelter: Shelter[]) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  shelters: [],
  accessToken: null,
  coreAPI: "",
  authAPI: "",
  userAPI: "",
  shelterAPI: "",
  login: () => {},
  logout: () => {},
  userProfile: null,
  loginLoading: false,
  setLoginLoading: (loginLoading: boolean) => {},
  setUserProfile: () => {},
  setUser: () => {},
  petsList: [],
  petAPI: "",
  medicalRecordAPI: "",
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
  const [petsList, setPetsList] = useState([]);
  const authAxios = useAuthAxios();

  // APIs
  const coreAPI = "http://localhost:9999";
  const authAPI = "http://localhost:9999/auth";
  const userAPI = "http://localhost:9999/users";
  const shelterAPI = "http://localhost:9999/shelters";
  const petAPI = "http://localhost:9999/pets";
  const medicalRecordAPI = "http://localhost:9999/medical-records";

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

  // get pets list
  useEffect(() => {
    axios
      .get(`${petAPI}/get-pet-list`)
      .then((res) => {
        setPetsList(res.data);
      })
      .catch((error) => {
        toast.error("Không thể lấy danh sách thú cưng");
      });
  }, []);

  //Shelter
  useEffect(() => {
    axios
      .get(`${coreAPI}/shelters/get-all`)
      .then((res) => {
        setShelters(res.data);
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
        userAPI,
        shelterAPI,
        login,
        logout,
        userProfile,
        loginLoading,
        setLoginLoading,
        setUserProfile,
        setUser,
        petsList,
        petAPI,
        medicalRecordAPI,
        setShelters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
