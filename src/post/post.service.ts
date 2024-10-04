import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
      ) {}
    
      async findAll(userId?: number): Promise<Post[]> {
        if (userId){
            return this.postRepository.find({
                where: {user: {id: userId}},
                relations: ['user', 'postImages', 'postComments', 'postLikes'],
        });
      }
        return this.postRepository.find({
            relations: ['user', 'postImages', 'postComments', 'postLikes'],
        });
    }
}
