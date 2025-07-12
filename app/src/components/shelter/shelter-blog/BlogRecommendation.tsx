import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Blog } from "@/types/Blog";
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "@/utils/dateUtils";


const BlogRecommendation = ({ blog} : {blog: Blog}) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg shadow-sm border overflow-hidden w-full max-w-[30vw]">
      {/* Ảnh hiển thị ngang */}
      <div>
          <img
            src={blog.thumbnail_url}
            alt={`thumbnail-${blog.title}`}
            className="object-cover h-25 w-full cursor-pointer"
            onClick={() => {
                navigate(`/shelters/${blog.shelter}/blog/${blog._id}`)
            }}
          />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2">
          {blog.title}
        </h3>
        <p className="text-sm line-clamp-3 mb-4 max-h-[8vh]">{blog.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>{getTimeAgo(new Date(blog.createdAt))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogRecommendation;
