import { type Blog } from "@/types/Blog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/utils/dateUtils";
import locationUtils from "@/utils/locationUtils";
import { useContext } from "react";
import AppContext from "@/context/AppContext";
import { Link, useNavigate } from "react-router-dom";


const BlogPreview = ({blog}: {blog: Blog}) => {
  const {calculateDistance} = locationUtils;
  const {user} = useContext(AppContext);
  const navigate = useNavigate();

  if (!blog) return <div className="text-center text-gray-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="py-10 gap-x-10">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">Blog mới nhất</h2>
        <div className="mx-auto py-8 w-full">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex mb-2 justify-between">
            <div className="flex gap-2 text-sm text-muted-foreground">
              <Avatar className="h-8 w-8 my-auto"><AvatarImage src={blog.shelter.avatar} alt="shelter avatar"   className="cursor-pointer"  onClick={() => navigate(`/shelters/${blog.shelter._id}`)}/></Avatar>
              <div>
                <span className="text-md font-md">{blog.shelter?.name || "Trạm A"}</span>
                <p className="flex">
                  {getTimeAgo(new Date(blog.createdAt))}
                </p>
              </div>
            </div>
            {
              // user && user.location && blog.shelter.location && blog.shelter.address &&
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
            className="prose prose-lg max-w-none text-justify [&>*]:mb-4 truncate"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          {blog.content && blog.content.length > 500 && 
            <Link to={`/shelters/${blog.shelter._id}/blog/${blog._id}`}>
              <p className="text-center font-semibold mt-2 text-blue-500 underline hover:text-amber-500">Xem thêm...</p>
              </Link>
          }
          <div className="mt-10 text-sm text-right italic text-muted-foreground">
            Cập nhật lần cuối: {getTimeAgo(new Date(blog.updatedAt))}
          </div>
        </div>
    </div>
  );
};

export default BlogPreview;
