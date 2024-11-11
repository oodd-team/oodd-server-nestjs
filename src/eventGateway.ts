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

//클라이언트의 패킷들이 게이트웨이를 통해서 들어오게 됩니다.
@WebSocketGateway({ namespace: '/chatting', cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // 소켓 서버를 정의합니다.
  @WebSocketServer()
  server: Server;
  // 유저 정보를 레디스에 적재시키기 위해서 레디스 설정이 선행되야합니다.
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  afterInit(server: Server) {
    console.log('Initialized', server.engine.clientsCount);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getChatRooms')
  async handleGetChatRooms(client: Socket, userId: number) {
    const chatRooms =
      await this.chatRoomService.getChatRoomsWithLatestMessage(userId);
    client.emit('chatRoomList', chatRooms);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: {
      chatRoomId: number;
      toUserId: number;
      message: string;
      fromUserId: number;
      createdAt: string;
    },
  ) {
    const { chatRoomId, toUserId, message, fromUserId, createdAt } = payload;

    // 메시지 저장 로직
    const newMessage = await this.chatMessageService.saveMessage(
      chatRoomId,
      toUserId,
      message,
      fromUserId,
      createdAt,
    );

    // 채팅방 리스트 업데이트
    const chatRooms =
      await this.chatRoomService.getChatRoomsWithLatestMessage(fromUserId);
    client.emit('chatRoomList', chatRooms);

    // 해당 채팅방에 있는 모든 사용자에게 메시지 전송
    this.server.to(String(chatRoomId)).emit('newMessage', newMessage);
  }

  @SubscribeMessage('getChatRoomMessages')
  async handleGetChatRoomMessages(client: Socket, chatRoomId: number) {
    const messages =
      await this.chatMessageService.getMessagesByChatRoomId(chatRoomId);
    client.emit('chatRoomMessages', messages); // 클라이언트에 메시지 리스트 전송
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(client: Socket, chatRoomId: number) {
    client.join(String(chatRoomId));
  }
}
