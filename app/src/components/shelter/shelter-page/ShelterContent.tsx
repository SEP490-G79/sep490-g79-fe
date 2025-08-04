import PetCard from "@/components/landing-page/PetCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShelterPosts from "../shelter-post/ShelterPost";
import Blogs from "./shelter-blog/Blogs";
import AppContext from "@/context/AppContext";
import { useContext, useState, useEffect,useMemo } from "react";
import type { Pet } from "@/types/Pet";
import type { FilterState } from "@/components/pet/FilterSectionForShelter";
import type { Breed } from "@/types/Breed";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import FilterSectionForShelter from "@/components/pet/FilterSectionForShelter";
import { useParams } from "react-router-dom";



function PaginationSection({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        />
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        />
      </PaginationContent>
    </Pagination>
  );
}


function ShelterContent() {
  const { petsList,userProfile } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const { shelterId } = useParams<{ shelterId: string }>();
  const [filters, setFilters] = useState<FilterState>({
    species: [],
    breed: [],
    gender: "",
    color: [],
    ageRange: [0, 100],
    weightRange: [0, 100],
    priceRange: [0, Infinity],
    inWishlist: false,
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;


  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const filteredByShelterPets = useMemo(() => {
  if (!shelterId) return petsList;
  return petsList.filter((pet: Pet) => pet.shelter?._id === shelterId);
}, [petsList, shelterId]);

  const filteredPets = useMemo<Pet[]>(() => {
    setIsLoading(true);
    //  Normalize & tokenize
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const rawStopWords = [
      "tôi",
      "muốn",
      "tìm",
      "một",
      "bạn",
      "con",
      "cần",
      "có",
      "em",
      "mình",
      "pet",
      "đến",
      "cho",
      "của",
      "ở",
      "với",
      "để",
      "nữa",
      "rồi",
      "và",
      "hoặc",
      "thì",
      "là",
      "màu",
      "mẫu",
      "giống",
      "loài",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ];

    const stopWords = new Set(rawStopWords.map(normalize));
    const tokens = normalize(filters.searchTerm || "")
      .split(/\s+/)
      .map((token) => normalize(token.trim()))
      .filter((token) => token && !stopWords.has(token));

    let filtered = [...filteredByShelterPets];
    const locked: Record<string, string | null> = {
      species: null,
      breed: null,
      color: null,
      gender: null,
      shelter: null,
    };

    //  Lock các trường chính bằng token
    for (const rawTok of tokens) {
      const tok = normalize(rawTok);

      if (
        !locked.species &&
        filtered.some((p) => normalize(p.species?.name || "") === tok)
      ) {
        locked.species = tok;
        filtered = filtered.filter(
          (p) => normalize(p.species?.name || "") === tok
        );
        continue;
      }
      if (
        !locked.breed &&
        filtered.some((p) =>
          p.breeds?.some((b: Breed) => normalize(b.name || "") === tok)
        )
      ) {
        locked.breed = tok;
        filtered = filtered.filter((p) =>
          p.breeds?.some((b: Breed) => normalize(b.name || "") === tok)
        );
        continue;
      }
      if (
        !locked.color &&
        filtered.some((p) => normalize(p.color || "") === tok)
      ) {
        locked.color = tok;
        filtered = filtered.filter((p) => normalize(p.color || "") === tok);
        continue;
      }
      if (
        !locked.gender &&
        (tok === "duc" || tok === "male" || tok === "cai" || tok === "female")
      ) {
        locked.gender = tok === "duc" || tok === "male" ? "male" : "female";
        filtered = filtered.filter(
          (p) => (p.isMale ? "male" : "female") === locked.gender
        );
        continue;
      }
      if (
        !locked.shelter &&
        filtered.some((p) => normalize(p.shelter?.name || "") === tok)
      ) {
        locked.shelter = tok;
        filtered = filtered.filter(
          (p) => normalize(p.shelter?.name || "") === tok
        );
        continue;
      }
    }

    

    // Fallback với các token còn lại
    const fallback = tokens.filter(
      (tok) => !Object.values(locked).includes(tok)
    );

    return filtered.filter((p) => {
      const chip = [
        p.name,
        p.species?.name,
        ...(p.breeds?.map((b: Breed) => b.name) || []),
        p.color,
        p.identificationFeature,
        p.shelter?.name,
        p.shelter?.address,
        p.isMale ? "Đực" : "Cái",
      ]
        .filter(Boolean)
        .map(normalize)
        .join(" ");

      // Nếu fallback token nào không nằm trong chip, bỏ
      if (fallback.some((tok) => !chip.includes(tok))) return false;

      //  Các điều kiện filter khác
      const price = p.tokenMoney ?? 0;
      const isAllPrice =
        filters.priceRange[0] === 0 && filters.priceRange[1] === Infinity;
      const isFree = filters.priceRange[0] === 0 && filters.priceRange[1] === 0;
      if (
        !(
          isAllPrice ||
          (isFree
            ? price === 0
            : price >= filters.priceRange[0] && price <= filters.priceRange[1])
        )
      )
        return false;

      if (filters.inWishlist && !userProfile?.wishList.includes(p._id))
        return false;
      if (p.status !== "available") return false;
      if (
        filters.species.length &&
        !filters.species.includes(p.species?.name || "")
      )
        return false;
      if (
        filters.breed.length &&
        !p.breeds?.some((b: Breed) => filters.breed.includes(b.name || ""))
      )
        return false;
      if (filters.gender && (filters.gender === "male" ? !p.isMale : p.isMale))
        return false;
      // if (filters.color.length && !filters.color.includes(p.color || ""))
      //   return false;
      if (
  Array.isArray(filters.color) &&
  filters.color.length &&
  !filters.color.map(c => c.toLowerCase()).includes((p.color || "").toLowerCase())
)
  return false;


      const age = p.age ?? 0;
      if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
      const weight = p.weight ?? 0;
      if (weight < filters.weightRange[0] || weight > filters.weightRange[1])
        return false;

      setTimeout(() => setIsLoading(false), 500);

      return true;
    });
  }, [filters, petsList, userProfile]);

  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const currentPets: Pet[] = filteredPets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

 useEffect(() => {
  if (!shelterId) return;

  const shelterName = petsList.find((p : Pet) => p.shelter?._id === shelterId)?.shelter?.name;
  if (shelterName) {
    setFilters((prev) => ({
      ...prev,
      shelter: [shelterName],
    }));
  }
}, [shelterId, petsList]);


  return (
    <>
      <div className="min-h-screen">
        <Tabs defaultValue="pets" className="w-full">
          {/* Tab headers */}
          <TabsList className="flex justify-start text-muted-foreground w-full rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="pets"
              className="w-auto data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-b-(--primary) text-secondary rounded-none"
            >
              Pet
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="w-auto data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-b-(--primary) text-secondary rounded-none"
            >
              Bài đăng
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="w-auto data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-b-(--primary) text-secondary rounded-none"
            >
              Blog
            </TabsTrigger>
          </TabsList>

          {/* Tab contents */}
          <TabsContent value="pets" className="pt-4">
             <FilterSectionForShelter
        onChange={handleFiltersChange}
        setIsLoading={setIsLoading}
        pets={filteredByShelterPets}
        userProfile={userProfile}
      />
          {currentPets?.length > 0? (
            <div className="grid grid-cols-3 gap-3">
              {currentPets?.map((pet: any) => (
                <PetCard key={pet?._id} pet={pet} />
              ))}
            </div>
          ):(
            <p className="text-center text-gray-500 mt-10">
            Không có thú cưng phù hợp với bộ lọc hiện tại.
          </p>
          )}

                <div className="flex justify-center min-h-[250px]">
        {filteredPets.length > 1 && (
          <PaginationSection
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
          </TabsContent>
          <TabsContent value="posts" className="pt-4">
            <ShelterPosts />
          </TabsContent>
          <TabsContent value="blogs" className="pt-4">
            <Blogs />
          </TabsContent>
        </Tabs>
      </div>
   
    </>
  );
}

export default ShelterContent;
