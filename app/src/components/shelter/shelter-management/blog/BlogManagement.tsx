import React, { useContext, useEffect, useState } from 'react'
import BlogTable from './BlogTable';
import { useParams } from 'react-router-dom';
import AppContext from '@/context/AppContext';
import type { Blog } from '@/types/Blog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import EditBlog from './EditBlog';
import BlogDetail from './BlogDetail';
import CreateBlog from './CreateBlog';
import useAuthAxios from '@/utils/authAxios';
import { toast } from 'sonner';
import { SearchFilter } from '@/components/SearchFilter';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
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
            className="flex gap-2 hover:amber-500"
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
            className="flex gap-2 hover:amber-500"
          >
            <ArrowLeft className="h-4 w-4 my-auto" /> Quay lại
          </p>
          <BlogDetail blog={selectedBlog} />
        </>
      )}
      {!viewBlogMode && !editBlogMode && (
        <>
          <div className="flex justify-between mb-2 gap-2">
            {/* <SearchFilter<Blog>
              data={blogs}
              searchFields={["title"]}
              onResultChange={setFilteredBlogs}
              placeholder="Tìm theo tên"
            /> */}
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

export default BlogManagement