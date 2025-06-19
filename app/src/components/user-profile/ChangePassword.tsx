import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChangePassword() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            return alert("Vui lòng điền đầy đủ thông tin.");
        }
        if (newPassword !== confirmPassword) {
            return alert("Mật khẩu mới không khớp.");
        }

        try {
            const userId = "684ef3df0d4fe7b7340fa873"; // TODO: Thay bằng dữ liệu thực tế (từ context, localStorage,...)
            // const accessToken = localStorage.getItem("accessToken");

            const response = await axios.put(
                `http://localhost:9999/users/${userId}/change-password`,
                {
                    oldPassword,
                    newPassword,
                    confirmPassword,
                },
                // {
                //     headers: {
                //         Authorization: `Bearer ${accessToken}`,
                //     },
                // }
            );

            alert("Đổi mật khẩu thành công!");
        } catch (error: any) {
            const message = error.response?.data?.message || "Có lỗi xảy ra.";
            alert(`Đổi mật khẩu thất bại: ${message}`);
        }
    };
    return (
        <Card className="shadow-none border shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold mb-1">Đổi mật khẩu</CardTitle>
                <p className="text-muted-foreground text-sm">
                    Đổi mật khẩu của bạn để giữ tài khoản an toàn. Bạn nên ưu tiên sử dụng mật khẩu mạnh!
                </p>
            </CardHeader>

            <CardContent className="space-y-6 border-t pt-6">
                {/* Mật khẩu cũ */}
                <div>
                    <Label htmlFor="oldPassword" className="text-sm mb-1 block">Mật khẩu cũ</Label>
                    <div className="relative">
                        <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            className="pr-10"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </span>
                    </div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                    <Label htmlFor="newPassword" className="text-sm mb-1 block">Mật khẩu mới</Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            className="pr-10"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </span>
                    </div>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div>
                    <Label htmlFor="confirmPassword" className="text-sm mb-1 block">Xác nhận mật khẩu mới</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showNewPassword ? "text" : "password"}
                            className="pr-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </span>
                    </div>
                </div>


                {/* Đăng xuất khỏi tất cả thiết bị
                <div className="rounded-md border bg-muted p-4 space-y-1">
                  <Label htmlFor="logoutAllDevices" className="text-sm font-medium">
                    Đăng xuất khỏi tất cả thiết bị
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Thao tác này sẽ đăng xuất bạn khỏi tất cả các thiết bị và yêu cầu bạn đăng nhập lại.
                  </p>
                  <input
                    id="logoutAllDevices"
                    type="checkbox"
                    className="mt-2 scale-125 accent-primary"
                  />
                </div> */}

                {/* Nút đổi mật khẩu */}
                <Button className="w-full mt-4" onClick={handleChangePassword} >Đổi mật khẩu</Button>
            </CardContent>
        </Card>
    )
}