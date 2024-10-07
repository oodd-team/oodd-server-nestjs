export class UserPostsDto {
    id: number;
    isRepresentative: boolean;
    createdAt: Date;
    deletedAt: Date;
    images: {
        id: number;
        url: string;
        orderNum: number;
    } [];
    likeCount: number;
    commentCount: number;
}