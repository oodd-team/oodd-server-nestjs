import { PostImageDto } from 'src/post-image/dtos/post-image.dto';

class postDto {
  postId: number;
  content: string;
  createdAt: Date;
  postImages: PostImageDto[];
}

export class GetPostsResponse {
  post: postDto[];
  user: {
    userId: number;
    nickname: string;
    profilePictureUrl: string;
  };
  isMatching: boolean; //매칭 신청 여부
}
