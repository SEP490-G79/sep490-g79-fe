import React, { useContext, useEffect, useState } from 'react'
import Image from "@/assets/Home_1.jpg"; // đúng đường dẫn assets của bạn
import { useNavigate } from 'react-router-dom';
import AppContext from '@/context/AppContext';
import axios from 'axios';

const HandleVerify = () => {
    const [verifying, setVerifying] = useState<Boolean>(true);
    const navigate = useNavigate();
    const { authAPI } = useContext(AppContext);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const activeToken = urlParams.get("token");

        axios
          .post(`${authAPI}/verify-account`, {
            token: activeToken,
          })
          .then((res) => {
            setTimeout(() => {
                setVerifying(false);
            }, 2000)
            setTimeout(() => {
                navigate("/login");
            }, 3000)
          })
          .catch(err => {
            console.log(err)
          });
    },[])

  return (
    <div className="w-full h-screen flex">
  {/* Bên trái: Hình ảnh minh hoạ */}
  <div className="basis-1/2 flex items-center justify-center p-6 bg-gray-100">
    <img
      src={Image}
      alt="Login illustration"
      className="w-full h-full object-cover rounded-xl shadow-lg"
    />
  </div>

  {/* Bên phải: Thông báo kích hoạt */}
  <div className="basis-1/2 flex items-center justify-center bg-white">
    <div className="text-center max-w-md px-6 py-12 rounded-xl shadow-lg">
      {verifying === true ? (
        <>
          <h1 className="text-2xl font-semibold text-blue-600 mb-4">Đang kích hoạt tài khoản...</h1>
          <p className="text-gray-600">Vui lòng chờ trong giây lát, chúng tôi đang xử lý yêu cầu của bạn.</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-green-600 mb-4">Kích hoạt tài khoản thành công!</h1>
          <p className="text-gray-600">Đang chuyển về trang đăng nhập! Vui lòng đăng nhập lại</p>
        </>
      )}
    </div>
  </div>
</div>

  )
}

export default HandleVerify