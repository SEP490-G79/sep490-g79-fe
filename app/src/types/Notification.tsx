export interface Notification {
    id: string;
    content: {
      from: {
        name: string;
        avatar: string;
      };
      description: string;
      redirectUrl: string;
    };
    seen: boolean;
    created_at: string; // ISO string
  }
  
  export const mockNotifications: Notification[] = [
    {
      id: "1",
      content: {
        from: {
          name: "Trung tâm Cứu hộ Hà Nội",
          avatar: "/avatars/rescue_hn.png",
        },
        description: "đã duyệt hồ sơ nhận nuôi của bạn",
        redirectUrl: "/applications/1",
      },
      seen: false,
      created_at: "2025-06-22T09:15:00.000Z",
    },
    {
      id: "2",
      content: {
        from: {
          name: "Trung tâm Cứu hộ Đà Nẵng",
          avatar: "/avatars/rescue_dn.png",
        },
        description: "đã cập nhật lịch tiêm phòng cho thú cưng của bạn",
        redirectUrl: "/pets/45/health",
      },
      seen: true,
      created_at: "2025-06-20T14:30:00.000Z",
    },
    {
      id: "3",
      content: {
        from: {
          name: "PawShelter",
          avatar: "/avatars/logo.png",
        },
        description: "gửi lời nhắc theo dõi sau nhận nuôi 7 ngày",
        redirectUrl: "/support/check-in",
      },
      seen: false,
      created_at: "2025-06-23T08:00:00.000Z",
    },
    {
      id: "4",
      content: {
        from: {
          name: "Trung tâm Cứu hộ Sài Gòn",
          avatar: "/avatars/rescue_sg.png",
        },
        description: "mời bạn tham gia sự kiện gây quỹ",
        redirectUrl: "/events/fundraiser",
      },
      seen: true,
      created_at: "2025-06-18T16:45:00.000Z",
    },
    {
      id: "5",
      content: {
        from: {
          name: "PawShelter",
          avatar: "/avatars/logo.png",
        },
        description: "cập nhật chính sách ủng hộ mới",
        redirectUrl: "/support/policy",
      },
      seen: false,
      created_at: "2025-06-21T11:20:00.000Z",
    },
  ];
  