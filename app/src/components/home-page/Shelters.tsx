import React, { useContext, useMemo } from "react";
import PetCard from "../landing-page/PetCard";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ShelterCard from "./ShelterCard";
import { type Shelter } from "@/types/Shelter";
import AppContext from "@/context/AppContext";

function Shelters() {
  const {shelters} = useContext(AppContext);
  const filteredShelters = useMemo<Shelter[] | undefined>(() => {
    return (shelters ?? []).slice(0, 5);
  }, [shelters]);
  return (
    <div className="w-full flex flex-wrap justify-center mt-10">
      <h2 className="basis-3xl text-center text-3xl font-bold mb-5">
        Các trung tâm cứu trợ nổi bật
      </h2>
      <p className="basis-3xl text-center text-1xl text-(--muted-foreground) mb-10 px-20">
        Những mái ấm đang chờ bạn trao gửi cơ hội — cùng giúp các bé tìm được
        nơi gọi là nhà.
      </p>
      <div className="basis-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-8 px-40 mb-10">
        {filteredShelters?.map((s) => (
          <ShelterCard key={s._id} shelter={s} />
        ))}
      </div>

      <Button asChild className="bg-primary text-primary-foreground">
        <Link
          to="/shelters"
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "instant" })
          }
        >
          Xem tất cả <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <a></a>
    </div>
  );
}

export default Shelters;
