export interface CommentType {
    _id: string;
    post: string;
    commenter: {
        _id: string;
        fullName: string;
        avatar: string;
    };
    message: string;
    status: "visible" | "hidden" | "deleted";
    createdAt: string;
    updatedAt?: string;
}