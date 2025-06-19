import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { toast } from "react-toastify";
import bgImage from "@/assets/dc3.jpg"; // đúng đường dẫn assets của bạn

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const googleToken = query.get("googleToken");
    const userInfo = query.get("userInfo");
    const error = query.get("error");

    if (googleToken && userInfo) {
      localStorage.setItem("accessToken", googleToken);
      localStorage.setItem("userInfo", userInfo);
      navigate("/");
    }

    if (error === "unverified") {
      toast.error("Tài khoản chưa xác thực. Vui lòng kiểm tra email.");
      setShowResend(true);
      const savedEmail = localStorage.getItem("unverifiedEmail");
      if (savedEmail) setEmail(savedEmail);
    }

    if (error === "google_failed") {
      toast.error("Đăng nhập bằng Google thất bại.");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authorizedAxiosInstance.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(res.data.users));
      navigate("/");
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed";
      toast.error(msg);
      if (error?.response?.status === 403 && msg.includes("xác thực")) {
        setShowResend(true);
        localStorage.setItem("unverifiedEmail", email);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    const emailToSend = email || localStorage.getItem("unverifiedEmail");
    if (!emailToSend) {
      toast.error("Không tìm thấy email để gửi lại xác thực.");
      return;
    }

    try {
      const res = await authorizedAxiosInstance.post(
        "/auth/resend-verification",
        { email: emailToSend }
      );
      setResendMsg(res.data.message);
      toast.success(res.data.message);
      localStorage.removeItem("unverifiedEmail");
    } catch (err) {
      const msg = err?.response?.data?.message || "Gửi lại email thất bại.";
      setResendMsg(msg);
      toast.error(msg);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9999/api/auth/google";
  };

  return (
    <div className="flex w-full h-[600px] ms-40 overflow-hidden">
      {/* Left side: Image */}
      <div className="w-1/2 h-full">
        <img
          src={bgImage}
          alt="Cute pets"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side: Login form */}
      <div className="w-1/2 flex items-stretch bg-white dark:bg-zinc-900">
        <Card
          className="w-full h-[600px] max-w-md p-8 shadow-xl rounded-none
"
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">
              🐾 Đăng nhập
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Chào mừng bạn quay lại!
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Mật khẩu</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="relative flex items-center">
                <Separator className="flex-1" />
                <span className="px-3 text-xs text-muted-foreground">Hoặc</span>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle size={20} /> Đăng nhập bằng Google
              </Button>

              {showResend && (
                <div className="mt-4 text-center text-sm">
                  <p className="text-red-500">
                    Tài khoản chưa được xác thực. Hãy kiểm tra email của bạn.
                  </p>
                  <Button
                    variant="outline"
                    onClick={resendVerification}
                    className="mt-2"
                  >
                    Gửi lại email xác thực
                  </Button>
                  {resendMsg && (
                    <p className="text-muted-foreground mt-2">{resendMsg}</p>
                  )}
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-6">
                Bạn chưa có tài khoản?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Đăng ký ngay
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
