import React from "react";
import PetCard from "./PetCard";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Pets() {
  return (
    <div className="w-full flex flex-wrap justify-center mt-10">
      <h2 className="basis-3xl text-center text-3xl font-bold mb-5">
        Bạn không thể mua tình yêu nhưng có thể cứu lấy nó!
      </h2>
      <p className="basis-3xl text-center text-1xl text-(--muted-foreground) mb-10 px-20">
        Các bé đang chờ một mái nhà, một trái tim đủ ấm để được yêu thương.
      </p>
      <div className="basis-full flex justify-around gap-8 px-40 mb-10">
        <PetCard />
        <PetCard />
        <PetCard />
        <PetCard />
      </div>
      <Button asChild className="bg-primary text-primary-foreground">
        <Link to="/pets">
          Xem tất cả <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <a></a>
    </div>
  );
}

export default Pets;
