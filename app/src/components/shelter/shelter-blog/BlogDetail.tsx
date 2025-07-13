import React, { useContext, useEffect, useState } from "react";
import type { Blog } from "@/types/Blog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import AppContext from "@/context/AppContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/utils/dateUtils";
import BlogRecommendation from "./BlogRecommendation";


const mockBlog: Blog = {
  _id: "64fadb28cfae1a4a2e9381ab",
  shelter: "64fa1de7f7d12345a9b1cde9", // ID của trạm cứu hộ
  thumbnail_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIkP9sI_AuNBKBiH1YRqd7EpTyqpMxtNhw7g&s",
  title: "Cách chăm sóc chó con mùa hè",
  description:
    "Tìm hiểu cách chăm sóc chó con trong những tháng hè oi bức để đảm bảo sức khỏe và sự phát triển toàn diện.",
  content: `
    <h2>1. Giữ cho chó luôn mát mẻ</h2>
    <p>Trong những ngày nắng nóng, hãy đảm bảo chó con luôn có nước sạch và chỗ mát để nghỉ ngơi. Tránh dẫn chó đi dạo vào giữa trưa.</p>
    <h2>2. Chế độ ăn phù hợp</h2>
    <p>Chọn thức ăn dễ tiêu hóa, tránh các loại thực phẩm quá nhiều đạm hoặc dầu mỡ. Cung cấp thêm rau củ tươi để bổ sung vitamin.</p>
    <h2>3. Vệ sinh thường xuyên</h2>
    <p>Tắm rửa định kỳ để loại bỏ bụi bẩn và ký sinh trùng. Nên sử dụng sữa tắm chuyên dụng cho chó con.</p>
    <h2>4. Dấu hiệu cảnh báo sốc nhiệt</h2>
    <p>Nếu chó có dấu hiệu thở gấp, chảy nước dãi nhiều, nằm li bì – hãy đưa đến bác sĩ thú y ngay lập tức.</p>
    <p>👉 Hãy luôn để ý và chăm sóc người bạn nhỏ này như một thành viên trong gia đình!</p>
  `,
  status: "published",
  createdAt: "2025-07-01T10:00:00Z",
  updatedAt: "2025-07-09T12:30:00Z",
};

const BlogDetail = () => {
    const [blog, setBlog] = useState<Blog>();
    const {blogAPI} = useContext(AppContext);
    const {blogId} = useParams();
    useEffect(() => {
        // axios.get(`${blogAPI}/get-by-id/${blogId}`)
        // .then(result => setBlog(result.data))
        // .catch(error => console.log(error?.response.data.message))

        setBlog(mockBlog);
    }, [])



  if (!blog) return <div className="text-center text-gray-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="px-20 py-10 grid grid-cols-12">
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
            <BreadcrumbLink href={`/shelters/${blog.shelter}`}>
              {blog.shelter}
            </BreadcrumbLink>
          </BreadcrumbItem>
                  <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shelters/${blog.shelter}`}>
              Blog
            </BreadcrumbLink>
          </BreadcrumbItem>
        <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shelters/${blog.shelter}/blog/${blog._id}`}>
              {blog._id}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="col-span-2 mx-auto py-8 flex flex-col gap-2">
        <h4 className="font-semibold">Những bài viết cùng trạm</h4>
        <BlogRecommendation blog={mockBlog}/>
        <BlogRecommendation blog={mockBlog}/>
        <BlogRecommendation blog={mockBlog}/>
      </div>
        <div className="max-w-5xl mx-auto py-8 col-span-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex gap-2 mb-2">
            <Avatar className="h-12 w-12"><AvatarImage src={blog.thumbnail_url} alt="shelter avatar" /></Avatar>
            <div>
              {blog.shelter?.name || "Trạm A"} 
              <p className="flex">
                {getTimeAgo(new Date(blog.createdAt))}
              </p>
            </div>
          </div>
          {blog.thumbnail_url && (
            <img
              src={blog.thumbnail_url}
              alt="Blog Thumbnail"
              className="w-full h-auto max-h-[500px] object-cover rounded-md mb-6"
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
