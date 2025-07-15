import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import type { Pet } from '@/types/Pet';
import TagCombobox from './TagCombobox';
import { MarsStroke, Venus, SlidersHorizontal, Search, Badge } from "lucide-react";
import type { User } from '@/types/User';
import { Separator } from "@/components/ui/separator"
import shelterBg from "@/assets/BgFilter.jpg"
import { Input } from '../ui/input';

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
  }, [filters, pets]);

  const formatAge = (months: number) => months < 12 ? `${months} tháng` : `${Math.floor(months / 12)} năm`
  const maxAge = Math.max(...pets.map(p => p.age ?? 0), 0) + 24
  const maxWeight = Math.max(...pets.map(p => p.weight ?? 0), 0) + 4.9
  const availablePets = pets.filter(p => p.status === "available");
  const hasValidPrices = availablePets.some(p => p.tokenMoney != null);
  const priceOptions = hasValidPrices
    ? [
      { label: "Tất cả", range: [0, Infinity] as [number, number] },
      { label: "Miễn phí", range: [0, 0] as [number, number] },
      {
        label: "Dưới 200,000đ",
        range: [1000, 200_000] as [number, number],
      },
      {
        label: "200,000đ - 500,000đ",
        range: [200_000, 500_000] as [number, number],
      },
      {
        label: "500,000đ - 1,000,000đ",
        range: [500_000, 1_000_000] as [number, number],
      },
      {
        label: "Trên 1,000,000đ",
        range: [1_000_000, Infinity] as [number, number],
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
    <div className="relative w-full min-h-[75vh] ">
      <div className="absolute inset-0 ">
        <img
          src={shelterBg}
          alt="Shelter Background"
          className="absolute w-full h-full object-cover object-top z-0"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16">


        <div className="text-center mb-4 mt-25 ">

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-4 min-w-[500px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm những người bạn đồng hành hoàn hảo"
              value={filters.searchTerm || ""}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl shadow-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            />
          </div>

          {/* Advanced Filter Toggle */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 rounded-xl px-6 py-3"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            {showAdvancedFilters ? "Ẩn bộ lọc nâng cao" : "Bộ lọc nâng cao"}

          </Button>
        </div>


        {showAdvancedFilters && (
          <div className="transition-all duration-500 w-full max-w-7xl mx-auto py-5 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 
bg-white/70 backdrop-blur-md rounded-xl shadow-lg">
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
            <div className="col-span-full flex gap-2 mt-2 justify-end">
              <Button variant="outline" onClick={handleReset}>Đặt lại tất cả</Button>
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

export default FilterSection;
