import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MedicalRecordList from "./MedicalRecordList";
import type { Pet } from "@/types/Pet";
import type { Breed } from "@/types/pet.types";

interface Props {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
}

export default function PetDetailDialog({ open, onClose, pet }: Props) {
  if (!pet) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết thú nuôi</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <strong>Mã thú nuôi:</strong> {pet.petCode}
          </p>
          <p>
            <strong>Tên:</strong> {pet.name}
          </p>
          <p>
            <strong>Tuổi:</strong> {pet.age} tháng
          </p>
          <p>
            <strong>Giới tính:</strong> {pet.isMale ? "Đực" : "Cái"}
          </p>
          <p>
            <strong>Cân nặng:</strong> {pet.weight} kg
          </p>
          <p>
            <strong>Màu lông:</strong> {pet.color}
          </p>
          <p>
            <strong>Triệt sản:</strong>{" "}
            {pet.sterilizationStatus ? "Đã triệt sản" : "Chưa triệt sản"}
          </p>
          <p>
            <strong>Đặc điểm:</strong> {pet.identificationFeature || "Không có"}
          </p>
          <p>
            <strong>Loài:</strong>{" "}
            {typeof pet.species === "string" ? pet.species : pet.species?.name}
          </p>
          <p>
            <strong>Giống:</strong>{" "}
            {(pet.breeds || [])
              .map((b: string | Breed) => (typeof b === "string" ? b : b.name))
              .join(", ")}
          </p>

          <p className="col-span-2">
            <strong>Mô tả:</strong> {pet.bio || "Không có"}
          </p>
        </div>
        {Array.isArray(pet.photos) && pet.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {pet.photos.map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                alt={`photo-${idx}`}
                className="w-full h-28 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {pet._id && (
          <div className="mt-6">
            <MedicalRecordList petId={pet._id} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
