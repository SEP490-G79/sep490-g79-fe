import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PetFormState } from "@/types/pet.types";
import { Copy, Sparkles, Wand } from "lucide-react";
import imageCompression from "browser-image-compression";
import { usePetApi } from "@/apis/pet.api";
import type { Species, Breed } from "@/types/pet.types";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { mockColors } from "@/types/Corlor";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  imageUrl: string;
  setForm: React.Dispatch<React.SetStateAction<PetFormState>>;
  speciesList: Species[];
  breedList: Breed[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PetImageAIButton({
  imageUrl,
  setForm,
  speciesList,
  breedList,
  setIsLoading,
}: Props) {
  const { analyzePetImage } = usePetApi();
  const [speciesError, setSpeciesError] = useState<string | null>(null);
  const [breedError, setBreedError] = useState<string | null>(null);
  const authAxios = useAuthAxios();
  const { coreAPI } = useContext(AppContext);

  // const compressAndConvertToBase64 = async (blob: Blob): Promise<string> => {
  //   const file = new File([blob], "image.jpg", { type: blob.type });
  //   const compressedFile = await imageCompression(file, {
  //     maxSizeMB: 0.2,
  //     maxWidthOrHeight: 800,
  //     useWebWorker: true,
  //   });

  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(compressedFile);
  //     reader.onloadend = () => {
  //       const base64 = (reader.result as string).split(",")[1];
  //       resolve(base64);
  //     };
  //     reader.onerror = reject;
  //   });
  // };
  // const colorSuggestions = [
  //   "Trắng",
  //   "Đen",
  //   "Nâu",
  //   "Nâu socola",
  //   "Vàng kem",
  //   "Kem",
  //   "Nâu vàng nhạt",
  //   "Nâu rám",
  //   "Xám",
  //   "Xám xanh",
  //   "Xanh lam",
  //   "Đỏ",
  //   "Cam",
  //   "Vàng",
  //   "Vàng mơ",
  //   "Bạc",
  //   "Loang sọc",
  //   "Loang chấm",
  //   "Đen pha nâu",
  //   "Tam thể",
  //   "Vằn mèo",
  //   "Mai rùa",
  //   "Hai màu",
  //   "Ba màu",
  //   "Nâu đậm",
  //   "Tím nhạt",
  //   "Quế",
  //   "Be",
  //   "Trắng ngà",
  //   "Đen trắng kiểu vest",
  //   "Thân nhạt, mặt đậm",
  //   "Vằn mặt, tai",
  //   "Khói",
  //   "Loang đều",
  //   "Trắng với mặt và đuôi có màu",
  //   "Đốm trắng lớn",
  //   "Nâu tự nhiên",
  //   "Champagne",
  //   "Bạch tạng",
  //   "Chân trắng, mặt màu",
  //   "Xám than",
  //   "Nâu gỉ",
  //   "Nâu gụ",
  //   "Nâu gan",
  //   "Hồng đào",
  //   "Xám tro",
  //   "Xanh rêu",
  //   "Trắng tuyết",
  //   "Đồng đỏ",
  //   "Xám thép",
  //   "Hổ phách",
  //   "Xám rêu",
  //   "Hồng tro",
  //   "Bạch kim",
  //   "Đen tuyền",
  // ];

  // const getMatchedSpecies = (speciesRaw: string | undefined) => {
  //   const normalized = speciesRaw?.toLowerCase().trim();
  //   return (speciesList as Species[]).find(
  //     (s) => s.name.toLowerCase().trim() === normalized
  //   );
  // };

  // const getMatchedBreed = (breedRaw: string | undefined) => {
  //   const normalizedBreed = breedRaw?.toLowerCase().trim();
  //   return (breedList as Breed[]).find(
  //     (b) => b.name.toLowerCase().trim() === normalizedBreed
  //   );
  // };

  // const getMatchedColors = (rawColor: string | string[] | undefined) => {
  //   if (!rawColor) return [];
  //   const extractedColors = Array.isArray(rawColor)
  //     ? rawColor.map((c) => c.trim().toLowerCase())
  //     : rawColor.split(/[,;]/).map((c) => c.trim().toLowerCase());

  //   return colorSuggestions.filter((color) =>
  //     extractedColors.includes(color.toLowerCase())
  //   );
  // };

  // const mapResultToForm = (
  //   result: unknown,
  //   matchedSpecies: Species | undefined,
  //   matchedBreed: Breed | undefined
  // ) => {
  //   const r = result as AnalyzeResult;
  //   const colorArray = getMatchedColors(r.color);

  //   setForm((prev: PetFormState) => ({
  //     ...prev, // giữ những field không liên quan như photos
  //     species: matchedSpecies?._id ?? "",
  //     breeds: matchedBreed ? [matchedBreed._id] : [],
  //     age: r.age !== undefined ? String(r.age) : "",
  //     weight: r.weight !== undefined ? String(r.weight) : "",
  //     color: colorArray.join(", "),
  //     identificationFeature: r.identificationFeature ?? "",
  //   }));
  // };

  // const handleAnalyze = async () => {
  //   setSpeciesError(null);
  //   setBreedError(null);

  //   if (!imageUrl) return toast.error("Vui lòng chọn ảnh trước");
  //   toast.info(
  //     "Lưu ý: Phân tích AI chỉ mang tính gợi ý, cần xác minh lại thông tin."
  //   );

  //   try {
  //     const res = await fetch(imageUrl);
  //     const blob = await res.blob();
  //     const base64 = await compressAndConvertToBase64(blob);
  //     const result = await analyzePetImage(base64);

  //     if (!result) return toast.error("Không thể phân tích ảnh.");

  //     const matchedSpecies = getMatchedSpecies(result.species);
  //     const matchedBreed = getMatchedBreed(result.breed);

  //     let hasError = false;

  //     if (!matchedSpecies) {
  //       setSpeciesError(result.species || "[Chưa xác định]");
  //       setBreedError(null); // Đừng báo giống nếu loài đã sai
  //       hasError = true;
  //     } else if (!matchedBreed) {
  //       setSpeciesError(null); // Loài đúng rồi thì không cần báo nữa
  //       setBreedError(result.breed || "[Chưa xác định]");
  //       hasError = true;
  //     } else {
  //       setSpeciesError(null);
  //       setBreedError(null);
  //     }

  //     if (hasError) {
  //       toast.warning(
  //         "Một số thông tin AI chưa có trong hệ thống. Hãy kiểm tra lại."
  //       );
  //     } else {
  //       toast.success(
  //         "Phân tích AI hoàn tất! Vui lòng kiểm tra lại thông tin."
  //       );
  //     }

  //     mapResultToForm(result, matchedSpecies, matchedBreed);
  //   } catch (err) {
  //     console.error("GPT ANALYZE ERROR:", err);
  //     toast.error(
  //       "Phân tích AI thất bại, ảnh phải là thú cưng và chỉ có một con."
  //     );
  //   }
  // };

  const handleAnalyze = async () => {
    if (!imageUrl) return toast.error("Vui lòng chọn ảnh trước");
    toast.info(
      "Lưu ý: Phân tích AI chỉ mang tính gợi ý, cần xác minh lại thông tin."
    );
    setIsLoading(true);
    await authAxios
      .post(`${coreAPI}/pets/ai-analyze`, {
        imageRaw: imageUrl,
        colorsList: mockColors,
      })
      .then((res) => {
        // console.log(res);
        toast.success("Phân tích thành công!");
        const speciesRaw = res.data.species;
        const breedRaw = res.data.breeds[0];

        const matchedSpecies = speciesList?.find(
          (s) => s.name.toUpperCase() == speciesRaw.toUpperCase()
        );
        const matchedBreed = breedList?.find(
          (s) => s.name.toUpperCase() == breedRaw.toUpperCase()
        );
        // console.log(matchedSpecies);
        // console.log(matchedBreed);

          // --- Chuẩn hóa colors từ AI ---
  const aiColorsRaw = Array.isArray(res.data.colors)
    ? res.data.colors
    : String(res.data.colors || "")
        .split(/[;,]/)
        .map((c: string) => c.trim())
        .filter(Boolean);

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // mockColors: danh sách màu chuẩn (bạn đã import)
  const allowedNorm = new Set(mockColors.map((c) => normalize(c)));

  // Map từng màu AI -> màu chuẩn trong mockColors (theo so khớp không dấu, không hoa/thường)
  const mapped: string[] = [];
  for (const c of aiColorsRaw) {
    const n = normalize(c);
    if (!allowedNorm.has(n)) continue;
    // tìm lại label gốc chuẩn để hiển thị đúng
    const original = mockColors.find((m) => normalize(m) === n)!;
    if (!mapped.includes(original)) mapped.push(original);
    if (mapped.length === 2) break; // tối đa 2 màu
  }

        setForm((prev: PetFormState) => ({
          ...prev,
          species: matchedSpecies?._id ?? "",
          breeds: matchedBreed ? [matchedBreed._id] : [],
          age: res.data.age ? String(res.data.age) : "",
          weight: res.data.weight ? String(res.data.weight) : "",
          color: mapped.join(", "),       
          identificationFeature: res.data.identificationFeature ?? "",
        }));
      })
      .catch((err) => {
        // console.log(err?.response?.data?.message || "Lỗi chưa xác định!");
        if (err) {
          const errMessage = err?.response?.data?.message;

          const speciesMatch = errMessage.match(/Loài\s+'([^']+)'/);
          const species = speciesMatch ? speciesMatch[1] : null;

          const breedMatch = errMessage.match(/Giống\s+'([^']+)'/);
          const breed = breedMatch ? breedMatch[1] : null;

          setBreedError(breed);
          setSpeciesError(species);

          toast.error(err?.response?.data?.message || "Lỗi chưa xác định!");
          setTimeout(() => {
            displayNotFound(species,breed);
          }, 1000);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };

  const openGmailCompose = (to: string | string[], subject = "", body = "") => {
    const toStr = Array.isArray(to) ? to.join(",") : to;
    const url =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(toStr)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body.slice(0, 2000))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Đã sao chép nội dung email");
  };
  const handleSendMail = ( speciesRaw : string,breedRaw : string) => {
    // Tên shelter của bạn - có thể lấy từ context hoặc props
    // const shelterName = "Paws & Claws Rescue Center";

    // Gom phần đề xuất
    let suggestion = "";
    if (speciesRaw && breedRaw) {
      suggestion = `Tôi muốn đề xuất thêm loài "${speciesRaw}" và giống "${breedRaw}" vào hệ thống.`;
    } else if (speciesRaw) {
      suggestion = `Tôi muốn đề xuất thêm loài "${speciesRaw}" vào hệ thống.`;
    } else if (breedRaw) {
      suggestion = `Tôi muốn đề xuất thêm giống "${breedRaw}" vào hệ thống.`;
    }

    // Nội dung email
    const content =
      `Kính gửi Quản trị viên hệ thống,\n\n` +
      // `Tôi là thành viên của shelter "${shelterName}".\n` +
      `${suggestion}\n\n` +
      `Rất mong quản trị viên xem xét và cập nhật vào hệ thống.\n\n` +
      `Trân trọng!`;

    openGmailCompose(
      "pawsheltersystem@gmail.com",
      "Yêu cầu thêm loài/giống thú nuôi",
      content
    );
  };

  const displayNotFound = (species:string,breed:string) => {
      if (species || breed) {
            toast("Loài hoặc giống chưa được hỗ trợ trong hệ thống!", {
      description: `${species ? `Loài "${species}" chưa được hỗ trợ.`:``}
                    ${breed ? `Giống "${breed}" chưa được hỗ trợ.`:``}
                    Vui lòng liên hệ admin để được thêm mới!
        `,
      action: {
        label: "Gửi mail",
        onClick: ()=>{handleSendMail(species,breed)},
      },
      duration: 10000,
    });
      }
  };


  return (
    // <>
    //   <div className="flex justify-start">
    //     <Button variant="outline" type="button" onClick={handleAnalyze}>
    //       Phân tích AI từ ảnh
    //     </Button>
    //   </div>

    //   <span className="text-xs text-muted-foreground italic">
    //     (*) AI chỉ phân tích dựa trên ảnh đầu tiên được chọn
    //   </span>
    //   <br />
    //   <span className="text-xs text-muted-foreground italic">
    //     (*) AI chỉ phân tích được ảnh chứa một con thú cưng duy nhất
    //   </span>
    //   <br />

    //   <span className="text-xs text-muted-foreground italic">
    //     (*) Nên phân tích AI từ 2-3 lần để đạt độ chính xác cao nhất
    //   </span>
    //   {speciesError && (
    //     <ErrorSuggestion
    //       title="Loài chưa có trong hệ thống"
    //       content={`Loài: ${speciesError}`}
    //       onCopy={() =>
    //         handleCopy(
    //           `Kính thưa Quản trị viên,\n\nTôi muốn đề xuất thêm loài thú nuôi mới:\nLoài: ${speciesError}.\n\nTrân trọng!`
    //         )
    //       }
    //     />
    //   )}

    //   {speciesError === null && breedError && (
    //     <ErrorSuggestion
    //       title="Giống chưa có trong hệ thống"
    //       content={`Giống: ${breedError}`}
    //       onCopy={() =>
    //         handleCopy(
    //           `Kính thưa Quản trị viên,\n\nTôi muốn đề xuất thêm giống thú nuôi mới:\nGiống: ${breedError}\n\nTrân trọng,`
    //         )
    //       }
    //     />
    //   )}
    // </>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="link"
          type="button"
          onClick={handleAnalyze}
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
      <TooltipContent
        side="top"
        className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 text-white border-0"
      >
        <p className="flex">
          <Wand size={"15px"} /> Phân tích ảnh
        </p>
      </TooltipContent>
    </Tooltip>
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
