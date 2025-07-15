import React from 'react'
import { DataTableBlogs } from './data-table-blogs';
import type { ColumnDef } from '@tanstack/react-table';
import type { Blog } from '@/types/Blog';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Ban, Eye, MoreHorizontal, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type BlogTableProps = {
    filteredBlogs: Blog[];
    setViewBlogMode: React.Dispatch<React.SetStateAction<boolean>>;
    setEditBlogMode: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedBlog: React.Dispatch<React.SetStateAction<Blog | undefined>>;
    deleteBlog: (blogId: string) => Promise<void>
}

const BlogTable = ({filteredBlogs,setViewBlogMode, setEditBlogMode, setSelectedBlog, deleteBlog}: BlogTableProps) => {
    const columns: ColumnDef<Blog>[] = [
       {
         header: "STT",
         cell: ({ row }) => <p className="text-left px-2">{row.index + 1}</p>,
       },
       {
         accessorKey: "thumbnail_url",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               className="cursor-pointer"
             >
               Ảnh nền
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
            row.original.thumbnail_url &&
               <img
                 src={row.original.thumbnail_url}
                 alt={row.original._id}
                 className="h-10 w-10 rounded-full object-cover mx-auto"
               />
           );
         },
       },
       {
         accessorKey: "title",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Tiêu đề
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             <p className="max-w-[12vw] truncate">
               {row.original.title}
             </p>
           );
         },
       },
       {
         accessorKey: "status",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Trạng thái
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
            const isModerating = row.original.status === "moderating"; 
           return (
             <Badge variant={isModerating ? "secondary" : "default"}>
               {isModerating ? "Chờ duyệt" : "Đã đăng"}
             </Badge>
           );
         },
       },
       {
         accessorKey: "createdAt",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Ngày tạo
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             new Date (row.original.createdAt).toLocaleString("vi-VN", {dateStyle: "short"})
           );
         },
       },
       {
         id: "actions",
         header: () => "Hành động",
         cell: ({ row }) =>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                   <MoreHorizontal className="w-4 h-4" />
                 </Button>
               </DropdownMenuTrigger>

               <DropdownMenuContent
                 align="center"
                 sideOffset={0}
                 className="w-50 rounded-md border bg-background shadow-lg p-1"
               >
                 <DropdownMenuItem 
                     onSelect={() => {
                        setSelectedBlog(row.original)
                        setViewBlogMode(true);
                        setEditBlogMode(false)
                     }}
                     className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
                       <Eye className="w-4 h-4" />
                       Xem chi tiết blog
                 </DropdownMenuItem>
                                 <DropdownMenuItem 
                     onSelect={() => {
                        setSelectedBlog(row.original)
                        setEditBlogMode(true)
                        setViewBlogMode(false);
                     }}
                     className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
                       <Pencil className="w-4 h-4" />
                       Chỉnh sửa blog
                 </DropdownMenuItem>
                <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <DropdownMenuItem 
                     onSelect={(e) => e.preventDefault()}
                     className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
                       <Ban className="w-4 h-4" />
                       Xóa blog
                     </DropdownMenuItem>
                   </AlertDialogTrigger>

                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>
                         Xác nhận xóa blog
                       </AlertDialogTitle>
                       <AlertDialogDescription className="flex gap-2">
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Hủy</AlertDialogCancel>
                       <AlertDialogAction onClick={() => deleteBlog(row?.original._id)}
                       >
                         Xác nhận
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
               </DropdownMenuContent>
             </DropdownMenu>
           
       },
     ];

  return (
    <DataTableBlogs columns={columns} data={filteredBlogs ?? []} />
  )
}

export default BlogTable