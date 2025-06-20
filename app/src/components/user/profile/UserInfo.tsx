import React, { useState, useEffect, useContext } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Cake, MapPinHouse } from 'lucide-react';
import AppContext from "@/context/AppContext";
import dayjs from "dayjs";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';


function UserInfo() {
    const { userProfile } = useContext(AppContext);


    return (

        <div >
            <div>
                <div className="relative">

                    {/* Container: Card + Button */}
                    <div className="absolute bottom-[-530px]  flex flex-col items-start gap-y-14 px-4 sm:px-6 ml-20">
                        {/* Card: Avatar + Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-[300px] ">
                            {/* Avatar */}
                            <div className="mb-4">
                                <PhotoProvider>
                                 <PhotoView src={userProfile?.avatar}>
                                <img
                                    src={userProfile?.avatar || "/placeholder.svg"}
                                    alt="Avatar"
                                    className="w-35 h-35 rounded-full border-1 border-gray-100 shadow-md"
                                />
                                </PhotoView>
                                </PhotoProvider>
                            </div>

                            <div className="text-center mb-2">
                                <div className="flex items-center justify-center gap-1">
                                    <h2 className="text-xl font-bold text-black dark:text-white">
                                        {userProfile?.fullName}
                                    </h2>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 ">{userProfile?.bio}</p>
                            <div className="w-full space-y-2 mt-4">
                                <div className="flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{userProfile?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                                    <Cake className="w-4 h-4" />
                                    <span>
                                        {userProfile?.dob
                                            ? dayjs(userProfile?.dob).format("DD/MM/YYYY")
                                            : "Chưa có thông tin"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                                    <MapPinHouse className="w-4 h-4" />
                                    <span>{userProfile?.address || "Chưa có thông tin"}</span>

                                </div>
                            </div>

                        </div>
                        {/* Card: Request to Join or Create a Shelter */}

                        <div className="bg-slate-300 dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[330px] pt-4 ">
                            <h3 className="text-md font-semibold mb-2 text-black dark:text-white">
                                Yêu cầu tham gia hoặc tạo mới một trung tâm cứu trợ
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Bạn có thể gửi yêu cầu để tham gia vào một trung tâm cứu trợ thú cưng hiện có hoặc đề xuất tạo một trung tâm mới.
                            </p>
                            <p
                                onClick={() => {
                                }}
                                className="text-blue-600 hover:underline cursor-pointer text-sm "
                            >
                                Nhấn vào đây để gửi yêu cầu!
                            </p>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
