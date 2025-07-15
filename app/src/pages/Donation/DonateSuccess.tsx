import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DonateSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center p-6">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
      <p className="text-muted-foreground mb-6">Cảm ơn bạn đã ủng hộ trang web của chúng tôi. Chúng tôi rất trân trọng sự đóng góp của bạn.</p>
      <Button asChild>
        <Link to="/">Quay về trang chủ</Link>
      </Button>
    </div>
  );
}
