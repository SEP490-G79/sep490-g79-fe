import { useContext, useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import {type Blog } from '@/types/Blog';
import AppContext from '@/context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, RefreshCcw, Search } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const { blogAPI } = useContext(AppContext);
  const { shelterId } = useParams();
  const [keyword, setKeyword] = useState<string>("");
  const [shownBlogs, setShownBlogs] = useState<number>(6);
  const [refresh, setRefresh] = useState<boolean>(false);

  const noBlogNotice = () => {
  return <div className="col-span-3 flex items-center justify-center mt-15">
      <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl">
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
    </div>
}

  useEffect(() => {
    axios
      .get(`${blogAPI}/${shelterId}/get-by-shelter`)
      .then((result) => {
        setBlogs(result?.data?.data)
        setFilteredBlogs(result?.data?.data);
      })
      .catch((error) => console.log(error?.response.data.message));
  }, [refresh]);

  function searchBlogs(keywordValue: string){
     const searchedBlogs = blogs.filter((blog) => {
      if (
        (blog.title &&
          blog.title.toLowerCase().includes(keywordValue.toLowerCase())) ||
        (blog.description &&
          blog.description.toLowerCase().includes(keywordValue.toLowerCase())) ||
        (blog.content &&
          blog.content.toLowerCase().includes(keywordValue.toLowerCase()))
      ) {
        return blog;
      }
    });
    if (keywordValue.trim().length === 0) {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(searchedBlogs);
    }
  }

  if (blogs.length < 1) {
    noBlogNotice();
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-3 grid grid-cols-12 mb-5">
          <div className="col-span-11 flex gap-1 justify-start">
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
        filteredBlogs?.slice(0, shownBlogs).map((blog) => <BlogCard blog={blog} />)
      ) : (
        noBlogNotice()
      )}
      {filteredBlogs.length > 6 && shownBlogs < filteredBlogs.length && (
          <div className="w-full col-span-3 space-y-6 mt-5 text-center">
            <Button onClick={() => setShownBlogs((prev) => (prev += 6))}>
              Xem thêm
            </Button>
          </div>
        )}
    </div>
  );
}

export default Blogs