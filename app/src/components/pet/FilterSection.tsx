import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import type { Pet } from '@/types/Pet';
import TagCombobox from './TagCombobox';
import { MarsStroke, Venus } from "lucide-react";
import type { User } from '@/types/User';

export interface FilterState {
  species: string[];
  breed: string[];
  gender: string;
  shelter: string[];
  color: string[];
  ageRange: [number, number];
  weightRange: [number, number];
  priceRange: [number, number];
  inWishlist?: boolean;
  searchTerm?: string;
}

interface FilterSectionProps {
  onChange: (filters: FilterState) => void;
  pets: Pet[];
  userProfile?: User | null; 
}

function FilterSection({ onChange, pets, userProfile }: FilterSectionProps) {
  const [filters, setFilters] = useState<FilterState>({
    species: [],
    breed: [],
    gender: '',
    shelter: [],
    color: [],
    ageRange: [0, 100],
    weightRange: [0, 20],
    priceRange: [0, Infinity],
    inWishlist: false
  });

  const speciesOptions = Array.from(new Set(pets.map(p => p.species?.name).filter((n): n is string => !!n)))
  const breedOptions = Array.from(new Set(pets.flatMap(p => p.breeds?.map(b => b.name)).filter((n): n is string => !!n)))
  const shelterOptions = Array.from(new Set(pets.map(p => p.shelter?.name).filter((n): n is string => !!n)))
  const colorOptions = Array.from(new Set(pets.map(p => p.color).filter((c): c is string => !!c)))

  useEffect(() => {
    onChange(filters);
  }, [filters,pets]);

  const formatAge = (months: number) => months < 12 ? `${months} tháng` : `${Math.floor(months / 12)} năm`

  const maxAge = Math.max(...pets.map(p => p.age ?? 0), 0) + 24
  const maxWeight = Math.max(...pets.map(p => p.weight ?? 0), 0) + 4.9

  const availablePets = pets.filter(p => p.status === "available");

  const hasValidPrices = availablePets.some(p => p.tokenMoney != null);

  const roundToNearest = (value: number, step: number) => Math.round(value / step) * step;
  const step = 10000;
  const maxPrice = Math.max(...availablePets.map(p => p.tokenMoney ?? 0));
  const low = roundToNearest(maxPrice / 3, step);
  const mid = roundToNearest((2 * maxPrice) / 3, step);

  const priceOptions = hasValidPrices
    ? [
      { label: "Tất cả", range: [0, Infinity] as [number, number] },
      { label: "Miễn phí", range: [0, 0] as [number, number] },
      {
        label: `Dưới ${low.toLocaleString()}đ`,
        range: [0, low] as [number, number],
      },
      {
        label: `${low.toLocaleString()}đ - ${mid.toLocaleString()}đ`,
        range: [low, mid] as [number, number],
      },
      {
        label: `Trên ${mid.toLocaleString()}đ`,
        range: [mid, Infinity] as [number, number],
      },
    ]
    : [
      { label: "Tất cả", range: [0, Infinity] as [number, number] },
    ];
  useEffect(() => {
    const hasValidPrices = pets.some(p => p.tokenMoney != null);
    if (!hasValidPrices) {
      setFilters(prev => ({ ...prev, priceRange: [0, Infinity] }));
    }
  }, [pets]);

  const handleReset = () => {
    const defaultFilter: FilterState = {
      species: [], breed: [], gender: '', shelter: [], color: [],
      ageRange: [0, 100], weightRange: [0, 20], priceRange: [0, Infinity],
    }
    setFilters(defaultFilter)
    onChange(defaultFilter)
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-background border border-border rounded-xl shadow-sm">
<div className="col-span-full">
  <label className="text-base font-medium text-foreground block mb-1">Tìm kiếm</label>
  <input
    type="text"
    placeholder="Nhập mô tả như: chó poodle màu nâu..."
    value={filters.searchTerm || ""}
    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
    className="w-full border px-4 py-2 rounded-md text-sm"
  />
</div>
      <TagCombobox
        options={speciesOptions}
        selected={filters.species}
        onChange={(val) => setFilters({ ...filters, species: val })}
        placeholder="Chọn hoặc thêm loài"
        label="Loài"
      />

      <TagCombobox
        options={breedOptions}
        selected={filters.breed}
        onChange={(val) => setFilters({ ...filters, breed: val })}
        placeholder="Chọn hoặc thêm giống"
        label="Giống"
      />

      <TagCombobox
        options={shelterOptions}
        selected={filters.shelter}
        onChange={(val) => setFilters({ ...filters, shelter: val })}
        placeholder="Chọn hoặc thêm trung tâm"
        label="Trung tâm"
      />

      <TagCombobox
        options={colorOptions}
        selected={filters.color}
        onChange={(val) => setFilters({ ...filters, color: val })}
        placeholder="Chọn hoặc thêm màu sắc"
        label="Màu sắc"
      />


      {/* Gender */}
      <div>
        <label className="text-base font-medium text-foreground block mb-1">Giới tính</label>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm transition ${filters.gender === "" ? "bg-primary text-primary-foreground" : "border-border"
              }`}
            onClick={() => setFilters({ ...filters, gender: "" })}
          >
            Tất cả
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm transition ${filters.gender === "male" ? "bg-primary text-primary-foreground" : "border-border"
              }`}
            onClick={() => setFilters({ ...filters, gender: "male" })}
          >
            <MarsStroke className="w-4 h-4" />
            Đực
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-md border text-sm transition ${filters.gender === "female" ? "bg-primary text-primary-foreground" : "border-border"
              }`}
            onClick={() => setFilters({ ...filters, gender: "female" })}
          >
            <Venus className="w-4 h-4" />
            Cái
          </button>
        </div>
      </div>



      {/* Age Range */}
      <div>
        <label className="text-base font-medium text-foreground block mb-1">Độ tuổi</label>
        <span className="text-sm text-muted-foreground">
          {formatAge(filters.ageRange[0])} - {filters.ageRange[1] >= maxAge ? `${formatAge(maxAge)}+` : formatAge(filters.ageRange[1])}
        </span>
        <Slider
          min={0}
          max={maxAge}
          step={1}
          value={filters.ageRange}
          onValueChange={(val) => setFilters({ ...filters, ageRange: val as [number, number] })}
        />
      </div>

      {/* Weight Range */}
      <div>
        <label className="text-base font-medium text-foreground block mb-1">Cân nặng</label>
        <span className="text-sm text-muted-foreground">
          {filters.weightRange[0]} - {filters.weightRange[1] >= maxWeight ? `${maxWeight}+` : filters.weightRange[1]} kg
        </span>
        <Slider
          min={0}
          max={maxWeight}
          step={0.1}
          value={filters.weightRange}
          onValueChange={(val) => setFilters({ ...filters, weightRange: val as [number, number] })}
        />
      </div>

      {/* Price Range */}
      <div>
        <div className=" flex mb-1 mt-1 mb-4">
          <label className='text-base font-medium text-foreground block'>
            Giá:
          </label>
          <span className='ml-1'>
            {
              filters.priceRange[0] === 0 && filters.priceRange[1] === 0 ? "Miễn phí" :
                filters.priceRange[1] === Infinity ? `Trên ${filters.priceRange[0].toLocaleString()}đ` :
                  `${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}đ`
            }
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">


          {priceOptions.map(({ label, range }) => (
            <Button
              key={label}
              variant={
                filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1]
                  ? "default" : "outline"
              }
              onClick={() => setFilters({ ...filters, priceRange: range })}
            >{label}</Button>
          ))}
        </div>
      </div>

{userProfile && (
  <div>
    <label className="text-base font-medium text-foreground block mb-1">Yêu thích</label>
    <div className="flex gap-2">
      <Button
        variant={filters.inWishlist ? "default" : "outline"}
        onClick={() =>
          setFilters({ ...filters, inWishlist: !filters.inWishlist })
        }
      >
        {filters.inWishlist ? "Đang lọc theo yêu thích" : "Chỉ hiển thị yêu thích"}
      </Button>
    </div>
  </div>
)}

      {/* Reset Button */}
      <div className="col-span-full flex gap-2 mt-2">
        <Button variant="outline" onClick={handleReset}>Đặt lại</Button>
      </div>
    </div>
  )
}

export default FilterSection;
