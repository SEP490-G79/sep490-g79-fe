import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pet } from "@/types/Pet";
import type { MissionForm } from "@/types/MissionForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function getColorBarClass(total: number): string {
  if (total <= 29) return "bg-red-500";
  if (total >= 30 && total <= 59) return "bg-yellow-400";
  if (total >= 60 && total <= 79) return "bg-blue-400";
  return "bg-green-500";
}

export default function PetSubmission() {
  const { petId } = useParams();
  const { petsList, submissionsByPetId, setSubmissionsByPetId, coreAPI } = useAppContext();
  const authAxios = useAuthAxios();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showLegend, setShowLegend] = useState(false);

  const pet = petsList.find((p: Pet) => p._id === petId);
  const submissions = submissionsByPetId[petId ?? ""] || [];

  useEffect(() => {
    if (!submissions.length && petId) fetchSubmissions();
  }, [petId]);

  const fetchSubmissions = async () => {
    try {
      const res = await authAxios.post(`${coreAPI}/adoption-submissions/by-pet-ids`, {
        petIds: [petId],
      });
      const submissions: MissionForm[] = res.data;
      setSubmissionsByPetId({ [petId!]: submissions });
    } catch (err) {
      console.error("Lỗi khi fetch submissions:", err);
    }
  };
  const statusOptions = ["pending", "interviewing", "reviewed", "approved", "rejected"];
  const statusLabels: Record<string, string> = {
    pending: "Chờ duyệt",
    interviewing: "Chờ phỏng vấn",
    reviewed: "Đã phỏng vấn",
    approved: "Đồng ý",
    rejected: "Từ chối",

  };

  const statusCounts = submissions.reduce<Record<string, number>>((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, {});

  const filteredSubmissions = submissions
    .filter((sub) => !statusFilter || sub.status === statusFilter)
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ duyệt",
      interviewing: "Chờ phỏng vấn",
      reviewed: "Đã phỏng vấn",
      approved: "Đồng ý",
      rejected: "Từ chối",
    };
    return statusMap[status] || status;
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={pet?.photos?.[0] || "/placeholder-avatar.png"}
          alt={pet?.name}
          className="w-28 h-28 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-2xl font-semibold">{pet?.name}</h1>
          <p className="text-muted-foreground">Mã thú cưng: {pet?.petCode}</p>
        </div>


      </div>
      <div className="flex items-center flex-wrap justify-between gap-2 mb-4">
         <div className="flex items-center gap-2 flex-wrap">
        <button
          className={`px-3 py-1 rounded-full border text-sm ${statusFilter === "" ? "bg-primary text-white" : "bg-white"
            }`}
          onClick={() => setStatusFilter("")}
        >
          Tất cả ({submissions.length})
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded-full border text-sm capitalize ${statusFilter === status ? "bg-primary text-white" : "bg-white"
              }`}
            onClick={() => setStatusFilter(status)}
          >
            {statusLabels[status]} ({statusCounts[status] || 0})
          </button>
        ))}
       </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-3 py-1 rounded-full border text-sm bg-white ">
              Chú thích
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Giải thích mức độ phù hợp của đơn yêu cầu</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Phù hợp thấp (dưới 30%)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                Phù hợp trung bình (30–59%)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                Phù hợp cao (60–79%)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Phù hợp rất cao (trên 80%)
              </p>
            </div>
          </DialogContent>
        </Dialog>


      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {filteredSubmissions.length === 0 ? (
          <p className="flex items-center justify-center text-muted-foreground text-sm col-span-full mt-10">Không có đơn</p>
        ) : (
          filteredSubmissions.map((submission) => {
            const total = submission.total ?? 0;
            const colorBar = getColorBarClass(total);

            return (
              <div key={submission._id} className="flex rounded-md shadow-sm overflow-hidden border">
                <div className={`w-2 ${colorBar}`} />
                <div className="flex-1 bg-white">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Người nộp:{" "}
                        <span className="text-primary">
                          {submission.performedBy?.fullName || "Ẩn danh"}
                        </span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Nộp lúc: {format(new Date(submission.createdAt), "HH:mm dd/MM/yyyy")}
                      </p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      {/* <Badge variant="outline" className="text-sm">
                        Tổng điểm: {total}
                      </Badge> */}
                      <Badge className="text-xs uppercase bg-primary ml-auto">  {getStatusLabel(submission.status)}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          }))}
      </div>
    </div>
  );
}
