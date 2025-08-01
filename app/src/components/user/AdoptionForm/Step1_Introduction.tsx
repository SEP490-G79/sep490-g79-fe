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
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Step1Props {
  form: AdoptionForm;
  agreed: boolean;
  onAgree: () => void;
  onNext: () => void;
  onBack: () => void;
  setAgreed: (val: boolean) => void;
  readOnly?: boolean;

}

const Step1_Introduction = ({ form, agreed, onAgree, onNext, onBack, setAgreed, readOnly }: Step1Props) => {
  const pet = form.pet;
  const [showAgreementError, setShowAgreementError] = useState(false);

  const handleNextClick = () => {
    if (!agreed) {
      setShowAgreementError(true);
    } else {
      setShowAgreementError(false);
      onNext();
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case "available":
        return "Sẵn sàng nhận nuôi";
      case "pending":
        return "Đang chờ xử lý";
      case "adopted":
        return "Đã được nhận nuôi";
      case "unavailable":
        return "Không khả dụng";
      default:
        return "Không rõ";
    }
  };


  const money = Number(pet?.tokenMoney);

  const tokenMoneyDisplay =
    isNaN(money)
      ? "Chưa xác định"
      : money === 0
        ? "Miễn phí"
        : new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }).format(money);

       
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
          <div>
            <strong>Phí nhận nuôi:</strong>{" "}
            <span
              className={`text-sm font-medium ${money === 0
                ? "text-lime-600"
                : isNaN(money)
                  ? "text-muted-foreground"
                  : "text-yellow-500"
                }`}
            >
              {tokenMoneyDisplay}
            </span>
          </div>

          <div>
            <strong>Trạng thái:</strong>{" "}
            <Badge>
              {getStatusLabel(pet.status)}
            </Badge>
          </div>

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
          {/* Checkbox xác nhận */}
          <div className="mt-4 space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree-checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={readOnly}
                className="mt-1  "
              />
              <label htmlFor="agree-checkbox" className="text-sm">
                Tôi đồng ý với các điều khoản và điều kiện nhận nuôi thú cưng.
              </label>
            </div>

            {!agreed && showAgreementError && (
              <p className="text-sm text-red-500 italic">
                Bạn cần đồng ý với điều khoản trước khi tiếp tục.
              </p>
            )}


            <Button onClick={handleNextClick}>Tiếp theo</Button>
          </div>


        </CardContent>
      </Card>
    </div>

  );
};

export default Step1_Introduction;
