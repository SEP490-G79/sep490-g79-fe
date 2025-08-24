import { CalendarIcon } from "lucide-react";
import type { Blog } from "@/types/Blog";
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const BlogCard = ({ blog} : {blog: Blog}) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg shadow-sm border overflow-hidden w-full h-full min-h-[10vh] max-w-[20vw] flex flex-col justify-between">
      {/* Ảnh hiển thị ngang */}
      <div>
        <img
          src={
            blog.thumbnail_url ||
            "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
          }
          alt={`thumbnail-${blog.title}`}
          className="object-cover h-40 w-full cursor-pointer"
          onClick={() => {
            navigate(`/shelters/${blog.shelter._id}/blog/${blog._id}`);
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2">{blog.title}</h3>
        <p className="text-sm  line-clamp-3 mb-4 truncate">{blog.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex flex-col justify-between w-full">
            <div className="flex gap-2 items-center">
              <Avatar className="ring-2 ring-primary">
                <AvatarImage
                  className="cursor-pointer"
                  src={blog.createdBy.avatar}
                  alt={`avatar cua ${blog.createdBy.fullName}`}
                  onClick={() => navigate(`/profile/${blog.createdBy._id}`)}
                />
                <AvatarFallback>Avt</AvatarFallback>
              </Avatar>
              <div>
                <p onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              navigate(`/profile/${blog.createdBy._id}`);
            }} 
            className="cursor-pointer hover:text-primary text-xs">{blog.createdBy.fullName}</p>
            <span className="text-sm text-muted-foreground">
              {getTimeAgo(new Date(blog.createdAt))}
            </span>
              </div>
            </div>

                            <p onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              navigate(`/shelters/${blog.shelter._id}/blog/${blog._id}`);
            }} className="truncate hover:text-primary cursor-pointer text-xs text-right">{blog.shelter.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
