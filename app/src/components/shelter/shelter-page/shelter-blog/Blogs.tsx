import React, { useContext, useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import {type Blog } from '@/types/Blog';
import type useAuthAxios from '@/utils/authAxios';
import AppContext from '@/context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const { blogAPI } = useContext(AppContext);
  const { shelterId } = useParams();
  const [search, setSearch] = useState<string>("");
  const [shownBlogs, setShownBlogs] = useState<number>(6);

  useEffect(() => {
    axios
      .get(`${blogAPI}/${shelterId}/get-by-shelter`)
      .then((result) => {
        setBlogs(result?.data?.data)
        setFilteredBlogs(result?.data?.data);
      })
      .catch((error) => console.log(error?.response.data.message));
  }, []);

  useEffect(() => {
    const searchedBlogs = blogs.filter((blog) => {
      if (
        (blog.title &&
          blog.title.toLowerCase().includes(search.toLowerCase())) ||
        (blog.description &&
          blog.description.toLowerCase().includes(search.toLowerCase())) ||
        (blog.content &&
          blog.content.toLowerCase().includes(search.toLowerCase()))
      ) {
        return blog;
      }
    });
    if (search.trim().length === 0) {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(searchedBlogs);
    }
  }, [search]);

  if (blogs.length < 1) {
    return (
      <div className="text-center">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Không có bài viết blog
        </h4>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm blog theo tên hoặc nội dung"
        className="col-span-3 mb-2 w-1/3"
      />
      {filteredBlogs && filteredBlogs.length > 0 ? (
        filteredBlogs?.slice(0, shownBlogs).map((blog) => <BlogCard blog={blog} />)
      ) : (
        <div className="col-span-3 text-center">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Không tìm thấy bài viết blog
          </h4>
        </div>
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