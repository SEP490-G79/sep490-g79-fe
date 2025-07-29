// ShelterManagementGuard.tsx
import React, { useContext, type JSX } from "react";
import { Navigate, useParams } from "react-router-dom";
import AppContext from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function ShelterRoute({ children }: { children: JSX.Element }) {
  const { shelterId } = useParams<{ shelterId: string }>();
  const { shelters, user } = useContext(AppContext);

  if (shelters == undefined || user == undefined) {
    return (
      <div className="w-full min-h-full flex flex-wrap justify-around px-20 py-5">
        <div className="basis-full mb-5">
          <Skeleton className="h-6 w-1/4 mb-2" /> 
          <Skeleton className="h-8 w-1/3 mb-2" /> 
          <Skeleton className="h-4 w-1/5 mb-4" /> 
          <Separator />
        </div>

        <div className="basis-full sm:basis-1/4 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full mb-3" />
          ))}
        </div>

        <div className="basis-full sm:basis-3/4 w-full">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const shelter = shelters?.find((s) => s._id == shelterId);

  if (!shelter?.members.some((m) => m._id == user?._id)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
