import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room/chat-room.service';
import { ChatMessageService } from './chat-message/chat-message.service';
import { UserService } from './user/user.service';
import { UserBlockService } from './user-block/user-block.service';
import { MatchingsResponse } from './matching/dto/matching.response';
import { MatchingService } from './matching/matching.service';
import { forwardRef, Inject } from '@nestjs/common';

//클라이언트의 패킷들이 게이트웨이를 통해서 들어오게 됩니다.
@WebSocketGateway({ namespace: '/socket/chatting' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // 소켓 서버를 정의합니다.
  @WebSocketServer()
  server: Server;
  // 유저 정보를 레디스에 적재시키기 위해서 레디스 설정이 선행되야합니다.
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
    private readonly userService: UserService,
    private readonly userBlockService: UserBlockService,
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

  @SubscribeMessage('getChatRooms')
  async handleGetChatRooms(client: Socket, payload: { userId: number }) {
    const chatRooms = await this.chatRoomService.getChatRoomsWithLatestMessage(
      payload.userId,
    );
    client.emit('chatRoomList', chatRooms);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket | null,
    payload: {
      chatRoomId: number;
      toUserId: number;
      content: string | { text: string; matching: MatchingsResponse };
      fromUserId: number;
      createdAt: string;
    },
  ) {
    const { chatRoomId, toUserId, content, fromUserId, createdAt } = payload;
    const toUser = await this.userService.getUserById(toUserId);
    const blockedUserIds =
      await this.userBlockService.getBlockedUserIds(toUserId);
    if (!toUser || blockedUserIds.includes(fromUserId)) {
      const errorMessage = !toUser
        ? '존재하지 않는 사용자입니다.'
        : '차단된 사용자에게 메시지를 보낼 수 없습니다.';
      client.emit('error', errorMessage);
      return;
    }

    // content가 객체라면 JSON 문자열로 변환해서 저장
    const messageContent =
      typeof content === 'object' ? JSON.stringify(content) : content;

    // 메시지 저장 로직
    const newMessage = await this.chatMessageService.saveMessage(
      chatRoomId,
      toUserId,
      messageContent,
      fromUserId,
      createdAt,
    );

    // 채팅방 리스트 업데이트
    const chatRooms =
      await this.chatRoomService.getChatRoomsWithLatestMessage(fromUserId);
    client.emit('chatRoomList', chatRooms);

    // 해당 채팅방에 있는 모든 사용자에게 메시지 전송
    this.server
      .to(String(chatRoomId))
      .emit('newMessage', { ...newMessage, content });
  }

  @SubscribeMessage('getChatRoomMessages')
  async handleGetChatRoomMessages(
    client: Socket,
    payload: { chatRoomId: number },
  ) {
    const messages = await this.chatMessageService.getMessagesByChatRoomId(
      payload.chatRoomId,
    );
    client.emit('chatRoomMessages', messages); // 클라이언트에 메시지 리스트 전송
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(client: Socket, payload: { chatRoomId: number }) {
    client.join(String(payload.chatRoomId));
  }

  @SubscribeMessage('leaveChatRoom')
  async deleteChatRoom(
    client: Socket,
    payload: { chatRoomId: number; userId: number },
  ) {
    const { chatRoomId, userId } = payload;

    try {
      await this.chatRoomService.deleteChatRoom(chatRoomId, userId);
      client.leave(String(chatRoomId));
    } catch (error) {
      client.emit('error', '채팅방 나가기 처리 중 오류가 발생했습니다.');
    }
  }

  emitChatRooms(userId: number) {
    this.server.to(String(userId)).emit('getChatRooms', { userId });
  }

  /*
  @SubscribeMessage('requestMatching')
  async handleRequestMatching(client: Socket, payload: CreateMatchingReqeust) {
    const { requesterId, targetId, message } = payload;

    const matching = await this.matchingService.createMatching(payload);
    const chatRoom = await this.chatRoomService.getMatchingBotChatRoom(
      payload.targetId,
    );
    const requester = await this.userService.getUserById(requesterId);
    const requesterPost = requester.posts[0];
    const toUser = await this.userService.getUserById(targetId);
    const blockedUserIds =
      await this.userBlockService.getBlockedUserIds(targetId);
    if (!toUser || blockedUserIds.includes(targetId)) {
      const errorMessage = !toUser
        ? '존재하지 않는 사용자입니다.'
        : '차단된 사용자에게 매칭을 요청할 수 없습니다.';
      client.emit('error', errorMessage);
      return;
    }

    // 매칭 성공 시 메시지 이벤트 호출
    const botMessage = {
      chatRoomId: chatRoom.id,
      toUserId: targetId,
      fromUserId: MatchingBotStatusEnum.BOT_USER_ID,
      content: {
        text: `매칭 신청이 도착했습니다!💌\n\n"${message}"`,
        matching: {
          id: matching.id,
          requester: {
            id: requester.id,
            nickname: requester.nickname,
            profilePictureUrl: requester.profilePictureUrl,
            representativePost: requesterPost
              ? {
                  postImages: requesterPost.postImages.map((image) => ({
                    url: image.url,
                    orderNum: image.orderNum,
                  })),
                  styleTags: requesterPost.postStyletags
                    ? requesterPost.postStyletags.map(
                        (styleTag) => styleTag.styletag.tag,
                      )
                    : [],
                }
              : {},
          },
        },
      },
      createdAt: new Date().toISOString(),
    };
    this.server.emit('sendMessage', botMessage);
  }
    */
}
