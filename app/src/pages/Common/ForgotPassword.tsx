import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "@/context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const { authAPI } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [newPassword, setNewPassword] = useState<string>("")



  const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

const resetPasswordSchema = z
  .object({
    confirmPassword: z.string()
  })
  .refine((data) => newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tempToken = params.get("tempToken");

    if (tempToken) {
      localStorage.setItem("tempToken", tempToken); // Lưu vào localStorage
      // Xóa tempToken khỏi URL (không reload trang)
      params.delete("tempToken");
      navigate(
        {
          pathname: "/forgot-password",
          search: params.toString(),
        },
        { replace: true }
      );

      setStep("reset"); // Chuyển sang bước đặt lại mật khẩu
    }
  }, [location, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `${authAPI}/forgot-password/${values.email}`
      );
      toast.success(response?.data.message);
      form.reset();
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

  const onSubmitReset = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      const response = await axios.post(`${authAPI}/reset-password`, {
        password: newPassword,
        confirmPassword: values.confirmPassword,
        token: localStorage.getItem("tempToken"),
      });
      toast.success(response?.data.message);
      resetForm.reset();
      localStorage.removeItem("tempToken");
      setStep("success");
    } catch (error: any) {
      toast.error(error?.response.data.message);
      if (
        error?.response.data.message ===
        "Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại."
      ) {
        form.reset();
        resetForm.reset();
        localStorage.removeItem("tempToken");
        setStep("email");
      }
    }
  };

  if (step === "email") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              <span className="text-sm flex flex-row gap-1 hover:text-(--hover) cursor-pointer" onClick={() => navigate("/login")}>
                <ArrowLeft />
                <p className="my-auto">Quay lại</p>
              </span>
              Quên mật khẩu
            </CardTitle>
            <CardDescription>
              Vui lòng điền email của tài khoản bạn đã đăng kí để khôi phục lại
              mật khẩu
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="mt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Đang gửi..."
                    : "Gửi liên kết đặt lại mật khẩu"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    );
  } else if (step === "reset") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-20">
        <Card className="w-full max-w-md shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Đặt lại mật khẩu
            </CardTitle>
            <CardDescription>
              Vui lòng điền mật khẩu mới để đặt lại mật khẩu
            </CardDescription>
          </CardHeader>
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(onSubmitReset)}
              className="space-y-4"
            >
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2">Nhập mật khẩu mới</Label>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhập lại mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="mt-2">
                <Button type="submit" className="w-full">
                  Xác nhận đặt lại mật khẩu
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-20">
        <Card className="w-full max-w-md shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Đặt lại mật khẩu thành công!
            </CardTitle>
            <CardDescription className="text-center">
              Vui lòng ấn vào nút phía dưới để quay lại đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <ShieldCheckIcon className="h-20 w-20 text-primary mx-auto" />
            <Button onClick={() => navigate("/login")}>Quay về</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
