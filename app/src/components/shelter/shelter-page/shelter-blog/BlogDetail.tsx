import React, { useContext, useEffect, useState } from "react";
import {type Blog} from "@/types/Blog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import AppContext from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/utils/dateUtils";
import BlogRecommendation from "./BlogRecommendation";


const BlogDetail = () => {
    const [blog, setBlog] = useState<Blog>();
    const [recommendBlogs, setRecommendBlogs] = useState<Blog[]>([]);
    const {blogAPI} = useContext(AppContext);
    const {blogId, shelterId} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(AppContext);
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
        {recommendBlogs && recommendBlogs.map((item, index) => {
          return <BlogRecommendation blog={item} key={index} />
        })}
      </div>
        <div className="col-span-9 mx-auto py-8 w-full">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex mb-2 justify-between">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <Avatar className="h-8 w-8 my-auto"><AvatarImage src={blog.shelter.avatar} alt="shelter avatar"   className="cursor-pointer"  onClick={() => navigate(`/shelters/${shelterId}`)}/></Avatar>
              <div>
                <span className="text-md font-md">{blog.shelter?.name || "Trạm A"}</span>
                <p className="flex">
                  {getTimeAgo(new Date(blog.createdAt))}
                </p>
              </div>
            </div>
            {
              user && user.location && blog.shelter.location && blog.shelter.address &&
              <div className="text-sm italic text-muted-foreground">
                {/* <p>{calculateDistance(blog.shelter.location, user?.location)}</p> */}
                <p><strong>Địa điểm</strong>: {blog.shelter.address}</p>
              </div>
            }
          </div>
          {blog.thumbnail_url && (
            <img
              src={blog.thumbnail_url}
              alt="Blog Thumbnail"
              className="w-full h-auto max-h-[40vh] object-cover rounded-md mb-6"
            />
          )}
          {blog.description && (
            <p className="italic text-lg mb-6">{blog.description}</p>
          )}
          <div
            className="prose prose-lg max-w-none text-justify [&>*]:mb-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <div className="mt-10 text-sm text-right text-gray-500 italic">
            Cập nhật lần cuối: {getTimeAgo(new Date(blog.updatedAt))}
          </div>
        </div>
    </div>
  );
};

export default BlogDetail;
