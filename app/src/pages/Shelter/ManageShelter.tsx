import SideBar from "@/components/shelter/shelter-management/SideBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import AppContext from "@/context/AppContext";
import { type Shelter } from "@/types/Shelter";
import useAuthAxios from "@/utils/authAxios";
import React, { useContext, useEffect, useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function ManageShelter() {
  const { shelterId } = useParams();
  const { shelters, coreAPI, setShelterTemplates, user } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const shelter = useMemo<Shelter | undefined>(() => {
    return (shelters ?? [])?.find((s) => s._id == shelterId);
  }, [shelterId, shelters]);

  useEffect(() => {
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/get-all`)
      .then((res) => {
        setShelterTemplates(res.data);
      })
      .catch((err) => {
        console.log(err.data.response.message);
      });
  }, [shelterId]);
  const navs = [
    { title: "Thông tin chung", href: "dashboard" },
    { title: "Hồ sơ trung tâm", href: "shelter-profile" },
    { title: "Quản lý thành viên", href: "staffs-management" },
    { title: "Quản lý bài viết blog", href: "blogs-management" },
    { title: "Quản lý hồ sơ thú nuôi", href: "pet-profiles" },
    { title: "Quản lý mẫu nhận nuôi", href: "adoption-templates" },
    { title: "Quản lý form nhận nuôi", href: "adoption-forms" },
  ];

  return (
    <div className="w-full min-h-full flex flex-wrap justify-around px-20 py-5">
      <Breadcrumb className="basis-full mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-(--muted-foreground)"
              href="/"
            >
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-(--muted-foreground)"
              href={`/shelters/${shelterId}`}
            >
              {shelter?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý trung tâm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="basis-full mb-5 mt-5">
        <h1 className="text-2xl font-medium text-(--primary) mb-3">
          Quản lý trung tâm
        </h1>
        <p className="text-sm text-(--muted-foreground) mb-3">
          Cài đặt và quản lý tài nguyên
        </p>
        <Separator />
      </div>
      <div className="basis-full sm:basis-1/4 w-full">
        <aside className="w-full">
          <SideBar items={navs} />
        </aside>
      </div>
      <div className="basis-full sm:basis-3/4 w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default ManageShelter;
