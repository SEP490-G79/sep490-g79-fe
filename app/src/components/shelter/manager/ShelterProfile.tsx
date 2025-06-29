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
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  AlertTriangleIcon,
  CalendarIcon,
  HashIcon,
} from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type ShelterProfile } from "@/types/ShelterProfile"
import useAuthAxios from "@/utils/authAxios"
import AppContext from "@/context/AppContext"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const shelterProfileSchema = z.object({
  name: z.string().min(3, "Tên trạm phải có ít nhất 3 ký tự"),
  bio: z.string().max(300, "Mô tả không quá 300 ký tự"),
  address: z.string().min(5, "Địa chỉ không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  hotline: z.string().min(8, "Số hotline không hợp lệ"),
  avatar: z.any().optional(),
  background: z.any().optional(),
})

type ShelterFormValues = z.infer<typeof shelterProfileSchema>

const ShelterProfile = () => {
  const [initialProfile, setInitialProfile] = useState<ShelterFormValues | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const authAxios = useAuthAxios()
  const { shelterAPI } = useContext(AppContext)
  const { shelterId } = useParams()

  const form = useForm<ShelterFormValues>({
    resolver: zodResolver(shelterProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      address: "",
      hotline: "",
      avatar: undefined,
      background: undefined,
    },
  })

  const { register, handleSubmit, reset, setValue, watch } = form

useEffect(() => {
  if (!shelterId) return;

  authAxios
    .get(`${shelterAPI}/get-profile/${shelterId}`)
    .then(({ data }) => {
      reset(data);
      setInitialProfile(data); // 👈 Lưu dữ liệu ban đầu
      setAvatarPreview(data.avatar || null);
      setCoverPreview(data.background || null);
    })
    .catch((err) => console.log(err?.response?.data?.message));
}, [shelterId]);



  const onSubmit = async (data: ShelterFormValues) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    formData.append("hotline", data.hotline);
    formData.append("email", data.email);
    formData.append("address", data.address);
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }
    if (data.background instanceof File) {
      formData.append("background", data.background);
    }

    await authAxios.put(`${shelterAPI}/edit-profile/${shelterId}`, formData);
    toast.success("Cập nhật hồ sơ trạm cứu hộ thành công!");

    const res = await authAxios.get(`${shelterAPI}/get-profile/${shelterId}`);
    reset(res.data);
    setAvatarPreview(res.data.avatar || null);
    setCoverPreview(res.data.background || null);
  } catch (error: any) {
    console.log(error?.response?.data?.message || error);
    toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
  }
};


const handleCancel = () => {
  if (initialProfile) {
    reset(initialProfile);
    setAvatarPreview(initialProfile.avatar || null);
    setCoverPreview(initialProfile.background || null);
  }
};


  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setValue(type, file)
      type === "avatar"
        ? setAvatarPreview(url)
        : setCoverPreview(url)
    }
  }

  const currentValues = watch()

  const foundedDate = "2020-03-15"
  const warningCount = 2
  const shelterCode = "SH00123"
  const members = [{}, {}, {}]

  return (
    <div className="min-h-screen px-10 py-5">
      <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
        <h4 className="text-xl font-bold text-center text-gray-800">
          Hồ sơ trạm cứu hộ
        </h4>

        {/* Cover Image */}
        <div
          className="relative h-48 w-full cursor-pointer"
          onClick={() => coverInputRef.current?.click()}
        >
          <img
            src={
              coverPreview ||
              "https://www.mppl.com.vn/uploads/no-image.png"
            }
            alt="Cover"
            className="object-cover w-full h-full"
          />
          <input
            type="file"
            hidden
            accept="image/*"
            ref={coverInputRef}
            onChange={(e) => handleImageChange(e, "background")}
          />
        </div>

        {/* Avatar + Tên */}
        <div className="flex flex-col items-center justify-center mt-[-3rem]">
          <div
            onClick={() => avatarInputRef.current?.click()}
            className="cursor-pointer"
          >
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={avatarPreview || "https://www.mppl.com.vn/uploads/no-image.png"} />
              <AvatarFallback>{currentValues.name?.[0] ?? "S"}</AvatarFallback>
            </Avatar>
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={avatarInputRef}
            onChange={(e) => handleImageChange(e, "avatar")}
          />
          <Input
            {...register("name")}
            className="w-72 text-xl font-semibold text-center mt-2"
            placeholder="Tên trạm"
          />
        </div>

        {/* Bio + Badge */}
        <div className="flex flex-col items-center text-center px-6 pt-4 gap-2">
          <Textarea
            {...register("bio")}
            placeholder="Mô tả..."
            className="w-full max-w-2xl"
          />

          {/* <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge>Hoạt động</Badge>
            <Badge variant="outline">{members.length} thành viên</Badge>
            <Badge>
              <HashIcon className="w-4 h-4 mr-1" /> {shelterCode}
            </Badge>
            <Badge variant="destructive">
              <AlertTriangleIcon className="w-4 h-4 mr-1" /> {warningCount} cảnh báo
            </Badge>
            <Badge variant="secondary">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {format(new Date(foundedDate), "dd/MM/yyyy")}
            </Badge>
          </div> */}
        </div>

        {/* Thông tin chi tiết */}
        <CardContent className="px-6 pt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              <Input {...register("address")} placeholder="Địa chỉ" />
            </div>

            <div className="flex items-center gap-2">
              <MailIcon className="w-5 h-5" />
              <Input {...register("email")} placeholder="Email" />
            </div>

            <div className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              <Input {...register("hotline")} placeholder="Hotline" />
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={handleSubmit(onSubmit)}>Lưu</Button>
            <Button variant="outline" onClick={handleCancel}>Hủy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShelterProfile
