import { Button } from "@/components/ui/button";
import React from "react";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authorizedAxiosInstance.delete("/auth/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("userInfo");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6">
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default LandingPage;
