import { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ImageIcon, LocateFixed } from "lucide-react";
import { toast } from "sonner"
import { Loader2 } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import AppContext from "@/context/AppContext";
import axios from "axios"
import useAuthAxios from "@/utils/authAxios";


type GoongSuggestion = {
  place_id: string;
  description: string;
};
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;



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
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);
  const { userProfile } = useContext(AppContext);
  const { setUserProfile, setUser } = useContext(AppContext);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openBackgroundModal, setOpenBackgroundModal] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<GoongSuggestion[]>([]);
  const [placeId, setPlaceId] = useState("");
  const { userAPI } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const [rawProfile, setOriginalProfile] = useState({
    fullName: "",
    bio: "",
    dob: "",
    phoneNumber: "",
    address: "",
    avatar: "",
    background: "",
  });



  useEffect(() => {
    if (userProfile) {
      const dobValue = userProfile.dob ? userProfile.dob.split("T")[0] : "";

      setFullName(userProfile.fullName || "");
      setBio(userProfile.bio || "");
      setDob(dobValue);
      setPhoneNumber(userProfile.phoneNumber || "");
      setAddress(userProfile.address || "");
      setAvatarPreview(userProfile.avatar || "");
      setBackgroundPreview(userProfile.background || "");

      setOriginalProfile({
        fullName: userProfile.fullName || "",
        bio: userProfile.bio || "",
        dob: dobValue,
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
        avatar: userProfile.avatar || "",
        background: userProfile.background || "",
      });
    }
  }, [userProfile]);


  const handleProfileSubmit = async () => {
    try {
      setLoading(true);
      const isUnchanged =
        fullName === rawProfile.fullName &&
        bio === rawProfile.bio &&
        dob === rawProfile.dob &&
        phoneNumber === rawProfile.phoneNumber &&
        address === rawProfile.address &&
        !avatar && !background;
      if (isUnchanged) {
        toast.warning("Vui lòng thay đổi thông tin trước khi cập nhật.");
        return;
      }
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bio", bio);
      formData.append("dob", dob);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      formData.append("location", JSON.stringify(location));

      if (avatar) formData.append("avatar", avatar);
      if (background) formData.append("background", background);

      await authAxios.put(`${userAPI}/edit-profile`, formData);

      const updated = await authAxios.get(`${userAPI}/get-user`);


      setUserProfile(updated.data);
      setUser(updated.data);
      toast.success("Cập nhật thông tin thành công!");

      setAvatar(null);
      setAvatarPreview("");
      setOpenAvatarModal(false);

      setBackground(null);
      setBackgroundPreview("");
      setOpenBackgroundModal(false);
    } catch (err: any) {
      toast.error("Lỗi cập nhật: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressSuggestions = async (query: string) => {
    if (!query.trim()) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
        params: {
          input: query,
          api_key: GOONG_API_KEY,
        },
      });
      setAddressSuggestions(res.data.predictions || []);
    } catch (error) {
      console.error("Autocomplete failed:", error);
    }
  };

  const fetchPlaceDetail = async (place_id: string) => {
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/Detail", {
        params: {
          place_id,
          api_key: GOONG_API_KEY,
        },
      });
      const result = res.data.result;
      if (result?.formatted_address && result?.geometry?.location) {
        setAddress(result.formatted_address);
        setPlaceId(place_id);
        setLocation({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
      }
    } catch (error) {
      console.error("Place Detail error:", error);
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Trình duyệt không hỗ trợ định vị.");
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get("https://rsapi.goong.io/Geocode", {
            params: {
              latlng: `${coords.latitude},${coords.longitude}`,
              api_key: GOONG_API_KEY,
              has_deprecated_administrative_unit: true,
            },
          });
          const place = res.data.results?.[0];
          if (place) {
            setAddress(place.formatted_address);
            setPlaceId(""); // reverse không có place_id
          }
        } catch (error) {
          console.error("Reverse geocode error:", error);
        }
      },
      (err) => {
        console.error("Lỗi truy cập vị trí:", err);
      },
      { enableHighAccuracy: true }
    );
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
            <AvatarFallback className="bg-gray-200 text-gray-500">
              {fullName ? fullName.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
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
          <div className="relative">
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
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
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                fetchAddressSuggestions(e.target.value);
              }}
              className="flex-1 h-9"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={detectCurrentLocation}
              className="flex items-center gap-1 px-3 h-9 rounded-md cursor-pointer"
            >
              <LocateFixed />
              Lấy vị trí hiện tại
            </Button>
          </div>
          {addressSuggestions.length > 0 && (
            <div className="border mt-1 rounded-md shadow-sm bg-white z-50 max-h-60 overflow-y-auto">
              {addressSuggestions.map((sug) => (
                <div
                  key={sug.place_id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    fetchPlaceDetail(sug.place_id);
                    setAddressSuggestions([]);
                  }}
                >
                  {sug.description}
                </div>
              ))}
            </div>
          )}
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
