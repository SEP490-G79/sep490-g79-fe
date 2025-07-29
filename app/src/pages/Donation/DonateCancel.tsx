import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DonateCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center p-6">
      <XCircle className="text-red-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thanh toán không thành công</h1>
      <p className="text-muted-foreground mb-6">Có vẻ như bạn đã huỷ giao dịch hoặc xảy ra lỗi. Vui lòng thử lại.</p>
      <Button asChild variant="secondary">
        <Link to="/donation">Thử lại</Link>
      </Button>
    </div>
  );
}
