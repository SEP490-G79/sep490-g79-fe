import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ClipboardList, HandHelping, Settings } from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import type { Shelter } from "@/types/Shelter";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";

interface ShelterBgProps {
  shelter: Shelter;
}

export const ShelterBg: React.FC<ShelterBgProps> = ({ shelter }) => {
  const authAxios = useAuthAxios();
  const foundation = new Date(shelter.foundationDate).toLocaleDateString();
  const { user, shelterAPI } = useContext(AppContext);
  const isShelterMember = shelter.members?.some(
    (member) => member?._id == user?._id
  );

  const handleSendRequest = async (emailString: string) => {
    try {
      await authAxios.put(`${shelterAPI}/send-staff-request/${emailString}`);
      setTimeout(() => {
        toast.success("Gửi yêu cầu gia nhập thành công!");
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

  return (
    <>
      <Breadcrumb className="basis-full mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-muted-foreground"
              href="/"
            >
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-muted-foreground"
              href="/shelters"
            >
              Trung tâm cứu hộ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{shelter.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* <img
        src={shelter.background}
        alt={`${shelter.name} background`}
        className="w-full h-[15rem] object-cover rounded-md"
      /> */}
      <Avatar className="w-full h-[15rem] rounded-sm">
        <AvatarImage
          src={shelter.background}
          alt={`${shelter.name} background`}
          className=" object-cover object-center rounded-sm"
        />
        <AvatarFallback className="text-3xl rounded-sm">
          <span>{shelter.name.toUpperCase()}</span>
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-wrap justify-between items-center py-2 px-5">
        <div className="flex items-center space-x-4">
          <img
            src={shelter.avatar}
            alt={`${shelter.name} avatar`}
            className="w-20 h-20 object-cover rounded-md border-2 border-primary"
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-foreground line-clamp-1">
              {shelter.name}
            </h2>

            <div className="flex -space-x-2 mt-2">
              {shelter.members.map((member) => (
                <Link key={member?._id} to={`/profile/${member._id}`}>
                  <Avatar className="ring-2 ring-primary">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.fullName.trim().split(" ").pop()?.charAt(0) ?? ""}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Ngày thành lập: {foundation}
            </p>
          </div>
        </div>

        {isShelterMember ? (
          <Button variant="ghost" className="text-xs" asChild>
            <Link
              to={`/shelters/${shelter._id}/management`}
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "instant" })
              }
            >
              <ClipboardList className="text-(--primary)" /> Quản lý trung tâm
            </Link>
          </Button>
        ) :
        <Button variant="ghost" className="text-xs cursor-pointer" onClick={() => handleSendRequest(shelter.email)}>
            <HandHelping className="text-primary"/> Yêu cầu làm tình nguyện viên
        </Button>}
      </div>

      {/* <Separator /> */}
    </>
  );
};

export default ShelterBg;
