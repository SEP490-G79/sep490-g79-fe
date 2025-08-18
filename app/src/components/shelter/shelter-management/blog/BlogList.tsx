import  { useContext, useEffect, useState } from 'react'
import BlogTable from './BlogTable';
import { useParams } from 'react-router-dom';
import AppContext from '@/context/AppContext';
import type { Blog } from '@/types/Blog';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import EditBlog from './EditBlog';
import BlogDetail from './BlogDetail';
import CreateBlog from './CreateBlog';
import useAuthAxios from '@/utils/authAxios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const BlogList = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [search, setSearch] = useState<string>("");
    const {blogAPI} = useContext(AppContext);
    const {shelterId} = useParams();
    const [viewBlogMode, setViewBlogMode] = useState<boolean>(false);
    const [editBlogMode, setEditBlogMode] = useState<boolean>(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const authAxios = useAuthAxios();

    useEffect(() => {
        authAxios.get(`${blogAPI}/${shelterId}/get-by-shelter/staff`)
        .then(result => {
          setBlogs(result.data);
          setFilteredBlogs(result.data);
        })
        .catch(error => console.log(error?.data.response.message))

    }, [editBlogMode, isOpen, refresh])


    function searchBlog(searchValue: string){
      const searchedBlogs = blogs.filter((blog) => {
        if (
          (blog.title &&
            blog.title.toLowerCase().includes(searchValue.toLowerCase())) ||
          (blog.description &&
            blog.description.toLowerCase().includes(searchValue.toLowerCase())) ||
          (blog.content &&
            blog.content.toLowerCase().includes(searchValue.toLowerCase()))
        ) {
          return blog;
        }
      });
      if (searchValue.trim().length === 0) {
        setFilteredBlogs(blogs);
      } else {
        setFilteredBlogs(searchedBlogs);
      }
    }
      


    async function deleteBlog(blogId: string){
      try {
        await authAxios.delete(`${blogAPI}/${blogId}/delete/${shelterId}`)
        toast.success("Xóa blog thành công!")
        setRefresh(prev => !prev)
      } catch (error: any) {
        toast.error(error?.response.data.message)
      }
    }


  return (
    <>
      {editBlogMode && !viewBlogMode && (
        <>
          <p
            onClick={() => setEditBlogMode(false)}
            className="flex gap-2 hover:text-amber-500 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 my-auto" /> Quay lại
          </p>
          <EditBlog blog={selectedBlog} />
        </>
      )}

      {viewBlogMode && !editBlogMode && (
        <>
          <p
            onClick={() => {
              setEditBlogMode(false);
              setViewBlogMode(false);
            }}
            className="flex gap-2 hover:text-amber-500 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 my-auto" /> Quay lại
          </p>
          <BlogDetail blog={selectedBlog} />
        </>
      )}
      {!viewBlogMode && !editBlogMode && (
        <>
          <div className="flex justify-between mb-2 gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(event) => 
              event.key === "Enter" && searchBlog(search)} 
              placeholder='Tìm kiếm...'/>
            <Button variant="outline" className="text-xs cursor-pointer" onClick={() => searchBlog(search)}>
                <Search className="text-(--primary)" />Tìm kiếm
            </Button>
            <CreateBlog open={isOpen} setIsOpen={setIsOpen} />
          </div>
          <BlogTable
            filteredBlogs={filteredBlogs ?? []}
            setViewBlogMode={setViewBlogMode}
            setEditBlogMode={setEditBlogMode}
            setSelectedBlog={setSelectedBlog}
            deleteBlog={deleteBlog}
          />
        </>
      )}
    </>
  );
}

export default BlogList;