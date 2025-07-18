"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  FilePlus,
  Loader2Icon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { type ShelterProfile } from "@/types/ShelterProfile"
import useAuthAxios from "@/utils/authAxios"
import AppContext from "@/context/AppContext"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import axios from "axios"
import AddressInputWithGoong from "@/utils/AddressInputWithGoong"

type GoongSuggestion = {
  place_id: string;
  description: string;
};
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;


const shelterProfileSchema = z.object({
  name: z.string().min(3, "Tên trạm phải có ít nhất 3 ký tự"),
  shelterCode: z.string().optional(),
  bio: z.string().max(300, "Mô tả không quá 300 ký tự"),
  address: z.string().min(5, "Địa chỉ không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  hotline: z
  .string()
  .trim()
  .regex(
    /^((\+84)|0)(3|5|7|8|9)\d{8}$/,
    "Hotline không đúng định dạng số điện thoại Việt Nam"
  ),
  avatar: z.any().optional(),
  background: z.any().optional(),
})

type ShelterFormValues = z.infer<typeof shelterProfileSchema>

const ShelterProfile = () => {
  const [initialProfile, setInitialProfile] = useState<ShelterFormValues | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const authAxios = useAuthAxios()
  const { shelterAPI, shelters, user } = useContext(AppContext)
  const { shelterId } = useParams()
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [openBackgroundModal, setOpenBackgroundModal] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<GoongSuggestion[]>([]);
  const [placeId, setPlaceId] = useState("");

  const currentShelter = shelters?.find(shelter => String(shelter._id) === String(shelterId));
  const member = currentShelter?.members?.find(m => String(m._id) === String(user?._id));
  const isManager = member?.roles?.includes("manager") || false;

  const form = useForm<ShelterFormValues>({
    resolver: zodResolver(shelterProfileSchema),
    defaultValues: {
      name: "",
      shelterCode: "",
      email: "",
      bio: "",
      address: "",
      hotline: "",
      avatar: undefined,
      background: undefined,
    },
  })

  const { handleSubmit, reset, setValue, watch } = form

  useEffect(() => {
    if (!shelterId) return

    authAxios
      .get(`${shelterAPI}/get-profile/${shelterId}`)
      .then(({ data }) => {
        const theData = {...data, hotline: String(data.hotline ?? "")};
        reset(theData)
        setInitialProfile(theData)
        setAvatarPreview(data.avatar || null)
        setCoverPreview(data.background || null)
      })
      .catch((err) => console.log(err?.response?.data?.message))
  }, [shelterId])

  const onSubmit = async (data: ShelterFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData()
      // formData.append("name", data.name)
      formData.append("bio", data.bio)
      formData.append("hotline", data.hotline)
      formData.append("email", data.email)
      formData.append("address", data.address)
      formData.append("location", JSON.stringify(location)); 
      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar)
      }
      if (data.background instanceof File) {
        formData.append("background", data.background)
      }

      await authAxios.put(`${shelterAPI}/edit-profile/${shelterId}`, formData)

      const res = await authAxios.get(`${shelterAPI}/get-profile/${shelterId}`)
      reset(res.data)
      setAvatarPreview(res.data.avatar || null)
      setCoverPreview(res.data.background || null)

      setTimeout(() => {
        setLoading(false);
        toast.success("Cập nhập hồ sơ trạm cứu hộ thành công!")
      }, 1500)
    } catch (error: any) {
      console.log(error?.response?.data?.message || error)
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra!")
      setLoading(false);
    }
  }

  const handleCancel = () => {
    if (initialProfile) {
      reset(initialProfile)
      setAvatarPreview(initialProfile.avatar || null)
      setCoverPreview(initialProfile.background || null)
    }
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ cho phép tải lên tệp ảnh (JPG, PNG, WEBP...)");
      return;
    }

    const url = URL.createObjectURL(file);
    setValue(type, file);
    if (type === "avatar") {
      setAvatarPreview(url);
    } else {
      setCoverPreview(url);
    }
  };


  const currentValues = watch()

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
        // set địa chỉ vào trong react-hook-form
        console.log(result.formatted_address);
        setPlaceId(place_id);
        setLocation({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
        setValue("address", result.formatted_address);
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
            // set địa chỉ vào trong react-hook-form
            setValue("address", place.formatted_address);
            setLocation({
              lat: coords.latitude,
              lng: coords.longitude,
            });
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
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen px-10 py-5"
      >
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
          <h4 className="text-xl font-bold text-center text-gray-800">
            Hồ sơ trạm cứu hộ
          </h4>

          {/* Background */}
          <FormField
            control={form.control}
            name="background"
            render={({ field }) => (
              <FormItem>
                <div className="relative h-48 w-full px-2">
                  <div
                    className="h-full w-full cursor-pointer"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <img
                      src={
                        coverPreview ||
                        "https://www.mppl.com.vn/uploads/no-image.png"
                      }
                      alt="Cover"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                  {isManager &&
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-3 z-10 cursor-pointer"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Chọn ảnh nền
                  </Button>
                  }
                  <input
                  disabled={!isManager}
                    type="file"
                    hidden
                    accept="image/*"
                    ref={coverInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageChange(e, "background");
                        field.onChange(file);
                      }
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avatar */}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center justify-center mt-[-3rem]">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="scroll-m-20 text-m font-semibold tracking-tight">
                      Ảnh đại diện
                    </h4>
                    <div className="flex flex-row gap-2">
                      <div
                        onClick={() => isManager && avatarInputRef.current?.click()}
                        className="cursor-pointer"
                      >
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={
                              avatarPreview ||
                              "https://www.mppl.com.vn/uploads/no-image.png"
                            }
                          />
                          <AvatarFallback>
                            {currentValues.name?.[0] ?? "S"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {isManager && 
                      <Button
                      disabled={!isManager}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => avatarInputRef.current?.click()}
                        className="mt-1 my-auto cursor-pointer"
                      >
                        <FilePlus className="mr-2 h-4 w-4" />
                        Chọn ảnh
                      </Button>
                      }
                      <input
                      disabled={!isManager}
                        type="file"
                        hidden
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageChange(e, "avatar");
                            field.onChange(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thông tin */}
          <CardContent className="px-6 pt-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên trạm</FormLabel>
                  <FormControl>
                    <Input  placeholder="Tên trạm" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shelterCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã trạm</FormLabel>
                  <FormControl>
                    <Input placeholder="Mã trạm" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả..." {...field} disabled={!isManager}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                isManager ?
                <AddressInputWithGoong
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("address", val);
                  }}
                  onLocationChange={(loc) => setLocation(loc)}
                  error={form.formState.errors.address?.message}
                /> :
                <Input placeholder="Địa chỉ" {...field} disabled/>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email của trạm</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} disabled={!isManager}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hotline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số hotline</FormLabel>
                  <FormControl>
                    <Input placeholder="Hotline" {...field} disabled={!isManager}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              {isManager && 
               <div className="pt-4 flex gap-2">
              {loading ? (
                <Button disabled>
                  <>
                    <Loader2Icon className="animate-spin mr-2" />
                    Vui lòng chờ
                  </>
                </Button>
              ) : (
                <Button type="submit" className="cursor-pointer">
                  Lưu
                </Button>
              )}
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                className="cursor-pointer"
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
              }
           
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default ShelterProfile
