declare module "@/utils/cloudinaryUpload" {
  export function uploadToCloudinary(file: File): Promise<string>;
}
