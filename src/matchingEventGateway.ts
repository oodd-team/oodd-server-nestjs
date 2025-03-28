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

  private connectedClients = new Map<number, string>(); // userId -> socketId 매핑
  private pendingMatchings = new Map<number, any>(); // userId -> pendingMatching

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

  afterInit(server: Server) {
    console.log('Initialized', JSON.stringify(server.sockets));
  }

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.addClient(client, userId);
      console.log(`User ${userId} Connected ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected', client.id);
    this.removeClient(client);
  }

  // 클라이언트 추가 메서드
  addClient(client: Socket, userId: number) {
    this.connectedClients.set(userId, client.id);

    // 오프라인 시 받은 매칭을 연결 시 전송
    const pendingMatching = this.pendingMatchings.get(userId);
    if (pendingMatching) {
      this.server.to(client.id).emit('getLatestMatching', pendingMatching);
      this.pendingMatchings.delete(userId);
    }
  }

  // 클라이언트 삭제 메서드
  removeClient(client: Socket) {
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        this.connectedClients.delete(userId);
        break;
      }
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
        client.emit('error', '이미 매칭이 존재합니다.');
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
      await this.matchingService.createMatching(payload);

      const latestMatching =
        await this.matchingService.getLatestMatching(targetId);

      const targetSocketId = this.connectedClients.get(targetId);
      if (targetSocketId) {
        this.server
          .to(targetSocketId)
          .emit('getLatestMatching', latestMatching);
      } else {
        // 오프라인 상태면 보류 중인 매칭 저장
        this.pendingMatchings.set(targetId, latestMatching);
      }
    } catch (error) {
      client.emit('error', '매칭 신청 처리 중 오류가 발생했습니다.');
    }
  }

  @SubscribeMessage('getMatching')
  async handleGetMatching(client: Socket, payload: { userId: number }) {
    const { userId } = payload;
    try {
      const nextMatching = await this.matchingService.getNextMatching(userId);

      client.emit('nextMatching', nextMatching);
    } catch (error) {
      client.emit('error', '매칭 조회 중 오류가 발생했습니다.');
    }
  }

  @SubscribeMessage('getAllMatchings')
  async handleGetAllMatchings(client: Socket, payload: { userId: number }) {
    const { userId } = payload;
    try {
      const matchings = await this.matchingService.getMatchings(userId);

      client.emit('matchings', matchings);
    } catch (error) {
      client.emit('error', '매칭 조회 중 오류가 발생했습니다.');
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

      await this.matchingService.patchMatchingRequestStatus(matching, payload);
      const nextMatching = await this.matchingService.getNextMatching(
        matching.target.id,
      );

      client.emit('nextMatching', nextMatching);
    } catch (error) {
      client.emit('error', '매칭 상태 변경 처리 중 오류가 발생했습니다.');
    }
  }

  @SubscribeMessage('getLatestMatching')
  async handleGetLatestMatching(client: Socket, payload: { userId: number }) {
    const { userId } = payload;
    try {
      const latestMatching =
        await this.matchingService.getLatestMatching(userId);

      if (!latestMatching) {
        const joinedAt = await this.userService.getCreatedAtById(userId);
        client.emit('matchingNotFound', joinedAt);
        return;
      }

      client.emit('getLatestMatching', latestMatching);
    } catch (error) {
      client.emit('error', '매칭 조회 중 오류가 발생했습니다.');
    }
  }
}
