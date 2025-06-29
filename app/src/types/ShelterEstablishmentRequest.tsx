export interface ShelterEstablishmentRequest {
  name: string;
  shelterCode: string;
  email: string;
  hotline: number;
  address: string;
  status: string;
  shelterLicenseURL: string;
  aspiration: string;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}
