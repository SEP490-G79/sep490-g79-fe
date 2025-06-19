
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ImageIcon } from "lucide-react";

export default function EditProfile() {
  return (
    <Card className="shadow-none border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold text-center">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover photo */}
                <div className="relative w-full h-36 rounded-md overflow-hidden">
                  <img
                    src="https://images.hdqwalls.com/wallpapers/geometry-blue-abstract-4k-3y.jpg"
                    alt="Ảnh nền"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-4">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="flex gap-1 px-3 py-1 rounded-md cursor-pointer"
                    >
                      <label htmlFor="background" className="flex items-center gap-1 cursor-pointer text-sm">
                        <ImageIcon className="w-4 h-4" />
                        Chỉnh sửa
                      </label>
                    </Button>
                    <input id="background" type="file" accept="image/*" className="hidden" />
                  </div>
                </div>

                {/* Avatar + file upload */}
                <div className="flex items-center gap-6 justify-center">
                  <Avatar className="w-20 h-20 border-2 border-ring rounded-full">
                    <AvatarImage src="https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_960_720.png" alt="avatar" className="rounded-full" />
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Ảnh đại diện</Label>
                    <Button asChild variant="outline" size="sm">
                      <label htmlFor="avatar" className="cursor-pointer">
                        Chọn ảnh
                      </label>
                    </Button>
                    <input id="avatar" type="file" accept="image/*" className="hidden" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-sm mb-1 block">
                    Họ và tên đầy đủ
                  </Label>
                  <Input id="fullName" defaultValue="Le Quy Hoan" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-sm mb-1 block">
                    Tiểu sử
                  </Label>
                  <Input id="bio" defaultValue="awdawdawdadw" className="mt-1" />
                </div>
                {/* dob */}
                <div>
                  <Label htmlFor="dob" className="text-sm mb-1 block">
                    Ngày sinh
                  </Label>
                  <Input id="dob" type="date" defaultValue="2000-01-01" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm mb-1 block">
                    Số điện thoại
                  </Label>
                  <Input id="phoneNumber" defaultValue="0989216950" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm mb-1 block">
                    Địa chỉ
                  </Label>
                  <Input id="address" defaultValue="Hanoi" className="mt-1" />
                </div>
              </CardContent>

              <CardContent className="border-t pt-6">
                <Button className="w-full">Lưu thay đổi</Button>
              </CardContent>
            </Card>
  )
}