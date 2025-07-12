import React, { useContext, useEffect, useState } from 'react'
import BlogTable from './BlogTable';
import { useParams } from 'react-router-dom';
import AppContext from '@/context/AppContext';
import type { Blog } from '@/types/Blog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import EditBlog from './EditBlog';
import BlogDetail from './BlogDetail';
import CreateBlog from './CreateBlog';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const {blogAPI} = useContext(AppContext);
    const {shelterId} = useParams();
    const [search, setSearch] = useState<string>();
    const [viewBlogMode, setViewBlogMode] = useState<boolean>(false);
    const [editBlogMode, setEditBlogMode] = useState<boolean>(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog>();

    useEffect(() => {
        // axios.get(`${blogAPI}/get-by-shelter/${shelterId}`)
        // .then(result => setBlogs(result.data))
        // .catch(error => console.log(error?.data.response.message))

        // mock blog
        setBlogs([
            {
  _id: "64fadb28cfae1a4a2e9381ab",
  shelter: "64fa1de7f7d12345a9b1cde9", // ID của trạm cứu hộ
  thumbnail_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIkP9sI_AuNBKBiH1YRqd7EpTyqpMxtNhw7g&s",
  title: "Cách chăm sóc chó con mùa hè Cách chăm sóc chó con mùa hè Cách chăm sóc chó con mùa hè Cách chăm sóc chó con mùa hè",
  description: "Tìm hiểu cách chăm sóc chó con trong những tháng hè oi bức để đảm bảo sức khỏe và sự phát triển toàn diện \
    Tìm hiểu cách chăm sóc chó con trong những tháng hè oi bức để đảm bảo sức khỏe và sự phát triển toàn diện \
    Tìm hiểu cách chăm sóc chó con trong những tháng hè oi bức để đảm bảo sức khỏe và sự phát triển toàn diện",
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
},
{
  _id: "64fadb28cfay343a4a2e9381ab",
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
}
        ])
    }, [])


  return (
    <>
      {editBlogMode && !viewBlogMode && (
        <>
          <p
            onClick={() => setEditBlogMode(false)}
            className="flex gap-2 hover:amber-500"
          >
            <ArrowLeft className="h-4 w-4 my-auto" /> Quay lại
          </p>
          <EditBlog blog={selectedBlog} />
        </>
      )}

      {viewBlogMode && !editBlogMode && (
        <>
          <p
            onClick={() => {
                setEditBlogMode(false);
                setViewBlogMode(false);
            }}
            className="flex gap-2 hover:amber-500"
          >
            <ArrowLeft className="h-4 w-4 my-auto" /> Quay lại
          </p>
          <BlogDetail blog={selectedBlog} />
        </>
      )}
      {!viewBlogMode && !editBlogMode && (
        <>
          <div className="flex justify-between mb-2">
            <Input
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <CreateBlog />
          </div>
          <BlogTable
            filteredBlogs={blogs ?? []}
            setViewBlogMode={setViewBlogMode}
            setEditBlogMode={setEditBlogMode}
            setSelectedBlog={setSelectedBlog}
          />
        </>
      )}
    </>
  );
}

export default BlogManagement