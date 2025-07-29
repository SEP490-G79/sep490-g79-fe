import React from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

interface Props {
  photos: string[];
  setPhotos: (photos: string[]) => void;
}

const PetPhotoUpload = ({ photos, setPhotos }: Props) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photos.length >= 4) return toast.error("Chỉ được chọn tối đa 4 ảnh");
    try {
      const url = await uploadToCloudinary(file);
      setPhotos([...photos, url]);
    } catch {
      toast.error("Upload ảnh thất bại");
    }
  };

  return (
    <div className="col-span-4 flex flex-col gap-2">
      <label>Ảnh thú nuôi (tối đa 4)</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="pet-photo-upload"
        />
        <label
          htmlFor="pet-photo-upload"
          className="cursor-pointer bg-blue-600 text-white rounded px-4 py-2"
        >
          + Chọn ảnh
        </label>
        <span>Đã chọn {photos.length}/4</span>
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt="preview"
                className="w-full h-28 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetPhotoUpload;
