import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AppContext from "@/context/AppContext";
import axios from "axios";
import BlogCard from "@/components/shelter/shelter-page/shelter-blog/BlogCard";
import type { Blog } from "@/types/Blog";
import { Button } from "@/components/ui/button";
import bg1 from "../../assets/blogs/pexels-edd1egalaxy-3628100.jpg";
import logo from "../../assets/logo/logo.png";
import { FileText, RefreshCcw, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function BlogsFeed() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [keyword, setKeyword] = useState("");
  const {blogAPI} = useContext(AppContext);
  const [shownBlogs, setShownBlogs] = useState<number>(8);
  const [refresh, setRefresh] = useState<boolean>(false);

  const noBlogNotice = () => {
  return <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl my-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Không tìm thấy bài viết blog
        </h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          {blogs && blogs.length < 1 ? "Hiện tại chưa có bài viết nào. Hãy quay lại sau." : "Bài viết không tồn tại"}
        </p>
      </div>
   
}

  useEffect(() => {
    axios
      .get(`${blogAPI}/get-blogs-list`)
      .then((result) => {
        setBlogs(result?.data);
        setFilteredBlogs(result?.data);
      })
      .catch((error) => console.log(error?.data.response.message));
  }, [refresh]);

  const searchBlogs = (keywordValue: string) => {
    const searchedBlogs = blogs.filter(blog => {
      if(blog.title && blog.title.toLowerCase().includes(keywordValue.toLowerCase()) || 
      blog.description && blog.description.toLowerCase().includes(keywordValue.toLowerCase()) || 
      blog.content && blog.content.toLowerCase().includes(keywordValue.toLowerCase())){
        return blog;
      }
    })
    if(keywordValue.trim().length === 0){
      setFilteredBlogs(blogs)
    }else{
      setFilteredBlogs(searchedBlogs)
    }
  }

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        Khám phá các bài viết thú vị
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-center">
        Cùng đọc các chia sẻ hữu ích về chăm sóc thú cưng, hành trình giải cứu
        và câu chuyện truyền cảm hứng từ cộng đồng yêu động vật.
      </p>

      <div className="px-30">
        <div className="grid grid-cols-12 mt-5 mb-5">
          <div className="col-span-11 flex gap-1 justify-center ms-5">
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchBlogs(keyword)}
              className="w-100"
            />
            <Button variant="outline" className="cursor-pointer" onClick={() => searchBlogs(keyword)}>
                <Search  className="text-primary"/> Tìm kiếm
            </Button>
          </div>
          <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer col-span-1"
                    onClick={() => setRefresh((prev) => !prev)}
                  >
                    <RefreshCcw />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
            </Tooltip>
        </div>
        {filteredBlogs && filteredBlogs.length > 0 ? (
          <div className="space-y-6 grid grid-cols-4 gap-2">
            {filteredBlogs?.slice(0, shownBlogs).map((blog) => (
              <BlogCard blog={blog} />
            ))}
          </div>
        ) : (
          noBlogNotice()
        )}
        {filteredBlogs.length > 8 && shownBlogs < filteredBlogs.length && (
          <div className="space-y-6 text-center mt-5">
            <Button onClick={() => setShownBlogs((prev) => (prev += 8))}>
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
