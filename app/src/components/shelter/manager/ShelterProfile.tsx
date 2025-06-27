"use client"

import React, { useRef, useState } from "react"
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

const schema = z.object({
  name: z.string().min(3, "Tên trạm phải có ít nhất 3 ký tự"),
  bio: z.string().max(300, "Mô tả không quá 300 ký tự"),
  address: z.string().min(5, "Địa chỉ không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  avatar: z.any().optional(),
  coverImage: z.any().optional(),
})

type ShelterFormValues = z.infer<typeof schema>

const initialData: ShelterFormValues = {
  name: "Paws & Claws Rescue Center",
  bio: "Chúng tôi cứu hộ và chăm sóc hàng trăm thú cưng bị bỏ rơi mỗi năm.",
  address: "123 Trạm cứu hộ, Quận 1, TP.HCM",
  email: "contact@pawsclaws.org",
  phone: "0123 456 789",
  avatar: undefined,
  coverImage: undefined,
}

const ShelterProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShelterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  })

  const onSubmit = (data: ShelterFormValues) => {
    setIsEditing(false)
    console.log("✅ Đã cập nhật:", data)
  }

  const handleCancel = () => {
    reset(initialData)
    setIsEditing(false)
    setAvatarPreview(null)
    setCoverPreview(null)
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "coverImage"
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setValue(type, file)
      if (type === "avatar") setAvatarPreview(url)
      else setCoverPreview(url)
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
      {/* Tiêu đề */}
      <h4 className="text-xl font-bold text-center text-gray-800">
        Hồ sơ trạm cứu hộ
      </h4>

      {/* Cover Image */}
      <div
        className="relative h-48 w-full cursor-pointer"
        onClick={() => {
          if (isEditing && coverInputRef.current) {
            coverInputRef.current.click()
          }
        }}
      >
        <img
          src={
            coverPreview ||
            "https://t3.ftcdn.net/jpg/06/96/91/04/360_F_696910475_p7XUMWNKjVpsn9ok9wJtTpTEgMBB4zjC.jpg"
          }
          alt="Cover"
          className="object-cover w-full h-full"
        />
        <input
          type="file"
          hidden
          accept="image/*"
          ref={coverInputRef}
          onChange={(e) => handleImageChange(e, "coverImage")}
        />
      </div>

      {/* Avatar + Tên */}
      <div className="flex flex-col items-center justify-center mt-[-3rem]">
        <div
          onClick={() => isEditing && avatarInputRef.current?.click()}
          className="cursor-pointer"
        >
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={
                avatarPreview ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcOpQ34oIhwAug19-wJuxY5xe4J-P0nE3WyA&s"
              }
            />
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
        {isEditing ? (
          <Input
            {...register("name")}
            className="w-72 text-xl font-semibold text-center mt-2"
            placeholder="Tên trạm"
          />
        ) : (
          <h2 className="text-2xl font-bold text-center text-gray-800 mt-2">
            {currentValues.name}
          </h2>
        )}
      </div>

      {/* Bio + Badge */}
      <div className="flex flex-col items-center text-center px-6 pt-4 gap-2">
        {isEditing ? (
          <Textarea
            {...register("bio")}
            placeholder="Mô tả..."
            className="w-full max-w-2xl"
          />
        ) : (
          <p className="text-gray-700">{currentValues.bio}</p>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-2">
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
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <CardContent className="px-6 pt-6 space-y-4 text-base text-gray-700">
        <div className="space-y-2">
          {/* Địa chỉ */}
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            {isEditing ? (
              <Input {...register("address")} placeholder="Địa chỉ" />
            ) : (
              <span>{currentValues.address}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <MailIcon className="w-5 h-5" />
            {isEditing ? (
              <Input {...register("email")} placeholder="Email" />
            ) : (
              <span>{currentValues.email}</span>
            )}
          </div>

          {/* Điện thoại */}
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-5 h-5" />
            {isEditing ? (
              <Input {...register("phone")} placeholder="Số điện thoại" />
            ) : (
              <span>{currentValues.phone}</span>
            )}
          </div>
        </div>

        {/* Nút lưu / huỷ / chỉnh sửa */}
        <div className="pt-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSubmit(onSubmit)}>Lưu</Button>
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Chỉnh sửa thông tin
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
)

}

export default ShelterProfile
