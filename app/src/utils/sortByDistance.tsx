import type { Shelter } from "@/types/Shelter";
import axios from "axios";
import { toast } from "sonner";
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

export interface LatLng {
  lat: number;
  lng: number;
}



async function detectCurrentLocation(): Promise<{ lat: number; lng: number }> {
  if (!navigator.geolocation) {
    throw new Error("Trình duyệt không hỗ trợ Geolocation.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (err) => {
        reject(new Error("Không thể lấy vị trí hiện tại: " + err.message));
      },
      { enableHighAccuracy: true }
    );
  });
}

function getDistanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const hav =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return R * c;
}

function sortSheltersByProximity(
  shelters: Shelter[],
  userLocation: LatLng
): Shelter[] {
  return [...shelters].sort((s1, s2) => {
    const d1 = getDistanceKm(s1.location, userLocation);
    const d2 = getDistanceKm(s2.location, userLocation);
    return d1 - d2;
  });
}

function sortPostsByDistance(posts: any[], userLocation: LatLng): any[] {
  return [...posts].sort((a, b) => {
    const d1 = a.location ? getDistanceKm(a.location, userLocation) : Infinity;
    const d2 = b.location ? getDistanceKm(b.location, userLocation) : Infinity;
    return d1 - d2;
  });
}

export { sortSheltersByProximity, detectCurrentLocation, getDistanceKm, sortPostsByDistance };