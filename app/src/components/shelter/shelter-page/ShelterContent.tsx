import PetCard from "@/components/landing-page/PetCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShelterPosts from "../shelter-post/ShelterPost";
import Blogs from "./shelter-blog/Blogs";
import AppContext from "@/context/AppContext";
import { useContext } from "react";

function ShelterContent() {
  const { petsList } = useContext(AppContext);
  return (
    <>
      <div className="min-h-screen">
        <Tabs defaultValue="pets" className="w-full">
          {/* Tab headers */}
          <TabsList className="flex justify-start text-muted-foreground w-full rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="pets"
              className="w-auto data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-b-(--primary) text-secondary rounded-none"
            >
              Pet
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="w-auto data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-b-(--primary) text-secondary rounded-none"
            >
              Bài đăng
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="w-auto data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-b-(--primary) text-secondary rounded-none"
            >
              Blog
            </TabsTrigger>
          </TabsList>

          {/* Tab contents */}
          <TabsContent value="pets" className="pt-4">
            <div className="grid grid-cols-3 gap-3">
              {petsList?.map((pet: any) => (
                <PetCard key={pet?._id} pet={pet} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="posts" className="pt-4">
            <ShelterPosts />
          </TabsContent>
          <TabsContent value="blogs" className="pt-4">
            <Blogs />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ShelterContent;
