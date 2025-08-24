// File: components/PetForm.tsx
import React, { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PET_STATUSES } from "@/components/shelter/shelterPet/petStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Autosuggest from "react-autosuggest";
import PetPhotoUpload from "./PetPhotoUpload";
import PetImageAIButton from "./PetImageAIButton";
import type { Species, Breed, PetFormState } from "@/types/pet.types";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import TagCombobox from "@/components/pet/TagCombobox";
import { mockColors } from "@/types/Corlor";

interface PetFormProps {
  form: PetFormState;
  setForm: React.Dispatch<React.SetStateAction<PetFormState>>;
  speciesList: Species[];
  setSpeciesList: React.Dispatch<React.SetStateAction<Species[]>>;
  breedList: Breed[];
  setBreedList: React.Dispatch<React.SetStateAction<Breed[]>>;
  onSubmit: (e: React.FormEvent) => void;
  onCreateSpecies: (inputValue: string) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export default function PetForm({
  form,
  setForm,
  speciesList,
  setSpeciesList,
  breedList,
  setBreedList,
  onSubmit,
  onCreateSpecies,
  isEditing,
  isLoading,
}: PetFormProps) {
  
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [selectedBreedTemp, setSelectedBreedTemp] = useState<
    string | undefined
  >(undefined);
  const [breedSelectKey, setBreedSelectKey] = useState(0);

  const colorSuggestions = [
    "Trắng",
    "Đen",
    "Nâu",
    "Nâu socola",
    "Vàng kem",
    "Kem",
    "Nâu vàng nhạt",
    "Nâu rám",
    "Xám",
    "Xám xanh",
    "Xanh lam",
    "Đỏ",
    "Cam",
    "Vàng",
    "Vàng mơ",
    "Bạc",
    "Loang sọc",
    "Loang chấm",
    "Đen pha nâu",
    "Tam thể",
    "Vằn mèo",
    "Mai rùa",
    "Hai màu",
    "Ba màu",
    "Nâu đậm",
    "Tím nhạt",
    "Quế",
    "Be",
    "Trắng ngà",
    "Đen trắng kiểu vest",
    "Thân nhạt, mặt đậm",
    "Vằn mặt, tai",
    "Khói",
    "Loang đều",
    "Trắng với mặt và đuôi có màu",
    "Đốm trắng lớn",
    "Nâu tự nhiên",
    "Champagne",
    "Bạch tạng",
    "Chân trắng, mặt màu",
    "Xám than",
    "Nâu gỉ",
    "Nâu gụ",
    "Nâu gan",
    "Hồng đào",
    "Xám tro",
    "Xanh rêu",
    "Trắng tuyết",
    "Đồng đỏ",
    "Xám thép",
    "Hổ phách",
    "Xám rêu",
    "Hồng tro",
    "Bạch kim",
    "Đen tuyền",
  ];
  const getSuggestions = (value: string) =>
    mockColors.filter((color) =>
      color.toLowerCase().includes(value.toLowerCase())
    );
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
        {/* Tên thú nuôi */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Tuổi */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Giới tính */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Cân nặng */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Loài */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Giống */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Màu lông */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Đặc điểm nhận dạng */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Triệt sản */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Phí nhận nuôi */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Trạng thái (nếu editing) */}
        <div className="md:col-span-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Tiểu sử */}
        <div className="col-span-full flex flex-col gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Upload ảnh */}
        <div className="col-span-full flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-24 w-24 rounded-md" />
            <Skeleton className="h-24 w-24 rounded-md" />
            <Skeleton className="h-24 w-24 rounded-md" />
          </div>
        </div>

        <div className="col-span-full flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }
// derive colors từ form.color
const selectedColors: string[] = form.color
  ? form.color.split(",").map((c) => c.trim())
  : [];

// Khi đổi màu → cập nhật lại form.color
const handleColorsChange = (vals: string[]) => {
  const unique = Array.from(
    new Set(vals.map((v) => v.trim()).filter((v) => mockColors.includes(v)))
  ).slice(0, 2);

  setForm((prev) => ({
    ...prev,
    color: unique.join(", "),   
  }));
};

const breedOptions =
  breedList
    .filter(
      (b) =>
        (typeof b.species === "string" && b.species === form.species) ||
        (typeof b.species === "object" && b.species._id === form.species)
    )
    .map((b) => b.name); 
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto "
    >
      <div className="md:col-span-1 flex flex-col gap-1">
        <label className="text-sm font-medium">Tên thú nuôi <span className="text-red-500">*</span> </label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nhập tên thú nuôi"
        />
      </div>
      <div className="md:col-span-1 flex flex-col gap-1">
        <label className="text-sm font-medium">Tuổi (tháng)</label>
        <Input
          type="text"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          placeholder="Tuổi"
        />
      </div>
      <div className="md:col-span-1 flex flex-col gap-1">
        <label className="text-sm font-medium">Giới tính</label>
        <Select
          value={String(form.isMale)}
          onValueChange={(v) => setForm({ ...form, isMale: v == "true" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Đực</SelectItem>
            <SelectItem value="false">Cái</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-1  flex flex-col gap-1">
        <label className="text-sm font-medium">Cân nặng (kg) <span className="text-red-500">*</span> </label>
        <Input
          type="text"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          placeholder="Nhập cân nặng"
        />
      </div>
      <div className="md:col-span-1  flex flex-col gap-1">
        <label className="text-sm font-medium">Loài <span className="text-red-500">*</span> </label>
        <Select
          value={form.species}
          onValueChange={(value) => {
            if (value === "__create__") {
              const name = prompt("Nhập tên loài mới:");
              if (name) {
                onCreateSpecies(name); // Hàm tạo loài mới
              }
            } else {
              setForm((f) => ({ ...f, species: value, breeds: [] }));
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loài..." />
          </SelectTrigger>
          <SelectContent>
            {speciesList.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className=" md:col-span-1 flex flex-col gap-1 ">
        <label className="text-sm font-medium">Giống <span className="text-xs text-muted-foreground mt-1">
   ( Đã chọn {form.breeds.length}/2 )
  </span></label>

     
        {/* <div className="flex flex-wrap gap-2">
          {form.breeds.map((breedId) => {
            const breed = breedList.find((b) => b._id === breedId);
            return (
              <span
                key={breedId}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground border"
              >
                {breed?.name || "Không rõ"}
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      breeds: f.breeds.filter((id) => id !== breedId),
                    }))
                  }
                  className="hover:text-destructive text-base leading-none"
                  title="Xóa giống này"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

  
        {form.breeds.length < 2 && (
          <Select
            key={breedSelectKey}
            value={selectedBreedTemp}
            onValueChange={(value) => {
              if (form.breeds.includes(value)) return;
              setForm((f) => ({ ...f, breeds: [...f.breeds, value] }));
              setSelectedBreedTemp(undefined);
              setBreedSelectKey((k) => k + 1);
            }}
            disabled={!form.species}
          >
            <SelectTrigger className="w-full h-9 border border-input rounded-md px-3 text-sm">
              <SelectValue placeholder="Chọn giống để thêm..." />
            </SelectTrigger>
            <SelectContent className="z-50 max-h-64 overflow-y-auto">
              {breedList
                .filter(
                  (b) =>
                    (b.species === form.species ||
                      (typeof b.species === "object" &&
                        b.species._id === form.species)) &&
                    !form.breeds.includes(b._id)
                )
                .map((b) => (
                  <SelectItem
                    key={b._id}
                    value={b._id}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent"
                  >
                    {b.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )} */}


  <TagCombobox
    options={breedOptions}
    selected={
      form.breeds
        .map((id) => {
          const breed = breedList.find((b) => b._id === id);
          return breed?.name || null;
        })
        .filter(Boolean) as string[]
    }
    onChange={(vals) => {
      const limited = vals.slice(0, 2);
      const ids = limited
        .map((name) => {
          const breed = breedList.find(
            (b) => b.name.toLowerCase() === name.toLowerCase()
          );
          return breed?._id;
        })
        .filter(Boolean) as string[];
      setForm((f) => ({ ...f, breeds: ids }));
    }}
    placeholder="Chọn tối đa 2 giống"
  />

</div>

      <div className="flex flex-col gap-1 col-span-full md:col-span-1">
        <label className="text-sm font-medium">Màu lông <span className="text-red-500">*</span></label>
        {/* <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={({ value }) =>
            setSuggestions(getSuggestions(value))
          }
          onSuggestionsClearRequested={() => setSuggestions([])}
          getSuggestionValue={(s) => s}
          renderSuggestion={(s) => <span>{s}</span>}
          onSuggestionSelected={(_, { suggestion }) =>
            setForm((prev: PetFormState) => ({ ...prev, color: suggestion }))
          }
          inputProps={{
            placeholder: "Nhập màu lông...",
            value: form.color,
            onChange: (_: unknown, { newValue }: { newValue: string }) =>
              setForm((prev: PetFormState) => ({ ...prev, color: newValue })),
          }}
          theme={{
            input:
              "w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground",
            suggestionsContainer:
              "z-50 absolute border mt-1 rounded shadow-md bg-white border-gray-300 dark:bg-[#1f2937] dark:border-gray-700",
            suggestion:
              "px-4 py-2 cursor-pointer hover:bg-gray-100 text-black dark:hover:bg-[#374151] dark:text-white",
            suggestionHighlighted: "bg-blue-500 text-white dark:bg-blue-600",
          }}
        /> */}
    <div className="flex flex-col gap-1 col-span-full md:col-span-1">
        <p className="text-xs text-muted-foreground mt-1">
    Đã chọn {selectedColors.length}/2
  </p>
  <TagCombobox
  options={mockColors}
  selected={selectedColors}  
  onChange={handleColorsChange}
  placeholder="Chọn tối đa 2 màu"
/>

</div>


      </div>
      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-sm font-medium">Đặc điểm nhận dạng</label>
        <Input
          value={form.identificationFeature}
          onChange={(e) =>
            setForm({ ...form, identificationFeature: e.target.value })
          }
          placeholder="Nhập đặc điểm..."
        />
      </div>

      <div className=" md:col-span-1 flex flex-col gap-1">
        <label className="text-sm font-medium">Triệt sản</label>
        <Select
          value={String(form.sterilizationStatus)}
          onValueChange={(v) =>
            setForm({ ...form, sterilizationStatus: v === "true" })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Đã triệt sản</SelectItem>
            <SelectItem value="false">Chưa triệt sản</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-1 flex flex-col gap-1">
        <label className="text-sm font-medium">Phí nhận nuôi (VNĐ)</label>
        <Input
          type="number"
          min={0}
          value={form.tokenMoney}
          onChange={(e) =>
            setForm({ ...form, tokenMoney: Number(e.target.value) })
          }
          onBlur={(e) => {
            const cleaned = e.target.value.replace(/^0+(?!$)/, "");
            const finalValue = cleaned ? Number(cleaned) : 0;
            setForm({ ...form, tokenMoney: finalValue });
          }}
          placeholder="Ví dụ: 200000"
        />
      </div>

      {isEditing && ["available", "unavailable"].includes(form.status) && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Trạng thái <span className="text-red-500">*</span> </label>
          <Select
            value={form.status}
            onValueChange={(v) => {
              setForm({ ...form, status: v });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {PET_STATUSES.map(({ value, label }) => (
                <SelectItem
                  key={value}
                  value={value}
                  disabled={!["unavailable", "available"].includes(value)}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="col-span-full">
        <label className="text-sm font-medium">Tiểu sử</label>
        <Textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Nhập mô tả..."
        />
      </div>
      <div className="col-span-full">
        <PetPhotoUpload
          photos={form.photos}
          setPhotos={(photos) =>
            setForm((prev: PetFormState) => ({ ...prev, photos }))
          }
          setForm={setForm}
          speciesList={speciesList}
          breedList={breedList}
        />
      </div>

      {/* <div className="col-span-full">
        <PetImageAIButton
          imageUrl={form.photos[0]}
          setForm={setForm}
          speciesList={speciesList}
          setSpeciesList={setSpeciesList}
          breedList={breedList}
          setBreedList={setBreedList}
          colorSuggestions={colorSuggestions}
        />
      </div> */}
      <Separator className="col-span-full my-2 " />

      <div className="col-span-full flex justify-end">
        <Button type="submit" className="w-40">
          {isEditing ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}
