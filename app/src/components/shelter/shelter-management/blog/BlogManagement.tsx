import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogList from './BlogList';
import ModeratingBlogs from './ModeratingBlogList';

const BlogManagement = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2 text-center">Quản lý bài viết blog trong trạm</h3>
          <BlogList />
      </div>
    </div>
  );
}

export default BlogManagement;