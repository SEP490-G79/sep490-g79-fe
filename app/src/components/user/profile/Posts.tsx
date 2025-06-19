import React, { useState, useContext } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Globe, GlobeLock, Heart, MessageSquare, Ellipsis, Pin, Trash2, Pencil, SmileIcon, ImageIcon, MapIcon, TagIcon, MapPinIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import EmojiPicker from "emoji-picker-react";
import { useRef, useEffect } from "react";
import AppContext from "@/context/AppContext";




dayjs.extend(relativeTime);
dayjs.locale("vi");

function Posts() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Record<string | number, boolean>>({});
  const [expandedPostEdit, setExpandedPostEdit] = useState<Record<string | number, boolean>>({});
  const [showPicker, setShowPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [postContent, setPostContent] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false);



  const { userProfile } = useContext(AppContext);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  interface PostType {
    id: string | number;
    createdBy: string;
    title: string;
    privacy: string;
    photos: string[];
    likedBy: string[];
    status: string;
    createdAt: string;
  }

  const [editingPost, setEditingPost] = useState<PostType | null>(null);

  const posts = [
    {
      id: 1,
      createdBy: "Trần Hữu Hảo",
      title: `Tên lửa siêu vượt âm Fattah là vũ khí có tốc độ tối thiểu gấp 5 lần âm thanh (Mach 5), tương đương hơn 6.200 km/h. IRGC ra mắt tên lửa Fattah hồi tháng 6/2023, mô tả đây là "bước nhảy vọt lớn trong lĩnh vực tên lửa" của nước này. Giới chức Iran cho hay Fattah có tầm bắn 1.400 km, tốc độ tối đa khoảng 15.000 km/h, nhanh gấp 14 lần âm thanh, và có khả năng "xuyên thủng mọi lá chắn phòng thủ".

Tuy nhiên, có nhiều đánh giá liên quan đến tên lửa này. Bộ Quốc phòng Israel từng nhận định Fattah là tên lửa một tầng đẩy dùng nhiên liệu rắn, dựa trên thiết kế cơ sở của Kheibar Shekan. Nó mang được đầu đạn hồi quyển cỡ lớn có khả năng cơ động (MaRV), nhờ được lắp động cơ đẩy cỡ nhỏ để tăng tốc và thay đổi đường bay sau khi tách khỏi tầng đẩy.

MaRV có tính năng tương tự phương tiện lướt siêu vượt âm, nhưng cơ động kém hơn và chủ yếu vẫn bay theo quỹ đạo cố định trong giai đoạn giữa hành trình. Điều này khiến một số chuyên gia cho rằng Fattah chỉ là tên lửa đạn đạo thông thường, không thuộc nhóm vũ khí siêu vượt âm, vì thiếu khả năng cơ động liên tục ở tốc độ cao trong bầu khí quyển để vượt qua lưới phòng không đối phương.

Dù vậy, MaRV vẫn sở hữu những khả năng vượt trội so với đầu đạn thông thường như đột ngột tăng độ cao khi lao tới mục tiêu và tạo ra đường bay trồi sụt, giúp tăng tầm bắn, điều chỉnh hướng bay và gây khó khăn cho lá chắn tên lửa đối phương.
IDF đã nắm được thông tin về số người thương vong do hỏa lực của chúng tôi khi đám đông tiến đến gần. Thông tin chi tiết về sự việc đang được xem xét. IDF lấy làm tiếc về bất cứ tổn hại nào với những người không liên quan và đang hành động để giảm thiểu thiệt hại tối đa cho người dân Gaza, trong khi vẫn đảm bảo an toàn cho binh sĩ", tuyên bố có đoạn.

Hình ảnh trên mạng xã hội cho thấy hàng chục thi thể không nguyên vẹn nằm trên đường chính phía đông Khan Younis. Các nhân chứng cho biết xe tăng Israel đã bắn ít nhất hai phát vào đám đông hàng nghìn người tụ tập trên tuyến đường này với hy vọng nhận được thức ăn từ các xe tải cứu trợ đi qua.

"Họ để chúng tôi tiến lên phía trước, rồi xe tăng bất ngờ nã đạn", Alaa, một nhân chứng kể lại tại bệnh viện Nasser, nơi các nạn nhân bị thương nằm la liệt trên sàn, ngoài hành lang. Ít nhất 20 người bị thương đang trong tình trạng nguy kịch.`,

      privacy: "public",
      photos: [
        "https://i.pinimg.com/736x/b8/c4/b9/b8c4b99567ca22c481880d7983d60b1e.jpg",
        "https://i.pinimg.com/736x/c8/3b/c9/c83bc998e196e566b46a2bc60f169d42.jpg",
        "https://i.pinimg.com/736x/06/f1/04/06f10465e63c9877dcc815e014ee1a3a.jpg",
        "https://i.pinimg.com/736x/aa/29/5b/aa295bd9c166296bebbed87cdf118f5d.jpg",
        "https://i.pinimg.com/736x/aa/29/5b/aa295bd9c166296bebbed87cdf118f5d.jpg",
        "https://i.pinimg.com/736x/d8/8d/66/d88d66b30a635e86379654164d0e8a98.jpg",
      ],
      likedBy: ["hao", " hehe"],
      status: "active",
      createdAt: "2025-06-17T07:10:49.904Z",
    },
    {
      id: "2",
      createdBy: "Trần Hữu Hảo",
      title: "My private moment",
      privacy: "private",
      photos: ["https://i.pinimg.com/736x/b8/c4/b9/b8c4b99567ca22c481880d7983d60b1e.jpg"],
      likedBy: ["hehe"],
      status: "hidden",
      createdAt: "2025-03-01T10:00:00Z",
    },
    {
      id: "3",
      createdBy: "Trần Hữu Hảo",
      title: "Sunset memories",
      privacy: "public",
      photos: [],
      likedBy: ["hao"],
      status: "active",
      createdAt: "2025-06-01T10:00:00Z",
    },
  ];

  const user = {
    fullName: "Hảo trần",
    bio: "Game thủ vô tri!",
    location: "Hanoi, Vietnam",
    background:
      "https://i.pinimg.com/736x/c8/3b/c9/c83bc998e196e566b46a2bc60f169d42.jpg",
    avatar:
      "https://i.pinimg.com/736x/b8/c4/b9/b8c4b99567ca22c481880d7983d60b1e.jpg",
    email: "FV2rD@example.com",
    dob: "01/01/2000",
  };

  const formatCreatedAt = (date: string | Date): string => {
    const now = dayjs();
    const target = dayjs(date);

    if (now.isSame(target, 'day')) {
      return target.fromNow();
    }

    return target.format('DD/MM/YYYY');
  };
  const [postsData, setPostsData] = useState(posts);
  const currentUserId = "hao";

  const toggleExpand = (postId: string | number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleEditExpand = (postId: string | number) => {
    setExpandedPostEdit(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleLike = (postId: string | number) => {
    setPostsData(prev =>
      prev.map(item =>
        item.id === postId
          ? {
            ...item, likedBy: item.likedBy.includes(currentUserId)
              ? item.likedBy.filter(id => id !== currentUserId)
              : [...item.likedBy, currentUserId]
          }
          : item
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-0 mt-[10px] relative z-10 min-h-screen mb-10">
        <div className="space-y-6 lg:w-2/3 mr-10">
          <div
  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer"
  onClick={() => setOpenCreatePostDialog(true)}
>
  <img
    src={userProfile?.avatar || "/placeholder.svg"}
    alt="Avatar"
    className="w-10 h-10 rounded-full border"
  />

  <div
    className="flex-1 bg-gray-100 dark:bg-gray-700 text-muted-foreground px-4 py-2 rounded-full text-sm"
  >
    Bạn đang nghĩ gì?
  </div>
</div>


          <Dialog open={openCreatePostDialog} onOpenChange={setOpenCreatePostDialog}>
            <DialogContent className="sm:max-w-[600px] p-0  ">
              {/* Header của dialog */}
              <DialogHeader className="border-b px-6 pt-4 pb-2 bg-background">
                <DialogTitle className="text-lg font-semibold">Tạo bài viết</DialogTitle>
              </DialogHeader>

              {/* Nội dung */}
              <div className="px-6 pb-6 pt-4 space-y-4 bg-background">
                {/* Avatar + chọn quyền riêng tư */}
                <div className="flex items-start gap-3">
                  <img
                    src={userProfile?.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border border-border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{userProfile?.fullName}</span>
                    <Select defaultValue="public">
                      <SelectTrigger className="w-[140px] h-7 text-xs mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <Globe className="mr-2 h-4 w-4" /> Công khai
                        </SelectItem>
                        <SelectItem value="private">
                          <GlobeLock className="mr-2 h-4 w-4" /> Riêng tư
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Nội dung bài viết */}
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Bạn đang nghĩ gì?"
                  className="resize-none min-h-[100px] border-0 border-b focus:ring-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground"
                />

                {/* Hành động bổ sung */}
                <div className="flex gap-4 text-muted-foreground relative pl-1">
                  <div className="relative">
                    <SmileIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setShowPicker(!showPicker)}
                    />
                    {showPicker && (
                      <div
                        ref={emojiPickerRef}
                        className="absolute z-[9999] -top-50 -left-95"
                      >
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setPostContent((prev) => prev + emojiData.emoji);
                            setShowPicker(false);
                          }}
                          autoFocusSearch={false}
                        />
                      </div>
                    )}
                  </div>

                  <ImageIcon className="w-5 h-5 cursor-pointer" />
                  <MapPinIcon className="w-5 h-5 cursor-pointer" />
                </div>

                {/* Nút đăng bài */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => {
                      // Gửi bài viết ở đây
                      setOpenCreatePostDialog(false);
                    }}
                  >
                    Đăng bài
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>



          {postsData?.map((post) => (

            <Card key={post?.id} className="border-secondary dark:bg-gray-800  shadow-xl">
              <CardHeader className="pt-0 relative">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full border border-secondary shadow-md"
                    />
                    <div className="flex flex-col justify-top h-14">
                      <span>{post.createdBy}</span>
                      <div className="text-xs text-sidebar-ring flex items-center gap-2">
                        <span>{formatCreatedAt(post.createdAt)}</span>
                        {post.privacy === "private" ? (
                          <GlobeLock size={16} className="text-sidebar-ring" />
                        ) : (
                          <Globe size={16} className="text-sidebar-ring" />
                        )}
                      </div>
                    </div>


                  </div>
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-2 right-2 p-2 hover:bg-muted rounded-md">
                      <Ellipsis className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    alignOffset={0}
                    className="w-48 p-1 rounded-lg shadow-md border z-50"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingPost({ ...post });
                        setIsEditModalOpen(true);
                      }}


                      className="flex items-center gap-2 hover:bg-accent cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem

                      className="flex items-center gap-2 hover:bg-accent cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Xóa bài đăng</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <CardDescription className="text-sm text-gray-500 mt-4">
                  <div className="text-sm text-sidebar-foreground whitespace-pre-line">
                    {post.title.length > 400 && !expandedPosts[post.id]
                      ? `${post.title.slice(0, 300)}...`
                      : post.title}
                  </div>

                  {post.title.length > 400 && (
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="text-blue-500 text-sm underline mt-1"
                    >
                      {expandedPosts[post.id] ? "Ẩn bớt" : "Xem thêm"}
                    </button>
                  )}

                </CardDescription>


              </CardHeader>
              {post?.photos.length > 0 && (
                <CardContent>
                  <PhotoProvider maskOpacity={0} >
                    {post.photos.length === 1 && (
                      <PhotoView src={post.photos[0]}>
                        <img
                          src={post.photos[0]}
                          alt="Single"
                          className="w-full h-80 object-cover rounded-lg cursor-pointer"
                        />
                      </PhotoView>
                    )}

                    {post.photos.length === 2 && (
                      <div className="grid grid-cols-2 gap-2">
                        {post.photos.map((url, idx) => (
                          <PhotoView key={idx} src={url}>
                            <img
                              src={url}
                              alt={`Photo ${idx}`}
                              className="w-full h-64 object-cover rounded-lg cursor-pointer"
                            />
                          </PhotoView>
                        ))}
                      </div>
                    )}

                    {post.photos.length === 3 && (
                      <div className="grid grid-cols-3 gap-2">
                        <PhotoView src={post.photos[0]}>
                          <img
                            src={post.photos[0]}
                            alt="Photo 0"
                            className="col-span-2 h-64 object-cover rounded-lg cursor-pointer"
                          />
                        </PhotoView>
                        <div className="flex flex-col gap-2">
                          {post.photos.slice(1).map((url, idx) => (
                            <PhotoView key={idx} src={url}>
                              <img
                                src={url}
                                alt={`Photo ${idx + 1}`}
                                className="h-31 object-cover rounded-lg cursor-pointer"
                              />
                            </PhotoView>
                          ))}
                        </div>
                      </div>
                    )}

                    {post.photos.length > 3 && (
                      <div className="grid grid-cols-2 gap-2 relative">
                        {post.photos.slice(0, 3).map((url, idx) => (
                          <PhotoView key={idx} src={url}>
                            <img
                              src={url}
                              alt={`Photo ${idx}`}
                              className="w-full h-40 object-cover rounded-lg cursor-pointer"
                            />
                          </PhotoView>
                        ))}
                        <PhotoView src={post.photos[3]}>
                          <div className="relative cursor-pointer">
                            <img
                              src={post.photos[3]}
                              alt="Photo 3"
                              className="w-full h-40 object-cover rounded-lg brightness-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white  bg-secondary/30 text-base font-medium px-2 py-1 rounded-md backdrop-blur-none">
                                +{post.photos.length - 4}
                              </span>
                            </div>
                          </div>
                        </PhotoView>
                      </div>
                    )}

                    {post.photos.length === 0 && (
                      <p className="text-gray-400 italic">No photos</p>
                    )}
                  </PhotoProvider>
                </CardContent>
              )}

              <CardFooter className="text-sm text-gray-500 justify-between px-4">
                <div className="flex w-full">
                  <div
                    className={`flex items-center gap-1 cursor-pointer w-1/2 ml-4 ${postsData.find(item => item.id === post.id)?.likedBy.includes(currentUserId)
                      ? 'text-red-500'
                      : ''
                      }`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart className="w-5 h-5" />
                    <span>
                      {postsData.find(item => item.id === post.id)?.likedBy.length ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 justify-start w-1/2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Bình luận</span>
                  </div>
                </div>
              </CardFooter>



            </Card>
          ))}
        </div>
        <div className="w-full lg:w-1/3">{/* Sidebar (if any) */}</div>
      </div>
      {isEditModalOpen && editingPost && (
        <PhotoProvider>
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>

            <DialogContent
              className="max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <DialogHeader>
                <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
              </DialogHeader>

              {/* Header tương tự Card */}
              <div className="flex items-center gap-x-3 mt-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border border-secondary shadow-md"
                />
                <div className="flex flex-col justify-top h-14">
                  <span>{editingPost.createdBy}</span>
                  <div className="text-xs text-sidebar-ring flex items-center gap-2">
                    <span>{formatCreatedAt(editingPost.createdAt)}</span>

                    {/* Dropdown chỉnh sửa quyền riêng tư */}
                    <Select
                      value={editingPost.privacy}
                      onValueChange={(value) =>
                        setEditingPost({ ...editingPost, privacy: value })
                      }
                    >
                      <SelectTrigger className="w-[130px] h-7 text-xs bg-background text-sidebar-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public"><Globe />Công khai</SelectItem>
                        <SelectItem value="private"><GlobeLock />Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Tiêu đề */}
              {editingPost && (
                <div className="mt-4">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full bg-transparent focus:outline-none pb-1"
                    style={{ minHeight: '3rem' }}
                    onInput={e => {
                      const text = (e.target as HTMLDivElement).innerText;
                      setEditingPost(prev => prev ? { ...prev, title: text } : prev);
                    }}
                  >
                    {expandedPostEdit[editingPost.id] || editingPost.title.length <= 300
                      ? editingPost.title
                      : editingPost.title.slice(0, 300)}
                  </div>
                  {editingPost.title.length > 300 && (
                    <button
                      type="button"
                      onClick={() => toggleEditExpand(editingPost.id)}
                      className="text-blue-500 text-sm mt-1"
                    >
                      {expandedPostEdit[editingPost.id] ? 'Ẩn bớt' : 'Xem thêm'}
                    </button>
                  )}
                </div>
              )}


              {/* Ảnh */}
              <div className="mt-4">
                <PhotoProvider maskOpacity={0}>
                  {editingPost.photos.length === 1 && (
                    <PhotoView src={editingPost.photos[0]}>
                      <img
                        src={editingPost.photos[0]}
                        alt="Single"
                        className="w-full h-80 object-cover rounded-lg cursor-pointer"
                      />
                    </PhotoView>
                  )}

                  {editingPost.photos.length === 2 && (
                    <div className="grid grid-cols-2 gap-2">
                      {editingPost.photos.map((url, idx) => (
                        <PhotoView key={idx} src={url}>
                          <img
                            src={url}
                            alt={`Photo ${idx}`}
                            className="w-full h-64 object-cover rounded-lg cursor-pointer"
                          />
                        </PhotoView>
                      ))}
                    </div>
                  )}

                  {editingPost.photos.length === 3 && (
                    <div className="grid grid-cols-3 gap-2">
                      <PhotoView src={editingPost.photos[0]}>
                        <img
                          src={editingPost.photos[0]}
                          alt="Photo 0"
                          className="col-span-2 h-64 object-cover rounded-lg cursor-pointer"
                        />
                      </PhotoView>
                      <div className="flex flex-col gap-2">
                        {editingPost.photos.slice(1).map((url, idx) => (
                          <PhotoView key={idx} src={url}>
                            <img
                              src={url}
                              alt={`Photo ${idx + 1}`}
                              className="h-31 object-cover rounded-lg cursor-pointer"
                            />
                          </PhotoView>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingPost.photos.length > 3 && (
                    <div className="grid grid-cols-2 gap-2 relative">
                      {editingPost.photos.slice(0, 3).map((url, idx) => (
                        <PhotoView key={idx} src={url}>
                          <img
                            src={url}
                            alt={`Photo ${idx}`}
                            className="w-full h-40 object-cover rounded-lg cursor-pointer"
                          />
                        </PhotoView>
                      ))}
                      <PhotoView src={editingPost.photos[3]}>
                        <div className="relative cursor-pointer">
                          <img
                            src={editingPost.photos[3]}
                            alt="Photo 3"
                            className="w-full h-40 object-cover rounded-lg brightness-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white  bg-secondary/30 text-base font-medium px-2 py-1 rounded-md backdrop-blur-none">
                              +{editingPost.photos.length - 4}
                            </span>
                          </div>
                        </div>
                      </PhotoView>
                    </div>
                  )}

                  {editingPost.photos.length === 0 && (
                    <p className="text-gray-400 italic">No photos</p>
                  )}
                </PhotoProvider>
              </div>

              {/* Footer hành động */}

              <DialogFooter>
                <button
                  // onClick={() => {
                  //   if (editingPost) {
                  //     setPostsData(prev =>
                  //       prev.map(item =>
                  //         item.id === editingPost.id ? { ...editingPost } : item
                  //       )
                  //     );
                  //     setIsEditModalOpen(false);
                  //   }
                  // }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Lưu thay đổi
                </button>
              </DialogFooter>

            </DialogContent>
          </Dialog>
        </PhotoProvider>
      )}
    </>
  );
}

export default Posts;
