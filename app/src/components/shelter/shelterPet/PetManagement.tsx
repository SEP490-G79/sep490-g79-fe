import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import PetForm from "./PetForm";
import PetDetailDialog from "./PetDetailDialog";
import PetTable from "./PetTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePetApi } from "@/apis/pet.api";
import type { Pet } from "@/types/Pet";
import type { Breed, PetFormState, Species } from "@/types/pet.types";
import axios from "axios";
import { Plus, PlusSquare, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PetManagement() {
  const {
    getAllPets,
    createPet,
    updatePet,
    disablePet,
    getAllSpecies,
    getAllBreeds,
  } = usePetApi();

  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const { shelterId } = useParams<{ shelterId: string }>();
  const [data, setData] = React.useState<Pet[]>([]);
  const [speciesList, setSpeciesList] = React.useState<Species[]>([]);
  const [breedList, setBreedList] = React.useState<Breed[]>([]);
  const [form, setForm] = React.useState<PetFormState>({
    name: "",
    photos: [],
    age: "",
    isMale: true,
    weight: "",
    color: "",
    tokenMoney: 0,
    identificationFeature: "",
    sterilizationStatus: false,
    bio: "",
    status: "unavailable",
    species: "",
    breeds: [],
    shelter: shelterId || "", // nếu bạn cần thêm shelter
  });
  const [showForm, setShowForm] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [detailPet, setDetailPet] = React.useState<Pet | null>(null);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [isLoading, setIsloading] = useState(false);
  const validateForm = () => {
    // --- Name ---
    const name = (form.name ?? "").trim();
    if (!name) return toast.error("Tên thú nuôi không được để trống");

    // Regex: chỉ cho phép chữ cái (có dấu tiếng Việt) và khoảng trắng
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!nameRegex.test(name)) {
      return toast.error("Tên thú nuôi chỉ được chứa chữ cái và khoảng trắng");
    }

    if (name.length < 2)
      return toast.error("Tên thú nuôi phải có ít nhất 2 ký tự");
    if (name.length > 60) return toast.error("Tên thú nuôi tối đa 60 ký tự");

    // --- Species ---
    if (!form.species || String(form.species).trim() === "")
      return toast.error("Vui lòng chọn hoặc thêm loài");

    // --- Breeds
    if (Array.isArray(form.breeds) && form.breeds.length > 2)
      return toast.error("Bạn chỉ có thể chọn tối đa 2 giống");

    // --- Color
    const colorRaw = (form.color ?? "").trim();
    if (!colorRaw) return toast.error("Màu lông không được để trống");
    if (/^\d+$/.test(colorRaw))
      return toast.error("Màu lông không được chỉ là số");
    const colors = colorRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (colors.length > 2)
      return toast.error("Chỉ chọn tối đa 2 màu (ngăn cách bằng dấu phẩy)");

    // --- Age (tháng)
    const hasAge =
      form.age !== undefined &&
      form.age !== null &&
      String(form.age).trim() !== "";
    if (hasAge) {
      const ageNum = Number(form.age);
      if (!Number.isInteger(ageNum))
        return toast.error("Tuổi (tháng) phải là số nguyên");
      if (ageNum < 0) return toast.error("Tuổi (tháng) phải lớn hơn 0!");
    }

    // --- Weight (kg)
    if (
      form.weight === undefined ||
      form.weight === null ||
      String(form.weight).trim() === ""
    )
      return toast.error("Thiếu cân nặng");
    const weightNum = Number(form.weight);
    if (!Number.isFinite(weightNum)) return toast.error("Cân nặng phải là số");
    if (weightNum <= 0) return toast.error("Cân nặng không hợp lệ ");

    // --- Token Money ---
    const tokenMoneyNum = Number(form.tokenMoney);
    if (tokenMoneyNum && !Number.isFinite(tokenMoneyNum))
      return toast.error("Số tiền đặt cọc phải là số");
    if (tokenMoneyNum && tokenMoneyNum < 0)
      return toast.error("Số tiền đặt cọc không được âm");
    if (tokenMoneyNum && tokenMoneyNum > 1_000_000_000)
      return toast.error("Số tiền đặt cọc vượt quá giới hạn cho phép");

    // --- Photos ---
    if (!Array.isArray(form.photos) || form.photos.length === 0)
      return toast.error("Vui lòng chọn ít nhất 1 ảnh");

    return true;
  };

  const fetchPets = async () => {
    if (!shelterId) return;
    setIsloading(true)
    try{
      const res = await getAllPets(shelterId, pagination.page, pagination.limit);
      setData(res.data.pets || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit,
      }));
    }catch(err){
      console.log(err);
      
    }finally{
      setTimeout(() => {
        setIsloading(false)
      }, 200);
    }
    
  };

  const handleCreateSpecies = async (inputValue: string) => {
    const res = await fetch("/species/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: inputValue }),
    });
    if (res.ok) {
      const newSpecies = await res.json();
      setSpeciesList((prev) => [...prev, newSpecies]);
      setForm((prev) => ({ ...prev, species: newSpecies._id }));
    }
  };
  React.useEffect(() => {
    if (shelterId) {
      fetchPets();
    }
  }, [shelterId, pagination.page]);

  React.useEffect(() => {
    const fetchSpeciesAndBreeds = async () => {
      try {
        const [speciesRes, breedRes] = await Promise.all([
          getAllSpecies(),
          getAllBreeds(),
        ]);
        setSpeciesList(speciesRes.data);
        setBreedList(breedRes.data);
      } catch {
        toast.error("Không thể lấy danh sách loài hoặc giống");
      }
    };

    fetchSpeciesAndBreeds();
  }, []);

  const filteredData = data.filter((pet) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      pet.name?.toLowerCase().includes(keyword) ||
      pet.petCode?.toLowerCase().includes(keyword)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() !== true) return;

    const payload = {
      ...form,
      shelter:
        typeof form.shelter === "object" ? form.shelter._id : form.shelter,

      age: Number(form.age),
      weight: Number(form.weight),
    };
    setIsloading(true);
    try {
      if (!shelterId) {
        toast.error("Không tìm thấy ShelterId");
        return;
      }
      if (isEditing && form._id) {
        const payload = {
          ...form,
          shelter: shelterId, // đảm bảo gửi đúng shelter đang thao tác
          age: Number(form.age),
          weight: Number(form.weight),
        };
        await updatePet(form._id, shelterId, payload);

        toast.success("Cập nhật thành công");
      } else {
        await createPet(shelterId, payload);
        toast.success("Tạo mới thành công");
      }
      fetchPets();
      setShowForm(false);
      setForm({
        name: "",
        photos: [],
        age: "",
        isMale: true,
        weight: "",
        color: "",
        tokenMoney: 0,
        identificationFeature: "",
        sterilizationStatus: false,
        bio: "",
        status: "unavailable",
        species: "",
        breeds: [],
      });
    } catch (err: unknown) {
      let message = "Đã có lỗi xảy ra";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.error || err.response?.data?.message || message;
      }

      toast.error(message);
    } finally {
      setTimeout(() => {
        setIsloading(false);
      }, 200);
    }
  };

  if(isLoading){
    return(
      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <Skeleton className="h-10 w-1/3 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        <div className="rounded-md border">
          <div className="flex px-4 py-2 border-b">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-24 mr-4 last:mr-0 rounded" />
            ))}
          </div>

          <div>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="flex px-4 py-3 items-center border-b last:border-0"
              >
                {Array.from({ length: 6 }).map((__, cellIdx) => (
                  <Skeleton
                    key={cellIdx}
                    className="h-4 w-20 mr-4 last:mr-0 rounded"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
          <Skeleton className="h-6 w-32 rounded" />
        </div>
      </div>
    )
  }
  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center py-4 gap-2">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="basis-1/3"
        />
        <div className="basis-1/3 flex justify-end gap-3">
          <Button
            className="cursor-pointer"
            variant={"ghost"}
            onClick={fetchPets}
          >
            <RefreshCcw />
          </Button>
          <Button
            className="text-xs cursor-pointer"
            variant={"ghost"}
            onClick={() => {
              // Nếu danh sách chưa có, chờ đến khi fetch xong
              if (speciesList.length === 0 || breedList.length === 0) {
                toast.warning("Đang tải dữ liệu loài và giống...");
                return;
              }

              setForm({
                name: "",
                photos: [],
                age: "",
                isMale: true,
                weight: "",
                tokenMoney: 0,
                color: "",
                identificationFeature: "",
                sterilizationStatus: false,
                bio: "",
                status: "unavailable",
                species: "",
                breeds: [],
              });
              setIsEditing(false);
              setShowForm(true);
            }}
          >
            <PlusSquare className="text-(--primary)" /> Thêm hồ sơ
          </Button>
        </div>
      </div>
      <PetTable
        data={filteredData}
        total={pagination.total}
        page={pagination.page}
        limit={pagination.limit}
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
        onEdit={(pet) => {
          const normalizedPet: PetFormState = {
            _id: pet._id,
            name: pet.name ?? "",
            isMale: pet.isMale ?? true,
            age: String(pet.age ?? ""),
            weight: String(pet.weight ?? ""),
            color: pet.color ?? "",
            identificationFeature: pet.identificationFeature ?? "",
            sterilizationStatus: pet.sterilizationStatus ?? false,
            status: pet.status ?? "unavailable",
            species:
              typeof pet.species === "object"
                ? pet.species._id
                : pet.species ?? "",
            breeds: Array.isArray(pet.breeds)
              ? pet.breeds.map((b) => (typeof b === "object" ? b._id : b))
              : [],
            bio: pet.bio ?? "",
            photos: pet.photos ?? [],
            shelter:
              typeof pet.shelter === "object"
                ? pet.shelter._id
                : pet.shelter ?? "",
            tokenMoney: pet.tokenMoney ?? 0, // ✅ thêm dòng này
          };

          setForm(normalizedPet);
          setShowForm(true);
          setIsEditing(true);
        }}
        onDelete={async (id) => {
          if (!shelterId) {
            toast.error("Không tìm thấy ShelterId");
            return;
          }
          await disablePet(id, shelterId)
            .then(() => {
              toast.success("Xóa thành công");
              fetchPets();
            })
            .catch((err) => {
              toast.error(
                err?.response?.data?.message || "Lỗi khi xóa thú nuôi!"
              );
            });
        }}
        onView={(pet) => {
          setDetailPet(pet);
        }}
      />

      <Dialog open={showForm} modal={false} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl min-w-3xl  w-full bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              {isEditing ? "Cập nhật thú nuôi" : "Thêm thú nuôi"}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[75vh] overflow-y-auto pr-2">
            {speciesList.length > 0 && breedList.length > 0 && (
              <PetForm
                form={form}
                setForm={setForm}
                speciesList={speciesList}
                setSpeciesList={setSpeciesList}
                breedList={breedList}
                setBreedList={setBreedList}
                onSubmit={handleSubmit}
                onCreateSpecies={handleCreateSpecies}
                isEditing={isEditing}
                isLoading={isLoading}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {detailPet && (
        <PetDetailDialog
          open={!!detailPet}
          onClose={() => setDetailPet(null)}
          pet={detailPet}
        />
      )}
    </div>
  );
}
