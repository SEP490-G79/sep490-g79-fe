// File: components/PetForm.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CreatableSelect from "react-select/creatable";
import ReactSelect from "react-select";
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
import { toast } from "sonner";

interface Breed {
  _id: string;
  name: string;
}
interface Species {
  _id: string;
  name: string;
}
interface PetFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  speciesList: Species[];
  setSpeciesList: React.Dispatch<React.SetStateAction<Species[]>>;
  breedList: Breed[];
  setBreedList: React.Dispatch<React.SetStateAction<Breed[]>>;
  onSubmit: (e: React.FormEvent) => void;
  onCreateSpecies: (inputValue: string) => void;
  isEditing: boolean;
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
}: PetFormProps) {
  const filteredBreeds = breedList.filter(
    (b) =>
      b.species === form.species ||
      (typeof b.species === "object" ? b.species._id : b.species) ===
        form.species
  );
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
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
    colorSuggestions.filter((color) =>
      color.toLowerCase().includes(value.toLowerCase())
    );

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tên thú nuôi *</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nhập tên thú nuôi"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tuổi (tháng) *</label>
        <Input
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          placeholder="Tuổi"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Giới tính</label>
        <Select
          value={String(form.isMale)}
          onValueChange={(v) => setForm({ ...form, isMale: v === "true" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Đực</SelectItem>
            <SelectItem value="false">Cái</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Cân nặng (kg) *</label>
        <Input
          type="number"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          placeholder="Nhập cân nặng"
        />
      </div>
      <div className="flex flex-col gap-1 col-span-full md:col-span-1">
        <label className="text-sm font-medium">Màu lông *</label>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={({ value }) =>
            setSuggestions(getSuggestions(value))
          }
          onSuggestionsClearRequested={() => setSuggestions([])}
          getSuggestionValue={(s) => s}
          renderSuggestion={(s) => <span>{s}</span>}
          onSuggestionSelected={(_, { suggestion }) =>
            setForm((prev) => ({ ...prev, color: suggestion }))
          }
          inputProps={{
            placeholder: "Nhập màu lông...",
            value: form.color,
            onChange: (_: any, { newValue }: { newValue: string }) =>
              setForm((prev) => ({ ...prev, color: newValue })),
          }}
          theme={{
            input:
              "w-full px-3 py-2 rounded-md border border-input bg-background text-sm",
            suggestionsContainer:
              "z-50 absolute bg-white border mt-1 rounded shadow-md",
            suggestion: "px-4 py-2 hover:bg-gray-100 cursor-pointer",
            suggestionHighlighted: "bg-muted",
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Đặc điểm nhận dạng</label>
        <Input
          value={form.identificationFeature}
          onChange={(e) =>
            setForm({ ...form, identificationFeature: e.target.value })
          }
          placeholder="Nhập đặc điểm..."
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Triệt sản</label>
        <Select
          value={String(form.sterilizationStatus)}
          onValueChange={(v) =>
            setForm({ ...form, sterilizationStatus: v === "true" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Đã triệt sản</SelectItem>
            <SelectItem value="false">Chưa triệt sản</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 col-span-full">
        <label className="text-sm font-medium">Loài *</label>
        <CreatableSelect
          isClearable
          placeholder="Chọn hoặc thêm loài mới..."
          value={
            speciesList.find((s) => s._id === form.species)
              ? {
                  value: form.species,
                  label: speciesList.find((s) => s._id === form.species)?.name,
                }
              : null
          }
          options={speciesList.map((s) => ({ value: s._id, label: s.name }))}
          onChange={(option) =>
            setForm({
              ...form,
              species: option ? option.value : "",
              breeds: [],
            })
          }
          onCreateOption={onCreateSpecies}
        />
      </div>
      <div className="flex flex-col gap-1 col-span-full">
        <label className="text-sm font-medium">Giống (tối đa 2)</label>
        <ReactSelect
          isMulti
          placeholder={
            form.species
              ? "Chọn giống thuộc loài đã chọn..."
              : "Vui lòng chọn loài trước"
          }
          isDisabled={!form.species}
          value={breedList
            .filter((b) => form.breeds?.includes(b._id))
            .map((b) => ({ value: b._id, label: b.name }))}
          options={breedList
            .filter(
              (b) =>
                b.species === form.species ||
                (typeof b.species === "object" ? b.species._id : b.species) ===
                  form.species
            )
            .map((b) => ({ value: b._id, label: b.name }))}
          onChange={(options) => {
            if (options.length > 2) {
              toast.error("Chỉ được chọn tối đa 2 giống.");
              return;
            }
            setForm({
              ...form,
              breeds: options.map((o) => o.value),
            });
          }}
        />
      </div>

      <div className="col-span-full">
        <label className="text-sm font-medium">Mô tả</label>
        <Textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Nhập mô tả..."
        />
      </div>
      <div className="col-span-full">
        <PetPhotoUpload
          photos={form.photos}
          setPhotos={(photos) => setForm((prev) => ({ ...prev, photos }))}
        />
      </div>

      <div className="col-span-full">
        <PetImageAIButton
          imageUrl={form.photos[0]}
          setForm={setForm}
          speciesList={speciesList}
          setSpeciesList={setSpeciesList}
          breedList={breedList}
          setBreedList={setBreedList}
        />
      </div>

      <div className="col-span-full flex justify-end">
        <Button type="submit" className="w-40">
          {isEditing ? "Cập nhật" : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}
