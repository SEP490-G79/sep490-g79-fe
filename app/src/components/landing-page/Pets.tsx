import React, { useContext } from "react";
import PetCard from "./PetCard";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AppContext from "@/context/AppContext";
import PetsList from "../pet/PetsList";

function Pets() {
  const {petsList} = useContext(AppContext);
  return (
    <div className="w-full flex flex-wrap justify-center my-10">
      <h2 className="basis-3xl text-center text-3xl font-bold mb-5">
        Bạn không thể mua tình yêu nhưng có thể cứu lấy nó!
      </h2>
      <p className="basis-3xl text-center text-1xl text-(--muted-foreground) mb-10 px-20">
        Các bé đang chờ một mái nhà, một trái tim đủ ấm để được yêu thương.
      </p>
      <div className="basis-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 px-40 mb-10">
        {petsList?.slice(0, 4).map((pet: any) => (
          <PetCard key={pet?._id} pet={pet} />
        ))}
 
        
      </div>
      <Button asChild className="bg-primary text-primary-foreground">
        <Link to="/pets-list">
          Xem tất cả <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>

    </div>
  );
}

export default Pets;
