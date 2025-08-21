import React, { useState } from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Ellipsis, Sparkles, Trash, Upload, Wand } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PetImageAIButton from "./PetImageAIButton";
import type { Breed, PetFormState, Species } from "@/types/pet.types";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  photos: string[];
  setPhotos: (photos: string[]) => void;
  setForm: React.Dispatch<React.SetStateAction<PetFormState>>;
  speciesList: Species[];
  breedList: Breed[];
}

const MAX_PHOTOS = 4;

const PetPhotoUpload = ({
  photos,
  setPhotos,
  setForm,
  speciesList,
  breedList,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const getImageHash = async (input: File | string): Promise<string> => {
    const buffer = await (async () => {
      if (typeof input === "string") {
        // Input là URL
        const res = await fetch(input);
        const blob = await res.blob();
        return await blob.arrayBuffer();
      } else {
        // Input là File
        return await input.arrayBuffer();
      }
    })();

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleUpload = async (files: File[]) => {
    const remaining = MAX_PHOTOS - photos.length;

    if (remaining <= 0) {
      toast.error(`Chỉ được chọn tối đa ${MAX_PHOTOS} ảnh`);
      return;
    }

    try {
      setIsLoading(true);
      // 1. Tính hash của tất cả ảnh đã upload từ URL
      const existingHashes = new Set<string>();
      await Promise.all(
        photos.map(async (url) => {
          const hash = await getImageHash(url);
          existingHashes.add(hash);
        })
      );

      // 2. Tính hash ảnh mới và lọc ảnh chưa trùng
      const uniqueFiles: File[] = [];
      for (const file of files) {
        const hash = await getImageHash(file);
        if (!existingHashes.has(hash)) {
          uniqueFiles.push(file);
          existingHashes.add(hash); // để tránh trùng tiếp trong batch
        }
      }

      if (uniqueFiles.length === 0) {
        toast.warning("Tất cả ảnh đã tồn tại!");
        return;
      }

      if (uniqueFiles.length > remaining) {
        toast.warning(`Chỉ có thể thêm tối đa ${remaining} ảnh mới`);
      }

      const filesToUpload = uniqueFiles.slice(0, remaining);
      const uploadPromises = filesToUpload.map((file) =>
        uploadToCloudinary(file)
      );
      const urls = await Promise.all(uploadPromises);
      setPhotos([...photos, ...urls]);
    } catch (err) {
      console.error(err);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...photos];
    updated.splice(index, 1);
    setPhotos(updated);
  };
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="col-span-4 flex flex-col gap-2">
        <label className="font-medium">Ảnh thú nuôi</label>

        {/* Dropzone skeleton */}
        <div className="w-full rounded-md border p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            {/* vòng tròn icon */}
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            {/* 3 dòng text */}
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-52" />
            <Skeleton className="h-3 w-44" />

            {/* nút Upload */}
            <div className="mt-2">
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* Grid ảnh skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 mt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="relative group w-full h-35 rounded overflow-hidden border"
            >
              {/* khung ảnh */}
              <Skeleton className="h-full w-full" />

              {/* overlay + nút giả (ẩn/hiện khi hover giống thật) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-4 flex flex-col gap-2">
      <label className="font-medium">Ảnh thú nuôi</label>

      <FileUpload
        key={photos.length}
        maxFiles={MAX_PHOTOS}
        multiple
        disabled={photos.length == MAX_PHOTOS}
        onFileReject={onFileReject}
        onUpload={handleUpload}
        className="w-full"
        accept=".png,.jpg,.jpeg"
        maxSize={10 * 1024 * 1024}
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Kéo thả ảnh ở đây!</p>
            <p className="text-muted-foreground text-xs">
              Hoặc tải ảnh lên từ thiết bị
            </p>
            <p className="text-muted-foreground text-xs">
              (Tối đa {MAX_PHOTOS} ảnh)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Tải ảnh lên
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
      </FileUpload>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 mt-2">
          {photos.map((url, idx) => (
            <div
              key={idx}
              className="relative group w-full h-35 rounded overflow-hidden border"
            >
              <img
                src={url}
                alt="preview"
                className="w-full h-full object-cover transition duration-300 group-hover:opacity-60"
              />

              {/* Overlay chứa icon xoá */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="link"
                      onClick={() => handleRemove(idx)}
                      className="cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                    >
                      <Sparkles
                        className="w-5 h-5"
                        style={{
                          stroke: "url(#sparklesGradient)",
                        }}
                      />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient
                            id="sparklesGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop stopColor="#f9a8d4" offset="0%" />
                            <stop stopColor="#d946ef" offset="50%" />
                            <stop stopColor="#a855f7" offset="100%" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" 
                  className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 text-white border-0"
                  >
                    <p className="flex"><Wand size={"15px"}/>  Phân tích ảnh</p>
                  </TooltipContent>
                </Tooltip> */}
                <PetImageAIButton
                  setIsLoading={setIsLoading}
                  imageUrl={url}
                  setForm={setForm}
                  speciesList={speciesList}
                  breedList={breedList}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-(--destructive) cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-(--foreground)">
                    <p>Xóa ảnh</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetPhotoUpload;
