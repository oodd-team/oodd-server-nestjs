import { Body, Controller, Post } from '@nestjs/common';
import { PostImageService } from './post-image.service';
import { InstagramAccountDto } from './dtos/request/instagram-account.dto';
import { InstagramFeedDto } from './dtos/response/instagram-feed.dto';
import { PhotoUploadDto } from './dtos/request/upload-image.dto';

@Controller('post-image')
export class PostImageController {
    constructor(private readonly postImageService: PostImageService) {}

    @Post('instagram-feed')
    async getInstagramFeed(@Body() accountDto: InstagramAccountDto): Promise<InstagramFeedDto[]> {
        return await this.postImageService.getInstagramFeed(accountDto);
    }
    
    @Post('image-upload')
    async uploadLocalPhoto(@Body() uploadDto: PhotoUploadDto): Promise<string[]> {
        return await this.postImageService.uploadLocalPhoto(uploadDto);
    }
}
