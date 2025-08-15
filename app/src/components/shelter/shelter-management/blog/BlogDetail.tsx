import { format } from "date-fns";
import type { Blog } from "@/types/Blog";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BlogDetail = ({blog}: {blog: Blog | undefined}) => {

  if (!blog) return <div className="text-center text-gray-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="px-20 py-10">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 mb-4">
            {blog.title}
          </h1>
          <div className='flex gap-2 mb-2'>
            <Avatar className="ring ring-2 ring-primary">
              <AvatarImage src={blog.createdBy.avatar} alt={`avatar cua ${blog.createdBy.fullName}`} />
              <AvatarFallback>{blog.createdBy?.fullName && blog.createdBy.fullName[0]}</AvatarFallback>
            </Avatar>
            <p className='my-auto truncate max-w-[10vw]'>{blog.createdBy.fullName}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6 flex gap-2">
            <Calendar className="w-5 h-5"/> {format(new Date(blog.createdAt), "dd/MM/yyyy HH:mm")}
          </p>
          {blog.thumbnail_url && (
            <img
              src={blog.thumbnail_url}
              alt="Blog Thumbnail"
              className="w-full h-auto max-h-[500px] object-cover rounded-md mb-6"
            />
          )}
          {blog.description && (
            <p className="italic text-lg text-gray-700 mb-6">{blog.description}</p>
          )}
          <div
            className="prose prose-lg max-w-none text-justify [&>*]:mb-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <div className="mt-10 text-sm text-right text-gray-500 italic">
            Cập nhật lần cuối: {format(new Date(blog.updatedAt), "dd/MM/yyyy HH:mm")}
          </div>
        </div>
    </div>
  );
};

export default BlogDetail;
