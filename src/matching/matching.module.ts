import { Module, forwardRef } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { Matching } from 'src/common/entities/matching.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { UserBlock } from 'src/common/entities/user-block.entity';
import { UserBlockModule } from 'src/user-block/user-block.module';
import { EventsGateway } from 'src/eventGateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Matching]),
    ChatMessageModule,
    ChatRoomModule,
    forwardRef(() => UserModule),
    PostModule,
    UserBlockModule,
    EventsGateway,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
