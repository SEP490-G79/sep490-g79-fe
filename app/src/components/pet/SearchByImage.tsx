import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import AppContext from "@/context/AppContext";
import { mockColors } from "@/types/Corlor";
import axios from "axios";
import { Loader2Icon, Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export interface FilterState {
  species: string[];
  breed: string[];
  gender: string;
  shelter: string[];
  color: string[];
  ageRange: [number, number];
  weightRange: [number, number];
  priceRange: [number, number];
  inWishlist?: boolean;
  searchTerm?: string;
}

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SearchByImage({ setFilters, setIsLoading }: Props) {
  const { coreAPI } = React.useContext(AppContext);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        const uploadPromises = files.map(async (file) => {
          try {
            const totalChunks = 10;
            let uploadedChunks = 0;

            for (let i = 0; i < totalChunks; i++) {
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 200 + 100)
              );
              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            await new Promise((resolve) => setTimeout(resolve, 500));
            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    []
  );

  const handleSearchByImage = async (file: File) => {
    setIsLoading?.(true);
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("imageRaw", file);
    formData.append("colorsList", JSON.stringify(mockColors));

    await axios
      .post(`${coreAPI}/pets/search-by-ai`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Phân tích ảnh thành công!");
        setFilters((prev) => ({
          ...prev,
          species: res.data.species,
          breed: res.data.breeds,
          // colors: res.data.colors,
        }));
      })
      .catch((err) => {
        // console.error(err);
        toast.error(
          err.response.data.message ||
            "Có lỗi khi phân tích ảnh! Vui lòng thử lại sau."
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading?.(false);
          setBtnLoading(false);
        }, 200);
      });
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onUpload={onUpload}
      onFileReject={onFileReject}
      maxFiles={1}
      className="w-full max-w-md"
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Kéo thả ảnh ở đây!</p>
          <p className="text-muted-foreground text-xs">
            Hoặc tải ảnh lên từ thiết bị của bạn
          </p>
          <p className="text-muted-foreground text-xs">(Tối đa 1 ảnh)</p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit" >
            Tải ảnh lên
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file} className="flex-col">
            <div className="flex w-full items-center gap-2">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              {/* <Button variant={"outline"}>okok</Button> */}
              {btnLoading == false ? (
                <button
                  onClick={() => {
                    handleSearchByImage(file);
                  }}
                  className=" cursor-pointer translate-1 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                  <span className=" px-2 py-1 text-sm transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Phân tích
                  </span>
                </button>
              ) : (
                <Button size="sm" disabled>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </Button>
              )}

              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7" disabled={btnLoading}>
                  <X />
                </Button>
              </FileUploadItemDelete>
            </div>
            <FileUploadItemProgress />
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
