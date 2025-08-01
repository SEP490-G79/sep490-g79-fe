import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PetFormState } from "@/types/pet.types";
import { Copy } from "lucide-react";
import imageCompression from "browser-image-compression";
import { usePetApi } from "@/apis/pet.api";
import type { Species, Breed, AnalyzeResult } from "@/types/pet.types";

interface Props {
  imageUrl: string;
  setForm: React.Dispatch<React.SetStateAction<PetFormState>>;
  speciesList: Species[];
  setSpeciesList: React.Dispatch<React.SetStateAction<Species[]>>;
  breedList: Breed[];
  setBreedList: React.Dispatch<React.SetStateAction<Breed[]>>;
  colorSuggestions: string[];
}

export default function PetImageAIButton({
  imageUrl,
  setForm,
  speciesList,
  breedList,
}: Props) {
  const { analyzePetImage } = usePetApi();
  const [speciesError, setSpeciesError] = useState<string | null>(null);
  const [breedError, setBreedError] = useState<string | null>(null);

  const compressAndConvertToBase64 = async (blob: Blob): Promise<string> => {
    const file = new File([blob], "image.jpg", { type: blob.type });
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };
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

  const getMatchedSpecies = (speciesRaw: string | undefined) => {
    const normalized = speciesRaw?.toLowerCase().trim();
    return (speciesList as Species[]).find(
      (s) => s.name.toLowerCase().trim() === normalized
    );
  };

  const getMatchedBreed = (breedRaw: string | undefined) => {
    const normalizedBreed = breedRaw?.toLowerCase().trim();
    return (breedList as Breed[]).find(
      (b) => b.name.toLowerCase().trim() === normalizedBreed
    );
  };

  const getMatchedColors = (rawColor: string | string[] | undefined) => {
    if (!rawColor) return [];
    const extractedColors = Array.isArray(rawColor)
      ? rawColor.map((c) => c.trim().toLowerCase())
      : rawColor.split(/[,;]/).map((c) => c.trim().toLowerCase());

    return colorSuggestions.filter((color) =>
      extractedColors.includes(color.toLowerCase())
    );
  };

  const mapResultToForm = (
    result: unknown,
    matchedSpecies: Species | undefined,
    matchedBreed: Breed | undefined
  ) => {
    const r = result as AnalyzeResult;
    const colorArray = getMatchedColors(r.color);

    setForm((prev: PetFormState) => ({
      ...prev, // giữ những field không liên quan như photos
      species: matchedSpecies?._id ?? "",
      breeds: matchedBreed ? [matchedBreed._id] : [],
      age: r.age !== undefined ? String(r.age) : "",
      weight: r.weight !== undefined ? String(r.weight) : "",
      color: colorArray.join(", "),
      identificationFeature: r.identificationFeature ?? "",
    }));
  };

  const handleAnalyze = async () => {
    setSpeciesError(null);
    setBreedError(null);

    if (!imageUrl) return toast.error("Vui lòng chọn ảnh trước");
    toast.info(
      "Lưu ý: Phân tích AI chỉ mang tính gợi ý, cần xác minh lại thông tin."
    );

    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const base64 = await compressAndConvertToBase64(blob);
      const result = await analyzePetImage(base64);

      if (!result) return toast.error("Không thể phân tích ảnh.");

      const matchedSpecies = getMatchedSpecies(result.species);
      const matchedBreed = getMatchedBreed(result.breed);

      let hasError = false;

      if (!matchedSpecies) {
        setSpeciesError(result.species || "[Chưa xác định]");
        setBreedError(null); // Đừng báo giống nếu loài đã sai
        hasError = true;
      } else if (!matchedBreed) {
        setSpeciesError(null); // Loài đúng rồi thì không cần báo nữa
        setBreedError(result.breed || "[Chưa xác định]");
        hasError = true;
      } else {
        setSpeciesError(null);
        setBreedError(null);
      }

      if (hasError) {
        toast.warning(
          "Một số thông tin AI chưa có trong hệ thống. Hãy kiểm tra lại."
        );
      } else {
        toast.success(
          "Phân tích AI hoàn tất! Vui lòng kiểm tra lại thông tin."
        );
      }

      mapResultToForm(result, matchedSpecies, matchedBreed);
    } catch (err) {
      console.error("GPT ANALYZE ERROR:", err);
      toast.error(
        "Phân tích AI thất bại, ảnh phải là thú cưng và chỉ có một con."
      );
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Đã sao chép nội dung email");
  };

  return (
    <>
      <div className="flex justify-start">
        <Button variant="outline" type="button" onClick={handleAnalyze}>
          Phân tích AI từ ảnh
        </Button>
      </div>

      <span className="text-xs text-muted-foreground italic">
        (*) AI chỉ phân tích dựa trên ảnh đầu tiên được chọn
      </span>
      <br />
      <span className="text-xs text-muted-foreground italic">
        (*) AI chỉ phân tích được ảnh chứa một con thú cưng duy nhất
      </span>
      <br />

      <span className="text-xs text-muted-foreground italic">
        (*) Nên phân tích AI từ 2-3 lần để đạt độ chính xác cao nhất
      </span>
      {speciesError && (
        <ErrorSuggestion
          title="Loài chưa có trong hệ thống"
          content={`Loài: ${speciesError}`}
          onCopy={() =>
            handleCopy(
              `Kính thưa Quản trị viên,\n\nTôi muốn đề xuất thêm loài thú nuôi mới:\nLoài: ${speciesError}.\n\nTrân trọng!`
            )
          }
        />
      )}

      {speciesError === null && breedError && (
        <ErrorSuggestion
          title="Giống chưa có trong hệ thống"
          content={`Giống: ${breedError}`}
          onCopy={() =>
            handleCopy(
              `Kính thưa Quản trị viên,\n\nTôi muốn đề xuất thêm giống thú nuôi mới:\nGiống: ${breedError}\n\nTrân trọng,`
            )
          }
        />
      )}
    </>
  );
}

function ErrorSuggestion({
  title,
  content,
  onCopy,
}: {
  title: string;
  content: string;
  onCopy: () => void;
}) {
  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-md p-3 mt-4 text-sm">
      <p className="font-semibold text-yellow-700 mb-1">{title}</p>
      <p className="text-yellow-800 whitespace-pre-line">{content}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={onCopy}
      >
        <Copy className="w-4 h-4 mr-1" />
        Sao chép nội dung gửi cho quản trị viên
      </Button>
    </div>
  );
}
