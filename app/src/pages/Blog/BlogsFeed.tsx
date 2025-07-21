import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import AppContext from "@/context/AppContext";
import axios from "axios";
import BlogCard from "@/components/shelter/shelter-page/shelter-blog/BlogCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import BlogPreview from "@/components/shelter/shelter-page/shelter-blog/BlogPreview";
import type { Blog } from "@/types/Blog";
import { Button } from "@/components/ui/button";
import bg1 from "../../assets/blogs/pexels-edd1egalaxy-3628100.jpg"
import bg2 from "../../assets/blogs/pexels-fox-58267-1386422.jpg"
import bg3 from "../../assets/blogs/pexels-francesco-ungaro-96428.jpg"
import bg4 from "../../assets/blogs/pexels-nancy-guth-269359-850602.jpg"
import logo from "../../assets/logo/bbkzwnb6hyyrmi8jhiwp.jpg"

export default function BlogsFeed() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [keyword, setKeyword] = useState("");
  const {blogAPI} = useContext(AppContext);
  const [shownBlogs, setShownBlogs] = useState<number>(4);

  useEffect(() => {
    axios
      .get(`${blogAPI}/get-blogs-list`)
      .then((result) => {
        setBlogs(result?.data);
        setFilteredBlogs(result?.data);
      })
      .catch((error) => console.log(error?.data.response.message));
  }, []);

  useEffect(() => {
    const searchedBlogs = blogs.filter(blog => {
      if(blog.title && blog.title.toLowerCase().includes(keyword.toLowerCase()) || 
      blog.description && blog.description.toLowerCase().includes(keyword.toLowerCase()) || 
      blog.content && blog.content.toLowerCase().includes(keyword.toLowerCase())){
        return blog;
      }
    })
    if(keyword.trim().length === 0){
      setFilteredBlogs(blogs)
    }else{
      setFilteredBlogs(searchedBlogs)
    }
  },[keyword])

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        Khám phá các bài viết thú vị
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Cùng đọc các chia sẻ hữu ích về chăm sóc thú cưng, hành trình giải cứu
        và câu chuyện truyền cảm hứng từ cộng đồng yêu động vật.
      </p>
      <Carousel className="w-[90vw] mx-auto my-5">
        <CarouselPrevious />
        <CarouselContent className="h-[60vh] ">
          <CarouselItem key={1}>
            <img
              src={bg4}
              alt="anh 1"
              className="w-full h-[110vh] object-cover object-center"
            />
          </CarouselItem>
          <CarouselItem key={2}>
            <img
              src={bg2}
              alt="anh 2"
              className="w-full h-[60vh] object-cover object-center"
            />
          </CarouselItem>
          <CarouselItem key={3}>
            <img
              src={bg3}
              alt="anh 3"
              className="w-full h-[60vh] object-cover object-center"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>

      <div className="px-30">
        {/* <div className="w-full my-2">
          <BlogPreview blog={blogs[0]} />
        </div> */}
        <div className="w-full my-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
            {" "}
            Các blog mới nổi gần đây{" "}
          </h3>
        </div>
        <Input
          placeholder="Tìm kiếm bài viết..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="mb-6"
        />
        <div className="space-y-6 grid grid-cols-4 gap-2">
          {filteredBlogs?.slice(0, shownBlogs).map((blog) => (
            <BlogCard blog={blog} />
          ))}
        </div>
        {filteredBlogs.length > 4 && shownBlogs < filteredBlogs.length && (
          <div className="space-y-6 text-center mt-5">
            <Button onClick={() => setShownBlogs((prev) => (prev += 4))}>
              Xem thêm
            </Button>
          </div>
        )}
      </div>

      <div className="relative w-full h-[65vh] rounded-lg overflow-hidden shadow-md mt-5">
        <img
          src={bg1}
          alt="Ảnh kết thúc"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 sm:px-16">
          <div className="max-w-xl text-white">
            <img src={logo} alt="Logo" className="w-14 mb-4 rounded-full" />
            <h2 className="text-3xl font-bold leading-snug mb-2">
              Nhờ tất cả chúng ta,
            </h2>
            <p className="text-xl font-medium">
              thế giới của các em đã thay đổi...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
