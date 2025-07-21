import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePetApi } from "@/apis/pet.api";
import { Copy } from "lucide-react";
import imageCompression from "browser-image-compression";

interface Props {
  imageUrl: string;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  speciesList: any[];
  breedList: any[];
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
    return speciesList.find((s) => s.name.toLowerCase().trim() === normalized);
  };

  const getMatchedBreed = (
    breedRaw: string | undefined,
    description: string | undefined
  ) => {
    return breedList.find(
      (b) =>
        b.name.toLowerCase() === breedRaw?.toLowerCase() ||
        description?.toLowerCase().includes(b.name.toLowerCase())
    );
  };
  const getMatchedColors = (rawColor: string | undefined) => {
    if (!rawColor) return [];
    const extractedColors = rawColor
      .split(/[,;]/)
      .map((c) => c.trim().toLowerCase());
    return colorSuggestions.filter((color) =>
      extractedColors.some(
        (c) =>
          color.toLowerCase().includes(c) || c.includes(color.toLowerCase())
      )
    );
  };

  const mapResultToForm = (
    result: any,
    matchedSpecies: any,
    matchedBreed: any
  ) => {
    const colorArray = getMatchedColors(result.color);

    setForm((prev: any) => ({
      ...prev,
      age: result.age || prev.age,
      weight: result.weight || prev.weight,
      color: colorArray.join(", ") || prev.color,
      identificationFeature:
        result.identificationFeature || prev.identificationFeature,
      species: matchedSpecies?._id || prev.species,
      breeds: matchedBreed ? [matchedBreed._id] : prev.breeds,
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
      const matchedBreed = getMatchedBreed(result.breed, result.description);

      let hasError = false;
      if (!matchedSpecies) {
        setSpeciesError(`Loài: ${result.species || "[Chưa xác định]"}`);
        hasError = true;
      }
      if (!matchedBreed) {
        setBreedError(
          `Loài: ${result.species || "[Chưa xác định]"}\nGiống: ${
            result.breed || "[Chưa xác định]"
          }`
        );
        hasError = true;
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

      {speciesError && (
        <ErrorSuggestion
          title="Loài chưa có trong hệ thống"
          content={speciesError}
          onCopy={() =>
            handleCopy(
              `Kính thưa Quản trị viên,\n\nTôi muốn đề xuất thêm loài thú nuôi mới:\n${speciesError}\n\nTrân trọng,`
            )
          }
        />
      )}

      {breedError && (
        <ErrorSuggestion
          title="Giống chưa có trong hệ thống"
          content={breedError}
          onCopy={() =>
            handleCopy(
              `Kính thưa Quản trị viên,\n\nTôi muốn đề xuất thêm giống thú nuôi mới:\n${breedError}\n\nTrân trọng,`
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
