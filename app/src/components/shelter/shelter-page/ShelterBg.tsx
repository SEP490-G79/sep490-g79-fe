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
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import type { Shelter } from '@/types/Shelter';

interface ShelterBgProps {
  shelter: Shelter;
}

export const ShelterBg: React.FC<ShelterBgProps> = ({ shelter }) => {
  const foundation = new Date(shelter.foundationDate).toLocaleDateString();

  return (
    <>
      <Breadcrumb className="basis-full mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="hover:text-primary text-muted-foreground" href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="hover:text-primary text-muted-foreground" href="/shelters">
              Trung tâm cứu hộ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{shelter.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <img
        src={shelter.background}
        alt={`${shelter.name} background`}
        className="w-full h-[15rem] object-cover rounded-md"
      />

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
                <Avatar
                  key={member.id}
                  className="ring-2 ring-primary"
                >
                  {/* Fallback with last 2 chars of ID */}
                  <AvatarFallback>{member.id.slice(-2)}</AvatarFallback>
                </Avatar>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Ngày thành lập: {foundation}
            </p>
          </div>
        </div>

        <Button variant="ghost" asChild>
          <Link to={`/shelters/${shelter._id}/settings`}>  
            <Settings />
          </Link>
        </Button>
      </div>

      {/* <Separator /> */}
    </>
  );
};

export default ShelterBg;
