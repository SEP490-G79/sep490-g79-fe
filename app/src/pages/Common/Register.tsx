import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import Image from "@/assets/Home_1.jpg";
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

const registerSchema = z
  .object({
    username: z.string().min(1, "Tên tài khoản không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const Register = () => {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [googleRegisterLoading, setGoogleRegisterLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Hình minh hoạ */}
      <div className="hidden md:flex basis-1/2 items-center justify-center p-4">
        <img
          src={Image}
          alt="Register illustration"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Tiêu đề + Google */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Đăng ký
            </h1>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center"
              disabled={googleRegisterLoading}
            >
              <FcGoogle className="text-xl" />
              Đăng ký bằng Google
            </Button>

            <div className="w-full flex items-center">
              <Separator className="flex-1" />
              <span className="mx-2 text-muted-foreground">Hoặc</span>
              <Separator className="flex-1" />
            </div>
          </div>

          {/* Card */}
          <Card className="bg-transparent border-0 shadow-none w-full">
            <CardContent>
              <Form {...form}>
                <form className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tài khoản<span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập username..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email<span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập email..." />
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
                        <FormLabel>Mật khẩu<span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Nhập mật khẩu..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu<span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Nhập lại mật khẩu..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerLoading}
                  >
                    {registerLoading ? (
                      <>
                        <Loader2Icon className="animate-spin mr-2" />
                        Đang đăng ký...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex-col gap-2 mt-2">
              <div className="w-full flex items-center">
                <Separator className="flex-1" />
                <span className="mx-2 text-muted-foreground">
                  Đã có tài khoản?
                </span>
                <Separator className="flex-1" />
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link to="/login">Đăng nhập</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};