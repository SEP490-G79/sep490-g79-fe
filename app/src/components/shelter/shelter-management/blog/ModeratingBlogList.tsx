import { Input } from '@/components/ui/input';
import AppContext from '@/context/AppContext';
import { type Blog } from '@/types/Blog';
import useAuthAxios from '@/utils/authAxios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';
import BlogTable from './BlogTable';
import { useParams } from 'react-router-dom';


const ModeratingBlogs = () => {
      const authAxios = useAuthAxios();
      const {blogAPI} = useContext(AppContext);
      const [blogs, setBlogs] = useState<Blog[]>([]);
      const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
      const [refresh, setRefresh] = useState<boolean>(false); 
      const [search, setSearch] = useState<string>("");
        const [editBlogMode, setEditBlogMode] = useState<boolean>(false);
        const [selectedBlog, setSelectedBlog] = useState<Blog>();
        const [viewBlogMode, setViewBlogMode] = useState<boolean>(false);
        const {shelterId} = useParams();

      useEffect(() => {
        authAxios.get(`${blogAPI}/get-moderating-blogs/${shelterId}`)
        .then(({data}) => {
          setBlogs(data);
          setFilteredBlogs(data);
        }) 
        .catch((err) => console.log(err?.response.data.message))
      }, [refresh])

      useEffect(() => {
        if (search.trim().length === 0) {
          setFilteredBlogs(blogs);
          return;
        }
        const searchedBlogs = blogs.filter((blog) => {
          if (
            (blog.shelter.name &&
              blog.shelter.name.toLowerCase().includes(search.toLowerCase())) ||
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
        setFilteredBlogs(searchedBlogs);
      }, [search]);

      
        const handleApproveBlog = async (blogId: string): Promise<boolean> => {
          try {
            // console.log(blogId);
            await authAxios.put(`${blogAPI}/${blogId}/moderate-blog/approve`);
            toast.success("Duyệt chấp thuận blog thành công!")
            return true;
          } catch (error: any) {
            toast.error(error?.response.data.message);
            return false;
          } finally{
            setRefresh(prev => !prev);
          }
        };

        const handleRejectBlog = async (blogId: string) : Promise<boolean> => {
          try {
            // console.log(blogId);
            await authAxios.put(`${blogAPI}/${blogId}/moderate-blog/reject`);
            toast.success("Đuyệt từ chối blog thành công!")
            return true;
          } catch (error: any) {
            toast.error(error?.response.data.message);
            return false;
          }finally{
            setRefresh(prev => !prev);
          }
        };

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
    <div className="flex flex-1 flex-col ">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12">
          <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder='Tìm kiếm...' className='mb-2'/>
        </div>
        <BlogTable
            filteredBlogs={filteredBlogs ?? []}
            setViewBlogMode={setViewBlogMode}
            setEditBlogMode={setEditBlogMode}
            setSelectedBlog={setSelectedBlog}
            deleteBlog={deleteBlog}
            handleApproveBlog={handleApproveBlog}
            handleRejectBlog={handleRejectBlog}
          />
      </div>
    </div>
  );
}

export default ModeratingBlogs;