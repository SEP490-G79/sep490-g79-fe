import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import AppContext from "@/context/AppContext";
import axios from "axios";
import BlogCard from "@/components/shelter/shelter-page/shelter-blog/BlogCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import BlogPreview from "@/components/shelter/shelter-page/shelter-blog/BlogPreview";

interface Blog {
  _id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  createdAt: string;
}

const mockBlogs: Blog[] = [
  {
    _id: "1",
    title: "Chó phốc sóc nhỏ nhắn dễ thương, phù hợp căn hộ",
    description:
      "Chó phốc sóc (Pomeranian) là giống chó nhỏ có ngoại hình đáng yêu và tính cách năng động, rất được ưa chuộng tại các thành phố lớn.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1583337130417-3346a1fc85a0",
    createdAt: "2024-06-20T12:00:00Z",
  },
  {
    _id: "2",
    title: "Mèo Ba Tư lông dài cần nhà mới yêu thương",
    description:
      "Bé mèo Ba Tư ngoan ngoãn, đã tiêm phòng, ăn uống tốt, đang tìm chủ yêu thương và chăm sóc lâu dài.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1601758174625-0c8d8b8eaf1a",
    createdAt: "2024-06-15T09:30:00Z",
  },
];

export default function BlogsFeed() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [keyword, setKeyword] = useState("");
  const {blogAPI} = useContext(AppContext);

  useEffect(() => {
          axios.get(`${blogAPI}/get-blogs-list`)
          .then(result => {
            setBlogs(result?.data?.data);
            setFilteredBlogs(result?.data?.data);
          })
          .catch(error => console.log(error?.data.response.message))
  
      }, [])


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Các bài blog</h2>
      <Carousel>
        <CarouselContent>
          <CarouselItem key={1}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLmTjWnzzs-lNdAWEY4pNgRcueO6c4hgpH7g&s" alt="anh 1" className="w-full"/>
          </CarouselItem>
          <CarouselItem key={2}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLmTjWnzzs-lNdAWEY4pNgRcueO6c4hgpH7g&s" alt="anh 2" className="w-full"/>
          </CarouselItem>
          <CarouselItem key={3}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLmTjWnzzs-lNdAWEY4pNgRcueO6c4hgpH7g&s" alt="anh 3" className="w-full"/>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="w-full my-2">
        <BlogPreview blog={blogs[0]} />
      </div>

      <div className="w-full my-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center"> Các blog mới nổi gần đây </h3>
      </div>
        <Input
        placeholder="Tìm kiếm bài viết..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="mb-6"
        />

      <div className="space-y-6 flex gap-2">
        {blogs?.map((blog) => (
          <BlogCard blog={blog} />
        ))}
      </div>
    </div>
  );
}
