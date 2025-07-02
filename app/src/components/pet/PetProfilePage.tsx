import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
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



  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-[250px] mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-6 w-full mt-6" />
      </div>
    );
  }

  if (!pet) {
    return <div className="p-6 text-red-500 font-semibold">Không tìm thấy thú cưng</div>;
  }

  const medicalTimelineData = medicalRecords.map((record) => ({
    title: new Date(record.procedureDate).toLocaleDateString("vi-VN"),
    content: (
      <PhotoProvider>
        <div className="space-y-2">
          <p className="font-semibold text-base">{record.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{record.description}</p>
          <p className="text-sm text-muted-foreground">Chi phí: {record.cost.toLocaleString()}đ</p>
          <p className="text-sm text-muted-foreground">
            Hạn tiếp theo: {record.dueDate ? new Date(record.dueDate).toLocaleDateString("vi-VN") : "Chưa xác định"}
          </p>
          <p className="text-sm text-muted-foreground">Trạng thái: {record.status}</p>
          {record.photos?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {record.photos.map((url, index) => (
                <PhotoView key={index} src={url}>
                  <img
                    src={url}
                    alt={`Ảnh hồ sơ y tế ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md shadow cursor-zoom-in"
                  />
                </PhotoView>
              ))}
            </div>
          )}

        </div>
      </PhotoProvider>
    ),
  }));

   {/* <CardTitle className="text-2xl">{pet.name}</CardTitle> */}
          {/* <CardDescription>{pet.bio ?? "Chưa xác định"}</CardDescription> */}
  return (
    <div className="max-w-6xl mx-auto p-6">
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
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
              index === selectedIndex ? "border-blue-500" : "border-transparent"
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
         <p><strong>Tuổi:</strong> {pet.age ?? "Chưa xác định"}</p>
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
<div className="flex gap-2 mt-4">
  <Button
    className="px-3 py-1 text-sm"
   
  >
    Nhận nuôi
  </Button>

  <Button
    variant="outline"
    className="px-3 py-1 text-sm"
   
  >
    Liên hệ trung tâm
  </Button>
</div>

)}


      <Separator className="my-2" />

      <p><strong>Trung tâm:</strong> {pet.shelter?.name ?? "Chưa xác định"}</p>
      <p><strong>Địa chỉ:</strong> {pet.shelter?.address ?? "Chưa xác định"}</p>
    </div>
  </CardContent>
</Card>

<Card className="mt-6">
  <CardHeader>
    <CardTitle className="text-lg font-semibold ">
      Hành trình của {pet.name} tại trung tâm
    </CardTitle>
    {pet.bio && (
      <CardDescription className="w-xl">{pet.bio}</CardDescription>
    )}
  </CardHeader>
  <CardContent>
    <PhotoProvider>
      <Timeline data={medicalTimelineData} />
    </PhotoProvider>
  </CardContent>
</Card>

    </div>
  );
};

export default PetProfilePage;
