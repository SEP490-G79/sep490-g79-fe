import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Cake, MapPinHouse } from 'lucide-react';


function UserInfo() {

    const user = {
        fullName: "Hảo trần",
        bio: "Game thủ vô tri!",
        location: "Hanoi, Vietnam",
        background: "https://i.pinimg.com/736x/c8/3b/c9/c83bc998e196e566b46a2bc60f169d42.jpg",
        avatar: "https://i.pinimg.com/736x/b8/c4/b9/b8c4b99567ca22c481880d7983d60b1e.jpg",
        email: "FV2rD@example.com",
        dob: "01/01/2000",
    };

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
                                <img
                                    src={user.avatar || "/placeholder.svg"}
                                    alt="Avatar"
                                    className="w-35 h-35 rounded-full border-1 border-gray-100 shadow-md"
                                />
                            </div>
                            <div className="text-center mb-2">
                                <div className="flex items-center justify-center gap-1">
                                    <h2 className="text-xl font-bold text-black dark:text-white">
                                        {user.fullName}
                                    </h2>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 ">{user.bio}</p>
                            <div className="w-full space-y-2 mt-4">
                                <div className="flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                                    <Cake className="w-4 h-4" />
                                    <span>{user.dob}</span>
                                </div>
                                <div className="flex items-center gap-2 text-black dark:text-gray-400 text-sm">
                                    <MapPinHouse className="w-4 h-4" />
                                    <span>{user.location}</span>
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
