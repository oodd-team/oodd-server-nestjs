import { UserDto } from 'src/user/dtos/response/userResponse.dto';
import { PostImageDto } from 'src/post-image/dtos/response/post-imageResponse.dto';

export class PostDto {
    id: number;
    content: string;
    isRepresentative: boolean;
    createdAt: Date;
    deletedAt: Date;
    images: PostImageDto[];
    user: UserDto;
    likeCount: number;
    commentCount: number;
}