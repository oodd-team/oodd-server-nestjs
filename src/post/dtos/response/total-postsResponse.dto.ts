export class TotalPostsDto {
    id: number;
    content: string;
    createdAt: Date;
    deletedAt: Date;
    images: {
        id: number;
        url: string;
        orderNum: number;
    } [];
    user: {
        id: number;
        nickname: string;
        profilePictureUrl: string;
    };
}