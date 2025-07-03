export interface Option {
  title: string;
  isTrue: boolean;
}

export type Priority = "none" | "low" | "medium" | "high";
export type Status = "active" | "inactive";
export type QuestionType = "SINGLECHOICE" | "MULTIPLECHOICE" | "TEXT";
export interface Question {
  _id: string;
  title: string;
  priority: Priority;
  options: Option[];
  status: Status;
  type: QuestionType;
  createdAt: Date;
  updatedAt: Date;
}


export const mockQuestions: Question[] = [
{
  _id: "6140b2e5f1a4c2a3b4d5e6f7",
  title: "Chủ đề của React là gì?",
  priority: "medium",
  options: [
    { title: "A library for building user interfaces", isTrue: true },
    { title: "A database", isTrue: false },
    { title: "A CSS framework", isTrue: false },
    { title: "A testing tool", isTrue: false },
  ],
  status: "active",
  type: "SINGLECHOICE",
  createdAt: new Date("2025-01-01T08:00:00.000Z"),
  updatedAt: new Date("2025-01-02T09:30:00.000Z"),
},
{
  _id: "6140b2e5f1a4c2a3b4d5e6f8",
  title: "Chọn các phương thức HTTP thường dùng trong REST API",
  priority: "high",
  options: [
    { title: "GET", isTrue: true },
    { title: "POST", isTrue: true },
    { title: "CONNECT", isTrue: false },
    { title: "DELETE", isTrue: true },
  ],
  status: "active",
  type: "MULTIPLECHOICE",
  createdAt: new Date("2025-02-15T10:15:00.000Z"),
  updatedAt: new Date("2025-02-16T11:45:00.000Z"),
},
{
  _id: "6140b2e5f1a4c2a3b4d5e6f9",
  title: "Giải thích cơ chế hoạt động của JavaScript event loop",
  priority: "low",
  options: [],
  status: "active",
  type: "TEXT",
  createdAt: new Date("2025-03-10T14:20:00.000Z"),
  updatedAt: new Date("2025-03-10T14:20:00.000Z"),
},
];

