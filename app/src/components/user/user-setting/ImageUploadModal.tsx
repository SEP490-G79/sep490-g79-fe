
import React, { useState, useContext, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon, UploadIcon } from "lucide-react";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onImageSelect: (file: File, preview: string) => void;
  currentPreview: string;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ open, onClose, onImageSelect, currentPreview }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentPreview);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setPreview(currentPreview);
  }, [currentPreview]);


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(droppedFile);
      setFile(droppedFile);
      setPreview(previewUrl);
      onImageSelect(droppedFile, previewUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(selected);
      setFile(selected);
      setPreview(previewUrl);
      onImageSelect(selected, previewUrl);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview("");
    onImageSelect(null as any, "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Đăng tải ảnh</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-3">
          Bạn có thể chọn ảnh từ máy tính hoặc thư viện của mình
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`w-full aspect-square border-2 border-dashed rounded-md flex justify-center items-center relative ${dragActive ? "border-blue-500" : "border-gray-400"}`}
        >
          {!preview ? (
            <div className="text-center text-muted-foreground">
              <UploadIcon className="mx-auto w-6 h-6" />
              <p className="text-sm mt-2">Kéo và thả ảnh của bạn vào đây</p>
              <input type="file" accept="image/*" className="hidden" id="fileInput" onChange={handleFileChange} />
              <label htmlFor="fileInput" className="text-blue-500 text-sm cursor-pointer underline">
                Hoặc chọn ảnh
              </label>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="preview"
                className="absolute max-w-full max-h-full object-contain top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black z-10"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
