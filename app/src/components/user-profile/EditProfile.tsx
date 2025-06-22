import { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner"
import { Loader2 } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import AppContext from "@/context/AppContext";
import axios from "axios"
import useAuthAxios from "@/utils/authAxios";

export default function EditProfile() {
  const [background, setBackground] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { userProfile } = useContext(AppContext);
  const { setUserProfile, setUser } = useContext(AppContext);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openBackgroundModal, setOpenBackgroundModal] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || "");
      setBio(userProfile.bio || "");
      setDob(userProfile.dob ? userProfile.dob.split("T")[0] : "");
      setPhoneNumber(userProfile.phoneNumber || "");
      setAddress(userProfile.address || "");
      setAvatarPreview(userProfile.avatar || "");
      setBackgroundPreview(userProfile.background || "");

  }, [userProfile]);


  const handleProfileSubmit = async () => {
    try {
      setLoading(true);
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
      const updated = await axios.get(`http://localhost:9999/users/user-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUserProfile(updated.data);
      setUser(updated.data);
      toast.success("Cập nhật thông tin thành công!");

      setAvatar(null);
      setAvatarPreview("");
      setOpenAvatarModal(false); // ✅ đóng modal avatar

      setBackground(null);
      setBackgroundPreview("");
      setOpenBackgroundModal(false); // ✅ đóng modal background
    } catch (err: any) {
      toast.error("Lỗi cập nhật: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="shadow-none border shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-center">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover photo */}
        <div className="relative w-full h-36 rounded-md overflow-hidden" onClick={() => setOpenBackgroundModal(true)}>
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
          </div>
        </div>

        {/* Avatar + file upload */}
        <div className="flex items-center gap-6 justify-center" onClick={() => setOpenAvatarModal(true)}>
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
        <Button className="w-full cursor-pointer" onClick={handleProfileSubmit} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </CardContent>


      <ImageUploadModal
        open={openAvatarModal}
        onClose={() => setOpenAvatarModal(false)}
        currentPreview={avatar ? avatarPreview : ""}
        onImageSelect={(file, preview) => {
          setAvatar(file);
          setAvatarPreview(preview);
        }}
      />

      <ImageUploadModal
        open={openBackgroundModal}
        onClose={() => setOpenBackgroundModal(false)}
        currentPreview={background ? backgroundPreview : ""}
        onImageSelect={(file, preview) => {
          setBackground(file);
          setBackgroundPreview(preview);
        }}
      />
    </Card>
  )
}