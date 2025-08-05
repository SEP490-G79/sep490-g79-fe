import React from "react";
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

  const validateForm = () => {
    if (!form.name.trim())
      return toast.error("Tên thú nuôi không được để trống");

    if (!form.species || form.species === "")
      return toast.error("Vui lòng chọn hoặc thêm loài");

    if (!form.color.trim()) return toast.error("Màu lông không được để trống");

    if (/^\d+$/.test(form.color.trim()))
      return toast.error("Màu lông không được chỉ là số");

    if (!form.age || Number(form.age) < 0)
      return toast.error("Tuổi không hợp lệ");

    if (!form.weight || Number(form.weight) <= 0)
      return toast.error("Cân nặng không hợp lệ");

    if (form.photos.length === 0)
      return toast.error("Vui lòng chọn ít nhất 1 ảnh");

    return true;
  };

  const fetchPets = async () => {
    if (!shelterId) return;

    const res = await getAllPets(shelterId, pagination.page, pagination.limit);
    setData(res.data.pets || []);
    setPagination((prev) => ({
      ...prev,
      total: res.data.total,
      page: res.data.page,
      limit: res.data.limit,
    }));
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
    }
  };
  return (
    <div className="w-full p-6">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button
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
          Thêm thú nuôi
        </Button>
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
          .then(()=>{
            toast.success("Xóa thành công");
            fetchPets();
          })
          .catch((err)=>{
            toast.error(err?.response?.data?.message || "Lỗi khi xóa thú nuôi!")
          })
          
        }}
        onView={(pet) => {
          setDetailPet(pet);
        }}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl min-w-[900px] w-full bg-background text-foreground">
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
