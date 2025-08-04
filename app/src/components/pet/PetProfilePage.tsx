import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Timeline } from "@/components/ui/timeline";
import AppContext from "@/context/AppContext";
import type { MedicalRecord } from "@/types/MedicalRecord";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MedicalRecordBook from "@/components/pet/MedicalRecordBook";
import { useAppContext } from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
type ReturnRequest = {
  pet?: {
    _id: string;
  };
  status: string;
};

interface Pet {
  _id: string;
  name: string;
  isMale: boolean;
  age: number;
  weight: number;
  identificationFeature: string;
  sterilizationStatus: boolean;
  species: { name: string };
  breeds: { name: string }[];
  color: string;
  bio: string;
  intakeTime: string;
  foundLocation: string;
  tokenMoney: number;
  shelter: { name: string; address: string };
  status: string;
  photos: string[];
}

const PetProfilePage = () => {
  const { id } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const { petAPI, medicalRecordAPI } = useContext(AppContext);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { userProfile, coreAPI } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [hasReturnedThisPet, setHasReturnedThisPet] = useState(false);
  const authAxios = useAuthAxios();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${petAPI}/get-by-id/${id}`)
      .then((res) => {
        setPet(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Không thể lấy thông tin thú cưng");
        setLoading(false);
      });
    axios
      .get(`${petAPI}/${id}/medicalRecords`)
      .then((res) => {
        setMedicalRecords(res.data.records || []);
      })
      .catch((err) => {
        toast.error("Không thể lấy thông tin hồ sơ bệnh án của thú cưng");
      });

  }, [id]);

  useEffect(() => {
    if (!pet?._id || !userProfile?._id) return;

    authAxios
      .get(`${coreAPI}/return-requests/get-by-user`)
      .then((res) => {
        setReturnRequests(res.data);
        const matched = res.data.find((req: ReturnRequest) =>
          req.pet?._id === pet._id && req.status === "approved"
        );
        if (matched) {
          setHasReturnedThisPet(true);
        }
      })
      .catch(() => {
        toast.error("Không thể lấy thông tin yêu cầu trả lại");
      });
  }, [userProfile?._id, pet?._id]);



  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-[250px] mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-6 w-full mt-6" />
      </div>
    );
  }
  // console.log(pet);


  if (!pet) {
    return <div className="p-6 text-red-500 font-semibold">Không tìm thấy thú cưng</div>;
  }


  {/* <CardTitle className="text-2xl">{pet.name}</CardTitle> */ }
  {/* <CardDescription>{pet.bio ?? "Chưa xác định"}</CardDescription> */ }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <CardHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/pets-list">Danh sách thú cưng</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pet?.name ?? "Chi tiết thú cưng"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>

      <Card>
        <CardHeader>
          {/* Tiêu đề nếu cần */}
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ảnh bên trái */}
          <PhotoProvider>
            <div className="flex gap-4 w-full max-w-3xl">
              {/* Ảnh nhỏ dọc bên trái */}
              {pet.photos?.length > 1 && (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-80">
                  {pet.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Ảnh ${index + 1}`}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${index === selectedIndex ? "border-blue-500" : "border-transparent"
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Ảnh chính bên phải */}
              {pet.photos?.length > 0 ? (
                <PhotoView src={pet.photos[selectedIndex]}>
                  <img
                    src={pet.photos[selectedIndex]}
                    alt={`Ảnh chính`}
                    className="w-full max-w-xl h-110 object-cover rounded-xl cursor-zoom-in shadow"
                  />
                </PhotoView>
              ) : (
                <p className="text-gray-500">Chưa có ảnh</p>
              )}
            </div>
          </PhotoProvider>


          {/* Thông tin bên phải */}
          <div className="grid grid-cols-1 gap-4">

            <p><strong>Tên:</strong> {pet?.name ?? "Chưa xác định"}</p>

            {/* Loài và Giống chia 2 cột */}
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Loài:</strong> {pet.species?.name ?? "Chưa xác định"}</p>
              <p><strong>Giống:</strong> {pet.breeds?.length ? pet.breeds.map(b => b.name).join(", ") : "Chưa xác định"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Tuổi:</strong> {" "}
                {typeof pet?.age === "number" ? pet.age < 12 ? `${pet.age} tháng` : `${Math.floor(pet.age / 12)} năm` : "Chưa xác định"}
              </p>
              <p><strong>Giới tính:</strong> {pet.isMale === true ? "Đực" : pet.isMale === false ? "Cái" : "Chưa xác định"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Cân nặng:</strong> {pet.weight ?? "Chưa xác định"} kg</p>
              <p><strong>Màu sắc:</strong> {pet.color ?? "Chưa xác định"}</p>
            </div>



            <p><strong>Đặc điểm nhận dạng:</strong> {pet.identificationFeature ?? "Chưa xác định"}</p>
            <p><strong>Tình trạng triệt sản:</strong> {pet.sterilizationStatus === true ? "Đã triệt sản" : pet.sterilizationStatus === false ? "Chưa triệt sản" : "Chưa xác định"}</p>

            <p>
              <strong>Thời gian tiếp nhận:</strong>{" "}
              {pet.intakeTime
                ? new Date(pet.intakeTime).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                : "Chưa xác định"}
            </p>
            <p>
              <strong>Phí nhận nuôi:</strong>{" "}
              {typeof pet.tokenMoney === "number"
                ? pet.tokenMoney === 0
                  ? "Miễn phí"
                  : pet.tokenMoney.toLocaleString() + "đ"
                : "Chưa xác định"}
            </p>

            <p>
              <strong>Trạng thái:</strong>
              <Badge className="ml-2">
                {pet.status === "available" ? "Sẵn sàng nhận nuôi" : pet.status ?? "Chưa xác định"}
              </Badge>
            </p>
            {pet.status === "available" && (
              <div >
                <div className="dark:text-white ">
                  <MedicalRecordBook records={medicalRecords} />
                </div>
                <Button
                  className="px-3 py-3 text-sm mt-4"
                  onClick={() => {
                    if (!userProfile) {
                      toast.warning("Bạn cần đăng nhập để nhận nuôi thú cưng", {
                        action: {
                          label: "Đăng nhập",
                          onClick: () => {
                            localStorage.setItem("redirectAfterLogin", `/adoption-form/${pet._id}`);
                            navigate(`/login`);
                          },
                        },
                      });
                      return;
                    }

                    if (hasReturnedThisPet) {
                      toast.error("Bạn đã từng nhận nuôi và trả lại thú cưng này, nên không thể nhận nuôi lại.");
                      return;
                    }

                    navigate(`/adoption-form/${pet._id}`);
                  }}
                >
                  Nhận nuôi
                </Button>


              </div>
            )}
            <Separator className="my-2" />

            <p><strong>Trung tâm:</strong> {pet.shelter?.name ?? "Chưa xác định"}</p>
            <p><strong>Địa chỉ:</strong> {pet.shelter?.address ?? "Chưa xác định"}</p>
          </div>
        </CardContent>
      </Card>



    </div>
  );
};

export default PetProfilePage;
