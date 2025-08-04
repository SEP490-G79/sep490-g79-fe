import type { Pet } from "./Pet";
import type { Shelter } from "./Shelter";
import type { User } from "./User";

export interface Attachment {
    fileName: string;
    url: string;
    size: number;
    mimeType: string;
    createAt: Date;
    updateAt: Date;
  }
  
export interface ConsentForm {
    _id: string;
    title: string;
    adopter:User;
    shelter:Shelter;
    createdBy:User;
    pet?: Pet;
    commitments: string;
    tokenMoney: number;
    deliveryMethod: string;
    note: string;
    address: string;
    status: string;
    attachments: Attachment[];
    createdAt: Date;
    updatedAt: Date;
  }

  export const mockDeliveryMethods = [
    {
      value: "pickup",
      label: "Tự đến nhận",
    },
    {
      value: "delivery",
      label: "Nhân viên giao hàng",
    },
  ];
  export const mockStatus = [
    {
      value: "draft",
      label: "Nháp",
    },
    {
      value: "send",
      label: "Đã gửi",
    },
    {
      value: "accepted",
      label: "Đã chấp nhận",
    },
    {
      value: "cancelled",
      label: "Đã hủy",
    },
    {
      value: "approved",
      label: "Đã duyệt",
    },
    {
      value: "rejected",
      label: "Đã từ chối",
    },
  ];