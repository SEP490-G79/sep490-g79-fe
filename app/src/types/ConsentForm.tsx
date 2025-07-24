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
    adopter:User;
    shelter:Shelter;
    createdBy:User;
    pet:Pet;
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
