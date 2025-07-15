import { type Blog, type BlogDetail } from "@/types/Blog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/utils/dateUtils";


const BlogPreview = ({blog}: {blog: Blog}) => {

  if (!blog) return <div className="text-center text-gray-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="px-20 py-10 gap-x-10">
        <div className="mx-auto py-8 w-full">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          {/* <div className="flex gap-2 mb-2">
            <Avatar className="h-12 w-12"><AvatarImage src={blog.shelter.avatar} alt="shelter avatar"   className="cursor-pointer"  onClick={() => navigate(`/shelters/${shelterId}`)}/></Avatar>
            <div>
              {blog.shelter?.name || "Trạm A"} 
              <p className="flex">
                {getTimeAgo(new Date(blog.createdAt))}
              </p>
            </div>
          </div> */}
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

export default BlogPreview;
