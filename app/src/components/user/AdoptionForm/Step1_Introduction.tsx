import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import type { AdoptionForm } from "@/types/AdoptionForm";
import type { Pet } from "@/types/Pet";

interface Step1Props {
  form: AdoptionForm;
  agreed: boolean;
  onAgree: () => void;
  onNext: () => void;
  onBack: () => void;
}

const Step1_Introduction = ({
  form,
  agreed,
  onAgree,
  onNext,
  onBack,
}: Step1Props) => {
  const pet = form.pet;
  
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card className="md:col-span-1">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">Thông tin thú cưng</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      {pet && Array.isArray(pet.photos) && pet.photos.length > 0 && (
        <PhotoProvider>
          <PhotoView src={pet.photos[0]}>
            <img
              src={pet.photos[0]}
              alt={pet.name || "Ảnh thú cưng"}
              className="w-full h-64 object-cover rounded-xl cursor-zoom-in"
            />
          </PhotoView>
        </PhotoProvider>
      )}

      <div><strong>Tên:</strong> {pet.name}</div>
      <div><strong>Mã thú cưng:</strong> {pet.petCode}</div>
      <div><strong>Giới tính:</strong> {pet.isMale ? "Đực" : "Cái"}</div>
      <div><strong>Tuổi:</strong> {pet.age ?? "Không rõ"} tháng</div>
      <div><strong>Cân nặng:</strong> {pet.weight} kg</div>
      <div><strong>Màu sắc:</strong> {pet.color}</div>
      <div><strong>Đặc điểm:</strong> {pet.identificationFeature || "Không có"}</div>
      <div><strong>Triệt sản:</strong> {pet.sterilizationStatus ? "Đã triệt sản" : "Chưa triệt sản"}</div>
      <div><strong>Vị trí tìm thấy:</strong> {pet.foundLocation || "Không rõ"}</div>
      <div><strong>Tiền cọc:</strong> {Number(pet.tokenMoney).toLocaleString()}đ</div>
      <div><strong>Trạng thái:</strong> <Badge>{pet.status}</Badge></div>
    </CardContent>
  </Card>

  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{form.title || "Mẫu nhận nuôi thú cưng"}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <Separator />
      <p className="whitespace-pre-line">{form.description}</p>
      <Separator />
      <div className="flex items-center justify-between mt-4">
        {!agreed ? (
          <Button onClick={onAgree}>Tôi đồng ý và tiếp tục</Button>
        ) : (
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-green-600 italic">Bạn đã đồng ý với điều khoản</div>
            <Button onClick={onNext}>Tiếp theo</Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
</div>

  );
};

export default Step1_Introduction;
