import { useEffect, useState } from "react";
import useAuthAxios from "@/utils/authAxios";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Button } from "@/components/ui/button";
import EditReturnRequestDialog from "./EditReturnRequestDialog";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Props = {
    userId?: string;
};

export default function ReturnRequestList({ userId }: Props) {
    const [editingRequest, setEditingRequest] = useState<any | null>(null);
    const [deletingRequest, setDeletingRequest] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const { user, returnRequestAPI } = useAppContext();
    const authAxios = useAuthAxios();
    const isUser = userId && userId !== user?._id;

    const fetchRequests = async () => {
        try {
            const url = userId
                ? `${returnRequestAPI}/user/${userId}`
                : `${returnRequestAPI}/get-by-user`;
            const res = await authAxios.get(url);
            setRequests(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách yêu cầu trả thú cưng");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [userId]);

    useEffect(() => {
        fetchRequests();
    }, [userId]);

    useEffect(() => {
        authAxios
            .get(`${returnRequestAPI}/get-by-user`)
            .then((res) => {
                setRequests(res.data);
            })
            .catch((err) => {
                console.error("Lỗi khi tải danh sách yêu cầu trả thú cưng:", err);
                toast.error("Không thể tải danh sách yêu cầu trả thú cưng");
            });
    }, []);

    const handleDeleteRequest = async (requestId: string) => {
        try {
            const res = await authAxios.delete(`${returnRequestAPI}/${requestId}/delete`);
            toast.success(res.data.message || "Đã huỷ yêu cầu");

            const updatedRequest = res.data.data;
            fetchRequests();

            setRequests((prev) =>
                prev.map((r) =>
                    r._id === updatedRequest._id ? updatedRequest : r
                )
            );
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Không thể huỷ yêu cầu");
        } finally {
            setDeletingRequest(null);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-10">
                Bạn chưa có yêu cầu trả thú cưng nào.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
                <Card key={request._id} className="relative group">
                    <CardHeader className="flex items-start gap-4">
                        <img
                            src={request.pet.photos?.[0]}
                            alt="Pet"
                            className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                            <CardTitle>{request.pet.name}</CardTitle>
                            <CardDescription className="text-sm">
                                {request.shelter.name}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-xs">Trạng thái</span>
                            <Badge
                                className={`text-white ${request.status === "approved"
                                    ? "bg-green-600"
                                    : request.status === "rejected"
                                        ? "bg-red-600"
                                        : request.status === "cancelled"
                                            ? "bg-gray-400"
                                            : "bg-yellow-500"
                                    }`}
                            >
                                {request.status === "pending"
                                    ? "Chờ duyệt"
                                    : request.status === "approved"
                                        ? "Đã duyệt"
                                        : request.status === "rejected"
                                            ? "Từ chối"
                                            : "Đã huỷ"}
                            </Badge>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-xs">Lý do</span>
                            <p>{request.reason}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground text-xs">Ngày tạo</span>
                            <p>{new Date(request.createdAt).toLocaleDateString("vi-VN")}</p>
                        </div>
                        {request.photos?.length > 0 && (
                            <div>
                                <span className="text-muted-foreground text-xs">Ảnh đính kèm</span>
                                <PhotoProvider>
                                    <div className="flex gap-2 mt-1">
                                        {request.photos.slice(0, 3).map((url: string, i: number) => (
                                            <PhotoView key={i} src={url}>
                                                <div className="relative w-16 h-16 cursor-pointer">
                                                    <img
                                                        src={url}
                                                        alt={`Ảnh ${i + 1}`}
                                                        className="w-full h-full object-cover rounded border"
                                                    />
                                                    {i === 2 && request.photos.length > 3 && (
                                                        <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center rounded font-medium text-sm">
                                                            +{request.photos.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                            </PhotoView>
                                        ))}
                                    </div>
                                </PhotoProvider>
                            </div>
                        )}
                        {request.status === "pending" && !isUser && (
                            <div className="flex justify-between gap-2 mt-3">
                                {request.status === "pending" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingRequest(request)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                )}
                                {request.status === "pending" && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeletingRequest(request)}
                                    >
                                        Huỷ yêu cầu
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            {editingRequest && !isUser && (
                <EditReturnRequestDialog
                    open={true}
                    request={editingRequest}
                    onOpenChange={() => setEditingRequest(null)}
                    onUpdated={(updated) => {
                        setRequests((prev) =>
                            prev.map((r) => (r._id === updated._id ? updated : r))
                        );
                        setEditingRequest(null);
                    }}
                />
            )}
            {editingRequest && !isUser && (
                <AlertDialog open={true} onOpenChange={(open) => !open && setDeletingRequest(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc muốn huỷ yêu cầu?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Sau khi huỷ, yêu cầu sẽ không thể được khôi phục.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Đóng</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleDeleteRequest(deletingRequest._id)}
                            >
                                Xác nhận huỷ
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
