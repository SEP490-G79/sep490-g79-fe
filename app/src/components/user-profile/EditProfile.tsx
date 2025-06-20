import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner"
import axios from "axios"

export default function EditProfile() {
  const userId = "684ef3df0d4fe7b7340fa873";
  const [background, setBackground] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Fetch user info
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/users/user-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const user = res.data;

      setFullName(user.fullName || "");
      setBio(user.bio || "");
      setDob(user.dob?.slice(0, 10) || ""); 
      setPhoneNumber(user.phoneNumber || "");
      setAddress(user.address || "");
      if (user.avatar) setAvatarPreview(user.avatar);
      if (user.background) setBackgroundPreview(user.background);
    } catch (err) {
       toast.error("Không thể tải thông tin người dùng.")
    }
  };

  fetchUser();
}, []);


  const handleProfileSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bio", bio);
      formData.append("dob", dob);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      if (avatar) formData.append("avatar", avatar);
      if (background) formData.append("background", background);

      await axios.put(`http://localhost:9999/users/edit-profile`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

      alert("Cập nhật thành công");
    } catch (err: any) {
      alert("Lỗi cập nhật: " + (err?.response?.data?.message || err.message));
    }
  };
  return (
    <Card className="shadow-none border shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-center">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover photo */}
        <div className="relative w-full h-36 rounded-md overflow-hidden">
          <img
            src={backgroundPreview || "https://images.hdqwalls.com/wallpapers/geometry-blue-abstract-4k-3y.jpg"}
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
            <input
              id="background"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setBackground(file);
                  setBackgroundPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>

        {/* Avatar + file upload */}
        <div className="flex items-center gap-6 justify-center">
          <Avatar className="w-20 h-20 border-2 border-ring rounded-full">
            <AvatarImage src={avatarPreview || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_960_720.png"}
              alt="avatar"
              className="rounded-full w-full h-full object-cover"
            />
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="avatar">Ảnh đại diện</Label>
            <Button asChild variant="outline" size="sm">
              <label htmlFor="avatar" className="cursor-pointer">
                Chọn ảnh
              </label>
            </Button>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatar(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fullName" className="text-sm mb-1 block">
            Họ và tên đầy đủ
          </Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="bio" className="text-sm mb-1 block">
            Tiểu sử
          </Label>
          <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1" />
        </div>
        {/* dob */}
        <div>
          <Label htmlFor="dob" className="text-sm mb-1 block">
            Ngày sinh
          </Label>
          <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phoneNumber" className="text-sm mb-1 block">
            Số điện thoại
          </Label>
          <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="address" className="text-sm mb-1 block">
            Địa chỉ
          </Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
        </div>
      </CardContent>

      <CardContent className="border-t pt-6">
        <Button className="w-full" onClick={handleProfileSubmit}>Lưu thay đổi</Button>
      </CardContent>
    </Card>
  )
}