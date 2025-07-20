import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthAxios from "@/utils/authAxios";
import { useAppContext } from "@/context/AppContext";
import type { Pet } from "@/types/Pet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { MissionForm } from "@/types/MissionForm";

function getColorBarClass(total: number): string {
  if (total <= 3) return "bg-red-500";
  if (total < 7) return "bg-yellow-400";
  return "bg-green-500";
}


export default function PetSubmission() {
  const { petId } = useParams();
  const { petsList, submissionsByPetId, setSubmissionsByPetId,coreAPI } = useAppContext();
   const authAxios = useAuthAxios();

  const pet = petsList.find((p: Pet) => p._id === petId);
  const submissions = submissionsByPetId[petId ?? ""] || [];
  useEffect(() => {
  if (!submissionsByPetId[petId ?? ""]) {
    fetchSubmissions();
  }
}, [petId]);


  const fetchSubmissions = async () => {
    try {
const response = await authAxios.post(`${coreAPI}/adoption-submissions/by-pet-ids`, {
  petIds: [petId],
});
      const submissions: MissionForm[] = response.data;

      const grouped = submissions.reduce((acc, sub) => {
        const petId = sub.adoptionForm.pet._id;
        if (!petId) return acc;
        if (!acc[petId]) acc[petId] = [];
        acc[petId].push(sub);
        return acc;
      }, {} as Record<string, MissionForm[]>);

      setSubmissionsByPetId(grouped);
    } catch (err) {
      console.error("Lỗi khi fetch submissions:", err);
    }
  };
  console.log(submissions);
  

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={pet.photos?.[0] || "/placeholder-avatar.png"}
          alt={pet.name}
          className="w-28 h-28 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-2xl font-semibold">{pet.name}</h1>
          <p className="text-muted-foreground">Mã thú cưng: {pet.petCode}</p>
        </div>
      </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {[...submissions]
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
    .map((submission) => {
      const total = submission.total ?? 0;
      const colorBar = getColorBarClass(total);

      return (
        <div
          key={submission._id}
          className="flex rounded-md shadow-sm overflow-hidden border"
        >
          {/* Thanh màu trái */}
          <div className={`w-2 ${colorBar}`} />

          {/* Nội dung card */}
          <div className="flex-1 bg-white">
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle className="text-base">
                  Người nộp:{" "}
                  <span className="text-primary">
                    {submission.performedBy?.email || "Ẩn danh"}
                  </span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Nộp lúc:{" "}
                  {format(new Date(submission.createdAt), "HH:mm dd/MM/yyyy")}
                </p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  Tổng điểm: {total}
                </Badge>
                <Badge className="text-xs uppercase bg-primary">
                  {submission.status}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    })}
</div>


    </div>
  );
}
