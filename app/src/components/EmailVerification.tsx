import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";

export default function EmailVerification(): JSX.Element {
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Token không tồn tại.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get<{ message: string }>(
          `http://localhost:9999/api/auth/verify-email?token=${token}`,
          { withCredentials: true }
        );

        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const msg = axiosError.response?.data?.message || "Đã có lỗi xảy ra.";

        if (msg === "Already verified") {
          setStatus("success");
          setMessage("Verify account successfull.");
        } else {
          setStatus("error");
          setMessage(msg);
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === "pending" && (
          <>
            <Loader2 className="animate-spin mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Đang xác thực email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto text-green-500 w-10 h-10" />
            <h2 className="text-xl font-semibold text-green-600 mt-4">
              {message}
            </h2>
            <Button className="mt-4" onClick={() => navigate("/login")}>
              Đăng nhập ngay
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500 w-10 h-10" />
            <h2 className="text-xl font-semibold text-red-600 mt-4">
              {message}
            </h2>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
