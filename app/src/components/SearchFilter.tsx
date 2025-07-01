import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  placeholder?: string;
  onResultChange: (result: T[]) => void;
}

export function SearchFilter<T extends Record<string, any>>({
  data,
  searchFields,
  placeholder = "Tìm kiếm...",
  onResultChange,
}: SearchFilterProps<T>) {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const trimmed = keyword.trim().toLowerCase();

    if (!trimmed) {
      onResultChange(data);
      return;
    }

    const filtered = data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return (
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(trimmed)
        );
      })
    );

    onResultChange(filtered);
  }, [keyword, data, searchFields, onResultChange]);

  return (
    <Input
      placeholder={placeholder}
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="w-full"
    />
  );
}
