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
import type { AdoptionTemplate } from "@/types/AdoptionTemplate";
import type { AdoptionForm } from "@/types/AdoptionForm";
import type { MissionForm } from "@/types/MissionForm";
import type { ConsentForm } from "@/types/ConsentForm";
import { useLocation } from "react-router-dom";

const excludedURLs = [
  "/",
  "/login",
  "/register",
  "/active-account",
  "/faq",
  "/donation",
  "/donation/success",
  "/donation/cancel",
  "/newfeed",
];

interface AppContextType {
  user: User | null;
  shelters: Shelter[] | null;
  shelterTemplates: AdoptionTemplate[];
  shelterForms: AdoptionForm[];
  shelterConsentForms: ConsentForm[];
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
  blogAPI: string;
  reportAPI: string;
  returnRequestAPI: string;
  shelterId: string | null;
  setShelterId: (id: string | null) => void;
  setShelters: (shelter: Shelter[]) => void;
  setShelterTemplates: (shelterTemplates: AdoptionTemplate[]) => void;
  setShelterForms: (shelterForms: AdoptionForm[]) => void;
  refreshUserProfile: () => Promise<void>;
  submissionsByPetId: Record<string, MissionForm[]>;
  setSubmissionsByPetId: (data: Record<string, MissionForm[]>) => void;
  setShelterConsentForms: (shelterConsentForms: ConsentForm[]) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  shelters: [],
  shelterTemplates: [],
  shelterForms: [],
  shelterConsentForms: [],
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
  blogAPI: "",
  reportAPI: "",
  returnRequestAPI: "",
  setShelters: () => [],
  shelterId: null,
  setShelterId: () => {},
  setShelterTemplates: () => [],
  setShelterForms: () => [],
  refreshUserProfile: async () => {},
  submissionsByPetId: {},
  setSubmissionsByPetId: () => {},
  setShelterConsentForms: () => [],
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [shelterId, setShelterId] = useState<string | null>(null);

  const [shelterTemplates, setShelterTemplates] = useState<AdoptionTemplate[]>(
    []
  );
  const [shelterForms, setShelterForms] = useState<AdoptionForm[]>([]);
  const accessToken = localStorage.getItem("accessToken");
  const [loginLoading, setLoginLoading] = useState<Boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [petsList, setPetsList] = useState([]);
  const authAxios = useAuthAxios();
  const [submissionsByPetId, setSubmissionsByPetId] = useState<
    Record<string, MissionForm[]>
  >({});
  const [shelterConsentForms, setShelterConsentForms] = useState<ConsentForm[]>(
    []
  );
  const location = useLocation();
  const base_API = import.meta.env.VITE_BE_API; 

  // APIs
  const coreAPI = base_API;
  const authAPI = `${base_API}/auth`;
  const userAPI = `${base_API}/users`;
  const shelterAPI = `${base_API}/shelters`;
  const petAPI = `${base_API}/pets`;
  const medicalRecordAPI = `${base_API}/medical-records`;
  const blogAPI = `${base_API}/blogs`;
  const reportAPI = `${base_API}/reports`;
  const returnRequestAPI = `${base_API}/return-requests`;
  

  const login = (accessToken: string, userData: User) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    axios
      .post(`${authAPI}/logout`, { id: user?.id })
      .then((res) => {
        // toast.success("Thoát đăng nhập thành công");
        setUser(null);
        localStorage.removeItem("accessToken");
      })
      .catch((err) => {
        toast.error("Lỗi đăng xuất!");
        setUser(null);
        localStorage.removeItem("accessToken");
      });
  };

  // Check trạng thái login và access token mỗi khi chuyển trang trừ các trang public

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      authAxios
        .get(`${coreAPI}/users/get-user`)
        .then((res) => {
          setUser(res.data);
          setUserProfile(res.data);
        })
        .catch(() => {
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem("accessToken");
        });
    } else {
      setUser(null);
      setUserProfile(null);
    }
  }, [localStorage.getItem("accessToken"), location.pathname]);

  // get pets list
  useEffect(() => {
    axios
      .get(`${petAPI}/get-pet-list`)
      .then((res) => {
        setPetsList(res.data);
      })
      .catch((error) => {
        // toast.error("Không thể lấy danh sách thú cưng");
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

  const refreshUserProfile = async () => {
    try {
      const res = await authAxios.get(`${coreAPI}/users/get-user`);
      setUser(res.data);
      setUserProfile(res.data);
    } catch (err) {
      console.error("Lỗi khi refresh user profile:", err);
      toast.error("Không thể cập nhật thông tin người dùng");
    }
  };

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
        blogAPI,
        reportAPI,
        returnRequestAPI,
        setShelters,
        shelterId,
        setShelterId,
        shelterTemplates,
        setShelterTemplates,
        shelterForms,
        setShelterForms,
        refreshUserProfile,
        submissionsByPetId,
        setSubmissionsByPetId,
        shelterConsentForms,
        setShelterConsentForms,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
