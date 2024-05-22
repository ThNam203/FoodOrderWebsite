import { User } from "./User";

export type Comment = {
    id: number;
    rating: number;
    createdAt: string;
    title: string;
    content: string;
    user: User;
}