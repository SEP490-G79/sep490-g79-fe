import React, { useState, useEffect, useContext, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner"
import Image from "@/assets/Home_1.jpg"; // đúng đường dẫn assets của bạn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import AppContext from "@/context/AppContext";
import axios from "axios";

export const Login = () => {
  // const [loginLoading, setLoginLoading] = useState<Boolean>(false);
  const { login, authAPI, loginLoading, setLoginLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const hasRun = useRef(false);


  const loginSchema = z.object({
    email: z.string().trim().min(1, {
      message: "Tên tài khoản hoặc email không được để trống",
    }),
    password: z.string().trim().min(1, {
      message: "Mật khẩu không được để trống",
    }),
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // cho toast hien thi 1 lan duy nhat
    if (hasRun.current) return;
    hasRun.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const isLoginByGoogle = urlParams.get("isLoginByGoogle");
    const message = urlParams.get("message");

    if (isLoginByGoogle === 'false') {
      setLoginLoading(false);
      setTimeout(() => {
        setLoginLoading(false);
        toast.error(message);
      }, 1000);
    }

    if (isLoginByGoogle === 'true') {
      setLoginLoading(true);
      axios.get(`${authAPI}/getUserByAccessToken`, { withCredentials: true })
        .then(res => {
          const { user, accessToken } = res.data;
          switch (user.status) {
            case 'verifying':
              setLoginLoading(false);
              toast.error("Tài khoản của bạn chưa kích hoạt! Hãy kích hoạt thông qua email")
              break;
            case 'banned':
              setLoginLoading(false);
              toast.error("Tài khoản của bạn đã bị khóa!")
              break;
            default:
              toast.success("Đăng nhập bằng tài khoản google thành công!")
              setTimeout(() => {
                setLoginLoading(false);
                login(accessToken, user);
                const redirectPath = localStorage.getItem("redirectAfterLogin");
                if (redirectPath) {
                  localStorage.removeItem("redirectAfterLogin");
                  navigate(redirectPath);
                } else {
                  navigate("/home");
                }
              }, 2000);
              break;
          }
        })
        .catch(error => {
          console.log(error?.response.data.message);
        });
    }
  }, [])


  const sendActiveToken = async (activeToken: string) => {
    try {
      const res = await axios.post(`${authAPI}/send-activation-email`, {
        activeToken: activeToken
      });
      toast.success(res?.data.message)
    } catch (error: any) {
      console.log(error?.response.data.message)
    }

  }

  const onLogin = async ({ email, password }: z.infer<typeof loginSchema>) => {
    setLoginLoading(true);
    try {
      const response = await axios.post(`${authAPI}/login`, {
        email: email,
        password: password,
        type: 'user'
      });

      if (response.status === 200) {
        toast.success("Đăng nhập thành công!");
        login(response.data.accessToken, response.data.user)
        setTimeout(() => {
          setLoginLoading(false);
          const redirectPath = localStorage.getItem("redirectAfterLogin");
          if (redirectPath) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);
          } else {
            navigate("/home");
          }
        }, 2000);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error?.response.data.message);
      } else {
        toast.error(error?.response.data.message, {
          description: "Gửi lại mã xác nhận ?",
          action: {
            label: "Gửi lại",
            onClick: () => sendActiveToken(error?.response.data.activeToken),
          },
        })
      }
      setLoginLoading(false);
    }
  };

  function handleGoogleLogin() {
    window.open(`${authAPI}/loginByGoogle`, "_self");
  }

  return (
    <div className="w-full h-full flex">
      <div className="basis-1/2 flex items-center justify-center p-4">
        <img
          src={Image}
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="basis-1/2 h-full">
        <div className="flex flex-col flex-grow items-center">
          {/* Title + SubTitle - Giới hạn width như Card */}
          <div className="w-full  max-w-md text-center mt-5 flex flex-col justify-center items-center px-5 mt-35">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
              Đăng nhập
            </h1>

            <div className="w-full flex items-center my-4">
              <Separator className="flex-1" />
              <span className="mx-2 text-muted-foreground">Hoặc</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2 cursor-pointer"
              onClick={handleGoogleLogin}
              disabled={loginLoading ? true : undefined}
            >
              Đăng nhập bằng tài khoản Google
            </Button>
          </div>

          {/* Card form */}
          <div className="flex  justify-center w-full">
            <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
              <CardContent className="">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onLogin)}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập email..."
                              className="my-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Nhập mật khẩu..."
                              className="my-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {loginLoading ? (
                      <Button type="submit" className="w-full" disabled>
                        <Loader2Icon className="animate-spin" />
                        Vui lòng chờ
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={loginLoading ? true : undefined}
                      >
                        Đăng nhập
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <div className="w-full flex items-center">
                  <Separator className="flex-1" />
                  <span className="text-(--muted-foreground)">
                    Bản chưa có tài khoản?
                  </span>
                  <Separator className="flex-1" />
                </div>

                {loginLoading ? (
                  <Button type="submit" className="w-full" disabled>
                    <Loader2Icon className="animate-spin" />
                    Vui lòng chờ
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/register" className="w-full my-5">
                      Đăng ký
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};