"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { LocateFixed } from "lucide-react";

const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

export type Location = {
  lat: number;
  lng: number;
};

export type GoongSuggestion = {
  place_id: string;
  description: string;
};

interface AddressInputWithGoongProps {
  value: string;
  onChange: (value: string) => void;
  onLocationChange: (location: Location) => void;
  label?: string;
  error?: string;
}

export default function AddressInputWithGoong({
  value,
  onChange,
  onLocationChange,
  label = "Địa chỉ",
  error,
}: AddressInputWithGoongProps) {
  const [suggestions, setSuggestions] = useState<GoongSuggestion[]>([]);

  const fetchAddressSuggestions = async (query: string) => {
    if (!query.trim()) return setSuggestions([]);
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
        params: { input: query, api_key: GOONG_API_KEY },
      });
      setSuggestions(res.data.predictions || []);
    } catch (error) {
      console.error("Autocomplete failed:", error);
    }
  };

  const fetchPlaceDetail = async (placeId: string) => {
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/Detail", {
        params: { place_id: placeId, api_key: GOONG_API_KEY },
      });
      const result = res.data.result;
      if (result?.formatted_address && result?.geometry?.location) {
        onChange(result.formatted_address);
        onLocationChange({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
      }
    } catch (error) {
      console.error("Place Detail error:", error);
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation)
      return alert("Trình duyệt không hỗ trợ định vị.");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get("https://rsapi.goong.io/Geocode", {
            params: {
              latlng: `${coords.latitude},${coords.longitude}`,
              api_key: GOONG_API_KEY,
              has_deprecated_administrative_unit: true,
            },
          });
          const place = res.data.results?.[0];
          if (place) {
            onChange(place.formatted_address);
            onLocationChange({ lat: coords.latitude, lng: coords.longitude });
          }
        } catch (error) {
          console.error("Reverse geocode error:", error);
        }
      },
      (err) => console.error("Lỗi truy cập vị trí:", err),
      { enableHighAccuracy: true }
    );
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>

      {/* Flex container cho input + button */}
      <div className="flex items-center space-x-2">
        <FormControl className="flex-1">
          <Input
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              onChange(newValue);
              fetchAddressSuggestions(newValue);
            }}
            placeholder="Địa chỉ"
          />
        </FormControl>

        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={detectCurrentLocation}
        >
          <LocateFixed className="mr-1 h-4 w-4" />
          Lấy vị trí hiện tại
        </Button>
      </div>

      {/* Message nếu có lỗi */}
      {error && <FormMessage>{error}</FormMessage>}

      {/* Gợi ý địa chỉ */}
      {suggestions.length > 0 && (
        <div className="border mt-1 rounded-md shadow-sm bg-white z-50 max-h-60 overflow-y-auto">
          {suggestions.map((sug) => (
            <div
              key={sug.place_id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                fetchPlaceDetail(sug.place_id);
                setSuggestions([]);
              }}
            >
              {sug.description}
            </div>
          ))}
        </div>
      )}
    </FormItem>
  );
}
