// Tính toán khoảng cách giữa 2 vị trí (theo công thức Haversine)
function calculateDistance(
  locationA: { lat: number; lng: number },
  locationB: { lat: number; lng: number }
): string {

  const lat1 = locationA.lat;
  const lng1 = locationA.lng;
  const lat2 = locationB.lat;
  const lng2 = locationB.lng;
  // Chuyển đổi độ sang radian
  const toRad = (value: number) => (value * Math.PI) / 180;

  // Bán kính Trái Đất (6,371 km)
  const R = 6371e3;

  // Vĩ độ điểm A (radian)
  const φ1 = toRad(lat1);
  // Vĩ độ điểm B (radian)
  const φ2 = toRad(lat2);

  // Hiệu vĩ độ giữa 2 điểm
  const Δφ = toRad(lat2 - lat1);
  // Hiệu kinh độ giữa 2 điểm
  const Δλ = toRad(lng2 - lng1);

  // Tính bình phương nửa khoảng cách góc giữa 2 điểm
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  // Góc trung tâm (central angle) giữa hai điểm
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Khoảng cách thực tế theo mét
  const distance = R * c;

  if(distance < 1000){
    return `Cách bạn khoảng ${Math.round(distance)} m`;
  }else{
    return `Cách bạn khoảng ${Math.round(distance/1000).toFixed(0)} km`;
  }
  
}


const locationUtils = {
    calculateDistance,
}

export default locationUtils;