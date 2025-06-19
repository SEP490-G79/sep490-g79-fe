import React, { useState } from "react";
import PostCard from "@/components/post/PostCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmileIcon, ImageIcon, MapPinIcon, Globe, GlobeLock } from "lucide-react";
import { useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";


function Newfeed() {
  const currentUserId = "hao";

const currentUser = 
  {
    id: "hao",
    avatar: "https://i.pinimg.com/736x/f8/ab/a4/f8aba4c637ecd88f18b58b2967f62c05.jpg",
    fullName: "Hao nè hẹ hẹ ehj",
  }


  const initialPosts = [
    {
      id: 1,
      createdBy: "Nguyễn Văn A",
      user: {
        avatar: "https://i.pinimg.com/736x/f8/ab/a4/f8aba4c637ecd88f18b58b2967f62c05.jpg",
        fullName: "Nguyễn Văn A",
      },
      title: "Newjeans never die",
      privacy: "public",
      photos: [
        "https://i.pinimg.com/736x/b8/c4/b9/b8c4b99567ca22c481880d7983d60b1e.jpg",
        "https://i.pinimg.com/736x/c8/3b/c9/c83bc998e196e566b46a2bc60f169d42.jpg",
        "https://i.pinimg.com/736x/06/f1/04/06f10465e63c9877dcc815e014ee1a3a.jpg",
        "https://i.pinimg.com/736x/aa/29/5b/aa295bd9c166296bebbed87cdf118f5d.jpg",
        "https://i.pinimg.com/736x/aa/29/5b/aa295bd9c166296bebbed87cdf118f5d.jpg",
        "https://i.pinimg.com/736x/d8/8d/66/d88d66b30a635e86379654164d0e8a98.jpg",
      ],
      likedBy: ["toi","tao"],
      status: "active",
      createdAt: "2025-06-01T10:00:00Z",
    },
    {
      id: 2,
      createdBy: "Trần B",
      user: {
        avatar: "https://i.pinimg.com/736x/7f/ea/10/7fea104bdd0286284ed2c80797657384.jpg",
        fullName: "Trần B",
      },
      title: "Hẹ Hẹ Hẹ Hẹ Hẹ ",
      privacy: "public",
      photos: ["https://i.pinimg.com/736x/07/49/c1/0749c1507d82680963885ad9a6a8d3d3.jpg"],
      likedBy: ["hao"],
      status: "active",
      createdAt: "2025-06-03T14:00:00Z",
    },
  ];

  const [postsData, setPostsData] = useState(initialPosts);
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
const [showPicker, setShowPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const emojiPickerRef = useRef<HTMLDivElement>(null);


useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    const handleLike = (postId: string | number) => {
    setPostsData(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likedBy: post.likedBy.includes(currentUserId)
                ? post.likedBy.filter(id => id !== currentUserId)
                : [...post.likedBy, currentUserId],
            }
          : post
      )
    );
  };


  return (
    <div className="space-y-6 max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Bảng tin</h1>
      {/* Form tạo bài viết */}
      <Card className="border-secondary dark:bg-gray-800 shadow-xl">
        <CardHeader className="flex flex-row items-center gap-x-3">
          <img
            src={currentUser.avatar || "/placeholder.svg"}
            alt="Avatar"
            className="w-14 h-14 rounded-full border border-secondary shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-medium">{currentUser.fullName}</span>
            <Select defaultValue={privacy} onValueChange={setPrivacy}>
              <SelectTrigger className="w-[140px] h-7 text-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <Globe className="mr-2 w-4 h-4" />Công khai
                </SelectItem>
                <SelectItem value="private">
                  <GlobeLock className="mr-2 w-4 h-4" />Riêng tư
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="mt-4 p-0">
          <Textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="resize-none min-h-[100px] border-0 border-b focus:ring-0 focus-visible:ring-0 dark:bg-gray-800 text-lg placeholder:text-muted-foreground"
          />

          <div className="flex gap-4 mt-4 pl-6 text-muted-foreground relative">
            <div className="relative">
              <SmileIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => setShowPicker(!showPicker)}
              />
              {showPicker && (
                <div ref={emojiPickerRef} className="absolute z-50 top-8">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setPostContent((prev) => prev + emojiData.emoji);
                    }}
                    autoFocusSearch={false}
                  />
                </div>
              )}
            </div>

            <ImageIcon className="w-6 h-6 cursor-pointer" />
            <MapPinIcon className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="flex justify-end mt-6 pr-6">
            <Button variant="default" >Đăng bài</Button>
          </div>
        </CardContent>
      </Card>
      {postsData.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onLike={handleLike}
      
        />
      ))}
    </div>
  );
}

export default Newfeed;
