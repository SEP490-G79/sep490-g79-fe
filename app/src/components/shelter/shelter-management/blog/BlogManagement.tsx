import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogList from './BlogList';
import ModeratingBlogs from './ModeratingBlogList';

const BlogManagement = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main mt-10">
          <BlogList />
      </div>
    </div>
  );
}

export default BlogManagement;