"use client";

import { useState } from "react";
import {
  getShelterDashboardStatistics,
  type ShelterDashboardStatistics,
} from "@/apis/shelter.api";
import { toast } from "sonner";

const ShelterDashboardTest = () => {
  const [dashboardData, setDashboardData] =
    useState<ShelterDashboardStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [shelterId, setShelterId] = useState("");

  const fetchDashboardData = async () => {
    if (!shelterId) {
      toast.error("Vui lòng nhập Shelter ID");
      return;
    }

    try {
      setLoading(true);
      const data = await getShelterDashboardStatistics(shelterId);
      setDashboardData(data);
      toast.success("Lấy dữ liệu dashboard thành công!");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Shelter Dashboard API</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Shelter ID:</label>
        <input
          type="text"
          value={shelterId}
          onChange={(e) => setShelterId(e.target.value)}
          placeholder="Nhập Shelter ID..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Đang tải..." : "Lấy dữ liệu Dashboard"}
        </button>
      </div>

      {dashboardData && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Dữ liệu Dashboard:</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm text-gray-600">Thú đang chăm sóc</h3>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData.caringPets}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm text-gray-600">Thú đã nhận nuôi</h3>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData.adoptedPets}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm text-gray-600">Bài viết</h3>
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData.posts}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm text-gray-600">Thành viên</h3>
              <p className="text-2xl font-bold text-orange-600">
                {dashboardData.members}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">
              Tăng trưởng thú cưng theo tháng:
            </h3>
            <div className="space-y-2">
              {dashboardData.petGrowth.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="font-medium">{item.month}</span>
                  <span className="text-blue-600 font-bold">
                    {item.count} thú cưng
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Raw Data:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(dashboardData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterDashboardTest;
