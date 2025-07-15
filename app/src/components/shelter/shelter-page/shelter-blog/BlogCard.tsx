import { CalendarIcon } from "lucide-react";
import type { Blog } from "@/types/Blog";
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";


const BlogCard = ({ blog} : {blog: Blog}) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg shadow-sm border overflow-hidden w-full min-h-[10vh] max-w-[20vw] flex flex-col justify-between">
      {/* Ảnh hiển thị ngang */}
      <div>
          <img
            src={blog.thumbnail_url || "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"}
            alt={`thumbnail-${blog.title}`}
            className="object-cover h-40 w-full cursor-pointer"
            onClick={() => {
                navigate(`/shelters/${blog.shelter}/blog/${blog._id}`)
            }}
          />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2">
          {blog.title}
        </h3>
        <p className="text-sm  line-clamp-3 mb-4">{blog.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1 ">
            <CalendarIcon size={16} />
            <span>{getTimeAgo(new Date(blog.createdAt))}</span>
          </div>
          <Button
            className="text-sm px-3 py-1 rounded-md font-medium cursor-pointer"
            onClick={() => {
                navigate(`/shelters/${blog.shelter}/blog/${blog._id}`)
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
