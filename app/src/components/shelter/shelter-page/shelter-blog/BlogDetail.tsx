import React, { useContext, useEffect, useState } from "react";
import {type Blog} from "@/types/Blog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import AppContext from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/utils/dateUtils";
import BlogRecommendation from "./BlogRecommendation";
import ReportBlogDialog from "./ReportBlog";


const BlogDetail = () => {
    const [blog, setBlog] = useState<Blog>();
    const [recommendBlogs, setRecommendBlogs] = useState<Blog[]>([]);
    const {blogAPI} = useContext(AppContext);
    const {blogId, shelterId} = useParams();
    const navigate = useNavigate();
    const {user, shelters} = useContext(AppContext);
    const currentShelter = shelters?.find(shelter => shelter.members.some(member => String(member._id) === String(user?._id)));
    useEffect(() => {
        axios.get(`${blogAPI}/${blogId}`)
        .then(result => {
          console.log(result?.data)
          setBlog(result?.data)
        })
        .catch(error => console.log(error?.response.data.message))

        axios.get(`${blogAPI}/${blogId}/recommend/${shelterId}`)
        .then(result => {
          console.log(result?.data)
          setRecommendBlogs(result?.data)
        })
        .catch(error => console.log(error?.response.data.message))
    }, [blogId])



  if (!blog) return <div className="text-center text-gray-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="px-20 py-10 grid grid-cols-12 gap-x-10">
    <Breadcrumb className="container mb-3 py-1 px-2 col-span-12">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shelters`} >
              Trung tâm cứu hộ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shelters/${blog.shelter._id}`}>
              {blog.shelter.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
                  <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shelters/${blog.shelter._id}`}>
              Blog
            </BreadcrumbLink>
          </BreadcrumbItem>
        <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shelters/${blog.shelter._id}/blog/${blog._id}`}>
              {blog.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="col-span-3 mx-auto py-8 flex flex-col gap-2 w-full">
        <h4 className="font-semibold">Những bài viết cùng trạm</h4>
        {recommendBlogs && recommendBlogs.slice(0,3).map((item, index) => {
          return <BlogRecommendation blog={item} key={index} />
        })}
      </div>
        <div className="col-span-9 mx-auto py-8 w-full">
                    {blog.thumbnail_url && (
            <img
              src={blog.thumbnail_url}
              alt="Blog Thumbnail"
              className="w-full h-auto max-h-[40vh] object-cover rounded-md mb-6"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex mb-2 justify-between">
            <div className="flex gap-2 text-sm">
              <Avatar className="my-auto ring-2 ring-primary">
              <AvatarImage className="cursor-pointer" src={blog.createdBy.avatar} alt={`avatar cua ${blog.createdBy.fullName}`} onClick={() => navigate(`/profile/${blog.createdBy._id}`)}/>
              <AvatarFallback>Avt</AvatarFallback>
            </Avatar>
              <div>
                <span className="font-semibold ">{blog.createdBy?.fullName || ""}</span>
                <p className="flex text-muted-foreground">
                  {getTimeAgo(new Date(blog.createdAt))}
                </p>
              </div>
            </div>
              <div className="text-sm italic text-muted-foreground">
                <p className="cursor-pointer transition-colors duration-200 hover:text-amber-500" onClick={() => navigate(`/shelters/${shelterId}`)}>{blog?.shelter.name}</p>
                {user && user.location && blog.shelter.location && blog.shelter.address && <p><strong>Địa điểm</strong>: {blog.shelter.address}</p>}                
              </div>
          </div>
          {blog.description && (
            <p className="italic text-lg mb-6">{blog.description}</p>
          )}
          <div
            className="prose prose-lg max-w-none text-justify [&>*]:mb-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          {blog.createdBy._id !== user?._id && String(currentShelter?._id) !== String(shelterId) &&
          <div className="flex justify-end px-2">
            <ReportBlogDialog blogId={blog?._id} key={blog?._id} />
          </div>
          }
        </div>
    </div>
  );
};

export default BlogDetail;
