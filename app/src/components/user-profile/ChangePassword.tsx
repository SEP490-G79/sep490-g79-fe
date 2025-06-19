import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
    const [showOldPassword, setShowOldPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
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
                    <Label htmlFor="currentPassword" className="text-sm mb-1 block">Mật khẩu cũ</Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showOldPassword ? "text" : "password"}
                            className="pr-10"
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
                    <Label htmlFor="confirmNewPassword" className="text-sm mb-1 block">Xác nhận mật khẩu mới</Label>
                    <div className="relative">
                        <Input
                            id="confirmNewPassword"
                            type={showNewPassword ? "text" : "password"}
                            className="pr-10"
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
                <Button className="w-full mt-4">Đổi mật khẩu</Button>
            </CardContent>
        </Card>
    )
}