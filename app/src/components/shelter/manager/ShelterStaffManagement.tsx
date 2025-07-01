import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpDown, Ban, Loader2Icon, MoreHorizontal, RotateCcwKey } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ShelterEstablishmentRequest } from "@/types/ShelterEstablishmentRequest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { ShelterMember } from "@/types/ShelterMember";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShelterStaffsList from "./ShelterStaffsList";
import ShelterStaffRequestManagement from "./ShelterStaffRequestManagement";

const ShelterStaffManagement = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
          <Tabs defaultValue="staffs-list">
            <TabsList>
              <TabsTrigger value="staffs-list" className='cursor-pointer'>Tất cả thành viên</TabsTrigger>
              <TabsTrigger value="staff-requests-list" className='cursor-pointer'>
                Các yêu cầu gia nhập và lời mời vào trạm cứu hộ
              </TabsTrigger>
            </TabsList>
            <TabsContent value="staffs-list">
              <ShelterStaffsList/>
            </TabsContent>
            <TabsContent value="staff-requests-list">
              <ShelterStaffRequestManagement />
            </TabsContent>
          </Tabs>
        </div>
    </div>
  )
}

export default ShelterStaffManagement