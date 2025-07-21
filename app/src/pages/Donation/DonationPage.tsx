import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";

export default function DonationPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ amount: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const newErrors = { ...errors };

    if (!value || Number(value) < 5000) {
      newErrors.amount = "Vui lòng nhập số tiền lớn hơn hoặc bằng 5000 VND";
    } else if (Number(value) > 10000000000) {
      newErrors.amount = "Số tiền không được vượt quá 10.000.000.000 VND";
    } else if (!/^\d+$/.test(value)) {
      newErrors.amount = "Số tiền chỉ được chứa các chữ số";
    } else {
      newErrors.amount = "";
    }

    setErrors(newErrors);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    const newErrors = { ...errors };

    if (value.length > 25) {
      newErrors.message = "Lời nhắn không được vượt quá 25 ký tự";
    } else {
      newErrors.message = "";
    }

    setErrors(newErrors);
  };

  const handleDonate = async () => {
    const newErrors: any = {};

    if (!amount || Number(amount) < 5000) {
      newErrors.amount = "Vui lòng nhập số tiền lớn hơn hoặc bằng 5000 VND";
    } else if (Number(amount) > 10000000000) {
      newErrors.amount = "Số tiền không được vượt quá 10.000.000.000 VND";
    } else if (!/^\d+$/.test(amount)) {
      newErrors.amount = "Số tiền chỉ được chứa các chữ số";
    } else {
      newErrors.amount = "";
    }

    if (message.length > 25) {
      newErrors.message = "Lời nhắn không được vượt quá 25 ký tự";
    } else {
      newErrors.message = "";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3030/create-payment-link", {
        amount: Number(amount),
        message,
      }, {
        headers: localStorage.getItem("accessToken")
          ? {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          }
          : {},
      });
      window.location.href = res.data.url;
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi tạo liên kết thanh toán. Vui lòng thử lại sau.");
      console.error("Error creating payment link:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <div className="absolute top-6 left-6 z-20">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ủng hộ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Background Right (image) */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://media.istockphoto.com/id/1478563909/vi/vec-to/vector-c%E1%BB%A7a-d%E1%BA%A5u-ch%C3%A2n-%C4%91%E1%BB%99ng-v%E1%BA%ADt-puma-hoa-v%C4%83n-li%E1%BB%81n-m%E1%BA%A1ch.jpg?s=2048x2048&w=is&k=20&c=-HErBrAHj7NtXdW3QFxA28GqFQOEm6w71DlfnVVMLR8=')",
        }}
      />

      {/* Background Right (white) */}
      <div className="absolute right-0 top-0 w-1/2 h-full " />

      {/* Main container */}
      <div className="relative z-10 flex shadow-xl rounded-xl overflow-hidden max-w-6xl w-full">
        {/* Image section (right) */}
        <div className="w-1/2 relative">
          <img
            src="https://i.pinimg.com/736x/16/b6/31/16b631760774ae9f709248b942b18cb9.jpg"
            alt="donate"
            className="w-full h-140 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-[var(--primary)]/90 text-white p-5 rounded-md max-w-xs shadow-md">
            <h3 className="text-lg font-semibold mb-2">Mỗi đóng góp của bạn là một tia hy vọng !</h3>
            <p className="text-sm text-white leading-snug">
              Những hành động nhỏ tạo nên thay đổi lớn. Hãy cùng chúng tôi xây dựng một cộng đồng tốt đẹp hơn, nơi mọi người đều được tiếp cận thông tin hữu ích và đáng tin cậy.
            </p>
          </div>
        </div>
        {/* Form section (left) */}
        <div className="w-1/2 p-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-zinc-900 dark:text-white">
          <h2 className="text-2xl font-bold mb-4 text-[var(--primary)] dark:text-[var(--primary)]-300">Ủng hộ trang web của chúng tôi</h2>



          <p className="text-sm text-muted-foreground mb-10">
            Bằng việc ủng hộ, bạn sẽ giúp chúng tôi duy trì và phát triển trang web này, cung cấp nội dung chất lượng và cải thiện trải nghiệm người dùng. Mọi đóng góp đều được trân trọng!
          </p>



          <div className="mb-8">
            <Label className="text-[var(--primary)] dark:text-[var(--primary)]">Số tiền muốn donate:</Label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Nhập số tiền"
              className={`mt-3 w-full ${errors.amount ? "border-destructive ring-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div className="mb-8">
            <Label className="text-[var(--primary)] dark:text-[var(--primary)]">Lời nhắn:</Label>
            <Input
              type="text"
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Viết lời nhắn nếu muốn"
              className={`mt-3 w-full ${errors.message ? "border-destructive ring-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <p className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary)] mb-10">{Number(amount).toLocaleString("vi-VN")} VND</p>


          <Button
            onClick={handleDonate}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" />
                Đang xử lý...
              </span>
            ) : (
              "Ủng hộ ngay"
            )}
          </Button>
        </div>


      </div>
    </div>
  );
}
