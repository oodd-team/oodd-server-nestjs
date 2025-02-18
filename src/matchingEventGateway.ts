import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchingService } from './matching/matching.service';
import {
  CreateMatchingRequest,
  PatchMatchingRequest,
} from './matching/dto/matching.request';
import { UserService } from './user/user.service';
import { UserBlockService } from './user-block/user-block.service';
import { StatusEnum } from './common/enum/entityStatus';
import { PostService } from './post/post.service';
import { ChatRoomService } from './chat-room/chat-room.service';
import { MatchingRequestStatusEnum } from './common/enum/matchingRequestStatus';

@WebSocketGateway({ namespace: '/socket/matching' })
export class MatchingEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // 소켓 서버를 정의합니다.
  @WebSocketServer()
  server: Server;
  // 유저 정보를 레디스에 적재시키기 위해서 레디스 설정이 선행되야합니다.
  constructor(
    private readonly matchingService: MatchingService,
    private readonly userService: UserService,
    private readonly userBlockService: UserBlockService,
    private readonly postService: PostService,
    private readonly chatRoomService: ChatRoomService,
  ) {}
  /*
     유저정보는 같지만 소켓이 여러개가 연결되어 있을 경우
     핸들링 할수있게 유저정보와 소켓 연결정보에 대한
     분기처리가 필요합니다.
   */
  private connectedClients = [];

  afterInit(server: Server) {
    console.log('Initialized', JSON.stringify(server.sockets));
  }

  handleConnection(client: Socket) {
    console.log('Connected', client.id);
    this.addClient(client); // 괄호 추가
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected', client.id);
    this.removeClient(client);
  }

  // 클라이언트 추가 메서드
  addClient(client: any) {
    this.connectedClients.push(client.id);
  }

  // 클라이언트 삭제 메서드
  removeClient(client: any) {
    const index = this.connectedClients.indexOf(client.id);
    if (index !== -1) {
      this.connectedClients.splice(index, 1);
    }
  }

  @SubscribeMessage('requestMatching')
  async handleRequestMatching(client: Socket, payload: CreateMatchingRequest) {
    const { requesterId, targetId } = payload;

    try {
      const target = await this.userService.getUserById(targetId);

      const blockedUserIds =
        await this.userBlockService.getBlockedUserIds(targetId);
      if (!target || blockedUserIds.includes(requesterId)) {
        const errorMessage = !target
          ? '존재하지 않는 사용자입니다.'
          : '차단된 사용자에게 매칭 신청을 보낼 수 없습니다.';
        client.emit('error', errorMessage);
        return;
      }

      if (await this.matchingService.existsMatching(requesterId, targetId)) {
        client.emit('error', '이미 매칭 요청을 보냈습니다.');
        return;
      }

      if (
        !(await this.postService.findByFields({
          where: {
            user: { id: requesterId },
            status: StatusEnum.ACTIVATED,
          },
        }))
      ) {
        client.emit('error', '신청 유저의 게시물이 존재하지 않습니다.');
        return;
      }

      const matchingInfo = await this.matchingService.createMatching(payload);
      client.emit('matchingInfo', matchingInfo);
    } catch (error) {
      client.emit('error', '매칭 신청 처리 중 오류가 발생했습니다.');
    }
  }

  @SubscribeMessage('patchMatching')
  async handlePatchMatching(client: Socket, payload: PatchMatchingRequest) {
    const { id } = payload;
    try {
      const matching = await this.matchingService.getMatchingById(id);
      const chatRoom = await this.chatRoomService.getChatRoomByMatchingId(id);
      const blockedUserIds = await this.userBlockService.getBlockedUserIds(
        matching.target.id,
      );
      if (
        !matching.requester ||
        blockedUserIds.includes(matching.requester.id)
      ) {
        const errorMessage = !matching.requester
          ? '존재하지 않는 사용자입니다.'
          : '차단한 사용자입니다.';
        client.emit('error', errorMessage);
        return;
      }

      if (!matching) {
        client.emit('error', '해당 매칭 요청을 찾을 수 없습니다.');
        return;
      }
      if (matching.requestStatus !== MatchingRequestStatusEnum.PENDING) {
        client.emit('error', '이미 처리된 요청입니다.');
        return;
      }
      if (!chatRoom) {
        client.emit('error', '채팅방을 찾을 수 없습니다.');
        return;
      }

      const patchMatching =
        await this.matchingService.patchMatchingRequestStatus(
          matching,
          payload,
        );
      const matchingStatus = {
        id: id,
        requesterId: patchMatching.requester.id,
        targetId: patchMatching.target.id,
        requestStatus: patchMatching.requestStatus,
        chatRoomId: chatRoom.id,
      };
      client.emit('matchingStatus', matchingStatus);
    } catch (error) {
      client.emit('error', '매칭 상태 변경 처리 중 오류가 발생했습니다.');
    }
  }
}
